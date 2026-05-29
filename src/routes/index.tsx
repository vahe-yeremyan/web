import type { ArtworkTheme } from '@/components/home/themes-section'

import { createFileRoute } from '@tanstack/react-router'

import { ArtworkGridSection } from '@/components/home/artwork-grid-section'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { ThemesSection } from '@/components/home/themes-section'
import {
  AmexIcon,
  ApplePayIcon,
  GooglePayIcon,
  MastercardIcon,
  PaypalIcon,
  VisaIcon,
} from '@/components/icons/PaymentIcons'
import { Divider } from '@/components/ui/divider'
import { shopifyProductsToArtworkGridItems } from '@/lib/queries/shopify/artwork-grid'
import {
  getHighlightedArtworks,
  getRecentArtworks,
} from '@/server/shopify/catalog.functions'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [highlightedArtworkProducts, recentArtworkProducts] =
      await Promise.all([getHighlightedArtworks(), getRecentArtworks()])

    return {
      highlightedArtworks: shopifyProductsToArtworkGridItems(
        highlightedArtworkProducts,
      ),
      recentArtworks: shopifyProductsToArtworkGridItems(recentArtworkProducts),
    }
  },
  component: Home,
})

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
  const { highlightedArtworks, recentArtworks } = Route.useLoaderData()

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

      <Divider className="mt-16 md:mt-20" />

      {highlightedArtworks.length > 0 && (
        <>
          <ArtworkGridSection
            title="Highlighted Artworks"
            artworks={highlightedArtworks}
          />
          <Divider className="mt-16 md:mt-20" />
        </>
      )}

      {recentArtworks.length > 0 && (
        <>
          <ArtworkGridSection
            title="Recently Added"
            artworks={recentArtworks}
          />
          <Divider className="mt-16 md:mt-20" />
        </>
      )}

      <ThemesSection themes={ARTWORK_THEMES} />

      <Divider className="mt-16 md:mt-20" />

      <section className="mt-20">
        <h3 className="featured-headline text-center md:text-2xl!">
          Secure Payment Options
        </h3>
        <div className="flex items-center justify-center gap-4">
          <VisaIcon />
          <AmexIcon />
          <PaypalIcon />
          <MastercardIcon />
          <ApplePayIcon />
          <GooglePayIcon />
        </div>
      </section>
    </main>
  )
}
