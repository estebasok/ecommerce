import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { CartProvider } from '@/lib/cart'

import '../styles.css'

const siteName = 'Moonsoda Goods — loud little things for everyday orbit'
const siteDescription =
  'Squishy sneakers, glossy puffers, wobbly vases and fuzzy hats. Moonsoda makes playful, well-built everyday goods.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: siteName },
      { name: 'description', content: siteDescription },
      { name: 'theme-color', content: '#f6efe1' },
      { property: 'og:title', content: siteName },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/.netlify/images?url=/img/hero.png&w=1200&fm=jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=JetBrains+Mono:wght@400;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <p className="font-display text-8xl font-extrabold text-tomato">404</p>
      <p className="mt-4 font-display text-2xl font-bold">This page drifted out of orbit.</p>
      <a href="/" className="btn-pop mt-8 inline-block rounded-full bg-lime px-6 py-3 font-bold">
        Back to the shop
      </a>
    </div>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="grain">
        <CartProvider>
          <div className="bg-ink py-2 text-center font-mono text-[11px] uppercase tracking-widest text-paper">
            Free shipping over $85 <span className="text-lime">&#10022;</span> 45-day returns
          </div>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <Scripts />
      </body>
    </html>
  )
}
