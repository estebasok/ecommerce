# Moonsoda Goods

A playful, mobile-first online store for "loud little things for everyday orbit": squishy sneakers, glossy puffers, wobbly vases, fuzzy hats and more. The look is a neo-brutalist pop style: cream paper, ink outlines, hard offset shadows, and tomato, cobalt and acid-lime accents.

## Features

- **Home and shop grid**: a hero with a spinning sticker, a scrolling marquee, and a product grid you can search and filter. Filters cover category, color family, max price and sale items, plus five sort orders. Filters live in the URL, so any filtered view can be shared.
- **Product detail pages**: a swipeable gallery with thumbnails, hover zoom and colorway previews. Color and size variants include sold-out states and size-based price changes, plus a quantity stepper, a sticky add-to-bag bar on mobile, detail accordions and related products.
- **Bag**: a slide-out cart saved in `localStorage`, with quantity controls and a free-shipping progress bar.
- **Checkout**: Stripe Checkout with several line items. The server always looks prices up in the catalog.

## Tech

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, server functions)
- Tailwind CSS 4
- Stripe Checkout
- Netlify Image CDN (`/.netlify/images`) for responsive WebP product imagery
- Deployed on Netlify

## Running locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

Set `STRIPE_SECRET_KEY` to turn on checkout. Without it the store still works, but the checkout button reads "Checkout opening soon".

## Editing the catalog

All products are in `src/data/products.ts`. Each product has a base price in cents, a gallery of images in `public/img/`, color variants (with an optional `hue` rotation for colorway previews) and optional size variants (with an optional `priceDelta`).

## Possible next steps

- Move the catalog into Netlify Database so it can be edited without a deploy
- Customer accounts and order history
- Product reviews and photos from customers
