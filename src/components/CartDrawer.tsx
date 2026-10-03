import { Link } from '@tanstack/react-router'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart'
import { formatPrice, getProduct, priceFor } from '@/data/products'
import { cdn } from '@/lib/image'
import { createCheckoutSession, getStripeEnabled } from '@/lib/stripe'

const FREE_SHIPPING = 8500

export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, subtotal, count } = useCart()
  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStripeEnabled().then(setStripeEnabled).catch(() => setStripeEnabled(false))
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close])

  const checkout = async () => {
    setCheckingOut(true)
    setError(null)
    try {
      const url = await createCheckoutSession({ data: lines })
      if (url) window.location.href = url
      else throw new Error('No checkout URL')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed, try again.')
      setCheckingOut(false)
    }
  }

  const toFree = Math.max(0, FREE_SHIPPING - subtotal)
  const progress = Math.min(1, subtotal / FREE_SHIPPING)

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-[2.5px] border-ink bg-paper transition-transform duration-500 ease-[cubic-bezier(0.2,0.9,0.2,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b-[2.5px] border-ink px-5 py-4">
          <h2 className="font-display text-3xl font-extrabold">
            Your bag <span className="font-mono text-base text-ink-soft">({count})</span>
          </h2>
          <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full border-[2.5px] border-ink hover:bg-lime" aria-label="Close bag">
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length > 0 && (
          <div className="border-b-2 border-dashed border-ink/30 px-5 py-3">
            <p className="font-mono text-xs">
              {toFree > 0 ? (
                <>
                  <b>{formatPrice(toFree)}</b> away from free shipping
                </>
              ) : (
                <>Free shipping unlocked. Nice.</>
              )}
            </p>
            <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-ink bg-white">
              <div className="h-full bg-lime transition-[width] duration-700" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="animate-wobble mb-6 grid h-28 w-28 place-items-center rounded-full border-[2.5px] border-ink bg-butter font-display text-5xl font-extrabold shadow-pop">
                0
              </div>
              <p className="font-display text-2xl font-bold">Bag&rsquo;s empty.</p>
              <p className="mt-1 max-w-[16rem] text-sm text-ink-soft">
                Fill it with something squishy, glossy or fuzzy.
              </p>
              <Link to="/" hash="shop" onClick={close} className="btn-pop mt-6 rounded-full bg-cobalt px-6 py-3 font-bold text-paper">
                Browse the shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line, i) => {
                const p = getProduct(line.productId)
                if (!p) return null
                const color = p.colors.find((c) => c.name === line.color)
                return (
                  <li key={`${line.productId}-${line.color}-${line.size}`} className="flex gap-4 rounded-2xl border-[2.5px] border-ink bg-white p-3">
                    <Link
                      to="/products/$productId"
                      params={{ productId: p.id }}
                      onClick={close}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-ink"
                    >
                      <img
                        src={cdn(p.images[0], 200)}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        style={color?.hue ? { filter: `hue-rotate(${color.hue}deg)` } : undefined}
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="font-display text-lg font-bold leading-tight">{p.name}</p>
                        <p className="font-mono text-sm font-bold">{formatPrice(priceFor(p, line.size) * line.qty)}</p>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
                        <span className="h-3 w-3 rounded-full border border-ink" style={{ background: color?.hex }} />
                        {line.color}
                        {line.size && <> &middot; {line.size}</>}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border-2 border-ink">
                          <button onClick={() => setQty(i, line.qty - 1)} className="grid h-8 w-8 place-items-center hover:text-tomato" aria-label="Decrease quantity">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center font-mono text-sm">{line.qty}</span>
                          <button onClick={() => setQty(i, line.qty + 1)} className="grid h-8 w-8 place-items-center hover:text-tomato" aria-label="Increase quantity">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button onClick={() => remove(i)} className="text-ink-soft hover:text-tomato" aria-label={`Remove ${p.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t-[2.5px] border-ink bg-white px-5 py-5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-widest">Subtotal</span>
              <span className="font-display text-3xl font-extrabold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-ink-soft">Taxes and shipping calculated at checkout.</p>
            {error && (
              <p className="mt-3 rounded-lg border-2 border-tomato bg-tomato/10 px-3 py-2 text-sm font-semibold text-tomato">{error}</p>
            )}
            <button
              onClick={checkout}
              disabled={checkingOut || stripeEnabled !== true}
              className="btn-pop mt-4 w-full rounded-full bg-lime py-4 font-display text-xl font-extrabold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {stripeEnabled === false
                ? 'Checkout opening soon'
                : checkingOut
                  ? 'Heading to checkout…'
                  : 'Checkout'}
            </button>
            {stripeEnabled === false && (
              <p className="mt-2 text-center font-mono text-[11px] text-ink-soft">
                Payments go live once a Stripe key is connected.
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
