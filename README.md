# MetroList Web Clone

A web-based clone of the MetroList app built with **Next.js**, **React**, and **Tailwind CSS**.

## How it differs from the original

The original MetroList is a YouTube Music client for Android. This clone is a **YouTube channel aggregator** for the web:

- No pre-loaded channels — your list starts empty.
- An **Add** button lets you paste any YouTube channel link (handle, `/channel/`, `/c/`, `/user/`) to add a new channel.
- Each channel shows its latest videos, which open on YouTube.
- Channels are saved in `localStorage` (no backend/database required).

## Features

- ✅ Add channels by pasting a YouTube channel link
- ✅ Channel metadata resolved server-side (title, description, thumbnail, channel ID)
- ✅ Latest videos per channel (requires YouTube Data API v3 key)
- ✅ Remove channels
- ✅ Responsive grid, dark mode, client-side navigation
- ✅ Persisted in `localStorage`

## Getting started

```bash
# Install dependencies
npm install

# Copy the env example and add your YouTube Data API key
cp .env.example .env.local

# Run the dev server
npm run dev
```

Open http://localhost:3000

## YouTube Data API key

Channel video loading uses the YouTube Data API v3. Without a key, the app still works for adding/browsing channels but will show an "API key not configured" message on channel detail pages.

To get a key:
1. Go to https://console.cloud.google.com/
2. Create a project → enable **YouTube Data API v3**
3. Create credentials → API key
4. Paste it into `.env.local` as `YOUTUBE_DATA_API_KEY=...`

## Tech stack

- Next.js (App Router)
- React 19
- Tailwind CSS
- Lucide React (icons)

## License

MIT
