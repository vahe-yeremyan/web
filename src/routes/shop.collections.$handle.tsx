import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'
import { ShopImage } from '@/components/shop/shop-image'
import { PRODUCT_PAGE_SIZE } from '@/lib/product-page-constants'
import { getCollection } from '@/server/shopify/catalog.functions'

function collectionQueryOptions(handle: string) {
  return queryOptions({
    queryKey: [
      'shopify',
      'collection',
      handle,
      { first: PRODUCT_PAGE_SIZE },
    ] as const,
    queryFn: () =>
      getCollection({
        data: { handle, first: PRODUCT_PAGE_SIZE },
      }),
  })
}

export const Route = createFileRoute('/shop/collections/$handle')({
  loader: async ({ context, params }) => {
    const collection = await context.queryClient.ensureQueryData(
      collectionQueryOptions(params.handle),
    )
    if (!collection) throw notFound()
    return { collection }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title:
              loaderData.collection.seo.title ?? loaderData.collection.title,
          },
          {
            name: 'description',
            content:
              loaderData.collection.seo.description ||
              loaderData.collection.description,
          },
        ]
      : [],
  }),
  pendingComponent: CollectionPending,
  component: CollectionRoute,
})

function CollectionRoute() {
  const { handle } = Route.useParams()
  const { data: collection } = useSuspenseQuery(collectionQueryOptions(handle))

  if (!collection) return null

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        {collection.image && (
          <ShopImage
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            width={1400}
            height={500}
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="aspect-14/5 w-full rounded-lg object-cover"
          />
        )}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium tracking-tight">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="max-w-2xl text-[--storefront-fg-muted]">
              {collection.description}
            </p>
          )}
        </div>
      </header>

      <ProductGrid products={collection.products.nodes} />
    </div>
  )
}

function CollectionPending() {
  return (
    <div className="space-y-10">
      <ProductGridSkeleton count={PRODUCT_PAGE_SIZE} />
    </div>
  )
}
