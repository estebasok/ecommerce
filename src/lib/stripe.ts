import { createServerFn } from '@tanstack/react-start'
import { getProduct, priceFor } from '@/data/products'

export const getStripeEnabled = createServerFn({ method: 'GET' }).handler(
  () => !!process.env.STRIPE_SECRET_KEY,
)

interface CheckoutLine {
  productId: string
  color: string
  size?: string
  qty: number
}

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((lines: Array<CheckoutLine>) => {
    if (!Array.isArray(lines) || lines.length === 0) {
      throw new Error('Cart is empty')
    }
    return lines
  })
  .handler(async ({ data: lines }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured')
    }
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const siteUrl = process.env.URL ?? process.env.SITE_URL ?? 'http://localhost:3000'

    // Prices are always resolved from the catalog on the server, never trusted from the client.
    const lineItems = lines.map((line) => {
      const product = getProduct(line.productId)
      if (!product) throw new Error(`Unknown product: ${line.productId}`)
      const color = product.colors.find((c) => c.name === line.color)
      if (!color || color.soldOut) throw new Error(`${product.name} colorway unavailable`)
      if (product.sizes) {
        const size = product.sizes.find((s) => s.label === line.size)
        if (!size || size.soldOut) throw new Error(`${product.name} size unavailable`)
      }
      const qty = Math.max(1, Math.min(10, Math.floor(line.qty)))
      const variant = [line.color, line.size].filter(Boolean).join(' / ')
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${product.name} — ${variant}`,
            description: product.tagline,
            images: [`${siteUrl}${product.images[0]}`],
          },
          unit_amount: priceFor(product, line.size),
        },
        quantity: qty,
      }
    })

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB'] },
      success_url: `${siteUrl}/checkout/success`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    })

    return session.url
  })
