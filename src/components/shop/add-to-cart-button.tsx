import type {
  ProductDetail,
  ProductDetailVariant,
} from '@/lib/queries/shopify/queries'

import { toast } from 'sonner'

import { useAddToCart, useCart } from '@/hooks/use-cart'
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
  isInBag,
}: {
  sold: boolean
  variant: ProductDetailVariant | undefined
  isPending: boolean
  isInBag: boolean
}) {
  if (sold) return 'Sold'
  if (!variant) return 'Select options'
  if (!variant.availableForSale) return 'Sold'
  if (isPending) return 'Adding...'
  if (isInBag) return 'In bag'
  return 'Add to bag'
}

function getAriaLabel(product: ProductDetail, sold: boolean, isInBag: boolean) {
  if (sold) return `${product.title} is sold`
  if (isInBag) return `${product.title} is already in your bag`
  return `Add ${product.title} to bag`
}

export function AddToCartButton({
  product,
  variant,
  quantity = 1,
  sold = false,
}: AddToCartButtonProps) {
  const { mutate, isPending } = useAddToCart()
  const { cart } = useCart()
  const isInBag = variant
    ? (cart?.lines.nodes.some((line) => line.merchandise.id === variant.id) ??
      false)
    : false
  const disabled =
    sold || !variant || !variant.availableForSale || isPending || isInBag
  const buttonText = getButtonText({ sold, variant, isPending, isInBag })
  const ariaLabel = getAriaLabel(product, sold, isInBag)

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-busy={isPending}
      onClick={() => {
        if (disabled) return
        mutate(
          {
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
          },
          {
            onSuccess: () => {
              toast.success(`${product.title} added to your bag`)
            },
            onError: () => {
              toast.error("We couldn't add this to your bag. Please try again.")
            },
          },
        )
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
