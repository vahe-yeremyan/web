import type { SanityImageSource } from '@sanity/image-url'

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
  artistImages?: Array<AboutArtistImage>
  credentialSections?: Array<AboutCredentialSection>
}

export type AboutPageDocument = Omit<AboutPage, 'artistImages'> & {
  artistImages?: Array<AboutArtistImageDocument>
}

export type AboutArtistImageDocument = {
  image: SanityImageSource
  alt: string
  aspectRatio?: number
}

export type AboutArtistImage = {
  src: string
  srcSet: string
  sizes: string
  alt: string
  aspectRatio?: number
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
    artistImages[]{
      image,
      alt,
      "aspectRatio": image.asset->metadata.dimensions.aspectRatio
    },
    credentialSections[]{
      title,
      items[]{
        date,
        description
      }
    }
  }
`
