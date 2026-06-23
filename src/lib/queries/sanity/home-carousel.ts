import type { SanityImageSource } from '@sanity/image-url'

export type HomeCarouselDocument = {
  slides: Array<{
    image: SanityImageSource
    alt?: string | null
    width?: number
    height?: number
  }> | null
} | null

/** Resolved, browser-ready hero image (plain URLs — no Sanity client needed). */
export type HomeCarouselImage = {
  src: string
  srcSet: string
  sizes: string
  alt: string
  width?: number
  height?: number
}

export const HOME_CAROUSEL_QUERY = `
  *[_type == "homeCarousel"][0]{
    slides[]{
      image,
      alt,
      "width": image.asset->metadata.dimensions.width,
      "height": image.asset->metadata.dimensions.height
    }
  }
`
