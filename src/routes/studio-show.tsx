import { createFileRoute } from '@tanstack/react-router'

import { PageHeading } from '@/components/page-heading'
import { STUDIO_SHOW_SEO } from '@/lib/legacy-seo'
import { createSeoHead } from '@/lib/seo'
import {
  STUDIO_SHOW_VIDEOS,
  getStudioShowStructuredData,
  youtubeEmbedUrl,
} from '@/lib/studio-show-videos'

export const Route = createFileRoute('/studio-show')({
  head: studioShowHead,
  component: StudioShowRoute,
})

function studioShowHead() {
  return {
    ...createSeoHead(STUDIO_SHOW_SEO),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(getStudioShowStructuredData()),
      },
    ],
  }
}

function StudioShowRoute() {
  return (
    <main className="pb-20">
      <PageHeading title="Studio & Show" />
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
        {STUDIO_SHOW_VIDEOS.map((video) => (
          <iframe
            key={video.id}
            src={youtubeEmbedUrl(video.id)}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="aspect-video w-full border-0 bg-neutral-100"
          />
        ))}
      </div>
    </main>
  )
}
