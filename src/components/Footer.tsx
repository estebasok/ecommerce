import { Link } from '@tanstack/react-router'
import { MoonMark } from './Logo'
import { CATEGORIES } from '@/data/products'

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t-[2.5px] border-ink bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl">
            Goods that fizz.
            <br />
            <span className="text-lime">Shipped from the moon</span>
            <span className="text-tomato">*</span>
          </p>
          <p className="mt-4 max-w-sm font-mono text-xs text-paper/60">
            *Technically a warehouse in Pittsburgh. Free shipping over $85, free returns for 45 days.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-paper/50">Shop</h3>
          <ul className="space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link to="/" search={{ cat: c }} hash="shop" className="font-semibold hover:text-lime">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-paper/50">Help</h3>
          <ul className="space-y-2 font-semibold">
            <li>Shipping &amp; returns</li>
            <li>Size guide</li>
            <li>hello@moonsoda.shop</li>
          </ul>
        </div>
      </div>
      <MoonMark className="animate-spin-slow pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 opacity-90" />
      <div className="border-t border-paper/15 py-5 text-center font-mono text-[11px] text-paper/50">
        &copy; {new Date().getFullYear()} Moonsoda Goods Co.
      </div>
    </footer>
  )
}
