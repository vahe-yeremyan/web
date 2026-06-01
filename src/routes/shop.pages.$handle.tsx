import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { getPage } from '@/server/shopify/catalog.functions'

function pageQueryOptions(handle: string) {
  return queryOptions({
    queryKey: ['shopify', 'page', handle] as const,
    queryFn: () => getPage({ data: { handle } }),
  })
}

export const Route = createFileRoute('/shop/pages/$handle')({
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(
      pageQueryOptions(params.handle),
    )
    if (!page) throw notFound()
    return { page }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.page.seo?.title || loaderData.page.title },
          {
            name: 'description',
            content:
              loaderData.page.seo?.description || loaderData.page.bodySummary,
          },
        ]
      : [],
  }),
  component: PageRoute,
})

function PageRoute() {
  const { handle } = Route.useParams()
  const { data: page } = useSuspenseQuery(pageQueryOptions(handle))

  if (!page) return null

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-medium tracking-tight">{page.title}</h1>
      <div
        className="shop-prose"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </article>
  )
}
