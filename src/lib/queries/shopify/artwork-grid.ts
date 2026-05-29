import type { HighlightedArtworkProduct, RecentArtworkProduct } from './queries'
import type { ArtworkGridItem } from '@/components/home/artwork-grid-section'
import type { ProductListItem } from '@/lib/queries/shopify/queries'

import { formatMoney, shopifyImageUrl } from './format'

const SHOPIFY_ARTWORK_IMAGE_WIDTHS = [320, 480, 640, 800, 1000]

const ARTWORK_GRID_IMAGE_SIZES =
  '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)'

function getShopifyImageSrcSet(src: string) {
  return SHOPIFY_ARTWORK_IMAGE_WIDTHS.map(
    (width) => `${shopifyImageUrl(src, { width, format: 'webp' })} ${width}w`,
  ).join(', ')
}

export function shopifyProductToArtworkGridItem(
  product: HighlightedArtworkProduct | RecentArtworkProduct,
): ArtworkGridItem {
  const image = product.images.edges.at(0)?.node
  const imageUrl = image?.url

  return {
    id: product.id,
    title: product.title,
    medium: product.medium?.value ?? '',
    dimensions: product.dimensionsImperial?.value ?? '',
    imageSrc: imageUrl
      ? shopifyImageUrl(imageUrl, { width: 800, format: 'webp' })
      : '',
    imageSrcSet: imageUrl ? getShopifyImageSrcSet(imageUrl) : undefined,
    imageSizes: ARTWORK_GRID_IMAGE_SIZES,
    imageAlt: image?.altText ?? product.title,
  }
}

export function shopifyProductsToArtworkGridItems(
  products: Array<HighlightedArtworkProduct | RecentArtworkProduct>,
) {
  return products.map(shopifyProductToArtworkGridItem)
}

export function shopifyProductListItemsToArtworkGridItems(
  products: ReadonlyArray<ProductListItem>,
  options: { showPrice?: boolean } = {},
) {
  return products.map((product) =>
    shopifyProductListItemToArtworkGridItem(product, options),
  )
}

function shopifyProductListItemToArtworkGridItem(
  product: ProductListItem,
  options: { showPrice?: boolean },
): ArtworkGridItem {
  const imageUrl = product.featuredImage?.url

  return {
    id: product.id,
    title: product.title,
    medium: product.medium?.value ?? '',
    dimensions: product.dimensions?.value ?? '',
    imageSrc: imageUrl
      ? shopifyImageUrl(imageUrl, { width: 800, format: 'webp' })
      : '',
    imageSrcSet: imageUrl ? getShopifyImageSrcSet(imageUrl) : undefined,
    imageSizes: ARTWORK_GRID_IMAGE_SIZES,
    imageAlt: product.featuredImage?.altText ?? product.title,
    price: options.showPrice ? formatProductListItemPrice(product) : undefined,
  }
}

function formatProductListItemPrice(product: ProductListItem) {
  const min = product.priceRange.minVariantPrice
  const max = product.priceRange.maxVariantPrice
  const minPrice = formatMoney(min.amount, min.currencyCode)

  if (min.amount === max.amount) return minPrice

  return `${minPrice} - ${formatMoney(max.amount, max.currencyCode)}`
}
