export type Category = 'Footwear' | 'Apparel' | 'Accessories' | 'Home' | 'Audio'

export interface ColorVariant {
  name: string
  hex: string
  /** Optional CSS hue rotation (deg) applied to the gallery to preview the colorway */
  hue?: number
  soldOut?: boolean
}

export interface SizeVariant {
  label: string
  /** Price adjustment in cents relative to the base price */
  priceDelta?: number
  soldOut?: boolean
}

export interface Product {
  id: string
  name: string
  tagline: string
  category: Category
  /** Base price in cents */
  price: number
  /** Original price in cents when on sale */
  compareAt?: number
  images: Array<string>
  description: string
  details: Array<string>
  colors: Array<ColorVariant>
  sizes?: Array<SizeVariant>
  sizeLabel?: string
  rating: number
  reviews: number
  badge?: 'New' | 'Low stock' | 'Sale' | 'Cult fave'
  accent: string
}

export const CATEGORIES: Array<Category> = [
  'Footwear',
  'Apparel',
  'Accessories',
  'Home',
  'Audio',
]

const products: Array<Product> = [
  {
    id: 'orbit-runner',
    name: 'Orbit Runner',
    tagline: 'A squishy, bouncy sneaker for orbiting the block.',
    category: 'Footwear',
    price: 14800,
    images: ['/img/runner-1.png', '/img/runner-2.png'],
    description:
      'The Orbit Runner rides on a 38mm foam sole tuned with wave-shaped lugs, so every step feels a little springy. The upper is breathable recycled mesh with suede overlays, and the oversized heel tab makes them easy to pull on when you’re late for the bus.',
    details: [
      'Recycled poly mesh upper, suede overlays',
      'Dual-density EVA midsole, 38mm stack',
      'Wave-lug rubber outsole',
      'Fits true to size, roomy toe box',
    ],
    colors: [
      { name: 'Tomato Soda', hex: '#ff5a3c' },
      { name: 'Grape Fizz', hex: '#8a6cff', hue: 230 },
      { name: 'Mint Float', hex: '#5fd6a8', hue: 140, soldOut: false },
    ],
    sizeLabel: 'US size',
    sizes: [
      { label: '6' },
      { label: '7' },
      { label: '8' },
      { label: '9' },
      { label: '10', soldOut: true },
      { label: '11' },
      { label: '12' },
    ],
    rating: 4.7,
    reviews: 412,
    badge: 'Cult fave',
    accent: '#2e48ff',
  },
  {
    id: 'cloud-puffer',
    name: 'Cloud Puffer',
    tagline: 'Wearable duvet. Glossy as a fresh coat of paint.',
    category: 'Apparel',
    price: 23600,
    compareAt: 28900,
    images: ['/img/puffer-1.png', '/img/puffer-2.png'],
    description:
      'A boxy, cropped puffer filled with 650-fill recycled down and shelled in a water-repellent high-shine nylon. Two-way zip, deep hand-warmer pockets and a stand collar that stays up on windy mornings.',
    details: [
      '650-fill recycled down',
      'High-shine water-repellent nylon shell',
      'Two-way YKK zip, snap storm flap',
      'Cropped boxy fit, size down for a closer fit',
    ],
    colors: [
      { name: 'Tangerine', hex: '#ff8a1f' },
      { name: 'Cobalt', hex: '#2e48ff', hue: 200 },
      { name: 'Hot Pink', hex: '#ff4fa3', hue: 300 },
    ],
    sizeLabel: 'Size',
    sizes: [
      { label: 'XS' },
      { label: 'S' },
      { label: 'M' },
      { label: 'L' },
      { label: 'XL', priceDelta: 1200 },
      { label: 'XXL', priceDelta: 1200, soldOut: true },
    ],
    rating: 4.8,
    reviews: 189,
    badge: 'Sale',
    accent: '#c9b8ff',
  },
  {
    id: 'moon-tote',
    name: 'Moon Tote',
    tagline: '16oz canvas that can carry a week of groceries.',
    category: 'Accessories',
    price: 4200,
    images: ['/img/tote-1.png', '/img/tote-2.png'],
    description:
      'Heavyweight organic cotton canvas, screen-printed with our oversized moon in water-based ink. Reinforced box stitching on the straps means it holds a watermelon without complaint.',
    details: [
      '16oz organic cotton canvas',
      'Water-based screen print',
      'Inner zip pocket, key clip',
      '40 × 42 × 14 cm',
    ],
    colors: [
      { name: 'Cream / Tomato', hex: '#f3e9d2' },
      { name: 'Cream / Cobalt', hex: '#3b5bff', hue: 210 },
    ],
    rating: 4.9,
    reviews: 1034,
    accent: '#d7ff3a',
  },
  {
    id: 'wobble-vase',
    name: 'Wobble Vase',
    tagline: 'Hand-thrown, a little lopsided, completely charming.',
    category: 'Home',
    price: 6800,
    images: ['/img/vase-1.png', '/img/vase-2.png'],
    description:
      'Each Wobble Vase is thrown by hand in a small studio in Porto and finished with a deep, glassy glaze. No two have the same bulges. Watertight and happy holding a single stem or a fistful of supermarket tulips.',
    details: [
      'Hand-thrown stoneware, food-safe glaze',
      'Watertight, hand wash only',
      'Every piece is unique, slight variations expected',
    ],
    colors: [
      { name: 'Cobalt Glaze', hex: '#2e48ff' },
      { name: 'Tomato Glaze', hex: '#ff4b2b', hue: 150 },
      { name: 'Pistachio Glaze', hex: '#a9d66b', hue: 260 },
    ],
    sizeLabel: 'Size',
    sizes: [
      { label: 'Petite · 14cm' },
      { label: 'Classic · 22cm', priceDelta: 2400 },
      { label: 'Grand · 31cm', priceDelta: 5600 },
    ],
    rating: 4.6,
    reviews: 276,
    badge: 'New',
    accent: '#ffd84a',
  },
  {
    id: 'static-cans',
    name: 'Static Cans',
    tagline: 'Wireless over-ears with a 1970s soul.',
    category: 'Audio',
    price: 18900,
    images: ['/img/headphones-1.png', '/img/headphones-2.png'],
    description:
      'Forty-millimetre graphene drivers, active noise cancelling and 52 hours of battery tucked into a retro shell with memory-foam cushions. Folds flat, connects to two devices at once, and still has a headphone jack.',
    details: [
      '40mm graphene drivers',
      'Hybrid ANC with transparency mode',
      '52-hour battery, USB-C fast charge',
      'Bluetooth 5.4 multipoint + 3.5mm jack',
    ],
    colors: [
      { name: 'Mint Cream', hex: '#9be3c4' },
      { name: 'Butter', hex: '#ffd84a', hue: 290 },
      { name: 'Lilac', hex: '#c9b8ff', hue: 110, soldOut: true },
    ],
    rating: 4.5,
    reviews: 538,
    accent: '#ff4fa3',
  },
  {
    id: 'fuzz-bucket',
    name: 'Fuzz Bucket',
    tagline: 'Terry-cloth bucket hat. Soft as a bath towel.',
    category: 'Accessories',
    price: 3600,
    images: ['/img/hat-1.png', '/img/hat-2.png'],
    description:
      'Thick loop terry cotton with a short, floppy brim and a satin inner band that won’t snag your hair. Throw it in the wash, it only gets fuzzier.',
    details: [
      '100% cotton loop terry',
      'Satin-lined sweatband',
      'Machine washable',
    ],
    colors: [
      { name: 'Lime', hex: '#c8f03a' },
      { name: 'Lilac', hex: '#c9b8ff', hue: 170 },
      { name: 'Orange', hex: '#ff8a1f', hue: 280 },
    ],
    sizeLabel: 'Fit',
    sizes: [{ label: 'S/M' }, { label: 'L/XL' }],
    rating: 4.8,
    reviews: 802,
    badge: 'Low stock',
    accent: '#ff4b2b',
  },
  {
    id: 'shroom-lamp',
    name: 'Shroom Lamp',
    tagline: 'A glossy mushroom that glows like dusk.',
    category: 'Home',
    price: 12400,
    images: ['/img/lamp-1.png', '/img/lamp-2.png'],
    description:
      'Blown-glass shade on a weighted lacquered base, with a warm-dim LED that drifts from 2700K down to candle-glow as you dim it. Touch-sensitive with three brightness steps.',
    details: [
      'Mouth-blown glass shade, lacquered steel base',
      'Warm-dim LED, 2700K → 1800K',
      'Touch dimmer, 3 steps',
      '34cm tall, 1.8m fabric cord',
    ],
    colors: [
      { name: 'Cherry', hex: '#e63a2e' },
      { name: 'Plum', hex: '#7a3b8f', hue: 290 },
    ],
    rating: 4.9,
    reviews: 147,
    badge: 'New',
    accent: '#3a2350',
  },
  {
    id: 'grapefruit-shades',
    name: 'Grapefruit Shades',
    tagline: 'Chunky acetate, tinted lenses, zero chill.',
    category: 'Accessories',
    price: 7800,
    compareAt: 9200,
    images: ['/img/shades-1.png', '/img/shades-2.png'],
    description:
      'Thick hand-polished bio-acetate frames with five-barrel hinges and polarised, 100% UV400 lenses in a warm grapefruit tint. Comes with a corduroy case that’s cuter than it needs to be.',
    details: [
      'Bio-acetate frames, 5-barrel hinges',
      'Polarised UV400 lenses',
      'Corduroy case and cleaning cloth included',
    ],
    colors: [
      { name: 'Lime / Grapefruit', hex: '#b5e83a' },
      { name: 'Cherry / Smoke', hex: '#e63a2e', hue: 260 },
    ],
    rating: 4.4,
    reviews: 321,
    badge: 'Sale',
    accent: '#8fd3ff',
  },
]

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}

