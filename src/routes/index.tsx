import { createFileRoute } from '@tanstack/react-router'

import { HERO_IMAGES, HeroCarousel } from '@/components/home/hero-carousel'

export const Route = createFileRoute('/')({
  head: () => ({
    links: HERO_IMAGES.slice(0, 5).map((image) => ({
      rel: 'preload',
      as: 'image',
      href: image.src,
    })),
  }),
  component: Home,
})

function Home() {
  return (
    <main className="py-2">
      <HeroCarousel />

      <p className="mt-14 mb-4 text-center text-[2.125rem] font-semibold tracking-tight">
        Welcome to Vahe Yeremyan's Personal Gallery
      </p>

      <p className="mx-auto max-w-4/5 text-center text-lg font-medium text-pretty lg:max-w-[45%]">
        I hope you enjoy the tour and discover a painting that truly moves you.
        Painting is the essence of my emotions, inspiration, and life; it is as
        natural to me as breathing. Through my art, I seek to capture the
        tranquility of nature, the vastness of the sky, and the soothing beauty
        of landscapes, fruits, and light-filled meadows.
      </p>
    </main>
  )
}
