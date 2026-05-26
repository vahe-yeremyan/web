import type { PortableTextBlock } from '@portabletext/types'

import { sanityClient } from '@/server/sanity/client'

export type AboutPage = {
  title: string
  slug: string
  body: Array<PortableTextBlock>
  credentialSections?: Array<AboutCredentialSection>
}

export type AboutCredentialSection = {
  title: string
  items?: Array<AboutCredentialItem>
}

export type AboutCredentialItem = {
  date?: string
  description: string
}

const ABOUT_QUERY = `
  *[_type == "about" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    body,
    credentialSections[]{
      title,
      items[]{
        date,
        description
      }
    }
  }
`

export function getAbout(slug = 'about') {
  return sanityClient.fetch<AboutPage | null>(ABOUT_QUERY, { slug })
}
