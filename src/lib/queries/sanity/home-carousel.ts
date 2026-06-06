import type { SanityImageSource } from '@sanity/image-url'

export type HomeCarouselDocument = {
  slides: Array<{
    image: SanityImageSource
    alt: string
  }> | null
} | null

/** Resolved, browser-ready hero image (plain URLs — no Sanity client needed). */
export type HomeCarouselImage = {
  src: string
  srcSet: string
  sizes: string
  alt: string
}

export const HOME_CAROUSEL_QUERY = `
  *[_type == "homeCarousel"][0]{
    slides[]{
      image,
      alt
    }
  }
`
