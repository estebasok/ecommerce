import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowDownRight, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import products, {
  CATEGORIES,
  COLOR_FAMILIES,
  colorFamily,
  formatPrice,
} from '@/data/products'
import type { Category, ColorFamily } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { cdn, srcSet } from '@/lib/image'

const SORTS = {
  featured: 'Featured',
  new: 'Newest',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
} as const
type SortKey = keyof typeof SORTS

const PRICE_CAP = Math.ceil(Math.max(...products.map((p) => p.price)) / 100 / 10) * 10

interface ShopSearch {
  q?: string
  cat?: Category
  color?: ColorFamily
  sort?: SortKey
  max?: number
  sale?: boolean
}

export const Route = createFileRoute('/')({
  validateSearch: (raw: Record<string, unknown>): ShopSearch => {
    const out: ShopSearch = {}
    if (typeof raw.q === 'string' && raw.q.trim()) out.q = raw.q.slice(0, 80)
    if (CATEGORIES.includes(raw.cat as Category)) out.cat = raw.cat as Category
    if (COLOR_FAMILIES.some((c) => c.name === raw.color)) out.color = raw.color as ColorFamily
    if (typeof raw.sort === 'string' && raw.sort in SORTS && raw.sort !== 'featured') {
      out.sort = raw.sort as SortKey
    }
    const max = Number(raw.max)
    if (Number.isFinite(max) && max > 0 && max < PRICE_CAP) out.max = Math.round(max)
    if (raw.sale === true || raw.sale === 'true') out.sale = true
    return out
  },
  component: Home,
})

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Shop />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
        <div className="relative z-10">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest">
            <span className="h-2 w-2 animate-pulse rounded-full bg-tomato" /> Fall drop 26 is live
          </p>
          <h1
            className="animate-rise font-display mt-6 text-[clamp(3.2rem,9vw,7.5rem)] font-extrabold leading-[0.86]"
            style={{ animationDelay: '80ms' }}
          >
            Loud little
            <br />
            things for
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">everyday</span>
              <span className="absolute inset-x-[-0.1em] bottom-[0.08em] z-0 h-[0.38em] -rotate-1 bg-lime" />
            </span>{' '}
            <span className="text-tomato">orbit.</span>
          </h1>
          <p
            className="animate-rise mt-6 max-w-md text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: '160ms' }}
          >
            Squishy sneakers, glossy puffers, lopsided vases and very fuzzy hats. Made in small runs, built to be
            used every day, and colored like a soda aisle.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
            <a href="#shop" className="btn-pop inline-flex items-center gap-2 rounded-full bg-tomato px-7 py-4 font-display text-lg font-extrabold text-paper">
              Shop the drop <ArrowDownRight className="h-5 w-5" />
            </a>
            <Link
              to="/products/$productId"
              params={{ productId: 'orbit-runner' }}
              className="inline-flex items-center rounded-full border-[2.5px] border-ink px-6 py-4 font-display text-lg font-bold transition hover:bg-ink hover:text-paper"
            >
              Meet the Orbit Runner
            </Link>
          </div>
          <dl className="mt-10 flex gap-8 font-mono text-xs">
            <div>
              <dt className="text-ink-soft">Avg. rating</dt>
              <dd className="font-display text-3xl font-extrabold">4.7</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Happy orbits</dt>
              <dd className="font-display text-3xl font-extrabold">38,412</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Returns</dt>
              <dd className="font-display text-3xl font-extrabold">45 days</dd>
            </div>
          </dl>
        </div>

        <div className="relative animate-rise" style={{ animationDelay: '200ms' }}>
          <div className="relative rotate-[2deg] overflow-hidden rounded-[2.5rem] border-[2.5px] border-ink bg-cobalt shadow-pop-lg">
            <img
              src={cdn('/img/hero.png', 1000)}
              srcSet={srcSet('/img/hero.png', [600, 1000, 1400])}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="A sculpture of a sneaker, vase, headphones and bucket hat balanced on a red pedestal in front of a crescent moon"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/6]"
              fetchPriority="high"
            />
          </div>
          <SpinBadge />
          <div className="absolute -bottom-5 left-4 rotate-[-4deg] rounded-2xl border-[2.5px] border-ink bg-butter px-4 py-3 shadow-pop sm:left-[-1.5rem]">
            <p className="font-mono text-[10px] uppercase tracking-widest">This week</p>
            <p className="font-display text-xl font-extrabold leading-tight">Cloud Puffer &minus;18%</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SpinBadge() {
  return (
    <div className="absolute -right-2 -top-6 h-28 w-28 sm:-right-6 sm:h-36 sm:w-36">
      <svg viewBox="0 0 100 100" className="animate-spin-slow h-full w-full">
        <defs>
          <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="var(--color-lime)" stroke="var(--color-ink)" strokeWidth="2.5" />
        <text className="font-mono" fontSize="9.5" fontWeight="700" letterSpacing="2.4" fill="var(--color-ink)">
          <textPath href="#circle">SMALL RUNS &#10022; BIG COLOR &#10022; NEW DROP &#10022;</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-2xl font-extrabold">&#9790;</span>
    </div>
  )
}

