import type { ArtworkGridItem } from './artwork-grid-item'

import { Link } from '@tanstack/react-router'

import { ArtworkImage } from './artwork-image'
import { ArtworkLink } from './artwork-link'
import { HomeSectionTitle } from './home-section-title'

export type { ArtworkGridItem } from './artwork-grid-item'

type ArtworkGridSectionProps = {
  title: string
  artworks: Array<ArtworkGridItem>
  hideTitle?: boolean
  priorityCount?: number
}

export function ArtworkGridSection({
  title,
  artworks,
  hideTitle = false,
  priorityCount = 0,
}: ArtworkGridSectionProps) {
  return (
    <section className={hideTitle ? undefined : 'my-6 md:my-10'}>
      {!hideTitle && <HomeSectionTitle>{title}</HomeSectionTitle>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {artworks.map((artwork, index) => (
          <article key={artwork.id} className="min-w-0">
            <ArtworkLink
              artwork={artwork}
              className="relative block aspect-9/8 overflow-hidden rounded-md border border-neutral-200/60 bg-neutral-50/75"
            >
              <ArtworkImage
                artwork={artwork}
                priority={index < priorityCount}
              />
            </ArtworkLink>

            <div className="mt-2 space-y-1.5 text-left md:mt-4">
              <h3 className="text-base font-semibold">
                {artwork.productHandle ? (
                  <Link
                    to="/product/$handle"
                    params={{ handle: artwork.productHandle }}
                    className="hover:text-primary-accent transition-colors"
                  >
                    {artwork.title}
                  </Link>
                ) : (
                  artwork.title
                )}
              </h3>

              {artwork.medium && artwork.dimensions && (
                <div className="font-manrope leading-wide space-y-1 text-xs text-neutral-600">
                  <p>{artwork.medium}</p>
                  <p>{artwork.dimensions}</p>
                </div>
              )}

              {(artwork.price || artwork.status) && (
                <p className="font-manrope inline-flex items-center gap-1 text-sm text-neutral-500">
                  {artwork.price}
                  {artwork.status && (
                    <>
                      <span>•</span>
                      <span className="text-rose-600">{artwork.status}</span>
                    </>
                  )}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
