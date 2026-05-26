import type { ArtworkGridItem } from '@/components/home/artwork-grid-section'
import type { ArtworkTheme } from '@/components/home/themes-section'

import { createFileRoute } from '@tanstack/react-router'

import { ArtworkGridSection } from '@/components/home/artwork-grid-section'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { ThemesSection } from '@/components/home/themes-section'

export const Route = createFileRoute('/')({
  component: Home,
})

const HIGHLIGHTED_ARTWORKS: Array<ArtworkGridItem> = Array.from(
  { length: 4 },
  (_, index) => ({
    id: `highlighted-lilies-${index + 1}`,
    title: 'Lilies',
    medium: 'Oil on Canvas (HARDCODED)',
    dimensions: '70 x 70 x 1.5 in (HARDCODED)',
    imageSrc: '/lilies1.jpg',
    imageAlt: 'Lilies artwork by Vahe Yeremyan',
  }),
)

const RECENT_ARTWORKS: Array<ArtworkGridItem> = Array.from(
  { length: 4 },
  (_, index) => ({
    id: `recent-trees-${index + 1}`,
    title: 'Trees',
    medium: 'Oil on Canvas (HARDCODED)',
    dimensions: '70 x 70 x 1.5 in (HARDCODED)',
    imageSrc: '/art.jpg',
    imageAlt: 'Trees artwork by Vahe Yeremyan',
  }),
)

const ARTWORK_THEMES: Array<ArtworkTheme> = [
  {
    id: 'abstract',
    title: 'Abstract',
    imageSrc: '/abstract.jpg',
    imageAlt: 'Abstract painting by Vahe Yeremyan',
  },
  {
    id: 'seascape',
    title: 'Seascape',
    imageSrc: '/seascape.jpg',
    imageAlt: 'Seascape painting by Vahe Yeremyan',
  },
  {
    id: 'flowers',
    title: 'Flowers',
    imageSrc: '/flowers.jpg',
    imageAlt: 'Floral painting by Vahe Yeremyan',
  },
  {
    id: 'landscape',
    title: 'Landscape',
    imageSrc: '/landscape.jpg',
    imageAlt: 'Landscape painting by Vahe Yeremyan',
  },
]

function Home() {
  return (
    <main className="py-2">
      <HeroCarousel />

      <section>
        <p className="mt-14 mb-4 text-center text-[2.125rem] font-semibold tracking-tight">
          Welcome to Vahe Yeremyan's Personal Gallery
        </p>

        <p className="mx-auto max-w-4/5 text-center text-lg font-medium text-pretty lg:max-w-[45%]">
          I hope you enjoy the tour and discover a painting that truly moves
          you. Painting is the essence of my emotions, inspiration, and life; it
          is as natural to me as breathing. Through my art, I seek to capture
          the tranquility of nature, the vastness of the sky, and the soothing
          beauty of landscapes, fruits, and light-filled meadows.
        </p>
      </section>

      <ArtworkGridSection
        title="Highlighted Artworks"
        artworks={HIGHLIGHTED_ARTWORKS}
      />

      <ArtworkGridSection title="Recently Added" artworks={RECENT_ARTWORKS} />

      <ThemesSection themes={ARTWORK_THEMES} />
    </main>
  )
}
