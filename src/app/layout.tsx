import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'My Chicken Addis — Poultry Farming & Farmer Services',
    template: '%s | My Chicken Addis',
  },
  description:
    'Quality 45-day birds, poultry feed, practical farmer training, and access to financing opportunities. Helping farmers start and grow successful poultry businesses in Addis Ababa, Ethiopia.',
  keywords: [
    'poultry farming',
    '45-day birds',
    'poultry feed',
    'poultry training',
    'poultry financing',
    'Addis Ababa',
    'Ethiopia',
    'chicken farming',
    'broiler chicken',
    'My Chicken Addis',
  ],
  authors: [{ name: 'My Chicken Addis' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'My Chicken Addis',
    title: 'My Chicken Addis — Poultry Farming & Farmer Services',
    description:
      'Quality 45-day birds, poultry feed, practical farmer training, and access to financing opportunities in Addis Ababa, Ethiopia.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-neutral-50 antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1C1917',
              color: '#FAFAF9',
              borderRadius: '0.75rem',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#FAFAF9',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FAFAF9',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
