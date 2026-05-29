import type { ProductListItem } from '@/lib/queries/shopify/queries'

import { ArtworkGridSection } from '@/components/home/artwork-grid-section'
import { shopifyProductListItemsToArtworkGridItems } from '@/lib/queries/shopify/artwork-grid'

type ProductGridProps = {
  products: ReadonlyArray<ProductListItem>
  showPrice?: boolean
}

export function ProductGrid({ products, showPrice = false }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-[--storefront-fg-muted]">
        No products yet.
      </p>
    )
  }

  return (
    <ArtworkGridSection
      title="Products"
      artworks={shopifyProductListItemsToArtworkGridItems(products, {
        showPrice,
      })}
      hideTitle
    />
  )
}
