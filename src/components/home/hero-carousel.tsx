import type { CarouselApi } from '@/components/ui/carousel'
import type { LucideIcon } from 'lucide-react'

import { useEffect, useState } from 'react'

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

type HeroImage = {
  src: string
  srcSet?: string
  alt: string
  sizes?: string
}

export const HERO_IMAGES: Array<HeroImage> = [
  {
    src: '/art.jpg',
    alt: 'Featured artwork by Vahe Yeremyan',
  },
  {
    src: '/lilies1.jpg',
    alt: 'Lilies artwork by Vahe Yeremyan',
  },
  {
    src: '/lilies2.jpg',
    alt: 'Lilies artwork by Vahe Yeremyan',
  },
  {
    src: '/lilies3.jpg',
    alt: 'Lilies artwork by Vahe Yeremyan',
  },
]

const AUTO_PLAY_INTERVAL_MS = 4000
const HERO_IMAGE_SIZES =
  '(min-width: 1536px) 1500px, (min-width: 1280px) 1400px, (min-width: 1024px) 1200px, (min-width: 768px) 900px, (min-width: 640px) 700px, calc(100vw - 2rem)'

export function HeroCarousel({ className }: { className?: string }) {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [autoPlayResetKey, setAutoPlayResetKey] = useState(0)

  const canMove = HERO_IMAGES.length > 1

  function scrollPrev() {
    api?.scrollPrev()
    resetAutoPlayTimer()
  }

  function scrollNext() {
    api?.scrollNext()
    resetAutoPlayTimer()
  }

  function scrollTo(index: number) {
    api?.scrollTo(index)
    resetAutoPlayTimer()
  }

  function resetAutoPlayTimer() {
    setAutoPlayResetKey((key) => key + 1)
  }

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
    if (!api || !isPlaying || !canMove) return

    const intervalId = window.setInterval(() => {
      api.scrollNext()
    }, AUTO_PLAY_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [api, autoPlayResetKey, canMove, isPlaying])

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: 'start', loop: true }}
      className={cn(
        'group/hero h-[min(720px,calc(100dvh-var(--header-height)-3rem))] min-h-80 w-full overflow-hidden rounded-2xl 2xl:mt-4 [&_[data-slot=carousel-content]>div]:will-change-transform',
        className,
      )}
    >
      <CarouselContent viewportClassName="h-full" className="ml-0 h-full">
        {HERO_IMAGES.map((image, index) => (
          <CarouselItem key={image.src} className="h-full pl-0">
            <img
              src={image.src}
              srcSet={image.srcSet}
              alt={image.alt}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'low'}
              loading={index === 0 ? 'eager' : 'lazy'}
              sizes={image.sizes ?? HERO_IMAGE_SIZES}
              className="h-full w-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {canMove && (
        <>
          <CarouselArrow
            label="Previous slide"
            edge="left"
            Icon={ChevronLeft}
            onClick={scrollPrev}
          />
          <CarouselArrow
            label="Next slide"
            edge="right"
            Icon={ChevronRight}
            onClick={scrollNext}
          />
        </>
      )}

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
        <button
          type="button"
          aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
          className="absolute right-full mr-3 flex size-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/35 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          onClick={() => {
            setIsPlaying((current) => !current)
          }}
        >
          {isPlaying ? (
            <Pause className="size-3.5" />
          ) : (
            <Play className="size-3.5 translate-x-px" />
          )}
        </button>

        {HERO_IMAGES.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={selectedIndex === index}
            className={cn(
              'size-2.5 rounded-full border border-white/90 transition',
              selectedIndex === index ? 'bg-white' : 'bg-white/20',
            )}
            onClick={() => {
              scrollTo(index)
            }}
          />
        ))}
      </div>
    </Carousel>
  )
}

function CarouselArrow({
  label,
  edge,
  Icon,
  onClick,
}: {
  label: string
  edge: 'left' | 'right'
  Icon: LucideIcon
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        'absolute inset-y-0 z-10 w-1/5',
        edge === 'left' ? 'group/prev left-0' : 'group/next right-0',
      )}
    >
      <button
        type="button"
        aria-label={label}
        className={cn(
          'absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black opacity-0 shadow-sm backdrop-blur-md transition hover:bg-white focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
          edge === 'left'
            ? 'left-4 group-hover/prev:opacity-100'
            : 'right-4 group-hover/next:opacity-100',
        )}
        onClick={onClick}
      >
        <Icon className="size-5" />
      </button>
    </div>
  )
}
