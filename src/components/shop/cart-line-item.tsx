import type { CartLineDetail } from '@/lib/queries/shopify/queries'

import { Link } from '@tanstack/react-router'

import { Money } from '@/components/shop/money'
import { ShopImage } from '@/components/shop/shop-image'
import { useRemoveCartLine, useUpdateCartLine } from '@/hooks/use-cart'

type CartLineItemProps = {
  line: CartLineDetail
}

export function CartLineItem({ line }: CartLineItemProps) {
  const update = useUpdateCartLine()
  const remove = useRemoveCartLine()
  const merch = line.merchandise

  return (
    <li className="flex gap-4 border-b border-[--storefront-line] py-6">
      <Link
        to="/product/$handle"
        params={{ handle: merch.product.handle }}
        className="shrink-0"
      >
        <ShopImage
          src={merch.image?.url}
          alt={merch.image?.altText ?? merch.product.title}
          width={120}
          height={150}
          className="h-37.5 w-30 rounded-md object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              to="/product/$handle"
              params={{ handle: merch.product.handle }}
              className="text-base font-medium text-[--storefront-fg] no-underline"
            >
              {merch.product.title}
            </Link>
            {merch.title && merch.title !== 'Default Title' && (
              <p className="text-sm text-[--storefront-fg-muted]">
                {merch.selectedOptions.map((o) => o.value).join(' · ')}
              </p>
            )}
          </div>
          <Money
            amount={line.cost.totalAmount.amount}
            currencyCode={line.cost.totalAmount.currencyCode}
            className="text-base font-medium"
          />
        </div>
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="inline-flex items-center rounded-full border border-[--storefront-line]">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={update.isPending || line.quantity <= 1}
              onClick={() =>
                update.mutate({ lineId: line.id, quantity: line.quantity - 1 })
              }
              className="px-3 py-1.5 text-base disabled:opacity-40"
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm">{line.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={update.isPending}
              onClick={() =>
                update.mutate({ lineId: line.id, quantity: line.quantity + 1 })
              }
              className="px-3 py-1.5 text-base disabled:opacity-40"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove.mutate({ lineId: line.id })}
            disabled={remove.isPending}
            className="text-sm text-[--storefront-fg-muted] underline underline-offset-4 hover:text-[--storefront-fg] disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
