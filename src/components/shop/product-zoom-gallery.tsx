import type { ProductDetail } from '@/lib/queries/shopify/queries'

import { useEffect } from 'react'

import { X } from 'lucide-react'

import { ProductImageCarousel } from './product-image-carousel'

type ZoomedProductGalleryProps = {
  images: ProductDetail['images']['nodes']
  title: string
  open: boolean
  initialIndex: number
  onOpenChange: (open: boolean) => void
}

export function ZoomedProductGallery({
  images,
  title,
  open,
  initialIndex,
  onOpenChange,
}: ZoomedProductGalleryProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onOpenChange, open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} enlarged image gallery`}
      className="fixed inset-0 z-100 flex bg-black"
    >
      <ProductImageCarousel
        images={images}
        title={title}
        initialIndex={initialIndex}
        zoomed
      />
      <button
        type="button"
        aria-label="Close image gallery"
        onClick={() => {
          onOpenChange(false)
        }}
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        <X className="size-5" />
      </button>
    </div>
  )
}
