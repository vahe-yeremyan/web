import type { ArtworkGridItem } from './artwork-grid-item'

import { Link } from '@tanstack/react-router'

type ArtworkLinkProps = {
  artwork: ArtworkGridItem
  className?: string
  children: React.ReactNode
}

export function ArtworkLink({
  artwork,
  className,
  children,
}: ArtworkLinkProps) {
  if (!artwork.productHandle) {
    return <div className={className}>{children}</div>
  }

  return (
    <Link
      to="/product/$handle"
      params={{ handle: artwork.productHandle }}
      className={className}
    >
      {children}
    </Link>
  )
}
