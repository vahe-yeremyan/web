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

import { PRODUCT_PAGE_SIZE } from '@/lib/product-page-constants'
import { productListNextPageQueryOptions } from '@/lib/queries/shopify/product-list'
import {
  getStableShopSearchKey,
  hasActiveShopFilters,
  isTitleShopSort,
  resetShopSearchPagination,
  toggleShopFilterValue,
} from '@/lib/shop-filters'

import { ArtworkFiltersSidebar } from './artwork-filters-sidebar'
import { ProductGrid, ProductGridSkeleton } from './product-grid'
import { ProductListingLayout } from './product-listing-layout'
import { ProductLoadMore } from './product-load-more'

type ProductListingPageProps = {
  title: string
  routeSearch: ShopSearchParams
  productSearch: ShopSearchParams
  filterOptions: ShopFilterOptions
  page: ProductListQueryResult
  lockedCategory?: string
  onSearchChange: (search: ShopSearchParams) => void
  onLockedCategoryToggle?: (category: string, search: ShopSearchParams) => void
}

type ProductListingPendingProps = {
  title: string
}

type ProductListingState = {
  currentPageInfo: ProductListQueryResult['pageInfo']
  displayedProducts: ProductListQueryResult['products']
  loadedPageCursors: string[]
}

const loadedPageCursorsBySearchKey = new Map<string, string[]>()

export function ProductListingPage({
  title,
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
  const { pageInfo, products } = page
  const queryClient = useQueryClient()
  const restoredListingState = getRestoredListingState({
    page,
    productSearch,
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
      productSearch,
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
  }, [page, pageInfo, productSearch, productSearchKey, products, queryClient])

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

  const updateSearch = (next: ShopSearchParams) => {
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
    onSearchChange(resolvedSearch)
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
  productSearch,
  productSearchKey,
  queryClient,
}: {
  page: ProductListQueryResult
  productSearch: ShopSearchParams
  productSearchKey: string
  queryClient: ReturnType<typeof useQueryClient>
}): ProductListingState {
  const storedCursors = loadedPageCursorsBySearchKey.get(productSearchKey) ?? []
  const restoredState: ProductListingState = {
    currentPageInfo: page.pageInfo,
    displayedProducts: page.products,
    loadedPageCursors: [],
  }

  for (const cursor of storedCursors) {
    const nextPage = queryClient.getQueryData<ProductListQueryResult>(
      productListNextPageQueryOptions(productSearch, cursor).queryKey,
    )
    if (!nextPage) break

    restoredState.displayedProducts = [
      ...restoredState.displayedProducts,
      ...nextPage.products,
    ]
    restoredState.currentPageInfo = nextPage.pageInfo
    restoredState.loadedPageCursors = [
      ...restoredState.loadedPageCursors,
      cursor,
    ]
  }

  return restoredState
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
