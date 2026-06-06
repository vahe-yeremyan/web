import type { PortableTextJsonBlock } from '@/lib/queries/sanity/about'

export type LegalPage = {
  title: string
  slug: string
  lastUpdated: string
  body: Array<PortableTextJsonBlock>
  seo?: {
    title?: string
    description?: string
  }
}

export const LEGAL_PAGE_QUERY = `
  *[_type == "legalPage" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    lastUpdated,
    body,
    seo{
      title,
      description
    }
  }
`
