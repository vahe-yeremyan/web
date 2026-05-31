import type { CarouselApi } from '@/components/ui/carousel'
import type { ProductDetail } from '@/lib/queries/shopify/queries'

import { useEffect, useState } from 'react'

import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { X } from 'lucide-react'

import { ShopPayIcon } from '@/components/icons/PaymentIcons'
import { AddToCartButton } from '@/components/shop/add-to-cart-button'
import { Money } from '@/components/shop/money'
import { ShopImage } from '@/components/shop/shop-image'
import '@/components/shop/shop.css'
import {
  VariantSelector,
  defaultSelectedOptions,
  findVariant,
} from '@/components/shop/variant-selector'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ARTWORK_CATEGORIES } from '@/lib/artwork-categories'
import { formatMoney } from '@/lib/queries/shopify/format'
import { cn } from '@/lib/utils'
import { getProduct } from '@/server/shopify/catalog.functions'

export const Route = createFileRoute('/product/$handle')({
  loader: async ({ params }) => {
    const product = await getProduct({ data: { handle: params.handle } })
    if (!product) throw notFound()
    return { product }
  },
  head: ({ loaderData, params }) => {
    const product = loaderData?.product
    const title = product?.seo.title ?? product?.title ?? params.handle
    const description = product
      ? product.seo.description || productDescription(product)
      : 'Original artwork by Vahe Yeremyan.'
    const image = product?.images.nodes[0]?.url
    const meta = [
      { title },
      { name: 'description', content: description },
      { property: 'og:type', content: 'product' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ]

    if (image) {
      meta.push({ property: 'og:image', content: image })
    }

    return {
      meta,
      links: [{ rel: 'canonical', href: `/product/${params.handle}` }],
    }
  },
  component: ProductRoute,
})

function ProductRoute() {
  const { product } = Route.useLoaderData()
  const [selectedOptions, setSelectedOptions] = useState(() =>
    defaultSelectedOptions(product),
  )
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomIndex, setZoomIndex] = useState(0)
  const variant = findVariant(product.variants.nodes, selectedOptions)
  const isSold = !product.availableForSale
  const price = variant?.price ?? product.priceRange.minVariantPrice
  const category = getCategory(product.category?.value)

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
            <h1 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
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

          <ProductMetadata product={product} category={category} />

          <section className="mt-8 space-y-5">
            <VariantSelector
              product={product}
              selectedOptions={selectedOptions}
              onChange={setSelectedOptions}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:max-w-64">
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

function ProductImageCarousel({
  images,
  title,
  initialIndex = 0,
  zoomed = false,
  onImageClick,
}: {
  images: ProductDetail['images']['nodes']
  title: string
  initialIndex?: number
  zoomed?: boolean
  onImageClick?: (index: number) => void
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const safeInitialIndex = clampIndex(initialIndex, images.length)

  useEffect(() => {
    if (!api) return

    const updateSelectedIndex = () => {
      setSelectedIndex(api.selectedScrollSnap())
    }

    updateSelectedIndex()
    api.on('select', updateSelectedIndex)
    api.on('reInit', updateSelectedIndex)

    return () => {
      api.off('select', updateSelectedIndex)
      api.off('reInit', updateSelectedIndex)
    }
  }, [api])

  useEffect(() => {
    api?.scrollTo(safeInitialIndex, true)
    setSelectedIndex(safeInitialIndex)
  }, [api, safeInitialIndex])

  if (images.length === 0) {
    return (
      <div className="aspect-[5/4] rounded-md border border-neutral-200 bg-neutral-50" />
    )
  }

  return (
    <div className={cn(zoomed && 'flex min-h-0 flex-1 flex-col')}>
      <Carousel
        setApi={setApi}
        opts={{ loop: images.length > 1, startIndex: safeInitialIndex }}
        className={cn(
          'group mx-auto w-full max-w-3xl',
          zoomed && 'flex min-h-0 max-w-5xl flex-1 flex-col justify-center',
        )}
      >
        <CarouselContent
          viewportClassName={cn(
            'rounded-md',
            zoomed ? 'bg-black' : 'bg-neutral-50',
          )}
        >
          {images.map((image, index) => (
            <CarouselItem key={`${image.url}-${index}`}>
              <button
                type="button"
                disabled={!onImageClick}
                aria-label={
                  onImageClick
                    ? `View ${title} image ${index + 1} enlarged`
                    : undefined
                }
                onClick={() => {
                  onImageClick?.(index)
                }}
                className={cn(
                  'flex aspect-[5/4] w-full items-center justify-center rounded-md border border-neutral-200 bg-neutral-50',
                  onImageClick && 'cursor-zoom-in',
                  zoomed && 'h-[min(78vh,760px)] border-0 bg-black p-0',
                )}
              >
                <ShopImage
                  src={image.url}
                  alt={image.altText ?? title}
                  width={zoomed ? 1800 : 1200}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  sizes={
                    zoomed
                      ? '100vw'
                      : '(min-width: 1024px) 58vw, calc(100vw - 2rem)'
                  }
                  className="max-h-full max-w-full rounded-[2px] object-contain"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious
              className={cn(
                'left-3 border-neutral-200 bg-white/85 text-black opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 disabled:opacity-0',
                zoomed && 'left-4 bg-white/10 text-white hover:bg-white/20',
              )}
            />
            <CarouselNext
              className={cn(
                'right-3 border-neutral-200 bg-white/85 text-black opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 disabled:opacity-0',
                zoomed && 'right-4 bg-white/10 text-white hover:bg-white/20',
              )}
            />
          </>
        )}
      </Carousel>

      {images.length > 1 && (
        <div className="mx-auto mt-3 flex w-full max-w-3xl [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <button
              key={`${image.url}-thumb-${index}`}
              type="button"
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={selectedIndex === index}
              onClick={() => {
                api?.scrollTo(index)
                setSelectedIndex(index)
              }}
              className={cn(
                'h-20 w-24 shrink-0 rounded-sm border bg-neutral-50 p-1 transition-colors',
                selectedIndex === index
                  ? 'border-neutral-950'
                  : 'border-neutral-200 hover:border-neutral-400',
                zoomed && 'bg-black',
              )}
            >
              <ShopImage
                src={image.url}
                alt=""
                width={180}
                loading="lazy"
                sizes="96px"
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ZoomedProductGallery({
  images,
  title,
  open,
  initialIndex,
  onOpenChange,
}: {
  images: ProductDetail['images']['nodes']
  title: string
  open: boolean
  initialIndex: number
  onOpenChange: (open: boolean) => void
}) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onOpenChange, open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} enlarged image gallery`}
      className="fixed inset-0 z-[100] flex bg-black"
    >
      <ProductImageCarousel
        images={images}
        title={title}
        initialIndex={initialIndex}
        zoomed
      />
      <button
        type="button"
        aria-label="Close image gallery"
        onClick={() => {
          onOpenChange(false)
        }}
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        <X className="size-5" />
      </button>
    </div>
  )
}

function ProductMetadata({
  product,
  category,
}: {
  product: ProductDetail
  category?: (typeof ARTWORK_CATEGORIES)[number]
}) {
  const dimensions = [
    product.dimensionsImperial?.value,
    product.dimensionsMetric?.value,
  ].filter(Boolean)

  if (!category && !product.medium?.value && dimensions.length === 0) {
    return null
  }

  return (
    <section className="mt-8 space-y-1.5 border-t border-neutral-200 pt-6 text-sm tracking-wide">
      {category && (
        <p className="font-medium">
          Category:{' '}
          <Link
            to="/product-category/$handle"
            params={{ handle: category.handle }}
            className="hover:text-secondary font-normal underline-offset-3 hover:underline"
          >
            {category.label}
          </Link>
        </p>
      )}
      {product.medium?.value && (
        <p className="font-medium">
          Medium:{' '}
          <Link
            to="/shop"
            search={{ medium: [product.medium.value] }}
            className="hover:text-secondary font-normal underline-offset-3 hover:underline"
          >
            {product.medium.value}
          </Link>
        </p>
      )}
      {dimensions.length > 0 && (
        <p className="font-medium">
          Dimensions:{' '}
          <span className="font-normal">{dimensions.join(' | ')}</span>
        </p>
      )}
    </section>
  )
}

function productDescription(product: ProductDetail) {
  const details = [
    'Original artwork by Vahe Yeremyan',
    product.medium?.value && `Medium: ${product.medium.value}`,
    product.dimensionsImperial?.value &&
      `Dimensions: ${product.dimensionsImperial.value}`,
    formatProductPrice(product),
  ].filter(Boolean)

  return `${details.join(' • ')}.`
}

function formatProductPrice(product: ProductDetail) {
  const min = product.priceRange.minVariantPrice
  const max = product.priceRange.maxVariantPrice
  const minPrice = formatMoney(min.amount, min.currencyCode)

  if (min.amount === max.amount) return minPrice

  return `${minPrice} - ${formatMoney(max.amount, max.currencyCode)}`
}

function getCategory(value?: string | null) {
  if (!value) return undefined
  return ARTWORK_CATEGORIES.find(
    (category) => category.label.toLowerCase() === value.toLowerCase(),
  )
}

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0
  if (index < 0) return 0
  if (index >= length) return length - 1
  return index
}
