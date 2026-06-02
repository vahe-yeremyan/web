import { HeroCarousel } from './hero-carousel'

export function HomeHero() {
  return (
    <div className="relative left-1/2 ml-[-50vw] w-screen">
      <HeroCarousel className="h-[calc(100dvh-var(--header-height))] rounded-none 2xl:mt-0" />

      <div
        aria-hidden="true"
        className="hero-readability-gradient pointer-events-none absolute inset-0 z-10"
      />

      <section className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-(--content-px) text-white">
        <div className="max-w-3xl text-center">
          <p className="font-playfair mb-4 text-[3rem] font-semibold">
            Welcome to Vahe Yeremyan's
            <br />
            Personal Gallery
          </p>
        </div>
      </section>
    </div>
  )
}
