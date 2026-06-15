import type { AboutPage, AboutPageDocument } from '@/lib/queries/sanity/about'

import { createServerFn } from '@tanstack/react-start'

import { ABOUT_QUERY } from '@/lib/queries/sanity/about'
import { setSanityBrowseCacheHeaders } from '@/server/sanity/cache'
import { sanityClient } from '@/server/sanity/client'
import { getSanityImageSrcSet, getSanityImageUrl } from '@/server/sanity/image'

const ABOUT_IMAGE_WIDTHS = [360, 540, 720, 960, 1280, 1600, 1920] as const
const ABOUT_IMAGE_DEFAULT_WIDTH = 1280
const ABOUT_IMAGE_SIZES =
  '(min-width: 1024px) 22vw, (min-width: 640px) 40vw, calc(50vw - 1.5rem)'

export const getAbout = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AboutPage | null> => {
    setSanityBrowseCacheHeaders()
    const about = await sanityClient.fetch<AboutPageDocument | null>(
      ABOUT_QUERY,
      { slug: 'about' },
    )

    if (!about) return null

    return {
      ...about,
      artistImages: about.artistImages
        ?.filter((image) => image.image)
        .map((image) => ({
          src: getSanityImageUrl(image.image, ABOUT_IMAGE_DEFAULT_WIDTH),
          srcSet: getSanityImageSrcSet(image.image, ABOUT_IMAGE_WIDTHS),
          sizes: ABOUT_IMAGE_SIZES,
          alt: image.alt,
          aspectRatio: image.aspectRatio,
        })),
    }
  },
)
