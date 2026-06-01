import type { ProductDetail } from '@/lib/queries/shopify/queries'

import { queryOptions } from '@tanstack/react-query'

import { ARTWORK_CATEGORIES } from '@/lib/artwork-categories'
import { formatMoney } from '@/lib/queries/shopify/format'
import { getProduct } from '@/server/shopify/catalog.functions'

export function productQueryOptions(handle: string) {
  return queryOptions({
    queryKey: ['shopify', 'product', handle] as const,
    queryFn: () => getProduct({ data: { handle } }),
  })
}

export function getProductHead(
  product: ProductDetail | null | undefined,
  handle: string,
) {
  const title = product?.seo.title ?? product?.title ?? handle
  const description = product
    ? product.seo.description || productDescription(product)
    : 'Original artwork by Vahe Yeremyan.'
  const image = product?.images.nodes[0]?.url
  const meta: Array<Record<string, string>> = [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: 'product' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
  ]

  if (image) {
    meta.push({ property: 'og:image', content: image })
  }

  return {
    meta,
    links: [{ rel: 'canonical', href: `/product/${handle}` }],
  }
}

export function getProductCategory(value?: string | null) {
  if (!value) return undefined

  return ARTWORK_CATEGORIES.find(
    (category) => category.label.toLowerCase() === value.toLowerCase(),
  )
}

function productDescription(product: ProductDetail) {
  const details = [
    'Original artwork by Vahe Yeremyan',
    product.medium?.value && `Medium: ${product.medium.value}`,
    product.dimensionsImperial?.value &&
      `Dimensions: ${product.dimensionsImperial.value}`,
    formatProductPrice(product),
  ].filter(Boolean)

  return `${details.join(' • ')}.`
}

function formatProductPrice(product: ProductDetail) {
  const min = product.priceRange.minVariantPrice
  const max = product.priceRange.maxVariantPrice
  const minPrice = formatMoney(min.amount, min.currencyCode)

  if (min.amount === max.amount) return minPrice

  return `${minPrice} - ${formatMoney(max.amount, max.currencyCode)}`
}
