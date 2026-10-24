/**
 * YouTube metadata resolver.
 *
 * Resolves an arbitrary YouTube channel link (handle, /channel/, /c/, /user/)
 * into channel metadata by fetching the channel page server-side and parsing
 * the embedded ytInitialData JSON. No API key is required for this step.
 */
export interface ResolvedChannel {
  channelId: string
  title: string
  description: string
  thumbnail: string
  url: string
}

const YT_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:m\.)?youtube(?:\.com|\.be)\/(?:channel\/|c\/|user\/|@)?([A-Za-z0-9_\-]+)/

export function extractChannelKey(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const m = trimmed.match(YT_REGEX)
  if (!m) return null
  return m[1]
}

function extractChannelIdFromUrl(url: string): string | null {
  const m = url.match(/channel\/([A-Za-z0-9_\-]{10,})/)
  if (m) return m[1]
  return null
}

function parseYtInitialData(html: string): any {
  // ytInitialData = {...};</script>
  const m = html.match(/ytInitialData\s*=\s*(\{[\s\S]*?\});\s*<\/script>/)
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch {
    return null
  }
}

function last<T>(arr: T[] | undefined | null): T | undefined {
  if (!arr || arr.length === 0) return undefined
  return arr[arr.length - 1]
}

export async function resolveChannel(input: string): Promise<ResolvedChannel> {
  const key = extractChannelKey(input)
  if (!key) {
    throw new Error('Could not parse a YouTube channel link from that URL.')
  }

  // Build a candidate channel page URL. Prefer /channel/ if it looks like an ID.
  let pageUrl: string
  if (/^UC[A-Za-z0-9_\-]{20,}$/.test(key)) {
    pageUrl = `https://www.youtube.com/channel/${key}`
  } else if (key.startsWith('@')) {
    pageUrl = `https://www.youtube.com/${key}`
  } else if (/^c\//i.test(input)) {
    // /c/ name
    const cm = input.match(/c\/([A-Za-z0-9_\-]+)/i)
    pageUrl = `https://www.youtube.com/${cm ? cm[0] : key}`
  } else if (/^user\//i.test(input)) {
    const um = input.match(/user\/([A-Za-z0-9_\-]+)/i)
    pageUrl = `https://www.youtube.com/${um ? um[0] : key}`
  } else {
    pageUrl = `https://www.youtube.com/@${key}`
  }

  const res = await fetch(pageUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    // Next.js server runtime allows a generous timeout
    next: { revalidate: 0 },
  } as any)

  if (!res.ok) {
    throw new Error(`YouTube returned ${res.status} while fetching channel page.`)
  }

  const html = await res.text()
  const data = parseYtInitialData(html)
  if (!data) {
    throw new Error('Unable to read channel data from YouTube page.')
  }

  const mf = data.microformat?.microformatDataRenderer
  const channelId =
    extractChannelIdFromUrl(mf?.urlCanonical || pageUrl) ||
    (key.startsWith('UC') ? key : null)

  if (!channelId) {
    throw new Error('Could not determine the channel ID from that link.')
  }

  const title = mf?.title?.simpleText || key
  const description = mf?.description?.simpleText || ''
  const thumbnails = (mf?.thumbnail?.thumbnails as any[] | undefined) ?? []
  const thumbnail = last(thumbnails)?.url || ''

  return {
    channelId,
    title,
    description,
    thumbnail,
    url: `https://www.youtube.com/channel/${channelId}`,
  }
}
