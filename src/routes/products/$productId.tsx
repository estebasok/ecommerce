import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import products, { formatPrice, getProduct, priceFor } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { Stars } from '@/components/Stars'
import { cdn, srcSet } from '@/lib/image'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/products/$productId')({
  loader: ({ params }) => {
    const product = getProduct(params.productId)
    if (!product) throw notFound()
    return product
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Moonsoda Goods` },
          { name: 'description', content: loaderData.tagline },
          { property: 'og:title', content: `${loaderData.name} — Moonsoda Goods` },
          { property: 'og:image', content: `/.netlify/images?url=${loaderData.images[0]}&w=1200&fm=jpg` },
        ]
      : [],
  }),
  component: ProductPage,
})

function ProductPage() {
  const product = Route.useLoaderData()
  const { add } = useCart()

  const defaultColor = product.colors.find((c) => !c.soldOut) ?? product.colors[0]
  const [colorName, setColorName] = useState(defaultColor.name)
  const [size, setSize] = useState<string | undefined>(undefined)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)

  // Reset selections when navigating between products
  useEffect(() => {
    setColorName(defaultColor.name)
    setSize(undefined)
    setQty(1)
    setSizeError(false)
  }, [product.id])

  const color = product.colors.find((c) => c.name === colorName) ?? defaultColor
  const price = priceFor(product, size)
  const savings = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0
  const related = products.filter((p) => p.id !== product.id && p.category === product.category)
  const more = [...related, ...products.filter((p) => p.id !== product.id && p.category !== product.category)].slice(0, 4)

  const addToBag = () => {
    if (product.sizes && !size) {
      setSizeError(true)
      document.getElementById('size-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    add({ productId: product.id, color: color.name, size, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-0">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-ink-soft" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Shop</Link>
        <span>/</span>
        <Link to="/" search={{ cat: product.category }} hash="shop" className="hover:text-ink">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Gallery key={product.id} images={product.images} name={product.name} hue={color.hue} accent={product.accent} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          {product.badge && (
            <span className="mb-4 inline-block rotate-[-3deg] rounded-full border-2 border-ink bg-lime px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          <h1 className="font-display text-6xl font-extrabold leading-[0.9] sm:text-7xl">{product.name}</h1>
          <p className="mt-3 text-lg text-ink-soft">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <Stars rating={product.rating} size={16} />
            <span className="font-bold">{product.rating}</span>
            <span className="font-mono text-xs text-ink-soft">&middot; {product.reviews.toLocaleString()} reviews</span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span key={price} className="animate-pop font-display text-5xl font-extrabold">
              {formatPrice(price)}
            </span>
            {product.compareAt && (
              <>
                <span className="mb-1.5 font-mono text-lg text-ink-soft line-through">
                  {formatPrice(product.compareAt + (price - product.price))}
                </span>
                <span className="mb-2 rounded-full border-2 border-ink bg-tomato px-2 py-0.5 font-mono text-xs font-bold text-paper">
                  &minus;{savings}%
                </span>
              </>
            )}
          </div>
          <p className="mt-1 font-mono text-[11px] text-ink-soft">
            or 4 payments of {formatPrice(Math.ceil(price / 4))}
          </p>

          {/* Color */}
          <fieldset className="mt-8">
            <legend className="mb-3 flex gap-2 font-mono text-xs uppercase tracking-widest">
              Color <span className="normal-case tracking-normal text-ink-soft">&mdash; {color.name}</span>
            </legend>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => {
                const active = c.name === color.name
                return (
                  <button
                    key={c.name}
                    onClick={() => !c.soldOut && setColorName(c.name)}
                    disabled={c.soldOut}
                    aria-pressed={active}
                    aria-label={`${c.name}${c.soldOut ? ' (sold out)' : ''}`}
                    title={c.soldOut ? `${c.name} — sold out` : c.name}
                    className={`relative grid h-12 w-12 place-items-center rounded-full border-[2.5px] border-ink transition ${
                      active ? 'scale-110 shadow-pop' : 'hover:scale-105'
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                    style={{ background: c.hex }}
                  >
                    {active && (
                      <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-paper">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    )}
                    {c.soldOut && <span className="absolute h-[2.5px] w-14 rotate-45 bg-ink" />}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Size */}
          {product.sizes && (
            <fieldset id="size-picker" className="mt-7">
              <legend className="mb-3 flex w-full justify-between font-mono text-xs uppercase tracking-widest">
                <span>{product.sizeLabel ?? 'Size'}</span>
                {sizeError && <span className="normal-case tracking-normal text-tomato">Pick one first</span>}
              </legend>
              <div className={`flex flex-wrap gap-2 rounded-2xl ${sizeError ? 'animate-pop' : ''}`}>
                {product.sizes.map((s) => {
                  const active = s.label === size
                  return (
                    <button
                      key={s.label}
                      onClick={() => {
                        setSize(s.label)
                        setSizeError(false)
                      }}
                      disabled={s.soldOut}
                      aria-pressed={active}
                      className={`relative min-w-14 overflow-hidden rounded-xl border-[2.5px] px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:text-ink/30 ${
                        active
                          ? 'border-ink bg-ink text-paper'
                          : sizeError
                            ? 'border-tomato bg-white'
                            : 'border-ink/25 bg-white hover:border-ink'
                      }`}
                    >
                      {s.label}
                      {s.priceDelta ? (
                        <span className={`ml-1 font-mono text-[10px] ${active ? 'text-lime' : 'text-ink-soft'}`}>
                          +{formatPrice(s.priceDelta)}
                        </span>
                      ) : null}
                      {s.soldOut && (
                        <span className="absolute left-1/2 top-1/2 h-[2px] w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-[20deg] bg-ink/30" />
                      )}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Quantity + add */}
          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-full border-[2.5px] border-ink bg-white">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-14 w-12 place-items-center hover:text-tomato" aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-mono font-bold" aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-14 w-12 place-items-center hover:text-tomato" aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <AddButton added={added} onClick={addToBag} price={price * qty} className="flex-1" />
          </div>

          <ul className="mt-6 grid gap-3 rounded-2xl border-2 border-dashed border-ink/30 p-4 text-sm sm:grid-cols-2">
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-cobalt" /> Ships in 1&ndash;2 days</li>
            <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-cobalt" /> 45-day free returns</li>
          </ul>

          <div className="mt-8 divide-y-2 divide-ink border-y-2 border-ink">
            <Accordion title="The story" defaultOpen>
              <p className="leading-relaxed text-ink-soft">{product.description}</p>
            </Accordion>
            <Accordion title="Details & materials">
              <ul className="space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-2 text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tomato" /> {d}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Shipping & returns">
              <p className="leading-relaxed text-ink-soft">
                Free standard shipping on orders over $85. Express available at checkout. Changed your mind?
                Send it back within 45 days in its original condition for a full refund.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Mobile sticky add bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-[2.5px] border-ink bg-paper/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-extrabold leading-tight">{product.name}</p>
            <p className="truncate font-mono text-[11px] text-ink-soft">
              {color.name}
              {size ? ` · ${size}` : product.sizes ? ' · choose size' : ''}
            </p>
          </div>
          <AddButton added={added} onClick={addToBag} price={price * qty} compact />
        </div>
      </div>

      <section className="mt-24">
        <h2 className="font-display text-5xl font-extrabold leading-none">
          Pairs well with<span className="text-tomato">.</span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 min-[520px]:grid-cols-2 lg:grid-cols-4">
          {more.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}

function AddButton({
  added,
  onClick,
  price,
  compact,
  className = '',
}: {
  added: boolean
  onClick: () => void
  price: number
  compact?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`btn-pop flex items-center justify-center gap-2 rounded-full font-display font-extrabold transition-colors ${
        added ? 'bg-lime' : 'bg-tomato text-paper'
      } ${compact ? 'h-12 px-5 text-base' : 'h-14 px-6 text-xl'} ${className}`}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" strokeWidth={3} /> In the bag
        </>
      ) : (
        <>
          Add to bag <span className="font-mono text-sm opacity-80">&middot; {formatPrice(price)}</span>
        </>
      )}
    </button>
  )
}

function Gallery({
  images,
  name,
  hue,
  accent,
}: {
  images: Array<string>
  name: string
  hue?: number
  accent: string
}) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const filter = hue ? `hue-rotate(${hue}deg)` : undefined

  const go = (i: number) => {
    const next = (i + images.length) % images.length
    setActive(next)
    const track = trackRef.current
    if (track) track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' })
  }

  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const i = Math.round(track.scrollLeft / track.clientWidth)
    if (i !== active) setActive(i)
  }

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div
        className="relative overflow-hidden rounded-[2rem] border-[2.5px] border-ink shadow-pop-lg"
        style={{ background: accent }}
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex aspect-square snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="relative h-full w-full shrink-0 snap-center overflow-hidden lg:cursor-zoom-in"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
              }}
              onMouseLeave={() => setZoom(null)}
            >
              <img
                src={cdn(src, 1000)}
                srcSet={srcSet(src, [600, 1000, 1400])}
                sizes="(min-width: 1024px) 55vw, 100vw"
                alt={`${name} — view ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover transition-[transform,filter] duration-500 ease-out"
                style={{
                  filter,
                  transform: zoom && i === active ? 'scale(1.8)' : undefined,
                  transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => go(active - 1)}
              className="btn-pop absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(active + 1)}
              className="btn-pop absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full border-2 border-ink bg-paper px-2 py-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full bg-ink transition-all ${i === active ? 'w-6' : 'w-2 opacity-30'}`}
                />
              ))}
            </div>
          </>
        )}
        {hue ? (
          <span className="absolute right-4 top-4 rounded-full border-2 border-ink bg-paper px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide">
            Colorway preview
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => go(i)}
            aria-label={`Show image ${i + 1}`}
            aria-current={i === active}
            className={`h-20 w-20 overflow-hidden rounded-2xl border-[2.5px] border-ink transition sm:h-24 sm:w-24 ${
              i === active ? 'shadow-pop -translate-y-1' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <img src={cdn(src, 200)} alt="" className="h-full w-full object-cover" style={{ filter }} />
          </button>
        ))}
      </div>
    </div>
  )
}

function Accordion({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left font-display text-xl font-bold"
      >
        {title}
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
