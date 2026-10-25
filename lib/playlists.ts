export interface FeedPlaylist {
  playlistId: string
  title: string
  thumbnail: string
  videoCountText: string
  updatedText: string
  channelTitle: string
}

export interface FeedPlaylistVideo {
  videoId: string
  title: string
  thumbnail: string
  durationText: string
  channelTitle: string
  index: number
}

export interface FeedPlaylistData {
  playlistId: string
  title: string
  description: string
  channelTitle: string
  videoCountText: string
  updatedText: string
  thumbnail: string
  videos: FeedPlaylistVideo[]
}

const CACHE_TTL_MS = 5 * 60 * 1000

const channelPlaylistCache = new Map<
  string,
  { playlists: FeedPlaylist[]; ts: number }
>()
const playlistCache = new Map<
  string,
  { data: FeedPlaylistData; ts: number }
>()

export async function fetchChannelPlaylists(
  channelId: string
): Promise<FeedPlaylist[]> {
  const cached = channelPlaylistCache.get(channelId)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.playlists
  }

  const res = await fetch(
    `/api/channel/${encodeURIComponent(channelId)}/playlists`
  )
  const json = await res.json()

  const playlists: FeedPlaylist[] = (json.playlists || []).map(
    (playlist: any) => ({
      playlistId: playlist.playlistId,
      title: playlist.title || 'Untitled playlist',
      thumbnail: playlist.thumbnail || '',
      videoCountText: playlist.videoCountText || '',
      updatedText: playlist.updatedText || '',
      channelTitle: playlist.channelTitle || '',
    })
  )

  channelPlaylistCache.set(channelId, { playlists, ts: Date.now() })
  return playlists
}

export async function fetchPlaylist(
  playlistId: string
): Promise<FeedPlaylistData> {
  const cached = playlistCache.get(playlistId)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data
  }

  const res = await fetch(`/api/playlist/${encodeURIComponent(playlistId)}`)
  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error || 'Unable to load playlist')
  }

  const data: FeedPlaylistData = {
    playlistId: json.playlistId || playlistId,
    title: json.title || 'Playlist',
    description: json.description || '',
    channelTitle: json.channelTitle || '',
    videoCountText: json.videoCountText || '',
    updatedText: json.updatedText || '',
    thumbnail: json.thumbnail || '',
    videos: (json.videos || []).map((video: any) => ({
      videoId: video.videoId,
      title: video.title || 'Untitled',
      thumbnail: video.thumbnail || '',
      durationText: video.durationText || '',
      channelTitle: video.channelTitle || '',
      index: video.index || 0,
    })),
  }

  playlistCache.set(playlistId, { data, ts: Date.now() })
  return data
}
