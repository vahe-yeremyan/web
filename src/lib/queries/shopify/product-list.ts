import type { ShopSearchParams } from '@/lib/shop-filters'

import { queryOptions } from '@tanstack/react-query'

import { PRODUCT_PAGE_SIZE } from '@/lib/product-page-constants'
import {
  getCollectionMetadata,
  getShopProductFilterOptions,
  getShopProducts,
} from '@/server/shopify/catalog.functions'

export type ProductListQueryResult = Awaited<ReturnType<typeof getShopProducts>>

export function getProductListSearchKey(search: ShopSearchParams) {
  return {
    sort: search.sort,
    category: search.category,
    medium: search.medium,
    orientation: search.orientation,
    price: search.price,
  }
}

export function getCategoryProductSearch(
  category: string,
  search: ShopSearchParams,
): ShopSearchParams {
  return {
    ...search,
    category: [category],
    cursor: undefined,
    direction: undefined,
  }
}

export function productFilterOptionsQueryOptions() {
  return queryOptions({
    queryKey: ['shopify', 'products', 'filter-options'] as const,
    queryFn: () => getShopProductFilterOptions(),
  })
}

export function collectionMetadataQueryOptions(handle: string) {
  return queryOptions({
    queryKey: ['shopify', 'collection', handle, 'metadata'] as const,
    queryFn: () => getCollectionMetadata({ data: { handle } }),
  })
}

export function productListQueryOptions(search: ShopSearchParams) {
  return queryOptions({
    queryKey: [
      'shopify',
      'products',
      'page',
      getProductListSearchKey(search),
    ] as const,
    queryFn: () =>
      getShopProducts({
        data: {
          pageSize: PRODUCT_PAGE_SIZE,
          sort: search.sort,
          category: search.category,
          medium: search.medium,
          orientation: search.orientation,
          price: search.price,
        },
      }),
  })
}

export function productListNextPageQueryOptions(
  search: ShopSearchParams,
  cursor: string,
) {
  return queryOptions({
    queryKey: [
      'shopify',
      'products',
      'next-page',
      getProductListSearchKey(search),
      cursor,
    ] as const,
    queryFn: () =>
      getShopProducts({
        data: {
          pageSize: PRODUCT_PAGE_SIZE,
          cursor,
          direction: 'next',
          sort: search.sort,
          category: search.category,
          medium: search.medium,
          orientation: search.orientation,
          price: search.price,
        },
      }),
  })
}
