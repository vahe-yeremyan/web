import type { AboutPage } from '@/lib/queries/sanity/about'

import { createServerFn } from '@tanstack/react-start'

import { ABOUT_QUERY } from '@/lib/queries/sanity/about'
import { sanityClient } from '@/server/sanity/client'

export const getAbout = createServerFn({ method: 'GET' }).handler(
  (): Promise<AboutPage | null> => {
    return sanityClient.fetch<AboutPage | null>(ABOUT_QUERY, { slug: 'about' })
  },
)
