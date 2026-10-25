import { NextRequest } from 'next/server'
import {
  getPlayerData,
  invalidatePlayerCache,
  isValidVideoId,
  type StreamFormat,
} from '@/lib/innertube'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

/**
 * Max bytes returned per request. Browsers request open-ended ranges
 * (`bytes=0-`), so we cap each response and let the media element ask for
 * the next chunk. This keeps every serverless invocation short.
 */
const CHUNK_SIZE = 4 * 1024 * 1024

const UPSTREAM_HEADERS = {
  'User-Agent':
    'com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip',
  Referer: 'https://www.youtube.com/',
  Origin: 'https://www.youtube.com',
}

function pickFormat(
  progressive: StreamFormat[],
  adaptive: StreamFormat[],
  itag?: number
): StreamFormat | undefined {
  const all = [...progressive, ...adaptive]
  if (itag) {
    return all.find((f) => f.itag === itag) || progressive[0]
  }
  return progressive[0]
}

/**
 * Turn a client range into an upstream range capped at CHUNK_SIZE.
 * Returns the range header value to send upstream.
 */
function capRange(range: string | null): string {
  if (!range) return `bytes=0-${CHUNK_SIZE - 1}`

  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim())
  if (!match) return `bytes=0-${CHUNK_SIZE - 1}`

  const [, startRaw, endRaw] = match

  // Suffix range (`bytes=-5000`): leave as-is, it's tiny.
  if (!startRaw) return range

  const start = Number(startRaw)
  if (!Number.isFinite(start)) return `bytes=0-${CHUNK_SIZE - 1}`

  const requestedEnd = endRaw ? Number(endRaw) : start + CHUNK_SIZE - 1
  const end = Math.min(requestedEnd, start + CHUNK_SIZE - 1)
  return `bytes=${start}-${end}`
}

async function fetchStream(
  videoId: string,
  itag: number | undefined,
  range: string
): Promise<{ upstream: Response; format: StreamFormat }> {
  const data = await getPlayerData(videoId)
  const format = pickFormat(data.progressive, data.adaptive, itag)
  if (!format) {
    throw new Error('No playable format found for this video')
  }

  const upstream = await fetch(format.url, {
    headers: { ...UPSTREAM_HEADERS, Range: range },
    cache: 'no-store',
  })

  return { upstream, format }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!isValidVideoId(id)) {
    return new Response('Invalid video id', { status: 400 })
  }

  const { searchParams } = new URL(req.url)
  const rawItag = Number(searchParams.get('itag'))
  const itag = Number.isFinite(rawItag) && rawItag > 0 ? rawItag : undefined
  const upstreamRange = capRange(req.headers.get('range'))

  try {
    let { upstream } = await fetchStream(id, itag, upstreamRange)

    // The googlevideo URL is bound to the requesting IP. If a cached URL was
    // minted by a different instance, re-mint it once and retry.
    if (upstream.status === 403 || upstream.status === 410) {
      invalidatePlayerCache(id)
      ;({ upstream } = await fetchStream(id, itag, upstreamRange))
    }

    if (!upstream.ok && upstream.status !== 206) {
      const text = await upstream.text().catch(() => '')
      return new Response(
        `Upstream stream error ${upstream.status}${text ? `: ${text.slice(0, 200)}` : ''}`,
        { status: 502 }
      )
    }

    const headers = new Headers()
    for (const name of [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'last-modified',
      'etag',
    ]) {
      const value = upstream.headers.get(name)
      if (value) headers.set(name, value)
    }
    headers.set('Accept-Ranges', 'bytes')
    headers.set('Cache-Control', 'no-store')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Content-Disposition', 'inline')

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    })
  } catch (err: any) {
    return new Response(err?.message || 'Failed to stream video', {
      status: 502,
    })
  }
}
