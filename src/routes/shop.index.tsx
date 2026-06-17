import type { ShopSearchParams } from '@/lib/shop-filters'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { ProductListingPage } from '@/components/shop/product-listing-page'
import { ProductListingPending } from '@/components/shop/product-listing-pending'
import { SHOP_SEO } from '@/lib/legacy-seo'
import {
  productFilterOptionsQueryOptions,
  productListQueryOptions,
} from '@/lib/queries/shopify/product-list'
import { createSeoHead } from '@/lib/seo'
import { normalizeShopSearchParams } from '@/lib/shop-filters'

export const Route = createFileRoute('/shop/')({
  validateSearch: (search): Partial<ShopSearchParams> =>
    normalizeShopSearchParams(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const search = normalizeShopSearchParams(deps)
    await Promise.all([
      context.queryClient.ensureQueryData(productFilterOptionsQueryOptions()),
      context.queryClient.ensureQueryData(productListQueryOptions(search)),
    ])
  },
  head: () => createSeoHead(SHOP_SEO),
  pendingComponent: ShopIndexPending,
  component: ShopIndex,
})

function ShopIndex() {
  const routeSearch = normalizeShopSearchParams(Route.useSearch())
  const { data: filterOptions } = useSuspenseQuery(
    productFilterOptionsQueryOptions(),
  )
  const { data: page } = useSuspenseQuery(productListQueryOptions(routeSearch))
  const navigate = useNavigate({ from: Route.fullPath })

  return (
    <ProductListingPage
      title="Artworks"
      routeSearch={routeSearch}
      productSearch={routeSearch}
      filterOptions={filterOptions}
      page={page}
      onSearchChange={(search, options) => {
        void navigate({
          replace: true,
          resetScroll: options?.resetScroll ?? false,
          search,
        })
      }}
    />
  )
}

function ShopIndexPending() {
  return <ProductListingPending title="Artworks" />
}
