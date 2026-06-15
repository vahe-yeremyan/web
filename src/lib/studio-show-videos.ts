import { STUDIO_SHOW_SEO } from '@/lib/legacy-seo'
import { absoluteSiteUrl } from '@/lib/seo'

const VIDEO_DESCRIPTION =
  'Video from Vahe Yeremyan’s studio, exhibitions, and art shows.'

export const STUDIO_SHOW_VIDEOS = [
  { id: 'iXMLB4k5AS8', title: 'Studio & Show video 1' },
  { id: 'KP6mjtcb1Qg', title: 'Studio & Show video 2' },
  { id: '8gqVNhFgV48', title: 'Studio & Show video 3' },
  { id: 'Eejkuh7eJxQ', title: 'Studio & Show video 4' },
  { id: 'SaaXF8v_nYo', title: 'Studio & Show video 5' },
  { id: 'iMu7wijA06w', title: 'Studio & Show video 6' },
  { id: 'HiS_2d_bwUs', title: 'Studio & Show video 7' },
  { id: 'dhrR9VmXLJw', title: 'Studio & Show video 8' },
] as const

export function youtubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}`
}

export function getStudioShowStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Studio & Show',
    url: absoluteSiteUrl(STUDIO_SHOW_SEO.path),
    description: STUDIO_SHOW_SEO.description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: STUDIO_SHOW_VIDEOS.map((video, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'VideoObject',
          name: video.title,
          description: VIDEO_DESCRIPTION,
          thumbnailUrl: [`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`],
          embedUrl: youtubeEmbedUrl(video.id),
          contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
          publisher: {
            '@type': 'Organization',
            name: 'Vahe Yeremyan’s Personal Gallery',
            url: absoluteSiteUrl('/'),
          },
        },
      })),
    },
  }
}
