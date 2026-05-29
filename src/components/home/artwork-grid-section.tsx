import { HomeSectionTitle } from './home-section-title'

export type ArtworkGridItem = {
  id: string
  title: string
  medium?: string
  dimensions?: string
  price?: string
  imageSrc?: string
  imageSrcSet?: string
  imageSizes?: string
  imageAlt: string
}

type ArtworkGridSectionProps = {
  title: string
  artworks: Array<ArtworkGridItem>
  hideTitle?: boolean
}

const ARTWORK_GRID_IMAGE_SIZES =
  '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)'

function ArtworkImage({ artwork }: { artwork: ArtworkGridItem }) {
  if (!artwork.imageSrc) {
    return (
      <div aria-hidden className="h-full w-full rounded-[2px] bg-neutral-100" />
    )
  }

  return (
    <img
      src={artwork.imageSrc}
      srcSet={artwork.imageSrcSet}
      alt={artwork.imageAlt}
      loading="lazy"
      decoding="async"
      sizes={artwork.imageSizes ?? ARTWORK_GRID_IMAGE_SIZES}
      className="block max-h-full max-w-full rounded-[2px] object-contain"
    />
  )
}

export function ArtworkGridSection({
  title,
  artworks,
  hideTitle = false,
}: ArtworkGridSectionProps) {
  return (
    <section className={hideTitle ? undefined : 'mt-20'}>
      {!hideTitle && <HomeSectionTitle>{title}</HomeSectionTitle>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
        {artworks.map((artwork) => (
          <article key={artwork.id} className="min-w-0">
            <div className="aspect-square overflow-hidden rounded-md border border-neutral-200/60 bg-neutral-50/75 p-4 sm:p-5">
              <div className="flex h-full w-full items-center justify-center">
                <ArtworkImage artwork={artwork} />
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-left">
              <h3 className="text-base font-semibold">{artwork.title}</h3>

              {artwork.medium && artwork.dimensions && (
                <div className="leading-wide space-y-1 text-xs text-neutral-600">
                  <p>{artwork.medium}</p>
                  <p>{artwork.dimensions}</p>
                </div>
              )}

              {artwork.price && (
                <p className="text-sm text-neutral-500">{artwork.price}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
