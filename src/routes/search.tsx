import type { ShopSearchParams } from '@/lib/shop-filters'

import { useEffect, useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { ProductListingPage } from '@/components/shop/product-listing-page'
import { ProductListingPending } from '@/components/shop/product-listing-pending'
import { SearchForm } from '@/components/shop/search-form'
import {
  productFilterOptionsQueryOptions,
  productListQueryOptions,
} from '@/lib/queries/shopify/product-list'
import { getSearchDisplayQuery } from '@/lib/search'
import { normalizeShopSearchParams } from '@/lib/shop-filters'

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): ShopSearchParams =>
    normalizeShopSearchParams(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const search = normalizeShopSearchParams(deps)
    await Promise.all([
      context.queryClient.ensureQueryData(productFilterOptionsQueryOptions()),
      context.queryClient.ensureQueryData(productListQueryOptions(search)),
    ])
    return { q: search.q ?? '' }
  },
  head: ({ loaderData }) => {
    const display = getSearchDisplayQuery(loaderData?.q ?? '')
    return {
      meta: [{ title: display ? `Searching for "${display}"` : 'Search' }],
    }
  },
  pendingComponent: SearchPending,
  component: SearchRoute,
})

function SearchRoute() {
  const routeSearch = normalizeShopSearchParams(Route.useSearch())
  const { data: filterOptions } = useSuspenseQuery(
    productFilterOptionsQueryOptions(),
  )
  const { data: page } = useSuspenseQuery(productListQueryOptions(routeSearch))
  const navigate = useNavigate({ from: Route.fullPath })
  const [searchInput, setSearchInput] = useState(routeSearch.q ?? '')

  useEffect(() => {
    setSearchInput(routeSearch.q ?? '')
  }, [routeSearch.q])

  const handleSearchSubmit = () => {
    void navigate({
      search: normalizeShopSearchParams({
        ...routeSearch,
        q: searchInput,
        cursor: undefined,
        direction: undefined,
      }),
    })
  }

  return (
    <ProductListingPage
      title="Search Results"
      titleActions={
        <div className="ml-auto w-full max-w-3xl rounded-xl border border-neutral-300 bg-white p-1.5 px-2 text-black sm:w-auto sm:flex-1 lg:max-w-xl">
          <SearchForm
            inputId="search-page-input"
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearchSubmit}
          />
        </div>
      }
      routeSearch={routeSearch}
      productSearch={routeSearch}
      filterOptions={filterOptions}
      page={page}
      onSearchChange={(search) => {
        void navigate({
          replace: true,
          resetScroll: false,
          search,
        })
      }}
    />
  )
}

function SearchPending() {
  return <ProductListingPending title="Search Results" />
}
