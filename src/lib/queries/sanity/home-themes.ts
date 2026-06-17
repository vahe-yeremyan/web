import type { SanityImageSource } from '@sanity/image-url'

export type HomeThemesDocument = {
  themes: Array<{
    _key: string
    title: string
    path: string
    image: SanityImageSource
    alt: string
  }> | null
} | null

export type HomeTheme = {
  id: string
  title: string
  path: string
  imageSrc: string
  imageSrcSet: string
  imageSizes: string
  imageAlt: string
}

export const HOME_THEMES_QUERY = `
  *[_type == "homeThemes"][0]{
    themes[]{
      _key,
      title,
      path,
      image,
      alt
    }
  }
`
