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
    <section className="mt-8 space-y-1.5 border-t border-neutral-200 pt-6 tracking-wide">
      {category && (
        <p className="font-semibold">
          Category:{' '}
          <Link
            to="/product-category/$handle"
            params={{ handle: category.handle }}
            className="hover:text-primary-accent font-medium"
          >
            {category.label}
          </Link>
        </p>
      )}
      {product.medium?.value && (
        <p className="font-semibold">
          Medium:{' '}
          <Link
            to="/shop"
            search={{ medium: [product.medium.value] }}
            className="hover:text-primary-accent font-medium"
          >
            {product.medium.value}
          </Link>
        </p>
      )}
      {dimensions.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold">
          <span>Dimensions:</span>
          <span className="font-manrope inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            {dimensions.map((dimension, index) => (
              <span
                key={`${dimension}-${index}`}
                className="inline-flex items-center gap-2 font-normal"
              >
                {index > 0 && (
                  <span aria-hidden="true" className="h-4.5 w-px bg-black" />
                )}
                <span>{dimension}</span>
              </span>
            ))}
          </span>
        </div>
      )}
    </section>
  )
}
