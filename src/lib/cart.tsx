import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getProduct, priceFor } from '@/data/products'

export interface CartLine {
  productId: string
  color: string
  size?: string
  qty: number
}

interface CartState {
  lines: Array<CartLine>
  count: number
  subtotal: number
  isOpen: boolean
  lastAdded: number
  open: () => void
  close: () => void
  add: (line: CartLine) => void
  setQty: (index: number, qty: number) => void
  remove: (index: number) => void
  clear: () => void
}

const CartContext = createContext<CartState | null>(null)
const STORAGE_KEY = 'moonsoda-cart-v1'

export const lineKey = (l: Pick<CartLine, 'productId' | 'color' | 'size'>) =>
  `${l.productId}::${l.color}::${l.size ?? ''}`

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Array<CartLine>>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Array<CartLine>
        setLines(parsed.filter((l) => getProduct(l.productId)))
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, hydrated])

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const key = lineKey(line)
      const existing = prev.findIndex((l) => lineKey(l) === key)
      if (existing === -1) return [...prev, line]
      return prev.map((l, i) =>
        i === existing ? { ...l, qty: Math.min(l.qty + line.qty, 10) } : l,
      )
    })
    setLastAdded(Date.now())
    setIsOpen(true)
  }, [])

  const setQty = useCallback((index: number, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((_, i) => i !== index)
        : prev.map((l, i) => (i === index ? { ...l, qty: Math.min(qty, 10) } : l)),
    )
  }, [])

  const remove = useCallback((index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((sum, l) => {
      const p = getProduct(l.productId)
      return p ? sum + priceFor(p, l.size) * l.qty : sum
    }, 0)
    return {
      lines,
      count,
      subtotal,
      isOpen,
      lastAdded,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQty,
      remove,
      clear: () => {
        localStorage.removeItem(STORAGE_KEY)
        setLines([])
      },
    }
  }, [lines, isOpen, lastAdded, add, setQty, remove])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
