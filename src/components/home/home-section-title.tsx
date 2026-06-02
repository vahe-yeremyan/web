import { cn } from '@/lib/utils'

type HomeSectionTitleProps = {
  children: string
  action?: React.ReactNode
  className?: string
}

export function HomeSectionTitle({
  children,
  action,
  className,
}: HomeSectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-4 flex items-baseline justify-between gap-4 md:mb-6',
        className,
      )}
    >
      <h2 className="font-raleway text-2xl font-semibold tracking-tight">
        {children}
      </h2>
      {action}
    </div>
  )
}
