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
  640, 960, 1280, 1600, 1920, 2400, 2880, 3200, 3840,
] as const
const CAROUSEL_DEFAULT_WIDTH = 1600
const CAROUSEL_FALLBACK_SIZES = '100vw'

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
      .map((slide) => {
        const imageWidths = getCarouselImageWidths(slide.width)
        const defaultWidth = slide.width
          ? Math.min(slide.width, CAROUSEL_DEFAULT_WIDTH)
          : CAROUSEL_DEFAULT_WIDTH

        return {
          src: getSanityImageUrl(slide.image, defaultWidth),
          srcSet: getSanityImageSrcSet(slide.image, imageWidths),
          sizes: getCarouselSizes(slide.width, slide.height),
          alt: slide.alt?.trim() ?? '',
          width: slide.width,
          height: slide.height,
        }
      })
  },
)

/**
 * The hero renders full-bleed (100vw) with `object-cover` in a full-height box.
 * When the box is taller than the image's aspect ratio (e.g. portrait phones),
 * cover scales by height, so the rendered width exceeds 100vw. Account for that
 * so the browser requests a candidate large enough to stay sharp.
 */
function getCarouselSizes(width?: number, height?: number) {
  if (!width || !height) return CAROUSEL_FALLBACK_SIZES

  const aspectRatio = (width / height).toFixed(3)
  return `max(100vw, calc(100svh * ${aspectRatio}))`
}

function getCarouselImageWidths(sourceWidth?: number) {
  if (!sourceWidth) return CAROUSEL_IMAGE_WIDTHS

  return [
    ...CAROUSEL_IMAGE_WIDTHS.filter((width) => width < sourceWidth),
    sourceWidth,
  ]
}
