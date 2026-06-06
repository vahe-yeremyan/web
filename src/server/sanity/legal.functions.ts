import type { LegalPage } from '@/lib/queries/sanity/legal'

import { createServerFn } from '@tanstack/react-start'

import * as v from 'valibot'

import { LEGAL_PAGE_QUERY } from '@/lib/queries/sanity/legal'
import { setSanityBrowseCacheHeaders } from '@/server/sanity/cache'
import { sanityClient } from '@/server/sanity/client'

export const getLegalPage = createServerFn({ method: 'POST' })
  .inputValidator(v.object({ slug: v.string() }))
  .handler(({ data }): Promise<LegalPage | null> => {
    setSanityBrowseCacheHeaders()
    return sanityClient.fetch<LegalPage | null>(LEGAL_PAGE_QUERY, {
      slug: data.slug,
    })
  })
