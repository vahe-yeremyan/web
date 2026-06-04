import { useEffect, useState } from 'react'

import { Link } from '@tanstack/react-router'

import { BagItem } from '@/components/shop/bag-item'
import { Money } from '@/components/shop/money'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCart, useClearCart } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'

type BagSide = 'right' | 'bottom'

function BagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.75"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  )
}

export function BagSheet() {
  const { cart, totalQuantity, refetch } = useCart()
  const clear = useClearCart()
  const [side, setSide] = useState<BagSide>('right')

  useEffect(() => {
    const checkScreenSize = () => {
      setSide(window.innerWidth < 768 ? 'bottom' : 'right')
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const lines = cart?.lines.nodes ?? []
  const hasItems = lines.length > 0
  const hasUnavailable = lines.some(
    (line) => !line.merchandise.availableForSale,
  )
  const badgeLabel = totalQuantity > 9 ? '9+' : totalQuantity

  return (
    <Sheet
      onOpenChange={(open) => {
        // Cart stock data can go stale between adding and checking out;
        // refetch on open so availability flags reflect current inventory.
        if (open) void refetch()
      }}
    >
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative p-2 transition-colors duration-100 ease-in-out"
          aria-label={`Bag, ${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`}
        >
          <BagIcon className="size-5 cursor-pointer" />
          {totalQuantity > 0 && (
            <span className="font-manrope absolute -top-0.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full bg-black text-xs leading-none font-medium text-white">
              {badgeLabel}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side={side}
        showCloseButton={false}
        className={cn(
          'bg-background text-foreground gap-0',
          side === 'right'
            ? 'w-full sm:max-w-sm'
            : 'h-auto max-h-[80vh] rounded-t-lg',
        )}
      >
        <SheetHeader className="border-border flex-row items-center justify-between border-b">
          <div>
            <SheetTitle className="text-lg font-semibold">Bag</SheetTitle>
            <SheetDescription className="sr-only">
              The items in your bag.
            </SheetDescription>
          </div>
          <SheetClose asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground text-sm font-medium underline-offset-4 transition-colors"
            >
              Close
            </button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {hasItems ? (
            <div className="space-y-4">
              {lines.map((line) => (
                <BagItem key={line.id} line={line} />
              ))}
            </div>
          ) : (
            <EmptyBag />
          )}
        </div>

        {hasItems && cart && (
          <SheetFooter className="border-border border-t">
            <div className="flex items-center justify-between text-base font-medium">
              <span>Subtotal</span>
              <Money
                className="font-manrope text-lg tracking-tight"
                amount={cart.cost.subtotalAmount.amount}
                currencyCode={cart.cost.subtotalAmount.currencyCode}
              />
            </div>
            <p className="text-muted-foreground text-sm">
              Shipping and taxes calculated at checkout.
            </p>
            {hasUnavailable ? (
              <button
                type="button"
                disabled
                className="bg-primary text-primary-foreground mt-1 block w-full cursor-not-allowed rounded-md px-6 py-3 text-center text-sm font-semibold opacity-50"
              >
                Checkout
              </button>
            ) : (
              <a
                href={cart.checkoutUrl}
                className="bg-primary text-primary-foreground mt-1 block w-full rounded-md px-6 py-3 text-center text-sm font-semibold no-underline transition hover:opacity-90"
              >
                Checkout
              </a>
            )}
            {hasUnavailable && (
              <p className="text-center text-xs font-medium text-red-800">
                Remove items that are no longer available to continue.
              </p>
            )}
            <SheetClose asChild>
              <button
                type="button"
                className="w-full rounded-md border px-6 py-2.5 text-center text-sm font-medium transition-colors hover:bg-neutral-100"
              >
                Continue browsing
              </button>
            </SheetClose>
            <button
              type="button"
              onClick={() => clear.mutate()}
              disabled={clear.isPending}
              className="text-muted-foreground hover:text-foreground text-center text-sm transition-colors disabled:opacity-40"
            >
              {clear.isPending ? 'Clearing...' : 'Clear bag'}
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function EmptyBag() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <BagIcon className="text-muted-foreground/30 mb-4 size-12" />
      <h3 className="mb-2 text-lg font-medium">Your bag is empty</h3>
      <p className="text-muted-foreground mb-6 max-w-xs text-sm font-medium">
        Discover original artworks and add pieces to your collection.
      </p>
      <SheetClose asChild>
        <Link
          to="/shop"
          className="text-foreground rounded-md border border-neutral-300 px-5 py-2 text-sm font-semibold no-underline transition hover:bg-neutral-50"
        >
          Continue browsing
        </Link>
      </SheetClose>
    </div>
  )
}
