import { QueryClient } from '@tanstack/react-query'

const DEFAULT_QUERY_STALE_TIME = 10 * 60 * 1000
const DEFAULT_QUERY_GC_TIME = 30 * 60 * 1000

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_QUERY_STALE_TIME,
        gcTime: DEFAULT_QUERY_GC_TIME,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
