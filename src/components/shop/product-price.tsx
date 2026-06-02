import type { ProductDetailVariant } from '@/lib/queries/shopify/queries'

import { formatMoney } from '@/lib/queries/shopify/format'

type ProductPriceProps = {
  price: ProductDetailVariant['price']
  sold: boolean
}

export function ProductPrice({ price, sold }: ProductPriceProps) {
  return (
    <p className="font-manrope my-4 inline-flex items-center gap-1.5 text-xl tracking-tight text-neutral-800">
      {formatMoney(price.amount, price.currencyCode)}
      {sold && (
        <>
          <span aria-hidden="true">•</span>
          <span className="tracking-normal text-rose-600">Sold</span>
        </>
      )}
    </p>
  )
}
