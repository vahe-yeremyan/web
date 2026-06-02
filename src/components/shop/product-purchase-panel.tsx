import type {
  ProductDetail,
  ProductDetailVariant,
} from '@/lib/queries/shopify/queries'

import { ShopPayIcon } from '@/components/icons/payment-icons'

import { AddToCartButton } from './add-to-cart-button'
import { ProductMetadata } from './product-metadata'
import { ProductPrice } from './product-price'

type ProductPurchasePanelProps = {
  product: ProductDetail
  variant: ProductDetailVariant | undefined
  sold: boolean
}

export function ProductPurchasePanel({
  product,
  variant,
  sold,
}: ProductPurchasePanelProps) {
  const price = variant?.price ?? product.priceRange.minVariantPrice

  return (
    <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
      <section className="space-y-2">
        <div className="space-y-1">
          <h1 className="text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
            {product.title}
          </h1>
          <h2 className="text-xl font-medium">by Vahe Yeremyan</h2>
        </div>

        <ProductPrice price={price} sold={sold} />
      </section>

      {product.descriptionHtml && (
        <div
          className="shop-prose font-medium text-neutral-700"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      )}

      <ProductMetadata product={product} />

      <section className="mt-8 space-y-5">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-10">
          <div className="w-fit">
            <AddToCartButton product={product} variant={variant} sold={sold} />
          </div>
          {!sold && (
            <p className="text-sm leading-tight font-medium text-neutral-600">
              Pay in installments
              <br />
              with <ShopPayIcon />
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
