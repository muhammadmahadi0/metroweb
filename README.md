# MetroList Web Clone

A web-based clone of the MetroList app built with **Next.js**, **React**, and **Tailwind CSS**.

## How it differs from the original

The original MetroList is a YouTube Music client for Android. This clone is a **YouTube channel aggregator** for the web:

- No pre-loaded channels — your list starts empty.
- An **Add** button lets you paste any YouTube channel link (handle, `/channel/`, `/c/`, `/user/`) to add a new channel.
- Each channel shows its latest videos, which play inside the app.
- Channels are saved in `localStorage` (no backend/database required).
- **No YouTube API key required** — channel lookup, channel videos, and playback all use YouTube's public pages and InnerTube API.

## Features

- ✅ Add channels by pasting a YouTube channel link
- ✅ Channel metadata resolved server-side (title, description, thumbnail, channel ID)
- ✅ Latest videos per channel, fetched via InnerTube (no API key)
- ✅ Remove channels
- ✅ **In-app playback via YouTube InnerTube** — videos play inside the app instead of opening YouTube
- ✅ **Audio-first playback** — starts in audio-only mode with an Audio/Video switch
- ✅ **Channel playlists** — browse a channel's playlists, open a playlist, and play through it with auto-advance
- ✅ **YouTube-style layout** — desktop sidebar, centered search, video grid, watch page with “Up next”, and a mobile bottom nav
- ✅ **Search across your channels** — search results include matching added channels and videos from their uploads
- ✅ Light/dark theme toggle (persisted), responsive desktop + mobile layouts
- ✅ Persisted in `localStorage`

## Design

The UI mirrors YouTube's layout and visual language:

- Sticky header with logo, centered search bar, and add-channel action.
- Desktop guide sidebar (collapsible to a mini rail) listing Home and your channels.
- Mobile drawer plus a fixed bottom navigation bar.
- YouTube-style video cards (rounded thumbnails, duration badges, channel avatars) and list rows.
- Channel page with banner, avatar, description, and a Videos tab.
- Watch page with a two-column layout and an “Up next” rail.
- Light/dark theme tokens (`--yt-*`) and Roboto typography.

## Getting started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open http://localhost:3000

## No API key required

Everything works out of the box:

- **Adding a channel** scrapes the public channel page for metadata.
- **Channel videos** are fetched through the InnerTube `browse` endpoint (channel "Videos" tab).
- **Playback** uses the InnerTube `player` endpoint.

There are no environment variables to configure.

## Search

The header search bar (or the Search tab on mobile) opens `/search?q=…` and searches **only the channels you added**:

- Matching channels by title or description.
- Matching videos by title or channel name, pulled from those channels' uploads.

The home feed aggregates the latest videos from every added channel, sorted by approximate recency, with filter chips per channel.

## Channel playlists

Every channel page has **Videos** and **Playlists** tabs:

- The **Playlists** tab lists the channel's public playlists, fetched via the InnerTube `browse` endpoint.
- Opening a playlist (`/playlist/<id>`) shows its title, description, video count, and a numbered video list with a **Play all** button.
- Playing a video from a playlist adds a playlist queue to the watch page sidebar. When a video ends, the next one in the playlist starts automatically.

## Video playback (InnerTube)

Clicking a video opens `/watch/<videoId>`, which plays in-app. Playback starts in **audio-only mode** by default; use the **Audio / Video** switch next to the channel row to switch to video (the choice is remembered).

1. `GET /api/video/<id>` calls YouTube's internal `youtubei/v1/player` endpoint using the `ANDROID` client (browse/channel calls use `ANDROID_VR`) and returns metadata plus:
   - the best audio-only adaptive stream (prefers AAC/MP4, e.g. `itag 140`), used by the default audio player;
   - the best progressive stream (`itag 18`, 360p MP4 with audio), used by video mode.
   The player tries the `ANDROID`, `IOS`, and `ANDROID_VR` clients in order, with a cached visitor id, so a network that is bot-challenged on one client can still play through another.
2. `GET /api/video/<id>/stream?itag=<itag>` proxies the googlevideo stream. googlevideo URLs are IP-bound to the machine that requested them, so the proxy re-mints them server-side and forwards `Range` requests in 4 MB chunks (keeps each serverless invocation short).
3. If every InnerTube client is blocked (common on datacenter IPs such as Vercel's), the player automatically falls back to the official YouTube embed, so playback still works. When a client returns audio but no progressive video, audio mode stays in-app and video mode uses the embed.

> Streaming is intended for personal/demo use. Video mode uses the progressive 360p stream; higher resolutions use adaptive video-only streams that would require an MSE player. YouTube blocks many cloud/datacenter IP ranges; if InnerTube is consistently unavailable, run the app from a residential connection or add a PO token/cookie provider.

## Tech stack

- Next.js (App Router)
- React 19
- Tailwind CSS
- Lucide React (icons)

## Deploying to Vercel

1. Import the repository at https://vercel.com/new
2. Framework preset: **Next.js**
3. Ensure the Node.js version is **20.x or 22.x**
4. Deploy

The build uses `next build --webpack` (see `package.json`) for maximum compatibility.

## License

MIT
