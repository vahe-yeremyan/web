import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type ProductListingLayoutProps = {
  title?: string
  titleActions?: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
  onMainScrollIntent?: () => void
}

const MAIN_SCROLL_INTENT_OFFSET = 320
const HIDDEN_SCROLLBAR_CLASS_NAME =
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

export function ProductListingLayout({
  title,
  titleActions,
  sidebar,
  children,
  onMainScrollIntent,
}: ProductListingLayoutProps) {
  return (
    <section className="md:flex md:h-[calc(100dvh-var(--header-height))] md:flex-col md:overflow-hidden">
      <div className="mt-8 mb-6 flex flex-wrap items-center gap-4 md:shrink-0 md:gap-6">
        {title && (
          <h1 className="shrink-0 text-2xl leading-tight font-semibold tracking-tight text-black md:text-3xl">
            {title}
          </h1>
        )}
        <div className="ml-auto md:hidden">
          <MobileFilters sidebar={sidebar} />
        </div>
        {titleActions}
      </div>

      <div className="grid gap-5 md:min-h-0 md:flex-1 md:grid-cols-[16rem_minmax(0,1fr)] md:items-stretch md:overflow-hidden">
        <div
          className={cn(
            HIDDEN_SCROLLBAR_CLASS_NAME,
            'hidden md:block md:min-h-0 md:overflow-y-auto md:overscroll-contain md:pr-1 md:pb-5',
          )}
        >
          {sidebar}
        </div>
        <div
          className={cn(
            HIDDEN_SCROLLBAR_CLASS_NAME,
            'min-w-0 pb-10 md:h-full md:min-h-0 md:overflow-y-auto md:overscroll-contain md:pr-2 md:pb-5',
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

function MobileFilters({ sidebar }: { sidebar: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 items-center rounded-md border border-neutral-300 px-4 text-sm font-semibold text-neutral-800"
        >
          Filters
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full gap-0 border-l-0 bg-white text-black sm:max-w-none md:hidden"
      >
        <SheetHeader className="h-16 flex-row items-center border-b border-neutral-100 px-(--content-px)">
          <div>
            <SheetTitle className="font-manrope text-lg font-semibold">
              Filters
            </SheetTitle>
            <SheetDescription className="sr-only">
              Product listing filters for narrowing artwork results.
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-(--content-px) py-5">
          {sidebar}
        </div>

        <SheetFooter className="border-t border-neutral-100 px-(--content-px) py-3">
          <SheetClose asChild>
            <button
              type="button"
              className="h-11 w-full rounded-md bg-black text-sm font-semibold text-white"
            >
              Show results
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
