import { createFileRoute, notFound } from '@tanstack/react-router'

import { ArtworkGridSection } from '@/components/home/artwork-grid-section'
import { PageHeading } from '@/components/page-heading'
import {
  ARTWORK_CATEGORIES,
  isArtworkCategoryHandle,
} from '@/lib/artwork-categories'
import { shopifyProductListItemsToArtworkGridItems } from '@/lib/queries/shopify/artwork-grid'
import { getCollection } from '@/server/shopify/catalog.functions'

export const Route = createFileRoute('/product-category/$handle')({
  loader: async ({ params }) => {
    if (!isArtworkCategoryHandle(params.handle)) throw notFound()

    const collection = await getCollection({
      data: {
        handle: params.handle,
        first: 24,
        sortKey: 'COLLECTION_DEFAULT',
      },
    })

    if (!collection) throw notFound()

    const category = ARTWORK_CATEGORIES.find(
      (item) => item.handle === params.handle,
    )
    if (!category) throw notFound()

    return {
      title: category.label,
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
  component: ProductCategoryRoute,
})

function ProductCategoryRoute() {
  const { title, products } = Route.useLoaderData()

  return (
    <main className="pb-20">
      <PageHeading title={title} />
      <ArtworkGridSection title={title} artworks={products} hideTitle />
    </main>
  )
}
