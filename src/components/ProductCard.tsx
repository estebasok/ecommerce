import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Stars } from './Stars'
import type { Product } from '@/data/products'
import { formatPrice } from '@/data/products'
import { cdn, srcSet } from '@/lib/image'
import { useCart } from '@/lib/cart'

const BADGE_STYLES: Record<NonNullable<Product['badge']>, string> = {
  New: 'bg-lime',
  Sale: 'bg-tomato text-paper',
  'Low stock': 'bg-butter',
  'Cult fave': 'bg-lilac',
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart()
  const firstColor = product.colors.find((c) => !c.soldOut) ?? product.colors[0]
  const canQuickAdd = !product.sizes

  return (
    <article
      className="animate-rise group relative flex flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] border-[2.5px] border-ink shadow-pop transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-0.6deg] group-hover:shadow-pop-lg"
        style={{ background: product.accent }}
      >
        <img
          src={cdn(product.images[0], 600)}
          srcSet={srcSet(product.images[0], [400, 600, 900])}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          alt={product.name}
          loading={index < 4 ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {product.images[1] && (
          <img
            src={cdn(product.images[1], 600)}
            srcSet={srcSet(product.images[1], [400, 600, 900])}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        )}
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rotate-[-8deg] rounded-full border-2 border-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </Link>

      {canQuickAdd && (
        <button
          onClick={() => add({ productId: product.id, color: firstColor.name, qty: 1 })}
          className="btn-pop absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-paper sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
          aria-label={`Add ${product.name} to bag`}
        >
          <Plus className="h-5 w-5" />
        </button>
      )}

      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">{product.category}</p>
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="font-display text-2xl font-extrabold leading-tight decoration-tomato decoration-[3px] underline-offset-4 hover:underline"
          >
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
            <Stars rating={product.rating} size={12} />
            <span className="font-mono">({product.reviews})</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-base font-bold">{formatPrice(product.price)}</p>
          {product.compareAt && (
            <p className="font-mono text-xs text-ink-soft line-through">{formatPrice(product.compareAt)}</p>
          )}
        </div>
      </div>
      <div className="mt-2 flex gap-1.5 px-1">
        {product.colors.map((c) => (
          <span
            key={c.name}
            title={c.name}
            className={`h-4 w-4 rounded-full border-2 border-ink ${c.soldOut ? 'opacity-30' : ''}`}
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </article>
  )
}
