import type { AboutArtistImage } from '@/lib/queries/sanity/about'

type ArtistImageGridProps = {
  images?: Array<AboutArtistImage>
}

const PORTRAIT_IMAGE_SIZES =
  '(min-width: 1024px) 15vw, (min-width: 640px) 28vw, 30vw'
const LANDSCAPE_IMAGE_SIZES =
  '(min-width: 1024px) 45vw, (min-width: 640px) 84vw, calc(100vw - 2rem)'

export function ArtistImageGrid({ images }: ArtistImageGridProps) {
  const visibleImages = images?.filter((image) => image.src) ?? []
  if (visibleImages.length === 0) return null

  const portraitImages = visibleImages
    .filter((image) => !isLandscapeImage(image))
    .slice(0, 3)
  const landscapeImage =
    visibleImages.find((image) => isLandscapeImage(image)) ??
    visibleImages.at(3)

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {portraitImages.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="relative aspect-3/4 overflow-hidden rounded-sm bg-neutral-100"
          >
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={PORTRAIT_IMAGE_SIZES}
              alt={image.alt}
              width="540"
              height="720"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {landscapeImage ? (
        <div className="relative aspect-2.25/1 overflow-hidden rounded-sm bg-neutral-100">
          <img
            src={landscapeImage.src}
            srcSet={landscapeImage.srcSet}
            sizes={LANDSCAPE_IMAGE_SIZES}
            alt={landscapeImage.alt}
            width="1440"
            height="720"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  )
}

function isLandscapeImage(image: AboutArtistImage) {
  return Boolean(image.aspectRatio && image.aspectRatio >= 1)
}
