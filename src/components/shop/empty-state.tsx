import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

type EmptyStateProps = {
  title: string
  description?: string
  cta?: { label: string; to: string }
  children?: ReactNode
}

export function EmptyState({
  title,
  description,
  cta,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[--storefront-line] px-6 py-16 text-center">
      <h2 className="text-xl font-medium">{title}</h2>
      {description && (
        <p className="max-w-md text-[--storefront-fg-muted]">
          {description}
        </p>
      )}
      {children}
      {cta && (
        <Link
          to={cta.to}
          className="rounded-full border border-[--storefront-fg] px-5 py-2 text-sm font-medium text-[--storefront-fg] no-underline"
        >
          {cta.label}
        </Link>
      )}
    </div>
  )
}
