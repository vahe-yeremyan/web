import { SEARCH_QUERY_MAX_LENGTH } from '@/lib/search'

export const SHOP_SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Title (A to Z)', value: 'title-asc' },
  { label: 'Title (Z to A)', value: 'title-desc' },
  { label: 'Price (low to high)', value: 'price-asc' },
  { label: 'Price (high to low)', value: 'price-desc' },
] as const

export type ShopSortOption = (typeof SHOP_SORT_OPTIONS)[number]['value']

export const PRICE_FILTER_OPTIONS = [
  { label: 'Under $500', value: 'under-500', min: 0, max: 500 },
  { label: '$500 - $1,000', value: '500-1k', min: 500, max: 1000 },
  { label: '$1,000 - $2,000', value: '1k-2k', min: 1000, max: 2000 },
  { label: '$2,000 - $5,000', value: '2k-5k', min: 2000, max: 5000 },
  { label: '$5,000 - $10,000', value: '5k-10k', min: 5000, max: 10000 },
  { label: 'Over $10,000', value: '10k-plus', min: 10000 },
] as const

export type PriceFilterOption = (typeof PRICE_FILTER_OPTIONS)[number]['value']

export type ShopFilterOptions = {
  categories: string[]
  mediums: string[]
  orientations: string[]
}

export type ShopSearchParams = {
  q?: string
  sort: ShopSortOption
  category: string[]
  medium: string[]
  orientation: string[]
  price?: PriceFilterOption
  cursor?: string
  direction?: 'next' | 'prev'
}

export type ShopFilterKey = 'category' | 'medium' | 'orientation'

const SHOP_SORT_VALUES = new Set<string>(
  SHOP_SORT_OPTIONS.map((option) => option.value),
)
const PRICE_FILTER_VALUES = new Set<string>(
  PRICE_FILTER_OPTIONS.map((option) => option.value),
)

function readStringArray(value: unknown): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : []

  return values
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
}

function readSortOption(value: unknown): ShopSortOption {
  if (typeof value === 'string' && SHOP_SORT_VALUES.has(value)) {
    return value as ShopSortOption
  }

  return 'default'
}

function readPriceFilter(value: unknown): PriceFilterOption | undefined {
  if (typeof value === 'string' && PRICE_FILTER_VALUES.has(value)) {
    return value as PriceFilterOption
  }

  return undefined
}

function readCursor(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function readDirection(value: unknown): ShopSearchParams['direction'] {
  return value === 'next' || value === 'prev' ? value : undefined
}

function readSearchQuery(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().slice(0, SEARCH_QUERY_MAX_LENGTH)
  return trimmed || undefined
}

export function normalizeShopSearchParams(
  search: Record<string, unknown>,
): ShopSearchParams {
  return {
    q: readSearchQuery(search.q),
    sort: readSortOption(search.sort),
    category: readStringArray(search.category),
    medium: readStringArray(search.medium),
    orientation: readStringArray(search.orientation),
    price: readPriceFilter(search.price),
    cursor: readCursor(search.cursor),
    direction: readDirection(search.direction),
  }
}

export function hasActiveShopFilters(search: ShopSearchParams) {
  return (
    search.category.length > 0 ||
    search.medium.length > 0 ||
    search.orientation.length > 0 ||
    Boolean(search.price)
  )
}

export function isTitleShopSort(sort: ShopSortOption) {
  return sort === 'title-asc' || sort === 'title-desc'
}

export function toggleShopFilterValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

export function getStableShopSearchKey(search: ShopSearchParams) {
  return JSON.stringify(search)
}

export function resetShopSearchPagination(
  search: ShopSearchParams,
): ShopSearchParams {
  return {
    ...search,
    cursor: undefined,
    direction: undefined,
  }
}

export function getPriceFilterBounds(value?: PriceFilterOption) {
  if (!value) return null
  return PRICE_FILTER_OPTIONS.find((option) => option.value === value) ?? null
}