function Marquee() {
  const words = ['Squishy', 'Glossy', 'Fuzzy', 'Wobbly', 'Bouncy', 'Loud', 'Fizzy', 'Lopsided']
  const row = [...words, ...words]
  return (
    <div className="relative z-10 -rotate-[1.5deg] border-y-[2.5px] border-ink bg-cobalt py-3 text-paper">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-3xl font-extrabold uppercase sm:text-4xl">
            {w}
            <span className={i % 2 ? 'text-tomato' : 'text-lime'}>&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Shop() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/' })
  const [showFilters, setShowFilters] = useState(false)
  const [q, setQ] = useState(search.q ?? '')

  useEffect(() => setQ(search.q ?? ''), [search.q])

  const update = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false })

  // Debounce the inline search box into the URL
  useEffect(() => {
    const value = q.trim() || undefined
    if (value === search.q) return
    const t = setTimeout(() => update({ q: value }), 220)
    return () => clearTimeout(t)
  }, [q])

  const results = useMemo(() => {
    const term = search.q?.toLowerCase()
    const list = products.filter((p) => {
      if (search.cat && p.category !== search.cat) return false
      if (search.color && !p.colors.some((c) => colorFamily(c.hex) === search.color)) return false
      if (search.max && p.price / 100 > search.max) return false
      if (search.sale && !p.compareAt) return false
      if (term) {
        const hay = [p.name, p.tagline, p.category, p.description, ...p.colors.map((c) => c.name)]
          .join(' ')
          .toLowerCase()
        if (!term.split(/\s+/).every((t) => hay.includes(t))) return false
      }
      return true
    })
    switch (search.sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price)
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating)
      case 'new':
        return list.sort((a, b) => Number(b.badge === 'New') - Number(a.badge === 'New'))
      default:
        return list
    }
  }, [search])

  const activeChips: Array<{ label: string; clear: Partial<ShopSearch> }> = [
    search.q && { label: `“${search.q}”`, clear: { q: undefined } },
    search.cat && { label: search.cat, clear: { cat: undefined } },
    search.color && { label: search.color, clear: { color: undefined } },
    search.max && { label: `Under ${formatPrice(search.max * 100)}`, clear: { max: undefined } },
    search.sale && { label: 'On sale', clear: { sale: undefined } },
  ].filter(Boolean) as Array<{ label: string; clear: Partial<ShopSearch> }>

  const filterCount = [search.color, search.max, search.sale].filter(Boolean).length
  const clearAll = () => navigate({ search: {}, replace: true, resetScroll: false })

  return (
    <section id="shop" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-20 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">The shelves</p>
          <h2 className="font-display text-6xl font-extrabold leading-none sm:text-7xl">
            Shop all<span className="text-tomato">.</span>
          </h2>
        </div>
        <label className="relative w-full md:max-w-sm">
          <span className="sr-only">Search products</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try “fuzzy”, “cobalt” or “lamp”"
            className="h-14 w-full rounded-2xl border-[2.5px] border-ink bg-white px-5 font-display text-lg font-semibold shadow-pop outline-none transition placeholder:font-normal placeholder:text-ink-soft/60 focus:bg-lime"
          />
          {q && (
            <button onClick={() => setQ('')} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label="Clear search">
              <X className="h-5 w-5" />
            </button>
          )}
        </label>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-4 mt-8 border-y-2 border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
            <Pill active={!search.cat} onClick={() => update({ cat: undefined })}>
              Everything
            </Pill>
            {CATEGORIES.map((c) => (
              <Pill key={c} active={search.cat === c} onClick={() => update({ cat: search.cat === c ? undefined : c })}>
                {c}
              </Pill>
            ))}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className={`flex shrink-0 items-center gap-2 rounded-full border-[2.5px] border-ink px-4 py-2 text-sm font-bold transition ${
              showFilters ? 'bg-ink text-paper' : 'bg-white hover:bg-lime'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filter &amp; sort</span>
            {filterCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-tomato font-mono text-[10px] text-paper">
                {filterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="animate-rise mt-4 grid gap-6 rounded-3xl border-[2.5px] border-ink bg-white p-5 shadow-pop md:grid-cols-[1.4fr_1fr_1fr]">
            <fieldset>
              <legend className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-soft">Color</legend>
              <div className="flex flex-wrap gap-2">
                {COLOR_FAMILIES.map((c) => {
                  const active = search.color === c.name
                  return (
                    <button
                      key={c.name}
                      onClick={() => update({ color: active ? undefined : c.name })}
                      aria-pressed={active}
                      className={`flex items-center gap-2 rounded-full border-2 py-1 pl-1 pr-3 text-sm font-semibold transition ${
                        active ? 'border-ink bg-ink text-paper' : 'border-ink/20 hover:border-ink'
                      }`}
                    >
                      <span className="h-6 w-6 rounded-full border-2 border-ink" style={{ background: c.hex }} />
                      {c.name}
                    </button>
                  )
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
                Max price &middot; <b className="text-ink">{search.max ? formatPrice(search.max * 100) : 'Any'}</b>
              </legend>
              <input
                type="range"
                min={30}
                max={PRICE_CAP}
                step={10}
                value={search.max ?? PRICE_CAP}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  update({ max: v >= PRICE_CAP ? undefined : v })
                }}
                className="w-full accent-tomato"
              />
              <div className="mt-1 flex justify-between font-mono text-[11px] text-ink-soft">
                <span>$30</span>
                <span>${PRICE_CAP}</span>
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={!!search.sale}
                  onChange={(e) => update({ sale: e.target.checked || undefined })}
                  className="h-5 w-5 accent-tomato"
                />
                On sale only
              </label>
            </fieldset>
            <fieldset>
              <legend className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-soft">Sort by</legend>
              <div className="flex flex-col gap-1">
                {(Object.keys(SORTS) as Array<SortKey>).map((k) => {
                  const active = (search.sort ?? 'featured') === k
                  return (
                    <button
                      key={k}
                      onClick={() => update({ sort: k === 'featured' ? undefined : k })}
                      className={`rounded-xl px-3 py-1.5 text-left text-sm font-semibold transition ${
                        active ? 'bg-lime' : 'hover:bg-paper-deep'
                      }`}
                    >
                      {SORTS[k]}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <p className="mr-2 font-mono text-xs text-ink-soft">
          {results.length} {results.length === 1 ? 'thing' : 'things'}
        </p>
        {activeChips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => update(chip.clear)}
            className="flex items-center gap-1 rounded-full border-2 border-ink bg-butter px-3 py-0.5 text-xs font-bold hover:bg-tomato hover:text-paper"
          >
            {chip.label} <X className="h-3 w-3" />
          </button>
        ))}
        {activeChips.length > 1 && (
          <button onClick={clearAll} className="font-mono text-xs underline underline-offset-2">
            Clear all
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-[2rem] border-[2.5px] border-dashed border-ink px-6 py-20 text-center">
          <div className="animate-wobble grid h-24 w-24 place-items-center rounded-full border-[2.5px] border-ink bg-lilac font-display text-4xl font-extrabold shadow-pop">
            ?
          </div>
          <p className="mt-6 font-display text-3xl font-extrabold">Nothing on this shelf.</p>
          <p className="mt-2 max-w-sm text-ink-soft">
            We couldn&rsquo;t find a match for those filters. Loosen them up a little, or start over.
          </p>
          <button onClick={clearAll} className="btn-pop mt-6 rounded-full bg-lime px-6 py-3 font-bold">
            Reset filters
          </button>
        </div>
      ) : (
        <div
          key={JSON.stringify(search)}
          className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {results.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border-[2.5px] px-4 py-2 text-sm font-bold transition ${
        active ? 'border-ink bg-ink text-paper' : 'border-ink/20 bg-white hover:border-ink'
      }`}
    >
      {children}
    </button>
  )
}
