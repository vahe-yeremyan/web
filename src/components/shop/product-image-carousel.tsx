import type { CarouselApi } from '@/components/ui/carousel'
import type { ProductDetail } from '@/lib/queries/shopify/queries'

import { useEffect, useState } from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
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
        <div className="mx-auto mt-3 flex w-full max-w-3xl scrollbar-none gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
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

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0
  if (index < 0) return 0
  if (index >= length) return length - 1
  return index
}
