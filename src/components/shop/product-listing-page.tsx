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
  const [search, setSearch] = useState(routeSearch)
  const [displayedProducts, setDisplayedProducts] = useState(products)
  const [currentPageInfo, setCurrentPageInfo] = useState(pageInfo)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasBrowseIntent, setHasBrowseIntent] = useState(false)
  const queryClient = useQueryClient()

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
      const nextPage = await queryClient.fetchQuery(
        productListNextPageQueryOptions(
          productSearch,
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
