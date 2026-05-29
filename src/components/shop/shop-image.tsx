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
}: ShopImageProps) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          background: 'var(--storefront-line)',
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
    />
  )
}
