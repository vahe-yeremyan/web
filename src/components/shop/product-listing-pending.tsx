import { PRODUCT_PAGE_SIZE } from '@/lib/product-page-constants'

import { ProductGridSkeleton } from './product-grid'
import { ProductListingLayout } from './product-listing-layout'

type ProductListingPendingProps = {
  title: string
}

export function ProductListingPending({ title }: ProductListingPendingProps) {
  return (
    <ProductListingLayout
      title={title}
      sidebar={<div className="hidden lg:block" />}
    >
      <ProductGridSkeleton count={PRODUCT_PAGE_SIZE} showPrice />
    </ProductListingLayout>
  )
}
