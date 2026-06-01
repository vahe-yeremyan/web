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
  shopifyImageSrcSet,
  shopifyImageUrl,
} from '@/lib/queries/shopify/format'
import {
  PRODUCT_IMAGE_SIZES,
  PRODUCT_IMAGE_SRC_SET_WIDTHS,
  PRODUCT_IMAGE_WIDTH,
  ZOOM_PRODUCT_IMAGE_SIZES,
  ZOOM_PRODUCT_IMAGE_SRC_SET_WIDTHS,
  ZOOM_PRODUCT_IMAGE_WIDTH,
} from '@/lib/queries/shopify/product-images'
import { cn } from '@/lib/utils'

import { ShopImage } from './shop-image'

type ProductImageCarouselProps = {
  images: ProductDetail['images']['nodes']
  title: string
  initialIndex?: number
  zoomed?: boolean
  onImageClick?: (index: number) => void
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
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([])

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

  useEffect(() => {
    if (zoomed || images.length <= 1) return

    const preloadImages = images
      .filter((image, index) => index !== safeInitialIndex && image.url)
      .map((image) => image.url)

    if (preloadImages.length === 0) return

    const preloadedImages: HTMLImageElement[] = []
    const cancelSchedule = scheduleAfterPageSettles(() => {
      for (const src of preloadImages) {
        const image = new Image()
        image.decoding = 'async'
        image.fetchPriority = 'low'
        image.sizes = PRODUCT_IMAGE_SIZES
        image.srcset = shopifyImageSrcSet(src, PRODUCT_IMAGE_SRC_SET_WIDTHS, {
          format: 'webp',
        })
        image.src = shopifyImageUrl(src, {
          width: PRODUCT_IMAGE_WIDTH,
          format: 'webp',
        })
        preloadedImages.push(image)
      }
    })

    return () => {
      cancelSchedule()
      preloadedImages.length = 0
    }
  }, [images, safeInitialIndex, zoomed])

  if (images.length === 0) {
    return (
      <div className="aspect-5/4 rounded-md border border-neutral-200 bg-neutral-50" />
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
                  'flex aspect-5/4 w-full items-center justify-center rounded-md border border-neutral-200 bg-neutral-50',
                  onImageClick && 'cursor-zoom-in',
                  zoomed && 'h-[min(78vh,760px)] border-0 bg-black p-0',
                )}
              >
                {loadedIndexes.has(index) ? (
                  <ShopImage
                    src={image.url}
                    alt={image.altText ?? title}
                    width={
                      zoomed ? ZOOM_PRODUCT_IMAGE_WIDTH : PRODUCT_IMAGE_WIDTH
                    }
                    loading={index === safeInitialIndex ? 'eager' : 'lazy'}
                    fetchPriority={index === safeInitialIndex ? 'high' : 'auto'}
                    sizes={
                      zoomed ? ZOOM_PRODUCT_IMAGE_SIZES : PRODUCT_IMAGE_SIZES
                    }
                    srcSetWidths={
                      zoomed
                        ? ZOOM_PRODUCT_IMAGE_SRC_SET_WIDTHS
                        : PRODUCT_IMAGE_SRC_SET_WIDTHS
                    }
                    className="max-h-full max-w-full rounded-[2px] object-contain"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="h-full w-full rounded-[2px] bg-neutral-100"
                  />
                )}
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious
              className={cn(
                'left-3 border-neutral-200 bg-white/85 text-black opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-white hover:text-black disabled:opacity-0',
                zoomed && 'left-4 bg-white/10 text-white',
              )}
            />
            <CarouselNext
              className={cn(
                'right-3 border-neutral-200 bg-white/85 text-black opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-white hover:text-black disabled:opacity-0',
                zoomed && 'right-4 bg-white/10 text-white',
              )}
            />
          </>
        )}
      </Carousel>

      {images.length > 1 && (
        <div
          className={cn(
            'mx-auto mt-3 w-full max-w-3xl scrollbar-none overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden',
            zoomed && 'pb-6',
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
                  'h-20 w-24 shrink-0 rounded-sm bg-neutral-50 transition-colors',
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

function scheduleAfterPageSettles(callback: () => void) {
  let timeoutId: number | undefined
  let idleId: number | undefined

  const runWhenIdle = () => {
    timeoutId = window.setTimeout(() => {
      idleId = window.requestIdleCallback(callback, { timeout: 3000 })
    }, 1000)
  }

  if (document.readyState === 'complete') {
    runWhenIdle()
  } else {
    window.addEventListener('load', runWhenIdle, { once: true })
  }

  return () => {
    window.removeEventListener('load', runWhenIdle)
    if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    if (idleId !== undefined) window.cancelIdleCallback(idleId)
  }
}
