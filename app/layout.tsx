import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Allura } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { WishlistProvider } from '@/contexts/wishlist-context'
import { Toaster } from '@/components/ui/toaster'

const allura = Allura({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-allura',
})

export const metadata: Metadata = {
  title: 'Mariyae Kalin - Premium Product Variety Collection',
  description: 'Exquisite product variety for every occasion. Crafting timeless elegance since 1998.',
  generator: 'Next.js',
  icons: {
    icon: '/mariyae_dark_wbg.png',
    shortcut: '/mariyae_dark_wbg.png',
    apple: '/mariyae_dark_wbg.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={allura.variable}>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  --font-allura: ${allura.variable};
}
        `}</style>
      </head>
      <body className="overflow-x-hidden">
        <CartProvider>
          <WishlistProvider>
            {children}
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
