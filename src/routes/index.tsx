import type { ArtworkTheme } from '@/components/home/themes-section'

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { ArtworkGridSection } from '@/components/home/artwork-grid-section'
import { HomeHero } from '@/components/home/home-hero'
import { PartnerLogosSection } from '@/components/home/partner-logos-section'
import { SecurePaymentOptionsSection } from '@/components/home/secure-payments-section'
import { ThemesSection } from '@/components/home/themes-section'
import { Divider } from '@/components/ui/divider'
import { HOME_SEO } from '@/lib/legacy-seo'
import { shopifyProductsToArtworkGridItems } from '@/lib/queries/shopify/artwork-grid'
import { createSeoHead } from '@/lib/seo'
import {
  getHighlightedArtworks,
  getRecentArtworks,
} from '@/server/shopify/catalog.functions'

function highlightedArtworksQueryOptions() {
  return queryOptions({
    queryKey: ['shopify', 'home', 'highlighted-artworks'] as const,
    queryFn: () => getHighlightedArtworks(),
  })
}

function recentArtworksQueryOptions() {
  return queryOptions({
    queryKey: ['shopify', 'home', 'recent-artworks'] as const,
    queryFn: () => getRecentArtworks(),
  })
}

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(highlightedArtworksQueryOptions()),
      context.queryClient.ensureQueryData(recentArtworksQueryOptions()),
    ])
  },
  head: () => createSeoHead(HOME_SEO),
  component: Home,
})

const ARTWORK_THEMES: Array<ArtworkTheme> = [
  {
    id: 'abstract',
    title: 'Abstract',
    categoryHandle: 'abstract',
    imageSrc: '/abstract.webp',
    imageAlt: 'Abstract painting by Vahe Yeremyan',
  },
  {
    id: 'seascape',
    title: 'Seascape',
    categoryHandle: 'seascape',
    imageSrc: '/seascape.webp',
    imageAlt: 'Seascape painting by Vahe Yeremyan',
  },
  {
    id: 'flowers',
    title: 'Flowers',
    categoryHandle: 'flowers',
    imageSrc: '/flowers.webp',
    imageAlt: 'Floral painting by Vahe Yeremyan',
  },
  {
    id: 'landscape',
    title: 'Landscape',
    categoryHandle: 'landscape',
    imageSrc: '/landscape.webp',
    imageAlt: 'Landscape painting by Vahe Yeremyan',
  },
]

function Home() {
  const { data: highlightedArtworkProducts } = useSuspenseQuery(
    highlightedArtworksQueryOptions(),
  )
  const { data: recentArtworkProducts } = useSuspenseQuery(
    recentArtworksQueryOptions(),
  )
  const highlightedArtworks = shopifyProductsToArtworkGridItems(
    highlightedArtworkProducts,
  )
  const recentArtworks = shopifyProductsToArtworkGridItems(
    recentArtworkProducts,
  )

  return (
    <main className="-mt-(--header-height) pb-2">
      <HomeHero />

      {highlightedArtworks.length > 0 && (
        <>
          <ArtworkGridSection
            title="Highlighted Artworks"
            artworks={highlightedArtworks}
          />
          <Divider className="my-6 md:my-10" />
        </>
      )}

      {recentArtworks.length > 0 && (
        <>
          <ArtworkGridSection
            title="Recently Added"
            artworks={recentArtworks}
          />
          <Divider className="my-6 md:my-10" />
        </>
      )}

      <ThemesSection themes={ARTWORK_THEMES} />

      <Divider className="my-6 md:my-10" />

      <PartnerLogosSection />

      <Divider className="my-6 md:my-10" />

      <SecurePaymentOptionsSection />
    </main>
  )
}
