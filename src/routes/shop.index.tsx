import type {
  PriceFilterOption,
  ShopFilterKey,
  ShopSearchParams,
  ShopSortOption,
} from '@/lib/shop-filters'

import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { ArtworkFiltersSidebar } from '@/components/shop/artwork-filters-sidebar'
import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'
import { ProductListingLayout } from '@/components/shop/product-listing-layout'
import { ProductLoadMore } from '@/components/shop/product-load-more'
import {
  PRODUCT_PAGE_GC_TIME,
  PRODUCT_PAGE_SIZE,
  PRODUCT_PAGE_STALE_TIME,
} from '@/lib/product-page-constants'
import {
  hasActiveShopFilters,
  normalizeShopSearchParams,
} from '@/lib/shop-filters'
import {
  getShopProductFilterOptions,
  getShopProducts,
} from '@/server/shopify/catalog.functions'

export const Route = createFileRoute('/shop/')({
  validateSearch: (search): Partial<ShopSearchParams> =>
    normalizeShopSearchParams(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const search = normalizeShopSearchParams(deps)
    const [filterOptions, page] = await Promise.all([
      getShopProductFilterOptions(),
      getShopProducts({
        data: {
          pageSize: PRODUCT_PAGE_SIZE,
          sort: search.sort,
          category: search.category,
          medium: search.medium,
          orientation: search.orientation,
          price: search.price,
        },
      }),
    ])

    return {
      filterOptions,
      pageInfo: page.pageInfo,
      products: page.products,
    }
  },
  pendingComponent: ShopIndexPending,
  component: ShopIndex,
})

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

function isTitleSort(sort: ShopSortOption) {
  return sort === 'title-asc' || sort === 'title-desc'
}

function searchKey(search: ShopSearchParams) {
  return JSON.stringify(search)
}

function shopProductsNextPageQueryOptions(
  search: ShopSearchParams,
  cursor: string,
) {
  return {
    queryKey: ['shop-products-next-page', searchKey(search), cursor] as const,
    queryFn: () =>
      getShopProducts({
        data: {
          pageSize: PRODUCT_PAGE_SIZE,
          cursor,
          direction: 'next',
          sort: search.sort,
          category: search.category,
          medium: search.medium,
          orientation: search.orientation,
          price: search.price,
        },
      }),
    staleTime: PRODUCT_PAGE_STALE_TIME,
    gcTime: PRODUCT_PAGE_GC_TIME,
  }
}

function ShopIndex() {
  const { filterOptions, pageInfo, products } = Route.useLoaderData()
  const routeSearch = normalizeShopSearchParams(Route.useSearch())
  const routeSearchKey = searchKey(routeSearch)
  const [search, setSearch] = useState(routeSearch)
  const [displayedProducts, setDisplayedProducts] = useState(products)
  const [currentPageInfo, setCurrentPageInfo] = useState(pageInfo)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasBrowseIntent, setHasBrowseIntent] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: Route.fullPath })

  useEffect(() => {
    setSearch(JSON.parse(routeSearchKey) as ShopSearchParams)
  }, [routeSearchKey])

  useEffect(() => {
    setDisplayedProducts(products)
    setCurrentPageInfo(pageInfo)
    setIsLoadingMore(false)
  }, [pageInfo, products])

  useEffect(() => {
    const cursor = currentPageInfo.endCursor
    if (!hasBrowseIntent) return
    if (!currentPageInfo.hasNextPage || !cursor) return

    const prefetchSearch = JSON.parse(routeSearchKey) as ShopSearchParams
    void queryClient.prefetchQuery(
      shopProductsNextPageQueryOptions(prefetchSearch, cursor),
    )
  }, [
    currentPageInfo.endCursor,
    currentPageInfo.hasNextPage,
    hasBrowseIntent,
    queryClient,
    routeSearchKey,
  ])

  const updateSearch = (next: ShopSearchParams, replace = true) => {
    const searchWithoutPagination = {
      ...next,
      cursor: undefined,
      direction: undefined,
    }
    const resolvedSearch =
      hasActiveShopFilters(searchWithoutPagination) &&
      isTitleSort(searchWithoutPagination.sort)
        ? { ...searchWithoutPagination, sort: 'default' as const }
        : searchWithoutPagination

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

  const handleLoadMore = async () => {
    if (
      isLoadingMore ||
      !currentPageInfo.hasNextPage ||
      !currentPageInfo.endCursor
    ) {
      return
    }

    setIsLoadingMore(true)
    setHasBrowseIntent(true)
    try {
      const nextPage = await queryClient.fetchQuery(
        shopProductsNextPageQueryOptions(
          routeSearch,
          currentPageInfo.endCursor,
        ),
      )

      setDisplayedProducts((current) => [...current, ...nextPage.products])
      setCurrentPageInfo(nextPage.pageInfo)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <ProductListingLayout
      title="Artworks"
      onMainScrollIntent={() => {
        setHasBrowseIntent(true)
      }}
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
      <ProductGrid products={displayedProducts} showPrice />
      <ProductLoadMore
        pageInfo={currentPageInfo}
        isLoading={isLoadingMore}
        onLoadMore={handleLoadMore}
      />
    </ProductListingLayout>
  )
}

function ShopIndexPending() {
  return (
    <ProductListingLayout
      title="Artworks"
      sidebar={<div className="hidden lg:block" />}
    >
      <ProductGridSkeleton count={PRODUCT_PAGE_SIZE} showPrice />
    </ProductListingLayout>
  )
}
