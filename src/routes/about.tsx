import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeading } from '@/components/page-heading'
import { ArtistImageGrid } from '@/components/sanity/artist-image-grid'
import { CredentialSections } from '@/components/sanity/credential-sections'
import { SanityPortableText } from '@/components/sanity/portable-text'
import { SocialLinks } from '@/components/social-links'
import { ABOUT_SEO } from '@/lib/legacy-seo'
import { createSeoHead } from '@/lib/seo'
import { getAbout } from '@/server/sanity/about.functions'

function aboutQueryOptions() {
  return queryOptions({
    queryKey: ['sanity', 'about'] as const,
    queryFn: () => getAbout(),
  })
}

export const Route = createFileRoute('/about')({
  loader: async ({ context }) => {
    const about = await context.queryClient.ensureQueryData(aboutQueryOptions())
    if (!about) throw notFound()
    return { about }
  },
  head: () => createSeoHead(ABOUT_SEO),
  component: AboutRoute,
})

function AboutRoute() {
  const { data: about } = useSuspenseQuery(aboutQueryOptions())
  if (!about) throw notFound()

  return (
    <main className="pb-20">
      <PageHeading title="About" />
      <article>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.8fr)] lg:items-center xl:gap-14">
          <div className="max-w-3xl space-y-5 text-lg leading-8 text-neutral-700">
            <SanityPortableText value={about.body} />
          </div>

          <div className="space-y-5">
            <ArtistImageGrid images={about.artistImages} />
            <SocialLinks className="justify-center" />
          </div>
        </div>

        <section
          id="contact"
          className="scroll-mt-28 pt-12 text-base leading-8 text-neutral-700"
        >
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Contact
          </h2>
          <div className="max-w-3xl space-y-5">
            <p>
              <a
                href="mailto:fineart@vaheyeremyan.com"
                className="hover:text-primary-accent font-semibold text-black transition-colors"
              >
                fineart@vaheyeremyan.com
              </a>
            </p>
            <p className="font-medium text-pretty">
              Thanks for your interest in my personal gallery.<br></br>
              Please reach out if you have any questions and I will respond as
              soon as possible.
            </p>
          </div>
        </section>

        <CredentialSections sections={about.credentialSections} />
      </article>
    </main>
  )
}
