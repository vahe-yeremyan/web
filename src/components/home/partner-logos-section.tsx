const PARTNER_LOGOS = [
  {
    src: '/artsy-logo.png',
    alt: 'Artsy',
    width: 800,
    height: 276,
    className: 'h-9 w-auto md:h-10',
  },
  {
    src: '/1st-dibs-logo.jpg',
    alt: '1stDibs',
    width: 1024,
    height: 512,
    className: 'h-10 w-auto md:h-11',
  },
  {
    src: '/liveauctioneers-logo.png',
    alt: 'LiveAuctioneers',
    width: 600,
    height: 79,
    className: 'h-6 w-auto md:h-7',
  },
] as const

export function PartnerLogosSection() {
  return (
    <section className="my-6 md:my-10">
      <h3 className="featured-headline text-center md:text-2xl!">
        Partnered With
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {PARTNER_LOGOS.map((logo) => (
          <img
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            decoding="async"
            className={logo.className}
          />
        ))}
      </div>
    </section>
  )
}
