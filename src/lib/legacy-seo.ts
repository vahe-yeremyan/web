import type { ArtworkCategoryHandle } from './artwork-categories'

export const HOME_SEO = {
  title: 'Vahe Yeremyan’s Personal Gallery',
  description:
    'Looking for the best artist and paintings for near you? Visit Vahe Yeremyan’s Personal Gallery for our collection of original paintings!',
  path: '/',
} as const

export const ABOUT_SEO = {
  title: 'About - Vahe Yeremyan’s Personal Gallery',
  description:
    'Armenian Artists Paintings - With a Master’s degree in Fine Art and a PhD in Fine Art Therapy, I strive to create the best artwork possible.',
  path: '/about',
} as const

export const STUDIO_SHOW_SEO = {
  title: 'Studio & Show - Vahe Yeremyan’s Personal Gallery',
  ogDescription: 'Studio & Show',
  path: '/studio-show',
} as const

export const SHOP_SEO = {
  title: 'Artworks - Vahe Yeremyan’s Personal Gallery',
  ogDescription: 'Artworks',
  path: '/shop/',
} as const

export const SOLD_SEO = {
  title: 'Sold - Vahe Yeremyan’s Personal Gallery',
  ogDescription: 'Sold',
  path: '/sold',
} as const

export const BOOKS_SEO = {
  title: 'Books - Vahe Yeremyan’s Personal Gallery',
  ogDescription: 'Books',
  path: '/books',
} as const

export const CATEGORY_SEO: Partial<
  Record<
    ArtworkCategoryHandle,
    {
      title: string
      description?: string
      ogDescription?: string
    }
  >
> = {
  abstract: {
    title:
      'Large Abstract Paintings for Sale - Buy Original Abstract Paintings',
    description:
      'Buy Original Abstract Paintings - Discover the best hand-painted Large Abstract Paintings for Sale. Shop our selection today!',
  },
  cityscape: {
    title: 'Cityscape Archives - Vahe Yeremyan’s Personal Gallery',
    ogDescription: 'Cityscape',
  },
  figurative: {
    title: 'Figurative Archives - Vahe Yeremyan’s Personal Gallery',
    ogDescription: 'Figurative',
  },
  flowers: {
    title: 'Flowers Archives - Vahe Yeremyan’s Personal Gallery',
    ogDescription: 'Flowers',
  },
  landscape: {
    title: 'Buy Original Landscape Paintings - Landscape Art for Sale',
    description:
      'Buy Original Landscape Paintings - Browse our original landscape painting collection for the very best in custom, handmade pieces. Order Now!',
  },
  seascape: {
    title: 'Seascape Paintings for Sale - Buy Original Seascape Artwork',
    description:
      'Seascape Paintings for Sale - Buy These seascape oil paintings to transform your space into a gallery of beautifully moving works of art!',
  },
  'still-life': {
    title: 'Still Life Archives - Vahe Yeremyan’s Personal Gallery',
    ogDescription: 'Still Life',
  },
}
