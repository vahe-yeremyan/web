import type { ProductListItem } from '@/lib/queries/shopify/queries'

import { ArtworkGridSection } from '@/components/home/artwork-grid-section'
import { Skeleton } from '@/components/ui/skeleton'
import { shopifyProductListItemsToArtworkGridItems } from '@/lib/queries/shopify/artwork-grid'

type ProductGridProps = {
  products: ReadonlyArray<ProductListItem>
  showPrice?: boolean
  priorityCount?: number
}

export function ProductGrid({
  products,
  showPrice = false,
  priorityCount = 0,
}: ProductGridProps) {
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
      priorityCount={priorityCount}
    />
  )
}

type ProductGridSkeletonProps = {
  count?: number
  showPrice?: boolean
}

export function ProductGridSkeleton({
  count = 12,
  showPrice = false,
}: ProductGridSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index)

  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading products</span>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
        {items.map((item) => (
          <article key={item} className="min-w-0">
            <div className="aspect-square overflow-hidden rounded-md border border-neutral-200/60 bg-neutral-50/75 p-4 sm:p-5">
              <Skeleton
                aria-hidden
                className="h-full w-full rounded-[2px] bg-neutral-200/70"
              />
            </div>

            <div className="mt-4 space-y-1.5">
              <Skeleton className="h-5 w-3/4 rounded bg-neutral-200/80" />
              <Skeleton className="h-3 w-1/2 rounded bg-neutral-200/80" />
              <Skeleton className="h-3 w-2/3 rounded bg-neutral-200/80" />
              {showPrice && (
                <Skeleton className="h-4 w-1/3 rounded bg-neutral-200/80" />
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
