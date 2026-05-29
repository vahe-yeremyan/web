import type {
  ProductFilter,
  SearchSortKeys,
} from './generated/storefront.types'
import type { ShopSearchParams } from '@/lib/shop-filters'

import { getPriceFilterBounds } from '@/lib/shop-filters'

export type ShopifyFilterOption = {
  id: string
  label: string
  values: Array<{
    label: string
    input: string
  }>
}

type FilterInputKey = 'category' | 'medium' | 'orientation'
type FilterInputIndex = Record<FilterInputKey, Map<string, ProductFilter>>

export type ShopifySearchFilterOptions = {
  categories: string[]
  mediums: string[]
  orientations: string[]
  inputIndex: FilterInputIndex
}

const EMPTY_FILTER_OPTIONS: ShopifySearchFilterOptions = {
  categories: [],
  mediums: [],
  orientations: [],
  inputIndex: createFilterInputIndex(),
}

function createFilterInputIndex(): FilterInputIndex {
  return {
    category: new Map(),
    medium: new Map(),
    orientation: new Map(),
  }
}

function normalizeLabel(value: string): string {
  return value.trim().toLocaleLowerCase('en-US')
}

function sortLabels(values: Iterable<string>) {
  return Array.from(values).sort((a, b) => a.localeCompare(b))
}

function parseFilterInput(raw: string): ProductFilter | undefined {
  try {
    return JSON.parse(raw) as ProductFilter
  } catch {
    return undefined
  }
}

function detectFilterKey(
  filter: ShopifyFilterOption,
  input: ProductFilter,
): FilterInputKey | undefined {
  const filterId = filter.id.toLocaleLowerCase('en-US')
  const filterLabel = filter.label.toLocaleLowerCase('en-US')
  const productMetafield = input.productMetafield

  if (
    productMetafield?.namespace === 'custom' &&
    productMetafield.key === 'category'
  ) {
    return 'category'
  }

  if (
    productMetafield?.namespace === 'custom' &&
    productMetafield.key === 'medium'
  ) {
    return 'medium'
  }

  if (
    productMetafield?.namespace === 'custom' &&
    productMetafield.key === 'orientation'
  ) {
    return 'orientation'
  }

  if (input.category && filterLabel.includes('category')) return 'category'
  if (filterId.includes('.custom.category')) return 'category'
  if (filterId.includes('.custom.medium')) return 'medium'
  if (filterId.includes('.custom.orientation')) return 'orientation'

  return undefined
}

export function createSearchFilterOptions(
  filters: ShopifyFilterOption[],
): ShopifySearchFilterOptions {
  if (filters.length === 0) return EMPTY_FILTER_OPTIONS

  const inputIndex = createFilterInputIndex()
  const labels = {
    category: new Map<string, string>(),
    medium: new Map<string, string>(),
    orientation: new Map<string, string>(),
  }

  filters.forEach((filter) => {
    filter.values.forEach((value) => {
      const input = parseFilterInput(value.input)
      if (!input) return

      const key = detectFilterKey(filter, input)
      if (!key) return

      const normalized = normalizeLabel(value.label)
      if (!normalized || inputIndex[key].has(normalized)) return

      inputIndex[key].set(normalized, input)
      labels[key].set(normalized, value.label)
    })
  })

  return {
    categories: sortLabels(labels.category.values()),
    mediums: sortLabels(labels.medium.values()),
    orientations: sortLabels(labels.orientation.values()),
    inputIndex,
  }
}

function fallbackMetafieldFilter(
  key: FilterInputKey,
  value: string,
): ProductFilter {
  return {
    productMetafield: {
      namespace: 'custom',
      key,
      value,
    },
  }
}

function addUniqueFilter(filters: ProductFilter[], next: ProductFilter) {
  const serialized = JSON.stringify(next)
  if (filters.some((filter) => JSON.stringify(filter) === serialized)) return
  filters.push(next)
}

function addSelectedFilters(
  productFilters: ProductFilter[],
  inputIndex: FilterInputIndex,
  key: FilterInputKey,
  values: string[],
) {
  values.forEach((value) => {
    const mapped = inputIndex[key].get(normalizeLabel(value))
    addUniqueFilter(
      productFilters,
      mapped ?? fallbackMetafieldFilter(key, value),
    )
  })
}

export function buildShopifyProductFilters(
  search: ShopSearchParams,
  filterOptions: ShopifySearchFilterOptions,
): ProductFilter[] {
  const productFilters: ProductFilter[] = [{ available: true }]

  addSelectedFilters(
    productFilters,
    filterOptions.inputIndex,
    'category',
    search.category,
  )
  addSelectedFilters(
    productFilters,
    filterOptions.inputIndex,
    'medium',
    search.medium,
  )
  addSelectedFilters(
    productFilters,
    filterOptions.inputIndex,
    'orientation',
    search.orientation,
  )

  const price = getPriceFilterBounds(search.price)
  if (price) {
    addUniqueFilter(productFilters, {
      price: {
        min: price.min,
        max: 'max' in price ? price.max : undefined,
      },
    })
  }

  return productFilters
}

export function getSearchSortParams(search: ShopSearchParams): {
  sortKey: SearchSortKeys
  reverse: boolean
} {
  if (search.sort === 'price-asc') {
    return { sortKey: 'PRICE', reverse: false }
  }

  if (search.sort === 'price-desc') {
    return { sortKey: 'PRICE', reverse: true }
  }

  return { sortKey: 'RELEVANCE', reverse: false }
}
