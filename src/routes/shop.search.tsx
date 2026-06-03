import { useEffect, useState } from 'react'

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'
import { PRODUCT_PAGE_SIZE } from '@/lib/product-page-constants'
import { searchProducts } from '@/server/shopify/catalog.functions'

type SearchRouteSearch = {
  q: string
}

function validateSearch(search: Record<string, unknown>): SearchRouteSearch {
  return {
    q: typeof search.q === 'string' ? search.q : '',
  }
}

function searchProductsQueryOptions(query: string) {
  const trimmedQuery = query.trim()

  return queryOptions({
    queryKey: ['shopify', 'search', 'products', trimmedQuery] as const,
    queryFn: async () => {
      if (!trimmedQuery) {
        return {
          products: [],
          totalCount: 0,
        }
      }

      return searchProducts({
        data: { query: trimmedQuery, first: PRODUCT_PAGE_SIZE },
      })
    },
  })
}

export const Route = createFileRoute('/shop/search')({
  validateSearch,
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ context, deps }) => {
    const q = deps.q.trim()
    await context.queryClient.ensureQueryData(searchProductsQueryOptions(q))
    return { q }
  },
  pendingComponent: SearchPending,
  component: SearchRoute,
})

function SearchRoute() {
  const { q } = Route.useLoaderData()
  const { data } = useSuspenseQuery(searchProductsQueryOptions(q))
  const navigate = useNavigate({ from: Route.fullPath })
  const [draft, setDraft] = useState(q)

  useEffect(() => {
    setDraft(q)
  }, [q])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-medium tracking-tight">Search</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          navigate({ search: { q: draft } })
        }}
        className="flex gap-2"
      >
        <input
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search products"
          autoFocus
          className="flex-1 rounded-full border border-[--storefront-line] bg-transparent px-5 py-3 text-base focus:border-[--storefront-accent] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-[--storefront-accent] px-6 py-3 text-sm font-medium text-[--storefront-accent-fg]"
        >
          Search
        </button>
      </form>

      {q && (
        <p className="text-sm text-[--storefront-fg-muted]">
          {data.totalCount} result{data.totalCount === 1 ? '' : 's'} for{' '}
          <span className="font-medium text-[--storefront-fg]">"{q}"</span>
        </p>
      )}

      {q && <ProductGrid products={data.products} />}
    </div>
  )
}

function SearchPending() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-medium tracking-tight">Search</h1>
      <ProductGridSkeleton count={PRODUCT_PAGE_SIZE} />
    </div>
  )
}
