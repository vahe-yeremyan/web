import { PageHeading } from '@/components/page-heading'
import { cn } from '@/lib/utils'

type ProductListingLayoutProps = {
  title?: string
  sidebar: React.ReactNode
  children: React.ReactNode
  onMainScrollIntent?: () => void
}

const MAIN_SCROLL_INTENT_OFFSET = 320
const HIDDEN_SCROLLBAR_CLASS_NAME =
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

export function ProductListingLayout({
  title,
  sidebar,
  children,
  onMainScrollIntent,
}: ProductListingLayoutProps) {
  return (
    <section className="lg:flex lg:h-[calc(100dvh-var(--header-height))] lg:flex-col lg:overflow-hidden">
      {title && <PageHeading title={title} className="lg:shrink-0" />}

      <div className="grid gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-stretch lg:overflow-hidden">
        <div
          className={cn(
            HIDDEN_SCROLLBAR_CLASS_NAME,
            'lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1 lg:pb-5',
          )}
        >
          {sidebar}
        </div>
        <div
          className={cn(
            HIDDEN_SCROLLBAR_CLASS_NAME,
            'min-w-0 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-2 lg:pb-5',
          )}
          onScroll={(event) => {
            if (event.currentTarget.scrollTop >= MAIN_SCROLL_INTENT_OFFSET) {
              onMainScrollIntent?.()
            }
          }}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
