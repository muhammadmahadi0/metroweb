/**
 * Minimal InnerTube client.
 *
 * Uses YouTube's internal `youtubei/v1/player` endpoint with the ANDROID
 * client, which currently returns direct googlevideo URLs for both
 * progressive and adaptive formats. (ANDROID_VR is used for browse calls;
 * the player endpoint now bot-challenges that client.)
 *
 * Note: googlevideo URLs are IP-bound to the machine that requested them,
 * so playback is proxied through `/api/video/[id]/stream` (see that route).
 */

const INNERTUBE_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8'
const PLAYER_URL = `https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_KEY}&prettyPrint=false`
const BROWSE_URL = `https://www.youtube.com/youtubei/v1/browse?key=${INNERTUBE_KEY}&prettyPrint=false`

const CLIENT = {
  clientName: 'ANDROID_VR',
  clientVersion: '1.60.19',
  deviceMake: 'Oculus',
  deviceModel: 'Quest 3',
  androidSdkVersion: 32,
  osName: 'Android',
  osVersion: '12',
  hl: 'en',
  gl: 'US',
}

const CLIENT_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12; GB) gzip',
  'X-YouTube-Client-Name': '28',
  'X-YouTube-Client-Version': CLIENT.clientVersion,
}

/**
 * The ANDROID_VR client is bot-challenged on the player endpoint, so playback
 * uses the regular ANDROID client instead. Browse (channels/playlists) still
 * uses ANDROID_VR, whose response shapes are parsed below.
 */
const PLAYER_CLIENT = {
  clientName: 'ANDROID',
  clientVersion: '20.10.38',
  androidSdkVersion: 34,
  osName: 'Android',
  osVersion: '14',
  hl: 'en',
  gl: 'US',
}

const PLAYER_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip',
  'X-YouTube-Client-Name': '3',
  'X-YouTube-Client-Version': PLAYER_CLIENT.clientVersion,
}

export interface StreamFormat {
  itag: number
  url: string
  mimeType: string
  qualityLabel?: string
  audioQuality?: string
  contentLength?: number
  bitrate?: number
  hasVideo: boolean
  hasAudio: boolean
  height?: number
}

export interface PlayerData {
  videoId: string
  title: string
  author: string
  channelId: string
  thumbnail: string
  durationSeconds: number
  viewCount?: number
  publishDate?: string
  description: string
  /** Progressive (video + audio) formats — playable in a single <video> tag. */
  progressive: StreamFormat[]
  /** Adaptive (video-only or audio-only) formats. */
  adaptive: StreamFormat[]
  /** Best progressive format, if any. */
  bestProgressive?: StreamFormat
  /** Best audio-only adaptive format, preferring AAC/MP4. */
  bestAudio?: StreamFormat
  /** Best adaptive video-only format, if any. */
  bestVideo?: StreamFormat
}

export function isValidVideoId(id: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(id)
}

export function isValidPlaylistId(id: string): boolean {
  return /^[A-Za-z0-9_-]{10,64}$/.test(id)
}

function toFormat(raw: any): StreamFormat | null {
  if (!raw?.url) return null
  const mimeType: string = raw.mimeType || ''
  return {
    itag: Number(raw.itag),
    url: raw.url,
    mimeType,
    qualityLabel: raw.qualityLabel,
    audioQuality: raw.audioQuality,
    contentLength: raw.contentLength ? Number(raw.contentLength) : undefined,
    bitrate: raw.bitrate ? Number(raw.bitrate) : undefined,
    hasVideo: mimeType.startsWith('video/'),
    hasAudio: mimeType.startsWith('audio/') || mimeType.includes('mp4a'),
    height: raw.height ? Number(raw.height) : undefined,
  }
}

/** Best audio-only adaptive format, preferring AAC/MP4 for compatibility. */
function pickBestAudio(adaptive: StreamFormat[]): StreamFormat | undefined {
  const audioOnly = adaptive.filter((format) => format.hasAudio && !format.hasVideo)
  if (audioOnly.length === 0) return undefined

  const mp4 = audioOnly.filter((format) =>
    format.mimeType.startsWith('audio/mp4')
  )
  const pool = mp4.length > 0 ? mp4 : audioOnly
  return [...pool].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0]
}

