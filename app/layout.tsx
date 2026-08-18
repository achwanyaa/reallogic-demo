import type { Metadata } from 'next'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reallogic — Spatial Intelligence & Industrial CAD Platform',
  description:
    'Millimeter-accurate 3D digital twins, structural engineering hotspots, equipment clearance simulations, and certified on-site LiDAR audit trails for commercial logistics.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 180px)' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
