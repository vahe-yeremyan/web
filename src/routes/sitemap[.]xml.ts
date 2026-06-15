import { createFileRoute } from '@tanstack/react-router'

import { ARTWORK_CATEGORIES } from '@/lib/artwork-categories'
import { absoluteSiteUrl } from '@/lib/seo'
import { shopifyServerFetch } from '@/server/shopify/storefront-client'

const STATIC_SITEMAP_PATHS = [
  '/',
  '/shop',
  '/books',
  '/sold',
  '/about',
  '/studio-show',
] as const

const PRODUCT_SITEMAP_QUERY = /* GraphQL */ `
  query ProductSitemap($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        handle
      }
    }
  }
`

type ProductSitemapQueryResult = {
  products: {
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
    nodes: Array<{ handle: string }>
  }
}

function sitemapUrl(path: string) {
  return `  <url><loc>${absoluteSiteUrl(path)}</loc></url>`
}

async function getProductSitemapPaths() {
  const paths: Array<string> = []
  let after: string | null = null
  let hasNextPage = true

  while (hasNextPage) {
    const result: ProductSitemapQueryResult = await shopifyServerFetch<
      ProductSitemapQueryResult,
      { first: number; after: string | null }
    >({
      query: PRODUCT_SITEMAP_QUERY,
      variables: { first: 250, after },
    })

    paths.push(
      ...result.products.nodes.map((product) => `/product/${product.handle}`),
    )
    hasNextPage = result.products.pageInfo.hasNextPage
    after = result.products.pageInfo.endCursor
  }

  return paths
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const productPaths = await getProductSitemapPaths().catch(() => [])
        const paths = [
          ...STATIC_SITEMAP_PATHS,
          ...ARTWORK_CATEGORIES.map(
            (category) => `/product-category/${category.handle}`,
          ),
          ...productPaths,
        ]
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(sitemapUrl).join('\n')}
</urlset>`

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'CDN-Cache-Control':
              'public, max-age=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
