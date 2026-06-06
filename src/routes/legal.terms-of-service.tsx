import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeading } from '@/components/page-heading'
import { SanityPortableText } from '@/components/sanity/portable-text'
import { createSeoHead } from '@/lib/seo'
import { formatDateLong } from '@/lib/utils'
import { getLegalPage } from '@/server/sanity/legal.functions'

const SLUG = 'terms-of-service'

function legalPageQueryOptions() {
  return queryOptions({
    queryKey: ['sanity', 'legal', SLUG] as const,
    queryFn: () => getLegalPage({ data: { slug: SLUG } }),
  })
}

export const Route = createFileRoute('/legal/terms-of-service')({
  loader: async ({ context }) => {
    const page = await context.queryClient.ensureQueryData(
      legalPageQueryOptions(),
    )
    if (!page) throw notFound()
    return { page }
  },
  head: ({ loaderData }) =>
    createSeoHead({
      title:
        loaderData?.page.seo?.title ??
        loaderData?.page.title ??
        'Terms of Service',
      description: loaderData?.page.seo?.description,
      path: '/legal/terms-of-service',
    }),
  component: TermsOfServiceRoute,
})

function TermsOfServiceRoute() {
  const { data: page } = useSuspenseQuery(legalPageQueryOptions())
  if (!page) throw notFound()

  return (
    <main className="pb-20">
      <div className="mx-auto max-w-3xl">
        <PageHeading title={page.title} />
        <p className="mb-8 text-sm font-medium text-neutral-500">
          Last updated: {formatDateLong(page.lastUpdated)}
        </p>
        <div className="space-y-5">
          <SanityPortableText value={page.body} />
        </div>
      </div>
    </main>
  )
}
