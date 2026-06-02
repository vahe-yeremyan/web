import type {
  ProductDetail,
  ProductDetailVariant,
} from '@/lib/queries/shopify/queries'

import { useAddToCart } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'

type AddToCartButtonProps = {
  product: ProductDetail
  variant: ProductDetailVariant | undefined
  quantity?: number
  sold?: boolean
}

function getButtonText({
  sold,
  variant,
  isPending,
}: {
  sold: boolean
  variant: ProductDetailVariant | undefined
  isPending: boolean
}) {
  if (sold) return 'Sold'
  if (!variant) return 'Select options'
  if (!variant.availableForSale) return 'Sold'
  if (isPending) return 'Adding...'
  return 'Add to bag'
}

function getAriaLabel(product: ProductDetail, sold: boolean) {
  if (sold) return `${product.title} is sold`
  return `Add ${product.title} to bag`
}

export function AddToCartButton({
  product,
  variant,
  quantity = 1,
  sold = false,
}: AddToCartButtonProps) {
  const { mutate, isPending } = useAddToCart()
  const disabled = sold || !variant || !variant.availableForSale || isPending
  const buttonText = getButtonText({ sold, variant, isPending })
  const ariaLabel = getAriaLabel(product, sold)

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-busy={isPending}
      onClick={() => {
        if (disabled) return
        mutate({
          variantId: variant.id,
          quantity,
          line: {
            productTitle: product.title,
            productHandle: product.handle,
            variantTitle: variant.title,
            price: variant.price,
            image: variant.image ?? product.images.nodes.at(0) ?? null,
            selectedOptions: variant.selectedOptions,
          },
        })
      }}
      className={cn(
        'w-full cursor-pointer rounded-full px-6 py-3 font-semibold tracking-wide transition-all duration-200 ease-in-out active:scale-[0.99] md:w-fit md:px-12',
        disabled &&
          'cursor-not-allowed bg-white text-gray-600 ring ring-gray-300 active:scale-100',
        !disabled && 'hover:bg-primary-accent bg-black text-white',
      )}
    >
      {buttonText}
    </button>
  )
}
