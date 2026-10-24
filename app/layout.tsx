export const metadata = {
  title: 'MetroList — Your YouTube Channels',
  description: 'A web-based clone of MetroList. Add YouTube channels by link and browse their videos.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  )
}
