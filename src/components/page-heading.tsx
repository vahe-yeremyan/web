import { cn } from '@/lib/utils'

type PageHeadingProps = {
  title: string
  className?: string
}

export function PageHeading({ title, className }: PageHeadingProps) {
  return (
    <header className={cn('mt-8 mb-6', className)}>
      <h1 className="text-2xl leading-tight font-semibold tracking-tight text-black md:text-3xl">
        {title}
      </h1>
    </header>
  )
}
