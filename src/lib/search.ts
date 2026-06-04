export const SEARCH_QUERY_MAX_LENGTH = 70
const SEARCH_TITLE_MAX_LENGTH = 25

export function normalizeSearchQuery(searchTerm?: string): string {
  if (!searchTerm) return ''
  return searchTerm.trim().slice(0, SEARCH_QUERY_MAX_LENGTH)
}

export function getSearchDisplayQuery(query: string): string {
  const normalizedQuery = normalizeSearchQuery(query)
  if (normalizedQuery.length <= SEARCH_TITLE_MAX_LENGTH) {
    return normalizedQuery
  }

  return `${normalizedQuery.slice(0, SEARCH_TITLE_MAX_LENGTH)}...`
}
