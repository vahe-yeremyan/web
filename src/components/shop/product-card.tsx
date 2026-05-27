import type { ProductListItem } from '@/lib/queries/shopify/queries'

import { Link } from '@tanstack/react-router'

import { Money } from '@/components/shop/money'
import { ShopImage } from '@/components/shop/shop-image'

type ProductCardProps = {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = product.priceRange.minVariantPrice
  const maxPrice = product.priceRange.maxVariantPrice
  const compareAt = product.compareAtPriceRange.minVariantPrice
  const onSale =
    Number(compareAt.amount) > 0 &&
    Number(compareAt.amount) > Number(minPrice.amount)
  const soldOut = !product.variants.nodes.some((v) => v.availableForSale)

  return (
    <Link
      to="/shop/products/$handle"
      params={{ handle: product.handle }}
      className="group flex flex-col gap-3 text-[--storefront-fg] no-underline"
    >
      <div
        className="relative overflow-hidden bg-[--storefront-line]"
        style={{
          aspectRatio: '4 / 5',
          borderRadius: 'var(--storefront-radius)',
        }}
      >
        <ShopImage
          src={product.featuredImage?.url}
          alt={product.featuredImage?.altText ?? product.title}
          width={600}
          height={750}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {soldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-[--storefront-bg]/90 px-2.5 py-1 text-xs font-medium tracking-wide uppercase">
            Sold out
          </span>
        )}
        {!soldOut && onSale && (
          <span className="absolute top-3 left-3 rounded-full bg-[--storefront-accent] px-2.5 py-1 text-xs font-medium tracking-wide text-[--storefront-accent-fg] uppercase">
            Sale
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm leading-snug font-medium">{product.title}</h3>
        <p className="text-sm text-[--storefront-fg-muted]">
          {onSale && (
            <span className="mr-2 line-through">
              <Money
                amount={compareAt.amount}
                currencyCode={compareAt.currencyCode}
              />
            </span>
          )}
          <Money
            amount={minPrice.amount}
            currencyCode={minPrice.currencyCode}
          />
          {Number(maxPrice.amount) > Number(minPrice.amount) && (
            <>
              {' – '}
              <Money
                amount={maxPrice.amount}
                currencyCode={maxPrice.currencyCode}
              />
            </>
          )}
        </p>
      </div>
    </Link>
  )
}