/** Best adaptive video-only format, if any. */
function pickBestVideo(adaptive: StreamFormat[]): StreamFormat | undefined {
  const videoOnly = adaptive.filter((format) => format.hasVideo && !format.hasAudio)
  if (videoOnly.length === 0) return undefined
  return [...videoOnly].sort((a, b) => (b.height || 0) - (a.height || 0))[0]
}

function parsePlayerJson(json: any, videoId: string): PlayerData {
  const status = json?.playabilityStatus
  if (status && status.status && status.status !== 'OK') {
    throw new Error(status.reason || `Video is not playable (${status.status})`)
  }

  const details = json?.videoDetails || {}
  const micro = json?.microformat?.playerMicroformatRenderer || {}
  const streaming = json?.streamingData || {}

  const progressive = (streaming.formats || [])
    .map(toFormat)
    .filter((f: StreamFormat | null): f is StreamFormat => Boolean(f))

  const adaptive = (streaming.adaptiveFormats || [])
    .map(toFormat)
    .filter((f: StreamFormat | null): f is StreamFormat => Boolean(f))

  if (progressive.length === 0 && adaptive.length === 0) {
    throw new Error(
      'No playable stream available for this video. It may be age-restricted, live, or region-locked.'
    )
  }

  const bestProgressive = [...progressive].sort(
    (a, b) => (b.height || 0) - (a.height || 0)
  )[0]

  const thumbnails = details.thumbnail?.thumbnails || []
  const thumbnail =
    thumbnails[thumbnails.length - 1]?.url ||
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  return {
    videoId,
    title: details.title || micro.title?.simpleText || 'Untitled video',
    author: details.author || micro.ownerChannelName || '',
    channelId: details.channelId || micro.externalChannelId || '',
    thumbnail,
    durationSeconds: Number(details.lengthSeconds) || 0,
    viewCount: details.viewCount ? Number(details.viewCount) : undefined,
    publishDate: micro.publishDate || micro.uploadDate,
    description: details.shortDescription || '',
    progressive,
    adaptive,
    bestProgressive,
    bestAudio: pickBestAudio(adaptive),
    bestVideo: pickBestVideo(adaptive),
  }
}

const cache = new Map<string, { data: PlayerData; expires: number }>()
const CACHE_TTL_MS = 10 * 60 * 1000

export async function getPlayerData(videoId: string): Promise<PlayerData> {
  if (!isValidVideoId(videoId)) {
    throw new Error('Invalid video id')
  }

  const cached = cache.get(videoId)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }

  const res = await fetch(PLAYER_URL, {
    method: 'POST',
    headers: PLAYER_HEADERS,
    body: JSON.stringify({
      context: { client: PLAYER_CLIENT },
      videoId,
      contentCheckOk: true,
      racyCheckOk: true,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`InnerTube player request failed (${res.status})`)
  }

  const json = await res.json()
  const data = parsePlayerJson(json, videoId)
  cache.set(videoId, { data, expires: Date.now() + CACHE_TTL_MS })
  return data
}

export function invalidatePlayerCache(videoId: string) {
  cache.delete(videoId)
}

/* ------------------------------------------------------------------ */
/* Channel videos (browse endpoint)                                    */
/* ------------------------------------------------------------------ */

export interface ChannelVideo {
  videoId: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  /** ISO date when known. InnerTube usually returns relative text instead. */
  publishedAt: string
  /** Human-readable relative date, e.g. "3 months ago". */
  publishedText: string
  /** Human-readable view count, e.g. "110,318 views". */
  viewCountText: string
  /** Human-readable duration, e.g. "3:51". */
  durationText: string
  channelId: string
  watchUrl: string
}

export interface ChannelVideosResult {
  videos: ChannelVideo[]
  channelTitle: string
}

function runsText(value: any): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (value.simpleText) return value.simpleText
  if (Array.isArray(value.runs)) {
    return value.runs.map((run: any) => run.text || '').join('')
  }
  return ''
}

/** Recursively collect every object stored under one of the given keys. */
function collectRenderers(value: any, keys: Set<string>, out: any[] = []): any[] {
  if (!value || typeof value !== 'object') return out
  for (const [key, child] of Object.entries(value)) {
    if (keys.has(key) && child && typeof child === 'object') {
      out.push(child)
    }
    collectRenderers(child, keys, out)
  }
  return out
}

