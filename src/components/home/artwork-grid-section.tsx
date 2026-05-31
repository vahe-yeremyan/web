import { useEffect, useRef, useState } from 'react'

import { Link } from '@tanstack/react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { HomeSectionTitle } from './home-section-title'

export type ArtworkGridItem = {
  id: string
  title: string
  medium?: string
  dimensions?: string
  price?: string
  status?: string
  productHandle?: string
  imageSrc?: string
  imageSrcSet?: string
  imageSizes?: string
  imageAlt: string
}

type ArtworkGridSectionProps = {
  title: string
  artworks: Array<ArtworkGridItem>
  hideTitle?: boolean
  priorityCount?: number
}

const ARTWORK_GRID_IMAGE_SIZES =
  '(min-width: 1536px) 360px, (min-width: 1280px) 335px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)'

function ArtworkImage({
  artwork,
  priority,
}: {
  artwork: ArtworkGridItem
  priority: boolean
}) {
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
      <div aria-hidden className="h-full w-full rounded-[2px] bg-neutral-100" />
    )
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
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
          'relative z-10 block max-h-full max-w-full rounded-[2px] object-contain transition-opacity duration-200',
          isLoaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}

function ArtworkLink({
  artwork,
  className,
  children,
}: {
  artwork: ArtworkGridItem
  className?: string
  children: React.ReactNode
}) {
  if (!artwork.productHandle) {
    return <div className={className}>{children}</div>
  }

  return (
    <Link
      to="/product/$handle"
      params={{ handle: artwork.productHandle }}
      className={className}
    >
      {children}
    </Link>
  )
}

export function ArtworkGridSection({
  title,
  artworks,
  hideTitle = false,
  priorityCount = 0,
}: ArtworkGridSectionProps) {
  return (
    <section className={hideTitle ? undefined : 'my-6 md:my-10'}>
      {!hideTitle && <HomeSectionTitle>{title}</HomeSectionTitle>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {artworks.map((artwork, index) => (
          <article key={artwork.id} className="min-w-0">
            <ArtworkLink
              artwork={artwork}
              className="block aspect-9/8 overflow-hidden rounded-md border border-neutral-200/60 bg-neutral-50/75 p-3"
            >
              <div className="flex h-full w-full items-center justify-center">
                <ArtworkImage
                  artwork={artwork}
                  priority={index < priorityCount}
                />
              </div>
            </ArtworkLink>

            <div className="mt-4 space-y-1.5 text-left">
              <h3 className="text-base font-semibold">
                {artwork.productHandle ? (
                  <Link
                    to="/product/$handle"
                    params={{ handle: artwork.productHandle }}
                    className="hover:text-secondary transition-colors"
                  >
                    {artwork.title}
                  </Link>
                ) : (
                  artwork.title
                )}
              </h3>

              {artwork.medium && artwork.dimensions && (
                <div className="leading-wide space-y-1 text-xs text-neutral-600">
                  <p>{artwork.medium}</p>
                  <p>{artwork.dimensions}</p>
                </div>
              )}

              {(artwork.price || artwork.status) && (
                <p className="inline-flex items-center gap-1 text-sm text-neutral-500">
                  {artwork.price}
                  {artwork.status && (
                    <span className="text-rose-600">• {artwork.status}</span>
                  )}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
