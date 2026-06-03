import type { ShopSearchParams } from '@/lib/shop-filters'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'

import { ProductListingPage } from '@/components/shop/product-listing-page'
import { ProductListingPending } from '@/components/shop/product-listing-pending'
import {
  ARTWORK_CATEGORIES,
  isArtworkCategoryHandle,
} from '@/lib/artwork-categories'
import { CATEGORY_SEO } from '@/lib/legacy-seo'
import {
  collectionMetadataQueryOptions,
  getCategoryProductSearch,
  productFilterOptionsQueryOptions,
  productListQueryOptions,
} from '@/lib/queries/shopify/product-list'
import { createSeoHead } from '@/lib/seo'
import { normalizeShopSearchParams } from '@/lib/shop-filters'

export const Route = createFileRoute('/product-category/$handle')({
  validateSearch: (search): Partial<ShopSearchParams> =>
    normalizeShopSearchParams(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params, deps }) => {
    if (!isArtworkCategoryHandle(params.handle)) throw notFound()

    const category = ARTWORK_CATEGORIES.find(
      (item) => item.handle === params.handle,
    )
    if (!category) throw notFound()

    const search = normalizeShopSearchParams(deps)
    const categorySearch = getCategoryProductSearch(category.label, search)
    const [collection] = await Promise.all([
      context.queryClient.ensureQueryData(
        collectionMetadataQueryOptions(params.handle),
      ),
      context.queryClient.ensureQueryData(productFilterOptionsQueryOptions()),
      context.queryClient.ensureQueryData(
        productListQueryOptions(categorySearch),
      ),
    ])

    if (!collection) throw notFound()

    return {
      handle: params.handle,
      title: category.label,
      description: collection.description,
      seo: collection.seo,
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const legacySeo = CATEGORY_SEO[loaderData.handle]
    const description =
      legacySeo?.description ??
      loaderData.seo.description ??
      loaderData.description

    return createSeoHead({
      title: legacySeo?.title ?? loaderData.seo.title ?? loaderData.title,
      description,
      ogDescription: legacySeo?.ogDescription ?? description,
      path: `/product-category/${loaderData.handle}`,
    })
  },
  pendingComponent: ProductCategoryRoutePending,
  component: ProductCategoryRoute,
})

function ProductCategoryRoute() {
  const { title } = Route.useLoaderData()
  const routeSearch = normalizeShopSearchParams(Route.useSearch())
  const categorySearch = getCategoryProductSearch(title, routeSearch)
  const { data: filterOptions } = useSuspenseQuery(
    productFilterOptionsQueryOptions(),
  )
  const { data: page } = useSuspenseQuery(
    productListQueryOptions(categorySearch),
  )
  const navigate = useNavigate({ from: Route.fullPath })

  return (
    <ProductListingPage
      title={title}
      routeSearch={routeSearch}
      productSearch={categorySearch}
      filterOptions={filterOptions}
      page={page}
      lockedCategory={title}
      onSearchChange={(search) => {
        void navigate({
          replace: true,
          resetScroll: false,
          search: { ...search, category: [] },
        })
      }}
      onLockedCategoryToggle={(category, search) => {
        const nextCategory = ARTWORK_CATEGORIES.find(
          (item) => item.label === category,
        )
        if (!nextCategory) return

        if (category === title) {
          void navigate({
            to: '/shop',
            resetScroll: false,
            search,
          })
          return
        }

        void navigate({
          to: '/product-category/$handle',
          params: { handle: nextCategory.handle },
          resetScroll: false,
          search,
        })
      }}
    />
  )
}

function ProductCategoryRoutePending() {
  const { handle } = Route.useParams()
  const title =
    ARTWORK_CATEGORIES.find((item) => item.handle === handle)?.label ??
    'Artworks'

  return <ProductListingPending title={title} />
}
