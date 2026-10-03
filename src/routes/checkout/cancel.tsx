import { createFileRoute } from '@tanstack/react-router'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/checkout/cancel')({
  component: CheckoutCancel,
})

function CheckoutCancel() {
  const { open } = useCart()

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <div className="animate-wobble grid h-28 w-28 place-items-center rounded-full border-[2.5px] border-ink bg-butter font-display text-5xl font-extrabold shadow-pop">
        !
      </div>
      <h1 className="font-display mt-8 text-6xl font-extrabold leading-none sm:text-7xl">
        No worries<span className="text-tomato">.</span>
      </h1>
      <p className="mt-5 max-w-md text-lg text-ink-soft">
        Checkout was cancelled and nothing was charged. Your bag is right where you left it.
      </p>
      <button onClick={open} className="btn-pop mt-10 rounded-full bg-tomato px-7 py-4 font-display text-lg font-extrabold text-paper">
        Open my bag
      </button>
    </div>
  )
}
