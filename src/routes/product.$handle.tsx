import { useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { ProductDetailSkeleton } from '@/components/shop/product-detail-skeleton'
import { ProductImageCarousel } from '@/components/shop/product-image-carousel'
import { ProductPurchasePanel } from '@/components/shop/product-purchase-panel'
import { ZoomedProductGallery } from '@/components/shop/product-zoom-gallery'
import {
  getProductHead,
  productQueryOptions,
} from '@/lib/queries/shopify/product-detail'

export const Route = createFileRoute('/product/$handle')({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(
      productQueryOptions(params.handle),
    )
    if (!product) throw notFound()
    return { product }
  },
  head: ({ loaderData, params }) =>
    getProductHead(loaderData?.product, params.handle),
  pendingComponent: ProductDetailSkeleton,
  component: ProductRoute,
})

function ProductRoute() {
  const { handle } = Route.useParams()
  const { product: loaderProduct } = Route.useLoaderData()
  const { data } = useSuspenseQuery(productQueryOptions(handle))
  const product = data ?? loaderProduct

  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomIndex, setZoomIndex] = useState(0)

  const variant = product.variants.nodes[0]
  const isSold = !product.availableForSale || !variant.availableForSale

  return (
    <main className="pb-20">
      <article className="grid grid-cols-1 gap-8 py-6 md:py-10 lg:grid-cols-[minmax(0,42rem)_minmax(22rem,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,48rem)_minmax(22rem,1fr)] xl:gap-16">
        <ProductImageCarousel
          images={product.images.nodes}
          title={product.title}
          onImageClick={(index) => {
            setZoomIndex(index)
            setZoomOpen(true)
          }}
        />

        <ProductPurchasePanel
          product={product}
          variant={variant}
          sold={isSold}
        />
      </article>

      <ZoomedProductGallery
        images={product.images.nodes}
        title={product.title}
        open={zoomOpen}
        initialIndex={zoomIndex}
        onOpenChange={setZoomOpen}
      />
    </main>
  )
}
