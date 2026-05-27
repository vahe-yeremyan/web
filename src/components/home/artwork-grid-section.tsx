import { HomeSectionTitle } from './home-section-title'

export type ArtworkGridItem = {
  id: string
  title: string
  medium?: string
  dimensions?: string
  imageSrc?: string
  imageSrcSet?: string
  imageSizes?: string
  imageAlt: string
}

type ArtworkGridSectionProps = {
  title: string
  artworks: Array<ArtworkGridItem>
}

const ARTWORK_GRID_IMAGE_SIZES =
  '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)'

export function ArtworkGridSection({
  title,
  artworks,
}: ArtworkGridSectionProps) {
  return (
    <section className="mt-20">
      <HomeSectionTitle>{title}</HomeSectionTitle>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {artworks.map((artwork) => (
          <article key={artwork.id} className="min-w-0">
            <div className="aspect-square overflow-hidden rounded-2xl border border-neutral-200/60 bg-[linear-gradient(180deg,#fdfdfc_0%,#fbfbfa_58%,#f8f8f7_100%)] p-4 sm:p-5">
              <div className="flex h-full w-full items-center justify-center">
                {artwork.imageSrc ? (
                  <img
                    src={artwork.imageSrc}
                    srcSet={artwork.imageSrcSet}
                    alt={artwork.imageAlt}
                    loading="lazy"
                    decoding="async"
                    sizes={artwork.imageSizes ?? ARTWORK_GRID_IMAGE_SIZES}
                    className="block max-h-full max-w-full rounded-[2px] object-contain"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="h-full w-full rounded-[2px] bg-neutral-100"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 space-y-1 text-center">
              <h3 className="text-base font-semibold">{artwork.title}</h3>
              {artwork.medium && (
                <p className="text-sm text-neutral-600">{artwork.medium}</p>
              )}
              {artwork.dimensions && (
                <p className="text-sm text-neutral-600">{artwork.dimensions}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
