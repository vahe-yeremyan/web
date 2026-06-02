import { createFileRoute } from '@tanstack/react-router'

import { PageHeading } from '@/components/page-heading'

export const Route = createFileRoute('/legal/terms-of-service')({
  head: () => ({
    meta: [
      {
        title: 'Terms of Service',
      },
    ],
  }),
  component: TermsOfServiceRoute,
})

function TermsOfServiceRoute() {
  return (
    <main className="pb-20">
      <PageHeading title="Terms of Service" />
      <p className="max-w-3xl text-lg leading-8 text-neutral-700">
        Terms of service details will be added here.
      </p>
    </main>
  )
}