const VIDEO_RENDERERS = new Set([
  'compactVideoRenderer',
  'videoRenderer',
  'gridVideoRenderer',
  'playlistVideoRenderer',
])

/** Params for the channel "Videos" tab. */
const CHANNEL_VIDEOS_PARAMS = 'EgZ2aWRlb3PyBgQKAjoA'

const channelVideoCache = new Map<
  string,
  { result: ChannelVideosResult; expires: number }
>()
const CHANNEL_CACHE_TTL_MS = 5 * 60 * 1000

export async function getChannelVideos(
  channelId: string,
  limit = 30
): Promise<ChannelVideosResult> {
  if (!/^UC[A-Za-z0-9_-]{22}$/.test(channelId)) {
    throw new Error('Invalid channel id')
  }

  const cached = channelVideoCache.get(channelId)
  if (cached && cached.expires > Date.now()) {
    return cached.result
  }

  const res = await fetch(BROWSE_URL, {
    method: 'POST',
    headers: CLIENT_HEADERS,
    body: JSON.stringify({
      context: { client: CLIENT },
      browseId: channelId,
      params: CHANNEL_VIDEOS_PARAMS,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`InnerTube browse request failed (${res.status})`)
  }

  const json = await res.json()

  const channelTitle =
    json?.header?.c4TabbedHeaderRenderer?.title ||
    json?.header?.pageHeaderRenderer?.pageTitle ||
    json?.metadata?.channelMetadataRenderer?.title ||
    ''

  const renderers = collectRenderers(json, VIDEO_RENDERERS)
  const seen = new Set<string>()
  const videos: ChannelVideo[] = []

  for (const renderer of renderers) {
    const videoId =
      renderer.videoId ||
      renderer.navigationEndpoint?.watchEndpoint?.videoId ||
      renderer.navigationEndpoint?.reelWatchEndpoint?.videoId
    if (!videoId || seen.has(videoId)) continue
    seen.add(videoId)

    const thumbnails = renderer.thumbnail?.thumbnails || []
    const thumbnail =
      thumbnails[thumbnails.length - 1]?.url ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

    videos.push({
      videoId,
      title: runsText(renderer.title) || runsText(renderer.headline) || 'Untitled',
      description: runsText(renderer.descriptionSnippet),
      thumbnail,
      channelTitle,
      publishedAt: '',
      publishedText: runsText(renderer.publishedTimeText),
      viewCountText:
        runsText(renderer.viewCountText) ||
        runsText(renderer.shortViewCountText),
      durationText: runsText(renderer.lengthText),
      channelId,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    })

    if (videos.length >= limit) break
  }

  const result: ChannelVideosResult = { videos, channelTitle }
  channelVideoCache.set(channelId, {
    result,
    expires: Date.now() + CHANNEL_CACHE_TTL_MS,
  })
  return result
}

/* ------------------------------------------------------------------ */
/* Channel playlists + playlist videos (browse endpoint)               */
/* ------------------------------------------------------------------ */

export interface ChannelPlaylist {
  playlistId: string
  title: string
  thumbnail: string
  videoCountText: string
  updatedText: string
  channelTitle: string
}

export interface ChannelPlaylistsResult {
  playlists: ChannelPlaylist[]
  channelTitle: string
}

export interface PlaylistVideo {
  videoId: string
  title: string
  thumbnail: string
  durationText: string
  channelTitle: string
  index: number
}

export interface PlaylistData {
  playlistId: string
  title: string
  description: string
  channelTitle: string
  videoCountText: string
  updatedText: string
  thumbnail: string
  videos: PlaylistVideo[]
}

/** Params for the channel "Playlists" tab. */
const CHANNEL_PLAYLISTS_PARAMS = 'EglwbGF5bGlzdHPyBgQKAkIA'

const channelPlaylistCache = new Map<
  string,
  { result: ChannelPlaylistsResult; expires: number }
>()
const playlistCache = new Map<string, { data: PlaylistData; expires: number }>()

export async function getChannelPlaylists(
  channelId: string,
  limit = 30
): Promise<ChannelPlaylistsResult> {
  if (!/^UC[A-Za-z0-9_-]{22}$/.test(channelId)) {
    throw new Error('Invalid channel id')
  }

  const cached = channelPlaylistCache.get(channelId)
  if (cached && cached.expires > Date.now()) {
    return cached.result
  }

  const res = await fetch(BROWSE_URL, {
    method: 'POST',
    headers: CLIENT_HEADERS,
    body: JSON.stringify({
      context: { client: CLIENT },
      browseId: channelId,
      params: CHANNEL_PLAYLISTS_PARAMS,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`InnerTube browse request failed (${res.status})`)
  }

  const json = await res.json()

  const channelTitle =
    json?.header?.c4TabbedHeaderRenderer?.title ||
    json?.header?.pageHeaderRenderer?.pageTitle ||
    json?.metadata?.channelMetadataRenderer?.title ||
    ''

  const renderers = collectRenderers(
    json,
    new Set([
      'compactPlaylistRenderer',
      'gridPlaylistRenderer',
      'playlistRenderer',
    ])
  )

  const seen = new Set<string>()
  const playlists: ChannelPlaylist[] = []

  for (const renderer of renderers) {
    const rawId =
      renderer.playlistId ||
      renderer.navigationEndpoint?.browseEndpoint?.browseId ||
      ''
    const playlistId = String(rawId).replace(/^VL/, '')
    if (!playlistId || seen.has(playlistId)) continue
    seen.add(playlistId)

    const thumbnails = renderer.thumbnail?.thumbnails || []
    playlists.push({
      playlistId,
      title: runsText(renderer.title) || 'Untitled playlist',
      thumbnail: thumbnails[thumbnails.length - 1]?.url || '',
      videoCountText:
        runsText(renderer.videoCountText) || runsText(renderer.thumbnailText),
      updatedText: runsText(renderer.publishedTimeText),
      channelTitle: runsText(renderer.shortBylineText) || channelTitle,
    })

    if (playlists.length >= limit) break
  }

  const result: ChannelPlaylistsResult = { playlists, channelTitle }
  channelPlaylistCache.set(channelId, {
    result,
    expires: Date.now() + CHANNEL_CACHE_TTL_MS,
  })
  return result
}

export async function getPlaylist(
  playlistId: string,
  limit = 100
): Promise<PlaylistData> {
  if (!isValidPlaylistId(playlistId)) {
    throw new Error('Invalid playlist id')
  }

  const cached = playlistCache.get(playlistId)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }

  const res = await fetch(BROWSE_URL, {
    method: 'POST',
    headers: CLIENT_HEADERS,
    body: JSON.stringify({
      context: { client: CLIENT },
      browseId: `VL${playlistId}`,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`InnerTube browse request failed (${res.status})`)
  }

  const json = await res.json()

  const header = collectRenderers(json, new Set(['playlistHeaderRenderer']))[0]
  const renderers = collectRenderers(json, new Set(['playlistVideoRenderer']))

  const videos: PlaylistVideo[] = []
  const seen = new Set<string>()

  for (const renderer of renderers) {
    const videoId =
      renderer.videoId || renderer.navigationEndpoint?.watchEndpoint?.videoId
    if (!videoId || seen.has(videoId)) continue
    seen.add(videoId)

    const thumbnails = renderer.thumbnail?.thumbnails || []
    videos.push({
      videoId,
      title: runsText(renderer.title) || 'Untitled',
      thumbnail:
        thumbnails[thumbnails.length - 1]?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      durationText: runsText(renderer.lengthText),
      channelTitle: runsText(renderer.shortBylineText),
      index: Number(runsText(renderer.index)) || videos.length + 1,
    })

    if (videos.length >= limit) break
  }

  const heroThumbnails =
    header?.playlistHeaderBanner?.heroPlaylistThumbnailRenderer?.thumbnail
      ?.thumbnails || []

  const data: PlaylistData = {
    playlistId,
    title: runsText(header?.title) || 'Playlist',
    description: runsText(header?.descriptionText),
    channelTitle: runsText(header?.ownerText),
    videoCountText:
      runsText(header?.numVideosText) || `${videos.length} videos`,
    updatedText: runsText(header?.publishedTimeText),
    thumbnail:
      heroThumbnails[heroThumbnails.length - 1]?.url ||
      videos[0]?.thumbnail ||
      '',
    videos,
  }

  playlistCache.set(playlistId, {
    data,
    expires: Date.now() + CHANNEL_CACHE_TTL_MS,
  })
  return data
}

