import { HomeSectionTitle } from './home-section-title'

export type ArtworkTheme = {
  id: string
  title: string
  imageSrc: string
  imageSrcSet?: string
  imageSizes?: string
  imageAlt: string
}

type ThemesSectionProps = {
  themes: Array<ArtworkTheme>
}

const THEME_IMAGE_SIZES =
  '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)'

export function ThemesSection({ themes }: ThemesSectionProps) {
  return (
    <section className="mt-20">
      <HomeSectionTitle>Explore Themes</HomeSectionTitle>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((theme) => (
          <article key={theme.id} className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
              <img
                src={theme.imageSrc}
                srcSet={theme.imageSrcSet}
                alt={theme.imageAlt}
                loading="lazy"
                decoding="async"
                sizes={theme.imageSizes ?? THEME_IMAGE_SIZES}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/45 via-black/20 to-transparent pt-16 pb-4 pl-4">
                <h3 className="text-[1.25rem] font-semibold text-white">
                  {theme.title}
                </h3>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
