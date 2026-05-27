export type JsonValue =
  | string
  | number
  | boolean
  | null
  | Array<JsonValue>
  | { [key: string]: JsonValue }

export type PortableTextJsonBlock = {
  _key: string
  _type: string
  [key: string]: JsonValue
}

export type AboutPage = {
  title: string
  slug: string
  body: Array<PortableTextJsonBlock>
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

export const ABOUT_QUERY = `
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
