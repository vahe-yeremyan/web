export type PaginationSearchParams = {
  cursor?: string
  direction?: 'next' | 'prev'
}

export type ConnectionPageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string | null
  endCursor?: string | null
}

export function getPaginationVariables(
  pagination: PaginationSearchParams,
  pageSize: number,
) {
  if (pagination.direction === 'prev' && pagination.cursor) {
    return {
      first: null,
      after: null,
      last: pageSize,
      before: pagination.cursor,
    }
  }

  return {
    first: pageSize,
    after:
      pagination.direction === 'next' && pagination.cursor
        ? pagination.cursor
        : null,
    last: null,
    before: null,
  }
}
