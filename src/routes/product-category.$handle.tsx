import type {
  PriceFilterOption,
  ShopFilterKey,
  ShopSearchParams,
  ShopSortOption,
} from '@/lib/shop-filters'

import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'

import { ArtworkFiltersSidebar } from '@/components/shop/artwork-filters-sidebar'
import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'
import { ProductListingLayout } from '@/components/shop/product-listing-layout'
import { ProductLoadMore } from '@/components/shop/product-load-more'
import {
  ARTWORK_CATEGORIES,
  isArtworkCategoryHandle,
} from '@/lib/artwork-categories'
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
  getCollectionMetadata,
  getShopProductFilterOptions,
  getShopProducts,
} from '@/server/shopify/catalog.functions'

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

function getCategoryProductsSearch(
  category: string,
  search: ShopSearchParams,
): ShopSearchParams {
  return {
    ...search,
    category: [category],
    cursor: undefined,
    direction: undefined,
  }
}

function categoryProductsNextPageQueryOptions(
  search: ShopSearchParams,
  cursor: string,
) {
  return {
    queryKey: [
      'category-products-next-page',
      searchKey(search),
      cursor,
    ] as const,
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

export const Route = createFileRoute('/product-category/$handle')({
  validateSearch: (search): Partial<ShopSearchParams> =>
    normalizeShopSearchParams(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    if (!isArtworkCategoryHandle(params.handle)) throw notFound()

    const category = ARTWORK_CATEGORIES.find(
      (item) => item.handle === params.handle,
    )
    if (!category) throw notFound()

    const search = normalizeShopSearchParams(deps)
    const categorySearch = getCategoryProductsSearch(category.label, search)
    const [filterOptions, collection, page] = await Promise.all([
      getShopProductFilterOptions(),
      getCollectionMetadata({ data: { handle: params.handle } }),
      getShopProducts({
        data: {
          pageSize: PRODUCT_PAGE_SIZE,
          sort: categorySearch.sort,
          category: categorySearch.category,
          medium: categorySearch.medium,
          orientation: categorySearch.orientation,
          price: categorySearch.price,
        },
      }),
    ])

    if (!collection) throw notFound()

    return {
      title: category.label,
      description: collection.description,
      seo: collection.seo,
      filterOptions,
      pageInfo: page.pageInfo,
      products: page.products,
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: loaderData.seo.title ?? loaderData.title,
          },
          {
            name: 'description',
            content: loaderData.seo.description || loaderData.description,
          },
        ]
      : [],
  }),
  pendingComponent: ProductCategoryPending,
  component: ProductCategoryRoute,
})

function ProductCategoryRoute() {
  const { filterOptions, title, pageInfo, products } = Route.useLoaderData()
  const routeSearch = normalizeShopSearchParams(Route.useSearch())
  const routeSearchKey = searchKey(routeSearch)
  const categorySearch = getCategoryProductsSearch(title, routeSearch)
  const categorySearchKey = searchKey(categorySearch)
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

    const prefetchSearch = JSON.parse(categorySearchKey) as ShopSearchParams
    void queryClient.prefetchQuery(
      categoryProductsNextPageQueryOptions(prefetchSearch, cursor),
    )
  }, [
    categorySearchKey,
    currentPageInfo.endCursor,
    currentPageInfo.hasNextPage,
    hasBrowseIntent,
    queryClient,
  ])

  const updateSearch = (next: ShopSearchParams, replace = true) => {
    const searchWithoutCategory: ShopSearchParams = {
      ...next,
      category: [],
      cursor: undefined,
      direction: undefined,
    }
    const resolvedSearch =
      hasActiveShopFilters(
        getCategoryProductsSearch(title, searchWithoutCategory),
      ) && isTitleSort(searchWithoutCategory.sort)
        ? { ...searchWithoutCategory, sort: 'default' as const }
        : searchWithoutCategory

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
    if (key === 'category') {
      const nextCategory = ARTWORK_CATEGORIES.find(
        (item) => item.label === value,
      )
      if (!nextCategory) return

      const nextSearch: ShopSearchParams = {
        ...search,
        category: [],
        cursor: undefined,
        direction: undefined,
        sort: isTitleSort(search.sort) ? ('default' as const) : search.sort,
      }

      if (value === title) {
        void navigate({
          to: '/shop',
          resetScroll: false,
          search: nextSearch,
        })
        return
      }

      setSearch(nextSearch)
      void navigate({
        to: '/product-category/$handle',
        params: { handle: nextCategory.handle },
        resetScroll: false,
        search: nextSearch,
      })
      return
    }

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
        categoryProductsNextPageQueryOptions(
          categorySearch,
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
          lockedCategory={title}
          onSortChange={handleSortChange}
          onFilterToggle={handleFilterToggle}
          onPriceChange={handlePriceChange}
          onClearFilters={handleClearFilters}
        />
      }
    >
      <ProductGrid products={displayedProducts} showPrice priorityCount={4} />
      <ProductLoadMore
        pageInfo={currentPageInfo}
        isLoading={isLoadingMore}
        onLoadMore={handleLoadMore}
      />
    </ProductListingLayout>
  )
}

function ProductCategoryPending() {
  const { handle } = Route.useParams()
  const title =
    ARTWORK_CATEGORIES.find((item) => item.handle === handle)?.label ??
    'Artworks'

  return (
    <ProductListingLayout
      title={title}
      sidebar={<div className="hidden lg:block" />}
    >
      <ProductGridSkeleton count={PRODUCT_PAGE_SIZE} showPrice />
    </ProductListingLayout>
  )
}
