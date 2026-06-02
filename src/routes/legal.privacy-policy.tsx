import { createFileRoute } from '@tanstack/react-router'

import { PageHeading } from '@/components/page-heading'

export const Route = createFileRoute('/legal/privacy-policy')({
  head: () => ({
    meta: [
      {
        title: 'Privacy Policy',
      },
    ],
  }),
  component: PrivacyPolicyRoute,
})

function PrivacyPolicyRoute() {
  return (
    <main className="pb-20">
      <PageHeading title="Privacy Policy" />
      <p className="max-w-3xl text-lg leading-8 text-neutral-700">
        Privacy policy details will be added here.
      </p>
    </main>
  )
}
