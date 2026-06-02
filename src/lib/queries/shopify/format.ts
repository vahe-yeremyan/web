/**
 * Browser-safe formatting helpers for Shopify Storefront API responses.
 * Framework-free — no React, no provider context required.
 */

export function formatMoney(amount: string | number, currencyCode: string) {
  const value = typeof amount === 'string' ? Number(amount) : amount
  const parts = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(value)

  return parts
    .map((part, index) => {
      if (part.type !== 'currency') return part.value

      const previousPart = index > 0 ? parts[index - 1] : undefined
      const nextPart = index < parts.length - 1 ? parts[index + 1] : undefined
      const hasAdjacentAmount =
        previousPart?.type === 'integer' || nextPart?.type === 'integer'

      return hasAdjacentAmount ? `${part.value}\u200a` : part.value
    })
    .join('')
}

type ShopifyImageOptions = {
  width?: number
  height?: number
  format?: 'webp' | 'jpg' | 'png'
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

/**
 * Append Shopify CDN transform parameters to a product image URL.
 * Shopify's CDN serves resized/reformatted versions automatically.
 */
export function shopifyImageUrl(url: string, opts: ShopifyImageOptions = {}) {
  const u = new URL(url)
  if (opts.width) u.searchParams.set('width', String(opts.width))
  if (opts.height) u.searchParams.set('height', String(opts.height))
  if (opts.format) u.searchParams.set('format', opts.format)
  if (opts.crop) u.searchParams.set('crop', opts.crop)
  return u.toString()
}

export function shopifyImageSrcSet(
  url: string,
  widths: ReadonlyArray<number>,
  opts: Omit<ShopifyImageOptions, 'width'> = {},
) {
  return widths
    .map((width) => `${shopifyImageUrl(url, { ...opts, width })} ${width}w`)
    .join(', ')
}
