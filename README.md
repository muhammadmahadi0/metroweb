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
- ✅ **Material 3 (Material You) design system** — tonal color tokens, elevation, extended FAB, rounded cards, dialog, light/dark themes
- ✅ Responsive grid, theme toggle (persisted), client-side navigation
- ✅ Persisted in `localStorage`

## Design

The UI implements a Material 3 design system from scratch:

- Tonal color roles (`primary`, `secondary`, `tertiary`, `surface-container-*`, `outline`, `error`, …) defined as CSS variables for light and dark schemes.
- M3 elevation levels (`shadow-m3-1` … `shadow-m3-4`).
- Components: filled/tonal/text/outlined buttons, extended FAB, icon buttons, filled text field, chips, cards, dialog with scrim, empty state.
- Roboto typography and a no-flash theme script.

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

## Video playback (InnerTube)

Clicking a video opens `/watch/<videoId>`, which plays in-app:

1. `GET /api/video/<id>` calls YouTube's internal `youtubei/v1/player` endpoint using the `ANDROID_VR` client and returns metadata plus the best progressive stream (`itag 18`, 360p MP4 with audio).
2. `GET /api/video/<id>/stream?itag=18` proxies the googlevideo stream. googlevideo URLs are IP-bound to the machine that requested them, so the proxy re-mints them server-side and forwards `Range` requests in 4 MB chunks (keeps each serverless invocation short).
3. If InnerTube extraction is blocked (for example, a datacenter IP challenge), the player automatically falls back to the official YouTube embed, so playback still works.

> Streaming is intended for personal/demo use. Higher resolutions (1080p+) use adaptive video-only streams that require MSE and are not implemented; use “Open on YouTube” for full quality.

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
