import type {
  HomeTheme,
  HomeThemesDocument,
} from '@/lib/queries/sanity/home-themes'

import { createServerFn } from '@tanstack/react-start'

import { HOME_THEMES_QUERY } from '@/lib/queries/sanity/home-themes'
import { setSanityBrowseCacheHeaders } from '@/server/sanity/cache'
import { sanityClient } from '@/server/sanity/client'
import { getSanityImageSrcSet, getSanityImageUrl } from '@/server/sanity/image'

const THEME_IMAGE_WIDTHS = [360, 540, 720, 960, 1280] as const
const THEME_IMAGE_DEFAULT_WIDTH = 720
const THEME_IMAGE_SIZES =
  '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'

export const getHomeThemes = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<HomeTheme>> => {
    setSanityBrowseCacheHeaders()

    let doc: HomeThemesDocument
    try {
      doc = await sanityClient.fetch<HomeThemesDocument>(HOME_THEMES_QUERY)
    } catch {
      return []
    }

    return (doc?.themes ?? [])
      .filter((theme) => Boolean(theme.image && theme.path && theme.title))
      .map((theme) => ({
        id: theme._key,
        title: theme.title,
        path: theme.path,
        imageSrc: getSanityImageUrl(theme.image, THEME_IMAGE_DEFAULT_WIDTH),
        imageSrcSet: getSanityImageSrcSet(theme.image, THEME_IMAGE_WIDTHS),
        imageSizes: THEME_IMAGE_SIZES,
        imageAlt: theme.alt,
      }))
  },
)
