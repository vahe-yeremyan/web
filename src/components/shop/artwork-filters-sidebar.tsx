import type {
  PriceFilterOption,
  ShopFilterKey,
  ShopFilterOptions,
  ShopSearchParams,
  ShopSortOption,
} from '@/lib/shop-filters'

import { Check, ChevronDown } from 'lucide-react'

import {
  PRICE_FILTER_OPTIONS,
  SHOP_SORT_OPTIONS,
  hasActiveShopFilters,
  isTitleShopSort,
} from '@/lib/shop-filters'
import { cn } from '@/lib/utils'

type ArtworkFiltersSidebarProps = {
  search: ShopSearchParams
  filterOptions: ShopFilterOptions
  lockedCategory?: string
  onSortChange: (sort: ShopSortOption) => void
  onFilterToggle: (key: ShopFilterKey, value: string) => void
  onPriceChange: (price?: PriceFilterOption) => void
  onClearFilters: () => void
}

type FilterSectionProps = {
  title: string
  name: ShopFilterKey
  options: string[]
  selected: string[]
  selectionMode?: 'multiple' | 'single'
  onToggle: (key: ShopFilterKey, value: string) => void
}

type SidebarHeaderProps = {
  hasFilters: boolean
  onClearFilters: () => void
}

type SortFilterProps = {
  value: ShopSortOption
  hasFilters: boolean
  onChange: (sort: ShopSortOption) => void
}

type PriceFilterProps = {
  value?: PriceFilterOption
  onChange: (price?: PriceFilterOption) => void
}

function optionId(prefix: string, value: string) {
  return `${prefix}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function FilterSection({
  title,
  name,
  options,
  selected,
  selectionMode = 'multiple',
  onToggle,
}: FilterSectionProps) {
  if (options.length === 0) return null

  return (
    <section className="space-y-3" aria-labelledby={`${name}-filters`}>
      <h3
        id={`${name}-filters`}
        className="text-sm font-medium text-neutral-700"
      >
        {title}
      </h3>

      <ul className="space-y-2">
        {options.map((option) => {
          const id = optionId(name, option)
          const isSelected = selected.includes(option)

          if (selectionMode === 'single') {
            return (
              <li key={option}>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-2 text-left"
                  aria-pressed={isSelected}
                  onClick={() => onToggle(name, option)}
                >
                  <span
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                      isSelected && 'border-neutral-900',
                      !isSelected && 'border-neutral-300',
                    )}
                    aria-hidden
                  >
                    {isSelected && (
                      <span className="size-2 rounded-full bg-neutral-900" />
                    )}
                  </span>
                  <span className="text-sm text-neutral-700">{option}</span>
                </button>
              </li>
            )
          }

          return (
            <li key={option} className="flex items-center gap-2">
              <span className="relative flex size-4 shrink-0 items-center justify-center">
                <input
                  id={id}
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(name, option)}
                  className="peer size-4 cursor-pointer appearance-none rounded-[3px] border border-neutral-300 bg-white checked:border-neutral-900 checked:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:outline-none"
                />
                <Check
                  aria-hidden
                  className="pointer-events-none absolute size-3 text-white opacity-0 peer-checked:opacity-100"
                  strokeWidth={3}
                />
              </span>
              <label
                htmlFor={id}
                className="cursor-pointer text-sm text-neutral-700"
              >
                {option}
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function SidebarHeader({ hasFilters, onClearFilters }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2
        id="artwork-filters-title"
        className="text-base font-semibold text-neutral-950"
      >
        Refine
      </h2>
      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm font-medium text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

function SortFilter({ value, hasFilters, onChange }: SortFilterProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="artwork-sort"
        className="text-sm font-medium text-neutral-700"
      >
        Sort by
      </label>
      <div className="relative mt-1">
        <select
          id="artwork-sort"
          value={value}
          onChange={(event) => onChange(event.target.value as ShopSortOption)}
          className="border-input flex h-9 w-full appearance-none items-center justify-between rounded-md border bg-transparent px-3 pr-9 text-sm whitespace-nowrap shadow-xs outline-none focus:outline-none focus-visible:outline-none"
        >
          {SHOP_SORT_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={hasFilters && isTitleShopSort(option.value)}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-50"
        />
      </div>
    </div>
  )
}

function PriceFilter({ value, onChange }: PriceFilterProps) {
  return (
    <section className="space-y-3" aria-labelledby="price-filters">
      <h3 id="price-filters" className="text-sm font-medium text-neutral-700">
        Price
      </h3>

      <ul className="space-y-2">
        {PRICE_FILTER_OPTIONS.map((option) => {
          const isSelected = value === option.value

          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onChange(isSelected ? undefined : option.value)}
                className="flex w-full cursor-pointer items-center gap-2 text-left"
                aria-pressed={isSelected}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full border transition-colors',
                    isSelected && 'border-neutral-900',
                    !isSelected && 'border-neutral-300',
                  )}
                  aria-hidden
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-neutral-900" />
                  )}
                </span>
                <span className="text-sm text-neutral-700">{option.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function ArtworkFiltersSidebar({
  search,
  filterOptions,
  lockedCategory,
  onSortChange,
  onFilterToggle,
  onPriceChange,
  onClearFilters,
}: ArtworkFiltersSidebarProps) {
  const hasFilters = hasActiveShopFilters(search)
  const displayedSearch = lockedCategory
    ? { ...search, category: [lockedCategory] }
    : search
  const hasSortFilters = hasActiveShopFilters(displayedSearch)

  return (
    <aside
      aria-labelledby="artwork-filters-title"
      className="font-manrope space-y-6 rounded-md border border-neutral-200 bg-white p-4"
    >
      <div className="space-y-3">
        <SidebarHeader
          hasFilters={hasFilters}
          onClearFilters={onClearFilters}
        />
        <SortFilter
          value={search.sort}
          hasFilters={hasSortFilters}
          onChange={onSortChange}
        />
      </div>

      <PriceFilter value={search.price} onChange={onPriceChange} />

      <FilterSection
        title="Category"
        name="category"
        options={filterOptions.categories}
        selected={displayedSearch.category}
        selectionMode="single"
        onToggle={onFilterToggle}
      />
      <FilterSection
        title="Medium"
        name="medium"
        options={filterOptions.mediums}
        selected={displayedSearch.medium}
        onToggle={onFilterToggle}
      />
      <FilterSection
        title="Orientation"
        name="orientation"
        options={filterOptions.orientations}
        selected={displayedSearch.orientation}
        onToggle={onFilterToggle}
      />
    </aside>
  )
}
