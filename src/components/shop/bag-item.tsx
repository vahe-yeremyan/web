import type { CartLineDetail } from '@/lib/queries/shopify/queries'

import { Link } from '@tanstack/react-router'

import { X } from 'lucide-react'

import { Money } from '@/components/shop/money'
import { ShopImage } from '@/components/shop/shop-image'
import { useRemoveCartLine } from '@/hooks/use-cart'

type BagItemProps = {
  line: CartLineDetail
}

export function BagItem({ line }: BagItemProps) {
  const remove = useRemoveCartLine()
  const merch = line.merchandise
  const hasVariant = merch.title && merch.title !== 'Default Title'

  return (
    <div className="flex gap-4 rounded-lg border border-neutral-200 p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
        <ShopImage
          src={merch.image?.url}
          alt={merch.image?.altText ?? merch.product.title}
          width={80}
          height={80}
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="hover:text-primary-accent line-clamp-2 leading-tight font-semibold transition-colors duration-200">
            <Link
              to="/product/$handle"
              params={{ handle: merch.product.handle }}
            >
              {merch.product.title}
            </Link>
          </h3>

          <button
            onClick={() => remove.mutate({ lineId: line.id })}
            disabled={remove.isPending}
            className="cursor-pointer self-start p-0 text-neutral-400 transition-colors duration-150 hover:text-neutral-600 disabled:opacity-40"
            aria-label={`Remove ${merch.product.title} from bag`}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {hasVariant && (
          <p className="text-sm text-neutral-600">
            {merch.selectedOptions.map((o) => o.value).join(' · ')}
          </p>
        )}

        <Money
          className="font-manrope mt-0.5 font-medium tracking-tight"
          amount={line.cost.totalAmount.amount}
          currencyCode={line.cost.totalAmount.currencyCode}
        />
        {!merch.availableForSale && (
          <p className="mt-0.5 text-sm font-medium text-red-800">
            No longer available
          </p>
        )}
      </div>
    </div>
  )
}
