import type { ProductListQueryResult } from '@/lib/queries/shopify/product-list'
import type {
  PriceFilterOption,
  ShopFilterKey,
  ShopFilterOptions,
  ShopSearchParams,
  ShopSortOption,
} from '@/lib/shop-filters'

import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { productListNextPageQueryOptions } from '@/lib/queries/shopify/product-list'
import {
  getStableShopSearchKey,
  hasActiveShopFilters,
  isTitleShopSort,
  resetShopSearchPagination,
  toggleShopFilterValue,
} from '@/lib/shop-filters'

import { ArtworkFiltersSidebar } from './artwork-filters-sidebar'
import { ProductGrid } from './product-grid'
import { ProductListingLayout } from './product-listing-layout'
import { ProductLoadMore } from './product-load-more'

type ProductListingPageProps = {
  title: string
  titleActions?: React.ReactNode
  routeSearch: ShopSearchParams
  productSearch: ShopSearchParams
  filterOptions: ShopFilterOptions
  page: ProductListQueryResult
  lockedCategory?: string
  onSearchChange: (
    search: ShopSearchParams,
    options?: { resetScroll?: boolean },
  ) => void
  onLockedCategoryToggle?: (category: string, search: ShopSearchParams) => void
}

type ProductListingState = {
  currentPageInfo: ProductListQueryResult['pageInfo']
  displayedProducts: ProductListQueryResult['products']
  loadedPageCursors: string[]
}

const loadedPageCursorsBySearchKey = new Map<string, string[]>()

export function ProductListingPage({
  title,
  titleActions,
  routeSearch,
  productSearch,
  filterOptions,
  page,
  lockedCategory,
  onSearchChange,
  onLockedCategoryToggle,
}: ProductListingPageProps) {
  const routeSearchKey = getStableShopSearchKey(routeSearch)
  const productSearchKey = getStableShopSearchKey(productSearch)
  const queryClient = useQueryClient()
  const restoredListingState = getRestoredListingState({
    page,
    productSearchKey,
    queryClient,
  })
  const [search, setSearch] = useState(routeSearch)
  const [displayedProducts, setDisplayedProducts] = useState(
    restoredListingState.displayedProducts,
  )
  const [currentPageInfo, setCurrentPageInfo] = useState(
    restoredListingState.currentPageInfo,
  )
  const [loadedPageCursors, setLoadedPageCursors] = useState(
    restoredListingState.loadedPageCursors,
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasBrowseIntent, setHasBrowseIntent] = useState(
    restoredListingState.loadedPageCursors.length > 0,
  )

  useEffect(() => {
    setSearch(JSON.parse(routeSearchKey) as ShopSearchParams)
  }, [routeSearchKey])

  useEffect(() => {
    const restoredState = getRestoredListingState({
      page,
      productSearchKey,
      queryClient,
    })

    setDisplayedProducts(restoredState.displayedProducts)
    setCurrentPageInfo(restoredState.currentPageInfo)
    setLoadedPageCursors(restoredState.loadedPageCursors)
    loadedPageCursorsBySearchKey.set(
      productSearchKey,
      restoredState.loadedPageCursors,
    )
    setHasBrowseIntent(restoredState.loadedPageCursors.length > 0)
    setIsLoadingMore(false)
  }, [page, productSearchKey, queryClient])

  useEffect(() => {
    const cursor = currentPageInfo.endCursor
    if (!hasBrowseIntent) return
    if (!currentPageInfo.hasNextPage || !cursor) return

    const prefetchSearch = JSON.parse(productSearchKey) as ShopSearchParams
    void queryClient.prefetchQuery(
      productListNextPageQueryOptions(prefetchSearch, cursor),
    )
  }, [
    currentPageInfo.endCursor,
    currentPageInfo.hasNextPage,
    hasBrowseIntent,
    productSearchKey,
    queryClient,
  ])

  const updateSearch = (
    next: ShopSearchParams,
    options?: { resetScroll?: boolean },
  ) => {
    const searchWithoutPagination = resetShopSearchPagination(next)
    const filterSearch = lockedCategory
      ? { ...searchWithoutPagination, category: [lockedCategory] }
      : searchWithoutPagination
    const resolvedSearch =
      hasActiveShopFilters(filterSearch) &&
      isTitleShopSort(searchWithoutPagination.sort)
        ? { ...searchWithoutPagination, sort: 'default' as const }
        : searchWithoutPagination

    setSearch(resolvedSearch)
    onSearchChange(resolvedSearch, options)
  }

  const handleSortChange = (sort: ShopSortOption) => {
    updateSearch({ ...search, sort })
  }

  const handleFilterToggle = (key: ShopFilterKey, value: string) => {
    if (key === 'category' && onLockedCategoryToggle) {
      const nextSearch = resetShopSearchPagination({
        ...search,
        category: [],
        sort: isTitleShopSort(search.sort) ? 'default' : search.sort,
      })
      setSearch(nextSearch)
      onLockedCategoryToggle(value, nextSearch)
      return
    }

    if (key === 'category') {
      updateSearch(
        {
          ...search,
          category: search.category.includes(value) ? [] : [value],
        },
        { resetScroll: true },
      )
      return
    }

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
      const nextPageCursor = currentPageInfo.endCursor
      const nextPage = await queryClient.fetchQuery(
        productListNextPageQueryOptions(productSearch, nextPageCursor),
      )
      const nextLoadedPageCursors = [...loadedPageCursors, nextPageCursor]

      setDisplayedProducts((current) => [...current, ...nextPage.products])
      setCurrentPageInfo(nextPage.pageInfo)
      setLoadedPageCursors(nextLoadedPageCursors)
      loadedPageCursorsBySearchKey.set(productSearchKey, nextLoadedPageCursors)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <ProductListingLayout
      title={title}
      titleActions={titleActions}
      onMainScrollIntent={() => {
        setHasBrowseIntent(true)
      }}
      sidebar={
        <ArtworkFiltersSidebar
          search={search}
          filterOptions={filterOptions}
          lockedCategory={lockedCategory}
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

function getRestoredListingState({
  page,
  productSearchKey,
  queryClient,
}: {
  page: ProductListQueryResult
  productSearchKey: string
  queryClient: ReturnType<typeof useQueryClient>
}): ProductListingState {
  const productSearch = JSON.parse(productSearchKey) as ShopSearchParams
  const storedCursors = loadedPageCursorsBySearchKey.get(productSearchKey) ?? []
  const displayedProducts = [...page.products]
  const loadedPageCursors: string[] = []
  const restoredState: ProductListingState = {
    currentPageInfo: page.pageInfo,
    displayedProducts,
    loadedPageCursors,
  }

  for (const cursor of storedCursors) {
    const nextPage = queryClient.getQueryData<ProductListQueryResult>(
      productListNextPageQueryOptions(productSearch, cursor).queryKey,
    )
    if (!nextPage) break

    displayedProducts.push(...nextPage.products)
    restoredState.currentPageInfo = nextPage.pageInfo
    loadedPageCursors.push(cursor)
  }

  return restoredState
}
