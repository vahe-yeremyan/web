import { shopifyImageUrl } from './format'

const SHOPIFY_ARTWORK_IMAGE_WIDTHS = [
  320, 400, 480, 560, 600, 640, 680, 800, 1000, 1200, 1440,
]

export const ARTWORK_GRID_IMAGE_SIZES =
  '(min-width: 1536px) 340px, (min-width: 1024px) calc(25vw - 56px), (min-width: 768px) calc(33.333vw - 56px), (min-width: 640px) calc(50vw - 56px), calc(50vw - 48px)'

export function getArtworkGridImageSrcSet(src: string) {
  return SHOPIFY_ARTWORK_IMAGE_WIDTHS.map(
    (width) => `${shopifyImageUrl(src, { width, format: 'webp' })} ${width}w`,
  ).join(', ')
}
