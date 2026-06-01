import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeading } from '@/components/page-heading'
import { CredentialSections } from '@/components/sanity/credential-sections'
import { SanityPortableText } from '@/components/sanity/portable-text'
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
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.about.title }] : [],
  }),
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

          <img
            src="/location.webp"
            alt="Vahe Yeremyan gallery location"
            width="600"
            height="400"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1536px) 680px, (min-width: 1280px) 560px, (min-width: 1024px) 45vw, calc(100vw - 2rem)"
            className="aspect-3/2 w-full rounded-2xl object-cover"
          />
        </div>

        <CredentialSections sections={about.credentialSections} />
      </article>
    </main>
  )
}
