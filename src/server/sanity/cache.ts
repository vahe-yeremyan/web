import { setResponseHeaders } from '@tanstack/react-start/server'

/**
 * Edge-cache headers for read-only Sanity content (hero, about, etc.).
 *
 * Browsers always revalidate (`max-age=0`), but Cloudflare's edge serves the
 * cached response for 10 minutes and revalidates in the background for up to a
 * day — so cold page loads don't wait on Sanity, and the cache is shared across
 * all visitors. This content changes rarely, so the window can be generous.
 */
export function setSanityBrowseCacheHeaders() {
  setResponseHeaders(
    new Headers({
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'CDN-Cache-Control': 'public, max-age=600, stale-while-revalidate=86400',
    }),
  )
}
