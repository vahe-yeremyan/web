import type { CarouselApi } from '@/components/ui/carousel'
import type { ProductDetail } from '@/lib/queries/shopify/queries'

import { useEffect, useRef, useState } from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  PRODUCT_IMAGE_SIZES,
  PRODUCT_IMAGE_SRC_SET_WIDTHS,
  PRODUCT_IMAGE_WIDTH,
  ZOOM_PRODUCT_IMAGE_SIZES,
  ZOOM_PRODUCT_IMAGE_SRC_SET_WIDTHS,
  ZOOM_PRODUCT_IMAGE_WIDTH,
} from '@/lib/queries/shopify/product-images'
import { cn } from '@/lib/utils'

import { useProductImagePreload } from './product-image-preload'
import { ShopImage } from './shop-image'

type ProductImageCarouselProps = {
  images: ProductDetail['images']['nodes']
  title: string
  initialIndex?: number
  zoomed?: boolean
  onImageClick?: (index: number) => void
}

const PRODUCT_IMAGE_SETTINGS = {
  width: PRODUCT_IMAGE_WIDTH,
  sizes: PRODUCT_IMAGE_SIZES,
  srcSetWidths: PRODUCT_IMAGE_SRC_SET_WIDTHS,
}

const ZOOM_PRODUCT_IMAGE_SETTINGS = {
  width: ZOOM_PRODUCT_IMAGE_WIDTH,
  sizes: ZOOM_PRODUCT_IMAGE_SIZES,
  srcSetWidths: ZOOM_PRODUCT_IMAGE_SRC_SET_WIDTHS,
}

export function ProductImageCarousel({
  images,
  title,
  initialIndex = 0,
  zoomed = false,
  onImageClick,
}: ProductImageCarouselProps) {
  const safeInitialIndex = clampIndex(initialIndex, images.length)
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(safeInitialIndex)
  const [loadedIndexes, setLoadedIndexes] = useState<ReadonlySet<number>>(
    () => new Set([safeInitialIndex]),
  )
  const [imageLoadedIndexes, setImageLoadedIndexes] = useState<
    ReadonlySet<number>
  >(() => new Set())
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([])
  const imageSettings = zoomed
    ? ZOOM_PRODUCT_IMAGE_SETTINGS
    : PRODUCT_IMAGE_SETTINGS

  useProductImagePreload({
    images,
    initialIndex: safeInitialIndex,
    zoomed,
  })

  useEffect(() => {
    setImageLoadedIndexes(new Set())
  }, [images])

  const markImageLoaded = (index: number) => {
    setImageLoadedIndexes((current) =>
      current.has(index) ? current : new Set(current).add(index),
    )
  }

  useEffect(() => {
    if (!api) return

    const updateSelectedIndex = () => {
      const nextIndex = api.selectedScrollSnap()
      setSelectedIndex(nextIndex)
      setLoadedIndexes((current) => new Set(current).add(nextIndex))
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
    setLoadedIndexes((current) => new Set(current).add(safeInitialIndex))
  }, [api, safeInitialIndex])

  useEffect(() => {
    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    })
  }, [selectedIndex])

  if (images.length === 0) {
    return <div className="aspect-4/3 bg-neutral-50" />
  }

  return (
    <div
      className={cn(zoomed && 'flex min-h-0 w-full min-w-0 flex-1 flex-col')}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: images.length > 1, startIndex: safeInitialIndex }}
        className={cn(
          'group w-full max-w-3xl',
          zoomed &&
            'mx-auto flex min-h-0 w-full max-w-5xl min-w-0 flex-1 flex-col justify-center lg:max-w-[min(64rem,calc(100vw-8rem))]',
        )}
      >
        <CarouselContent
          viewportClassName={cn(
            zoomed && 'bg-black',
            !zoomed && 'bg-neutral-50',
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
                  'relative flex w-full items-center justify-center bg-neutral-50',
                  !zoomed && 'aspect-4/3',
                  onImageClick && 'cursor-zoom-in',
                  zoomed && 'h-[min(80vh,760px)] border-0 bg-black p-0',
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {!imageLoadedIndexes.has(index) && (
                    <img
                      aria-hidden
                      alt=""
                      src={blankImageSrc(image.width, image.height)}
                      className={cn(
                        'max-h-full max-w-full',
                        zoomed && 'rounded-[2px]',
                        zoomed ? 'animate-pulse bg-zinc-900' : 'bg-neutral-100',
                      )}
                    />
                  )}
                  {loadedIndexes.has(index) && (
                    <ShopImage
                      src={image.url}
                      alt={image.altText ?? title}
                      width={imageSettings.width}
                      loading={index === safeInitialIndex ? 'eager' : 'lazy'}
                      fetchPriority={
                        index === safeInitialIndex ? 'high' : 'auto'
                      }
                      sizes={imageSettings.sizes}
                      srcSetWidths={imageSettings.srcSetWidths}
                      className={cn(
                        'absolute inset-0 h-full w-full object-contain',
                        zoomed && 'rounded-[2px]',
                      )}
                      onLoad={() => markImageLoaded(index)}
                      onError={() => markImageLoaded(index)}
                    />
                  )}
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious
              className={cn(
                'left-3 hidden border-neutral-200 bg-white/85 text-black shadow-sm backdrop-blur transition-opacity hover:bg-white hover:text-black md:inline-flex md:opacity-100 lg:opacity-0 lg:group-hover:opacity-100',
                zoomed && 'left-4 bg-white/10 text-white lg:-left-12',
              )}
            />
            <CarouselNext
              className={cn(
                'right-3 hidden border-neutral-200 bg-white/85 text-black shadow-sm backdrop-blur transition-opacity hover:bg-white hover:text-black md:inline-flex md:opacity-100 lg:opacity-0 lg:group-hover:opacity-100',
                zoomed && 'right-4 bg-white/10 text-white lg:-right-12',
              )}
            />
          </>
        )}
      </Carousel>

      {images.length > 1 && (
        <div
          className={cn(
            'mt-3 w-full max-w-3xl scrollbar-none overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden',
            zoomed && 'mx-auto pb-6',
          )}
        >
          <div className="flex w-max min-w-full justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={`${image.url}-thumb-${index}`}
                ref={(element) => {
                  thumbnailRefs.current[index] = element
                }}
                type="button"
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={selectedIndex === index}
                onClick={() => {
                  setLoadedIndexes((current) => new Set(current).add(index))
                  api?.scrollTo(index)
                  setSelectedIndex(index)
                }}
                className={cn(
                  'h-15 w-18 shrink-0 rounded-sm bg-neutral-50 transition-colors md:h-20 md:w-24',
                  selectedIndex === index
                    ? 'border-primary-accent border-[1.5px] p-[3.5px]'
                    : 'border border-neutral-200 p-1 hover:border-neutral-400',
                  zoomed && 'bg-black',
                )}
              >
                <ShopImage
                  src={image.url}
                  alt=""
                  width={180}
                  loading="lazy"
                  fetchPriority="low"
                  sizes="96px"
                  srcSetWidths={[96, 144]}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0
  if (index < 0) return 0
  if (index >= length) return length - 1
  return index
}

/**
 * A transparent SVG data URI with the given intrinsic dimensions. Used as a
 * placeholder so the loading box matches the image's aspect ratio (and thus its
 * `object-contain` footprint) instead of filling the whole slide.
 */
function blankImageSrc(
  width: number | null | undefined,
  height: number | null | undefined,
) {
  const w = width && width > 0 ? width : 5
  const h = height && height > 0 ? height : 4
  return `data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='${w}'%20height='${h}'/%3E`
}
