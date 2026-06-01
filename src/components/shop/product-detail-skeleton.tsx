import { Skeleton } from '@/components/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <main className="site-frame pb-20">
      <article
        role="status"
        aria-busy="true"
        className="grid gap-8 py-6 md:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-12 xl:gap-16"
      >
        <span className="sr-only">Loading product</span>
        <Skeleton className="aspect-5/4 w-full rounded-md bg-neutral-200/70" />
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4 rounded bg-neutral-200/80" />
            <Skeleton className="h-6 w-32 rounded bg-neutral-200/80" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded bg-neutral-200/70" />
            <Skeleton className="h-4 w-5/6 rounded bg-neutral-200/70" />
            <Skeleton className="h-4 w-2/3 rounded bg-neutral-200/70" />
          </div>
          <Skeleton className="h-12 w-64 rounded-full bg-neutral-200/80" />
        </div>
      </article>
    </main>
  )
}
