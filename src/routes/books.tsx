import { createFileRoute, notFound } from '@tanstack/react-router'

import { ArtworkGridSection } from '@/components/home/artwork-grid-section'
import { PageHeading } from '@/components/page-heading'
import { shopifyProductListItemsToArtworkGridItems } from '@/lib/queries/shopify/artwork-grid'
import { getCollection } from '@/server/shopify/catalog.functions'

export const Route = createFileRoute('/books')({
  loader: async () => {
    const collection = await getCollection({
      data: { handle: 'books', first: 24, sortKey: 'COLLECTION_DEFAULT' },
    })

    if (!collection) throw notFound()

    return {
      title: collection.title,
      description: collection.description,
      seo: collection.seo,
      products: shopifyProductListItemsToArtworkGridItems(
        collection.products.nodes,
      ),
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
  component: BooksRoute,
})

function BooksRoute() {
  const { title, products } = Route.useLoaderData()

  return (
    <main className="pb-20">
      <PageHeading title={title} />
      <ArtworkGridSection title={title} artworks={products} hideTitle />
    </main>
  )
}
