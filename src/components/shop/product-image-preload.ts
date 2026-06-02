import type { ProductDetail } from '@/lib/queries/shopify/queries'

import { useEffect } from 'react'

import {
  shopifyImageSrcSet,
  shopifyImageUrl,
} from '@/lib/queries/shopify/format'
import {
  PRODUCT_IMAGE_SIZES,
  PRODUCT_IMAGE_SRC_SET_WIDTHS,
  PRODUCT_IMAGE_WIDTH,
  ZOOM_PRODUCT_IMAGE_SIZES,
  ZOOM_PRODUCT_IMAGE_SRC_SET_WIDTHS,
  ZOOM_PRODUCT_IMAGE_WIDTH,
} from '@/lib/queries/shopify/product-images'

type ProductImagePreloadOptions = {
  images: ProductDetail['images']['nodes']
  initialIndex: number
  zoomed: boolean
}

type PreloadSettings = {
  sizes: string
  srcSetWidths: ReadonlyArray<number>
  width: number
}

const PRODUCT_PRELOAD_SETTINGS = {
  sizes: PRODUCT_IMAGE_SIZES,
  srcSetWidths: PRODUCT_IMAGE_SRC_SET_WIDTHS,
  width: PRODUCT_IMAGE_WIDTH,
} satisfies PreloadSettings

const ZOOM_PRODUCT_PRELOAD_SETTINGS = {
  sizes: ZOOM_PRODUCT_IMAGE_SIZES,
  srcSetWidths: ZOOM_PRODUCT_IMAGE_SRC_SET_WIDTHS,
  width: ZOOM_PRODUCT_IMAGE_WIDTH,
} satisfies PreloadSettings

export function useProductImagePreload({
  images,
  initialIndex,
  zoomed,
}: ProductImagePreloadOptions) {
  useEffect(() => {
    if (images.length <= 1) return

    const preloadSources = images
      .filter((image, index) => index !== initialIndex && image.url)
      .map((image) => image.url)

    if (preloadSources.length === 0) return

    const settings = zoomed
      ? ZOOM_PRODUCT_PRELOAD_SETTINGS
      : PRODUCT_PRELOAD_SETTINGS
    const preloadedImages: HTMLImageElement[] = []

    if (zoomed) {
      preloadedImages.push(...preloadProductImages(preloadSources, settings))
      return () => {
        preloadedImages.length = 0
      }
    }

    const cancelSchedule = scheduleAfterPageSettles(() => {
      preloadedImages.push(...preloadProductImages(preloadSources, settings))
    })

    return () => {
      cancelSchedule()
      preloadedImages.length = 0
    }
  }, [images, initialIndex, zoomed])
}

function scheduleAfterPageSettles(callback: () => void) {
  let timeoutId: number | undefined
  let idleId: number | undefined

  const runWhenIdle = () => {
    timeoutId = window.setTimeout(() => {
      idleId = window.requestIdleCallback(callback, { timeout: 3000 })
    }, 1000)
  }

  if (document.readyState === 'complete') {
    runWhenIdle()
  } else {
    window.addEventListener('load', runWhenIdle, { once: true })
  }

  return () => {
    window.removeEventListener('load', runWhenIdle)
    if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    if (idleId !== undefined) window.cancelIdleCallback(idleId)
  }
}

function preloadProductImages(
  sources: Array<string>,
  options: PreloadSettings,
) {
  return sources.map((src) => {
    const image = new Image()
    image.decoding = 'async'
    image.fetchPriority = 'low'
    image.sizes = options.sizes
    image.srcset = shopifyImageSrcSet(src, options.srcSetWidths, {
      format: 'webp',
    })
    image.src = shopifyImageUrl(src, {
      width: options.width,
      format: 'webp',
    })
    return image
  })
}
