# AGENTS.md

Moonsoda Goods is an ecommerce storefront built with TanStack Start (React 19) and Tailwind CSS 4, deployed on Netlify.

## Architecture

```
src/
├── data/products.ts        # The catalog (source of truth), price helpers, color-family bucketing
├── lib/
│   ├── cart.tsx            # CartProvider/useCart: client cart saved to localStorage (key moonsoda-cart-v1)
│   ├── stripe.ts           # Server functions: getStripeEnabled, createCheckoutSession(lines)
│   └── image.ts            # cdn()/srcSet() helpers for the Netlify Image CDN
├── components/
│   ├── Header.tsx          # Sticky header, category links, search ("/" shortcut), bag button
│   ├── CartDrawer.tsx      # Slide-out bag, free-shipping meter, Stripe checkout
│   ├── ProductCard.tsx     # Grid card: hover image swap, badge sticker, quick add (only for products without sizes)
│   ├── Footer.tsx, Logo.tsx, Stars.tsx
└── routes/
    ├── __root.tsx          # Shell: fonts, CartProvider, header/footer/drawer, 404
    ├── index.tsx           # Hero + marquee + shop grid. Filters are typed URL search params (validateSearch)
    ├── products/$productId.tsx  # PDP: gallery, variants, qty, add to bag, related items. $productId is the product slug
    └── checkout/{success,cancel}.tsx
public/img/                 # Generated product photography (1024px PNGs). Always serve through cdn()
```

## Conventions and decisions

- **Prices are integers in cents.** Use `formatPrice()` to display them and `priceFor(product, size)` to apply size deltas.
- **Server-side pricing.** `createCheckoutSession` receives `{productId, color, size, qty}` lines and resolves price and availability from `src/data/products.ts`. Never trust client prices.
- **Colorway previews** use a CSS `hue-rotate` filter (the `ColorVariant.hue` field) on the gallery, so each product needs only one photo set. To show real per-color photos, add per-color images to the product and drop the `hue` field.
- **Color filtering** buckets each swatch hex into a family with `colorFamily()`. New swatches are filterable automatically.
- **Design tokens** (colors, fonts, shadows, animations) are in the `@theme` block in `src/styles.css`. Reuse `btn-pop`, `shadow-pop`, `font-display`, `animate-rise` etc. rather than adding new ad-hoc styles. Fonts: Bricolage Grotesque (display/body) and JetBrains Mono (labels/prices).
- Import paths use the `@/` alias for `src/`.
- Environment: `STRIPE_SECRET_KEY` turns on checkout. The success/cancel URLs use Netlify's `URL` env var.
