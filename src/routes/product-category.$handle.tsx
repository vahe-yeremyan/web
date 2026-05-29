import { useEffect, useState } from 'react'

import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeading } from '@/components/page-heading'
import { ProductGrid } from '@/components/shop/product-grid'
import { ProductLoadMore } from '@/components/shop/product-load-more'
import {
  ARTWORK_CATEGORIES,
  isArtworkCategoryHandle,
} from '@/lib/artwork-categories'
import { getCollection } from '@/server/shopify/catalog.functions'

const PAGE_SIZE = 24

export const Route = createFileRoute('/product-category/$handle')({
  loader: async ({ params }) => {
    if (!isArtworkCategoryHandle(params.handle)) throw notFound()

    const collection = await getCollection({
      data: {
        handle: params.handle,
        first: PAGE_SIZE,
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
      pageInfo: collection.products.pageInfo,
      products: collection.products.nodes,
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
  const { title, pageInfo, products } = Route.useLoaderData()
  const { handle } = Route.useParams()
  const [displayedProducts, setDisplayedProducts] = useState(products)
  const [currentPageInfo, setCurrentPageInfo] = useState(pageInfo)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    setDisplayedProducts(products)
    setCurrentPageInfo(pageInfo)
    setIsLoadingMore(false)
  }, [pageInfo, products])

  const handleLoadMore = async () => {
    if (
      isLoadingMore ||
      !currentPageInfo.hasNextPage ||
      !currentPageInfo.endCursor
    ) {
      return
    }

    setIsLoadingMore(true)
    try {
      const collection = await getCollection({
        data: {
          handle,
          first: PAGE_SIZE,
          after: currentPageInfo.endCursor,
          sortKey: 'COLLECTION_DEFAULT',
        },
      })
      if (!collection) return

      setDisplayedProducts((current) => [
        ...current,
        ...collection.products.nodes,
      ])
      setCurrentPageInfo(collection.products.pageInfo)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <main className="pb-20">
      <PageHeading title={title} />
      <ProductGrid products={displayedProducts} showPrice />
      <ProductLoadMore
        pageInfo={currentPageInfo}
        isLoading={isLoadingMore}
        onLoadMore={handleLoadMore}
      />
    </main>
  )
}
