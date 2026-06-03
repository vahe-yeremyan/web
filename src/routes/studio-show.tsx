import { createFileRoute, redirect } from '@tanstack/react-router'

// import { PageHeading } from '@/components/page-heading'
// import { STUDIO_SHOW_SEO } from '@/lib/legacy-seo'
// import { createSeoHead } from '@/lib/seo'

export const Route = createFileRoute('/studio-show')({
  beforeLoad: () => {
    throw redirect({ to: '/about', statusCode: 301 })
  },
  // head: () => createSeoHead(STUDIO_SHOW_SEO),
  // component: StudioShowRoute,
})

// function StudioShowRoute() {
//   return (
//     <main className="pb-20">
//       <PageHeading title="Studio & Show" />
//     </main>
//   )
// }
