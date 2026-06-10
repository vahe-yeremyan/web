import type { ArtworkGridItem } from './artwork-grid-item'

import { useEffect, useRef, useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const ARTWORK_GRID_IMAGE_SIZES =
  '(min-width: 1536px) 360px, (min-width: 1280px) 335px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'

type ArtworkImageProps = {
  artwork: ArtworkGridItem
  priority: boolean
}

export function ArtworkImage({ artwork, priority }: ArtworkImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setIsLoaded(false)

    const image = imageRef.current
    if (image?.complete) {
      setIsLoaded(true)
    }
  }, [artwork.imageSrc])

  if (!artwork.imageSrc) {
    return (
      <div
        aria-hidden
        className="absolute inset-3 rounded-[2px] bg-neutral-100"
      />
    )
  }

  return (
    <div className="absolute inset-3">
      <Skeleton
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[2px] bg-neutral-200/70 transition-opacity duration-200',
          isLoaded && 'animate-none opacity-0',
        )}
      />
      <img
        ref={imageRef}
        src={artwork.imageSrc}
        srcSet={artwork.imageSrcSet}
        alt={artwork.imageAlt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={artwork.imageSizes ?? ARTWORK_GRID_IMAGE_SIZES}
        onLoad={() => {
          setIsLoaded(true)
        }}
        onError={() => {
          setIsLoaded(true)
        }}
        className={cn(
          'absolute inset-0 z-10 h-full w-full rounded-[2px] object-contain transition-opacity duration-200',
          isLoaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}
