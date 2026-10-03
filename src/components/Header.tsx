import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Search, ShoppingBag, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'
import { useCart } from '@/lib/cart'
import { CATEGORIES } from '@/data/products'

export function Header() {
  const { count, open, lastAdded } = useCart()
  const navigate = useNavigate()
  const search = useRouterState({ select: (s) => s.location.search as { q?: string } })
  const [query, setQuery] = useState(search.q ?? '')
  const [mobileSearch, setMobileSearch] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setQuery(search.q ?? ''), [search.q])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      to: '/',
      search: (prev) => ({ ...prev, q: query.trim() || undefined }),
      hash: 'shop',
    })
    setMobileSearch(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b-[2.5px] border-ink bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="group shrink-0" aria-label="Moonsoda home">
          <Logo />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/"
              search={{ cat: c }}
              hash="shop"
              className="rounded-full px-3 py-1.5 text-sm font-semibold transition hover:bg-ink hover:text-paper"
            >
              {c}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden flex-1 justify-end sm:flex" role="search">
          <label className="relative w-full max-w-xs">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the shelves"
              className="h-10 w-full rounded-full border-[2.5px] border-ink bg-white pl-9 pr-10 text-sm font-medium outline-none transition placeholder:text-ink-soft/70 focus:bg-lime"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-ink/30 px-1.5 font-mono text-[10px] text-ink-soft">
              /
            </kbd>
          </label>
        </form>

        <button
          onClick={() => setMobileSearch((v) => !v)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-full border-[2.5px] border-ink sm:hidden"
          aria-label="Toggle search"
        >
          {mobileSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </button>

        <button
          onClick={open}
          className="btn-pop relative flex h-10 items-center gap-2 rounded-full bg-tomato px-4 text-sm font-bold text-paper"
          aria-label={`Open cart, ${count} items`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Bag</span>
          <span
            key={lastAdded}
            className="animate-pop grid h-6 min-w-6 place-items-center rounded-full border-2 border-ink bg-lime px-1 font-mono text-xs text-ink"
          >
            {count}
          </span>
        </button>
      </div>

      {mobileSearch && (
        <form onSubmit={submit} className="border-t-2 border-ink px-4 py-3 sm:hidden" role="search">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the shelves"
            className="h-11 w-full rounded-full border-[2.5px] border-ink bg-white px-4 text-base outline-none focus:bg-lime"
          />
        </form>
      )}
    </header>
  )
}
