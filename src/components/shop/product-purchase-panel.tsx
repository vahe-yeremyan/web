import type {
  ProductDetail,
  ProductDetailVariant,
} from '@/lib/queries/shopify/queries'

import { ShopPayIcon } from '@/components/icons/shop-pay-icon'

import { AddToCartButton } from './add-to-cart-button'
import { ProductMetadata } from './product-metadata'
import { ProductPrice } from './product-price'

type ProductPurchasePanelProps = {
  product: ProductDetail
  variant: ProductDetailVariant | undefined
  sold: boolean
}

/** Removes blank lines from a description: collapses runs of <br>, strips
 * leading/trailing breaks inside paragraphs, and drops empty paragraphs. */
function trimEmptyLines(html: string): string {
  return html
    .replace(/(?:<br\s*\/?>\s*){2,}/gi, '<br>')
    .replace(/(<p[^>]*>)(?:\s|<br\s*\/?>|&nbsp;)+/gi, '$1')
    .replace(/(?:\s|<br\s*\/?>|&nbsp;)+(<\/p>)/gi, '$1')
    .replace(/<p[^>]*>(?:\s|&nbsp;)*<\/p>/gi, '')
    .trim()
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
          dangerouslySetInnerHTML={{
            __html: trimEmptyLines(product.descriptionHtml),
          }}
        />
      )}

      <ProductMetadata product={product} />

      <section className="mt-8 space-y-5">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-10">
          <div className="w-full lg:w-fit">
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
