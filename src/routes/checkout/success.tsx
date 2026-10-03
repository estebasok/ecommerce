import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCart } from '@/lib/cart'
import { MoonMark } from '@/components/Logo'

export const Route = createFileRoute('/checkout/success')({
  component: CheckoutSuccess,
})

function CheckoutSuccess() {
  const { clear } = useCart()
  useEffect(() => clear(), [])

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <MoonMark className="animate-wobble h-28 w-28" />
      <h1 className="font-display mt-8 text-6xl font-extrabold leading-none sm:text-7xl">
        Order <span className="text-tomato">launched.</span>
      </h1>
      <p className="mt-5 max-w-md text-lg text-ink-soft">
        Thanks for shopping with Moonsoda. A receipt is on its way to your inbox, and we&rsquo;ll email tracking as
        soon as your box leaves the launchpad.
      </p>
      <Link to="/" hash="shop" className="btn-pop mt-10 rounded-full bg-lime px-7 py-4 font-display text-lg font-extrabold">
        Keep browsing
      </Link>
    </div>
  )
}
