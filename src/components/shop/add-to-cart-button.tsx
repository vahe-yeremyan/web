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
}

export function AddToCartButton({
  product,
  variant,
  quantity = 1,
}: AddToCartButtonProps) {
  const { mutate, isPending } = useAddToCart()
  const disabled = !variant || !variant.availableForSale || isPending
  const buttonText = !variant
    ? 'Select options'
    : !variant.availableForSale
      ? 'Sold out'
      : isPending
        ? 'Adding...'
        : 'Add to cart'

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={`Add ${product.title} to cart`}
      aria-busy={isPending}
      onClick={() => {
        if (!variant) return
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
        'w-full cursor-pointer rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out active:scale-[0.99] md:w-fit md:px-12',
        disabled
          ? 'cursor-not-allowed bg-white text-gray-600 ring ring-gray-300 active:scale-100'
          : 'bg-black text-white hover:bg-[#910000]',
      )}
    >
      {buttonText}
    </button>
  )
}
