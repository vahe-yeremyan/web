import type { SoldProductListItem } from '@/lib/queries/shopify/queries'
import type {
  PriceFilterOption,
  ShopFilterKey,
  ShopFilterOptions,
  ShopSearchParams,
  ShopSortOption,
} from '@/lib/shop-filters'

import { useEffect, useMemo, useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { ArtworkFiltersSidebar } from '@/components/shop/artwork-filters-sidebar'
import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'
import { ProductListingLayout } from '@/components/shop/product-listing-layout'
import { ProductLoadMore } from '@/components/shop/product-load-more'
import { PRODUCT_PAGE_SIZE } from '@/lib/product-page-constants'
import {
  getPriceFilterBounds,
  normalizeShopSearchParams,
} from '@/lib/shop-filters'
import { getSoldProducts } from '@/server/shopify/catalog.functions'

export const Route = createFileRoute('/sold')({
  validateSearch: (search): Partial<ShopSearchParams> =>
    normalizeShopSearchParams(search),
  loader: async () => {
    const products = await getSoldProducts()
    return { products }
  },
  head: () => ({
    meta: [
      {
        title: 'Sold Artworks',
      },
      {
        name: 'description',
        content:
          'Browse selected sold artworks by Vahe Yeremyan, limited to the top 100 highest-priced sold works.',
      },
    ],
  }),
  pendingComponent: SoldPending,
  component: SoldRoute,
})

function searchKey(search: ShopSearchParams) {
  return JSON.stringify(search)
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

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
  const { products } = Route.useLoaderData()
  const routeSearch = normalizeShopSearchParams(Route.useSearch())
  const routeSearchKey = searchKey(routeSearch)
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
    const resolvedSearch = {
      ...next,
      cursor: undefined,
      direction: undefined,
    }

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
      [key]: toggleValue(search[key], value),
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
  return (
    <ProductListingLayout
      title="Sold"
      sidebar={<div className="hidden lg:block" />}
    >
      <ProductGridSkeleton count={PRODUCT_PAGE_SIZE} showPrice />
    </ProductListingLayout>
  )
}
