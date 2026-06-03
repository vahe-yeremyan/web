import type { SoldProductListItem } from '@/lib/queries/shopify/queries'
import type {
  PriceFilterOption,
  ShopFilterKey,
  ShopFilterOptions,
  ShopSearchParams,
  ShopSortOption,
} from '@/lib/shop-filters'

import { useEffect, useMemo, useState } from 'react'

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { ArtworkFiltersSidebar } from '@/components/shop/artwork-filters-sidebar'
import { ProductGrid } from '@/components/shop/product-grid'
import { ProductListingLayout } from '@/components/shop/product-listing-layout'
import { ProductListingPending } from '@/components/shop/product-listing-page'
import { ProductLoadMore } from '@/components/shop/product-load-more'
import { SOLD_SEO } from '@/lib/legacy-seo'
import { PRODUCT_PAGE_SIZE } from '@/lib/product-page-constants'
import { createSeoHead } from '@/lib/seo'
import {
  getPriceFilterBounds,
  getStableShopSearchKey,
  normalizeShopSearchParams,
  resetShopSearchPagination,
  toggleShopFilterValue,
} from '@/lib/shop-filters'
import { getSoldProducts } from '@/server/shopify/catalog.functions'

function soldProductsQueryOptions() {
  return queryOptions({
    queryKey: ['shopify', 'products', 'sold'] as const,
    queryFn: () => getSoldProducts(),
  })
}

export const Route = createFileRoute('/sold')({
  validateSearch: (search): Partial<ShopSearchParams> =>
    normalizeShopSearchParams(search),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(soldProductsQueryOptions())
  },
  head: () => createSeoHead(SOLD_SEO),
  pendingComponent: SoldPending,
  component: SoldRoute,
})

function productPrice(product: SoldProductListItem) {
  return Number(product.priceRange.maxVariantPrice.amount)
}

function productLabel(
  product: SoldProductListItem,
  key: ShopFilterKey,
): string {
  if (key === 'category') return product.category?.value ?? ''
  if (key === 'medium') return product.medium?.value ?? ''
  return product.orientation?.value ?? ''
}

function sortLabels(values: Iterable<string>) {
  return Array.from(values)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
}

function soldFilterOptions(
  products: ReadonlyArray<SoldProductListItem>,
): ShopFilterOptions {
  return {
    categories: sortLabels(
      new Set(products.map((product) => productLabel(product, 'category'))),
    ),
    mediums: sortLabels(
      new Set(products.map((product) => productLabel(product, 'medium'))),
    ),
    orientations: sortLabels(
      new Set(products.map((product) => productLabel(product, 'orientation'))),
    ),
  }
}

function filterSoldProducts(
  products: ReadonlyArray<SoldProductListItem>,
  search: ShopSearchParams,
) {
  const price = getPriceFilterBounds(search.price)

  return products.filter((product) => {
    const matchesCategory =
      search.category.length === 0 ||
      search.category.includes(productLabel(product, 'category'))
    const matchesMedium =
      search.medium.length === 0 ||
      search.medium.includes(productLabel(product, 'medium'))
    const matchesOrientation =
      search.orientation.length === 0 ||
      search.orientation.includes(productLabel(product, 'orientation'))
    const matchesPrice =
      !price ||
      (productPrice(product) >= price.min &&
        (!('max' in price) || productPrice(product) <= price.max))

    return (
      matchesCategory && matchesMedium && matchesOrientation && matchesPrice
    )
  })
}

function sortSoldProducts(
  products: ReadonlyArray<SoldProductListItem>,
  sort: ShopSortOption,
) {
  return [...products].sort((a, b) => {
    if (sort === 'title-asc') return a.title.localeCompare(b.title)
    if (sort === 'title-desc') return b.title.localeCompare(a.title)
    if (sort === 'price-asc') return productPrice(a) - productPrice(b)

    return productPrice(b) - productPrice(a)
  })
}

function SoldRoute() {
  const { data: products } = useSuspenseQuery(soldProductsQueryOptions())
  const routeSearch = normalizeShopSearchParams(Route.useSearch())
  const routeSearchKey = getStableShopSearchKey(routeSearch)
  const [search, setSearch] = useState(routeSearch)
  const [visibleCount, setVisibleCount] = useState(PRODUCT_PAGE_SIZE)
  const navigate = useNavigate({ from: Route.fullPath })

  useEffect(() => {
    setSearch(JSON.parse(routeSearchKey) as ShopSearchParams)
    setVisibleCount(PRODUCT_PAGE_SIZE)
  }, [routeSearchKey])

  const filterOptions = useMemo(() => soldFilterOptions(products), [products])
  const filteredProducts = useMemo(
    () => filterSoldProducts(products, routeSearch),
    [products, routeSearch],
  )
  const sortedProducts = useMemo(
    () => sortSoldProducts(filteredProducts, routeSearch.sort),
    [filteredProducts, routeSearch.sort],
  )
  const visibleProducts = sortedProducts.slice(0, visibleCount)

  const updateSearch = (next: ShopSearchParams, replace = true) => {
    const resolvedSearch = resetShopSearchPagination(next)

    setSearch(resolvedSearch)
    void navigate({
      replace,
      resetScroll: false,
      search: resolvedSearch,
    })
  }

  const handleSortChange = (sort: ShopSortOption) => {
    updateSearch({ ...search, sort })
  }

  const handleFilterToggle = (key: ShopFilterKey, value: string) => {
    updateSearch({
      ...search,
      [key]: toggleShopFilterValue(search[key], value),
    })
  }

  const handlePriceChange = (price?: PriceFilterOption) => {
    updateSearch({ ...search, price })
  }

  const handleClearFilters = () => {
    updateSearch({
      ...search,
      category: [],
      medium: [],
      orientation: [],
      price: undefined,
    })
  }

  return (
    <ProductListingLayout
      title="Sold"
      sidebar={
        <ArtworkFiltersSidebar
          search={search}
          filterOptions={filterOptions}
          onSortChange={handleSortChange}
          onFilterToggle={handleFilterToggle}
          onPriceChange={handlePriceChange}
          onClearFilters={handleClearFilters}
        />
      }
    >
      <ProductGrid
        products={visibleProducts}
        showPrice
        showSoldStatus
        emptyMessage="No sold artworks match these filters."
      />
      <ProductLoadMore
        pageInfo={{
          hasNextPage: visibleCount < sortedProducts.length,
          hasPreviousPage: false,
        }}
        onLoadMore={() => {
          setVisibleCount((count) =>
            Math.min(count + PRODUCT_PAGE_SIZE, sortedProducts.length),
          )
        }}
      />
    </ProductListingLayout>
  )
}

function SoldPending() {
  return <ProductListingPending title="Sold" />
}
