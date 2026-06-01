import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { getShopPolicy } from '@/server/shopify/catalog.functions'

function policyQueryOptions(handle: string) {
  return queryOptions({
    queryKey: ['shopify', 'policy', handle] as const,
    queryFn: () => getShopPolicy({ data: { handle } }),
  })
}

export const Route = createFileRoute('/shop/policies/$handle')({
  loader: async ({ context, params }) => {
    const policy = await context.queryClient.ensureQueryData(
      policyQueryOptions(params.handle),
    )
    if (!policy) throw notFound()
    return { policy }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.policy.title }] : [],
  }),
  component: PolicyRoute,
})

function PolicyRoute() {
  const { handle } = Route.useParams()
  const { data: policy } = useSuspenseQuery(policyQueryOptions(handle))

  if (!policy) return null

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-medium tracking-tight">{policy.title}</h1>
      <div
        className="shop-prose"
        dangerouslySetInnerHTML={{ __html: policy.body }}
      />
    </article>
  )
}