export function priceFor(product: Product, sizeLabel?: string) {
  const size = product.sizes?.find((s) => s.label === sizeLabel)
  return product.price + (size?.priceDelta ?? 0)
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export default products

export const COLOR_FAMILIES = [
  { name: 'Red', hex: '#ff4b2b' },
  { name: 'Orange', hex: '#ff8a1f' },
  { name: 'Yellow', hex: '#ffd84a' },
  { name: 'Green', hex: '#b5e83a' },
  { name: 'Blue', hex: '#2e48ff' },
  { name: 'Purple', hex: '#a98cff' },
  { name: 'Pink', hex: '#ff7ab8' },
  { name: 'Neutral', hex: '#f3e9d2' },
] as const

export type ColorFamily = (typeof COLOR_FAMILIES)[number]['name']

/** Bucket a swatch hex into a broad color family for filtering. */
export function colorFamily(hex: string): ColorFamily {
  const n = parseInt(hex.slice(1), 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (s < 0.35 || l > 0.88) return 'Neutral'
  let h = 0
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  h = (h * 60 + 360) % 360
  if (h < 18 || h >= 345) return 'Red'
  if (h < 40) return 'Orange'
  if (h < 62) return 'Yellow'
  if (h < 170) return 'Green'
  if (h < 245) return 'Blue'
  if (h < 300) return 'Purple'
  return 'Pink'
}
