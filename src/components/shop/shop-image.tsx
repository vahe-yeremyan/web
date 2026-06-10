import { useEffect, useRef } from 'react'

import { shopifyImageUrl } from '@/lib/queries/shopify/format'

type ShopImageProps = {
  src: string | null | undefined
  alt: string | null | undefined
  width: number
  height?: number
  className?: string
  sizes?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  srcSetWidths?: ReadonlyArray<number>
  onLoad?: () => void
  onError?: () => void
}

const DEFAULT_SRC_SET_WIDTHS = [
  160, 240, 320, 480, 640, 800, 1000, 1200, 1600, 2000, 2400, 2800,
]

export function ShopImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  loading = 'lazy',
  fetchPriority = 'auto',
  srcSetWidths = DEFAULT_SRC_SET_WIDTHS,
  onLoad,
  onError,
}: ShopImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const onLoadRef = useRef(onLoad)

  onLoadRef.current = onLoad

  useEffect(() => {
    // `load` can fire before React attaches its handler for cached/preloaded
    // images, so report completeness on mount/src change as a fallback.
    if (imgRef.current?.complete) onLoadRef.current?.()
  }, [src])

  if (!src) {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          background: 'var(--border)',
          aspectRatio: height ? `${width} / ${height}` : '1',
        }}
      />
    )
  }

  const transformed = shopifyImageUrl(src, { width, height, format: 'webp' })
  const maxSrcSetWidth = width * 2
  const srcSet = srcSetWidths
    .filter((candidate) => candidate <= maxSrcSetWidth)
    .concat(width)
    .filter(
      (candidate, index, candidates) => candidates.indexOf(candidate) === index,
    )
    .sort((a, b) => a - b)
    .map((candidateWidth) => {
      const candidateHeight = height
        ? Math.round((candidateWidth / width) * height)
        : undefined
      return `${shopifyImageUrl(src, { width: candidateWidth, height: candidateHeight, format: 'webp' })} ${candidateWidth}w`
    })
    .join(', ')

  return (
    <img
      ref={imgRef}
      src={transformed}
      srcSet={srcSet}
      sizes={sizes ?? `${width}px`}
      alt={alt ?? ''}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
      onLoad={onLoad}
      onError={onError}
    />
  )
}
