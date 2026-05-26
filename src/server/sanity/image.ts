import type { SanityImageSource } from '@sanity/image-url'

import { createImageUrlBuilder } from '@sanity/image-url'

import { sanityClient } from './client'

const imageBuilder = createImageUrlBuilder(sanityClient)
const DEFAULT_IMAGE_WIDTHS = [320, 480, 640, 960, 1280] as const

export const SANITY_IMAGE_SIZES = {
  grid: '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)',
  detail: '(min-width: 1024px) 50vw, 100vw',
  full: '100vw',
} as const

export function getSanityImageUrl(source: SanityImageSource, width?: number) {
  const image = imageBuilder.image(source).auto('format').fit('max')

  return width ? image.width(width).url() : image.url()
}

export function getSanityImageSrcSet(
  source: SanityImageSource,
  widths: ReadonlyArray<number> = DEFAULT_IMAGE_WIDTHS,
) {
  return widths
    .map((width) => `${getSanityImageUrl(source, width)} ${width}w`)
    .join(', ')
}
