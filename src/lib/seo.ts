const SITE_URL = 'https://www.vaheyeremyan.com'
const SITE_NAME = 'Vahe Yeremyan’s Personal Gallery'
const DEFAULT_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

type SeoHeadOptions = {
  title: string
  path: string
  description?: string
  ogDescription?: string
  image?: string
  type?: 'website' | 'product'
}

export function absoluteSiteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return new URL(path, SITE_URL).toString()
}

export function createSeoHead({
  title,
  path,
  description,
  ogDescription = description,
  image,
  type = 'website',
}: SeoHeadOptions) {
  const url = absoluteSiteUrl(path)
  const imageUrl = image ? absoluteSiteUrl(image) : undefined
  const meta: Array<Record<string, string>> = [
    { title },
    { name: 'robots', content: DEFAULT_ROBOTS },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:url', content: url },
    {
      name: 'twitter:card',
      content: imageUrl ? 'summary_large_image' : 'summary',
    },
    { name: 'twitter:title', content: title },
  ]

  if (description) {
    meta.push({ name: 'description', content: description })
  }

  if (ogDescription) {
    meta.push(
      { property: 'og:description', content: ogDescription },
      { name: 'twitter:description', content: ogDescription },
    )
  }

  if (imageUrl) {
    meta.push(
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:image', content: imageUrl },
    )
  }

  const links: Array<Record<string, string>> = [{ rel: 'canonical', href: url }]

  return {
    meta,
    links,
  }
}
