import type { ConnectionPageInfo } from '@/lib/pagination'

type ProductLoadMoreProps = {
  pageInfo: ConnectionPageInfo
  isLoading?: boolean
  onLoadMore: () => void
}

export function ProductLoadMore({
  pageInfo,
  isLoading = false,
  onLoadMore,
}: ProductLoadMoreProps) {
  if (!pageInfo.hasNextPage) return null

  return (
    <div className="mt-12 flex justify-center">
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isLoading}
        className="rounded-md border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        {isLoading ? 'Loading...' : 'Show More'}
      </button>
    </div>
  )
}
