import { useEffect, useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { ShopPayIcon } from '@/components/icons/PaymentIcons'
import { AddToCartButton } from '@/components/shop/add-to-cart-button'
import { Money } from '@/components/shop/money'
import { ProductDetailSkeleton } from '@/components/shop/product-detail-skeleton'
import { ProductImageCarousel } from '@/components/shop/product-image-carousel'
import { ProductMetadata } from '@/components/shop/product-metadata'
import { ZoomedProductGallery } from '@/components/shop/product-zoom-gallery'
import '@/components/shop/shop.css'
import {
  VariantSelector,
  defaultSelectedOptions,
  findVariant,
} from '@/components/shop/variant-selector'
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

  const [selectedOptions, setSelectedOptions] = useState(() =>
    defaultSelectedOptions(product),
  )
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomIndex, setZoomIndex] = useState(0)

  useEffect(() => {
    setSelectedOptions(defaultSelectedOptions(product))
  }, [product])

  const variant = findVariant(product.variants.nodes, selectedOptions)
  const isSold = !product.availableForSale
  const price = variant?.price ?? product.priceRange.minVariantPrice

  return (
    <main className="site-frame pb-20">
      <article className="grid gap-8 py-6 md:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-12 xl:gap-16">
        <ProductImageCarousel
          images={product.images.nodes}
          title={product.title}
          onImageClick={(index) => {
            setZoomIndex(index)
            setZoomOpen(true)
          }}
        />

        <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
          <section className="space-y-2">
            <h1 className="text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
              {product.title}
            </h1>
            <p className="inline-flex items-center gap-1.5 text-xl text-neutral-800">
              <Money amount={price.amount} currencyCode={price.currencyCode} />
              {isSold && <span className="text-rose-600">• Sold</span>}
            </p>
          </section>

          {product.descriptionHtml && (
            <div
              className="shop-prose mt-6 text-sm text-neutral-700"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}

          <ProductMetadata product={product} />

          <section className="mt-8 space-y-5">
            <VariantSelector
              product={product}
              selectedOptions={selectedOptions}
              onChange={setSelectedOptions}
            />

            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-10">
              <div className="w-fit">
                <AddToCartButton product={product} variant={variant} />
              </div>
              {isSold ? (
                <p className="text-sm text-rose-600">
                  This artwork has been sold.
                </p>
              ) : (
                <p className="text-sm leading-tight text-neutral-600">
                  Pay in installments
                  <br />
                  with <ShopPayIcon />
                </p>
              )}
            </div>
          </section>
        </div>
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
