import type {
  HomeCarouselDocument,
  HomeCarouselImage,
} from '@/lib/queries/sanity/home-carousel'

import { createServerFn } from '@tanstack/react-start'

import { HOME_CAROUSEL_QUERY } from '@/lib/queries/sanity/home-carousel'
import { setSanityBrowseCacheHeaders } from '@/server/sanity/cache'
import { sanityClient } from '@/server/sanity/client'
import { getSanityImageSrcSet, getSanityImageUrl } from '@/server/sanity/image'

const CAROUSEL_IMAGE_WIDTHS = [
  640, 960, 1280, 1600, 1920, 2400, 2880, 3840,
] as const
const CAROUSEL_DEFAULT_WIDTH = 1600
// The hero is full-bleed (100vw). Advertising 125vw makes the browser fetch
// ~1.25x the displayed size for extra sharpness (DPR is still applied on top).
const CAROUSEL_SIZES = '125vw'

export const getHomeCarouselImages = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<HomeCarouselImage>> => {
    setSanityBrowseCacheHeaders()

    let doc: HomeCarouselDocument
    try {
      doc = await sanityClient.fetch<HomeCarouselDocument>(HOME_CAROUSEL_QUERY)
    } catch {
      // If Sanity is unreachable/unconfigured, let the caller fall back to the
      // built-in static hero images rather than failing the home page.
      return []
    }

    const slides = doc?.slides ?? []

    return slides
      .filter((slide) => Boolean(slide.image))
      .map((slide) => ({
        src: getSanityImageUrl(slide.image, CAROUSEL_DEFAULT_WIDTH),
        srcSet: getSanityImageSrcSet(slide.image, CAROUSEL_IMAGE_WIDTHS),
        sizes: CAROUSEL_SIZES,
        alt: slide.alt,
      }))
  },
)
