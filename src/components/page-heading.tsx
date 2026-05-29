import { cn } from '@/lib/utils'

import { Divider } from './ui/divider'

type PageHeadingProps = {
  title: string
  className?: string
}

export function PageHeading({ title, className }: PageHeadingProps) {
  return (
    <header
      className={cn('mb-12 pt-[calc(var(--header-height)-1.5rem)]', className)}
    >
      <h1 className="text-3xl leading-tight font-semibold tracking-tight text-black md:text-4xl">
        {title}
      </h1>
      <Divider className="mt-8" />
    </header>
  )
}
