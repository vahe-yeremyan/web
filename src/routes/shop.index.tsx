import type {
  PriceFilterOption,
  ShopFilterKey,
  ShopSearchParams,
  ShopSortOption,
} from '@/lib/shop-filters'

import { useEffect, useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { ArtworkFiltersSidebar } from '@/components/shop/artwork-filters-sidebar'
import { ProductGrid } from '@/components/shop/product-grid'
import { ProductLoadMore } from '@/components/shop/product-load-more'
import {
  hasActiveShopFilters,
  normalizeShopSearchParams,
} from '@/lib/shop-filters'
import {
  getShopProductFilterOptions,
  getShopProducts,
} from '@/server/shopify/catalog.functions'

const PAGE_SIZE = 24

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
          pageSize: PAGE_SIZE,
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

function ShopIndex() {
  const { filterOptions, pageInfo, products } = Route.useLoaderData()
  const routeSearch = normalizeShopSearchParams(Route.useSearch())
  const routeSearchKey = searchKey(routeSearch)
  const [search, setSearch] = useState(routeSearch)
  const [displayedProducts, setDisplayedProducts] = useState(products)
  const [currentPageInfo, setCurrentPageInfo] = useState(pageInfo)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const navigate = useNavigate({ from: Route.fullPath })

  useEffect(() => {
    setSearch(JSON.parse(routeSearchKey) as ShopSearchParams)
  }, [routeSearchKey])

  useEffect(() => {
    setDisplayedProducts(products)
    setCurrentPageInfo(pageInfo)
    setIsLoadingMore(false)
  }, [pageInfo, products])

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
    try {
      const nextPage = await getShopProducts({
        data: {
          pageSize: PAGE_SIZE,
          cursor: currentPageInfo.endCursor,
          direction: 'next',
          sort: search.sort,
          category: search.category,
          medium: search.medium,
          orientation: search.orientation,
          price: search.price,
        },
      })

      setDisplayedProducts((current) => [...current, ...nextPage.products])
      setCurrentPageInfo(nextPage.pageInfo)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
      <ArtworkFiltersSidebar
        search={search}
        filterOptions={filterOptions}
        onSortChange={handleSortChange}
        onFilterToggle={handleFilterToggle}
        onPriceChange={handlePriceChange}
        onClearFilters={handleClearFilters}
      />

      <div className="min-w-0">
        <ProductGrid products={displayedProducts} showPrice />
        <ProductLoadMore
          pageInfo={currentPageInfo}
          isLoading={isLoadingMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  )
}
