import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { ArtworkGridSection } from '@/components/home/artwork-grid-section'
import { PageHeading } from '@/components/page-heading'
import { ProductGridSkeleton } from '@/components/shop/product-grid'
import { PRODUCT_PAGE_SIZE } from '@/lib/product-page-constants'
import { shopifyProductListItemsToArtworkGridItems } from '@/lib/queries/shopify/artwork-grid'
import { getCollection } from '@/server/shopify/catalog.functions'

function booksQueryOptions() {
  return queryOptions({
    queryKey: [
      'shopify',
      'collection',
      'books',
      { first: PRODUCT_PAGE_SIZE, sortKey: 'COLLECTION_DEFAULT' },
    ] as const,
    queryFn: () =>
      getCollection({
        data: {
          handle: 'books',
          first: PRODUCT_PAGE_SIZE,
          sortKey: 'COLLECTION_DEFAULT',
        },
      }),
  })
}

export const Route = createFileRoute('/books')({
  loader: async ({ context }) => {
    const collection =
      await context.queryClient.ensureQueryData(booksQueryOptions())
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
  pendingComponent: BooksPending,
  component: BooksRoute,
})

function BooksRoute() {
  const { data: collection } = useSuspenseQuery(booksQueryOptions())
  const products = shopifyProductListItemsToArtworkGridItems(
    collection?.products.nodes ?? [],
  )

  return (
    <main className="pb-20">
      <PageHeading title={collection?.title ?? 'Books'} />
      <ArtworkGridSection
        title={collection?.title ?? 'Books'}
        artworks={products}
        hideTitle
        priorityCount={9}
      />
    </main>
  )
}

function BooksPending() {
  return (
    <main className="pb-20">
      <PageHeading title="Books" />
      <ProductGridSkeleton count={PRODUCT_PAGE_SIZE} />
    </main>
  )
}
