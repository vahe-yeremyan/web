import type { ProductDetail } from '@/lib/queries/shopify/queries'

import { Link } from '@tanstack/react-router'

import { getProductCategory } from '@/lib/queries/shopify/product-detail'

type ProductMetadataProps = {
  product: ProductDetail
}

export function ProductMetadata({ product }: ProductMetadataProps) {
  const category = getProductCategory(product.category?.value)
  const dimensions = [
    product.dimensionsImperial?.value,
    product.dimensionsMetric?.value,
  ].filter(Boolean)

  if (!category && !product.medium?.value && dimensions.length === 0) {
    return null
  }

  return (
    <section className="mt-8 space-y-1.5 border-t border-neutral-200 pt-6 text-sm tracking-wide">
      {category && (
        <p className="font-medium">
          Category:{' '}
          <Link
            to="/product-category/$handle"
            params={{ handle: category.handle }}
            className="hover:text-secondary font-normal underline-offset-3 hover:underline"
          >
            {category.label}
          </Link>
        </p>
      )}
      {product.medium?.value && (
        <p className="font-medium">
          Medium:{' '}
          <Link
            to="/shop"
            search={{ medium: [product.medium.value] }}
            className="hover:text-secondary font-normal underline-offset-3 hover:underline"
          >
            {product.medium.value}
          </Link>
        </p>
      )}
      {dimensions.length > 0 && (
        <p className="font-medium">
          Dimensions:{' '}
          <span className="font-normal">{dimensions.join(' | ')}</span>
        </p>
      )}
    </section>
  )
}
