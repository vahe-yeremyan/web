import type { ConnectionPageInfo } from '@/lib/pagination'
import type {
  CollectionDetail,
  CollectionListItem,
  CollectionMetadata,
  CollectionMetadataQueryResult,
  CollectionQueryResult,
  CollectionsQueryResult,
  HighlightedArtworkProduct,
  HighlightedArtworksQueryResult,
  PageDetail,
  PageQueryResult,
  PolicySummary,
  ProductDetail,
  ProductListPage,
  ProductQueryResult,
  ProductSearchFilterOptionsQueryResult,
  ProductsQueryResult,
  ProductsQueryVariables,
  RecentArtworkProduct,
  RecentArtworksQueryResult,
  SearchQueryResult,
  SearchQueryVariables,
  ShopPoliciesQueryResult,
  ShopPolicy,
  ShopQueryResult,
  SoldProductListItem,
  SoldProductsQueryResult,
} from '@/lib/queries/shopify/queries'
import type { ShopFilterOptions, ShopSearchParams } from '@/lib/shop-filters'

import { createServerFn } from '@tanstack/react-start'
import { setResponseHeaders } from '@tanstack/react-start/server'

import * as v from 'valibot'

import { getPaginationVariables } from '@/lib/pagination'
import {
  COLLECTIONS_QUERY,
  COLLECTION_METADATA_QUERY,
  COLLECTION_QUERY,
  HIGHLIGHTED_ARTWORKS_QUERY,
  PAGE_QUERY,
  PRODUCTS_QUERY,
  PRODUCT_QUERY,
  PRODUCT_SEARCH_FILTER_OPTIONS_QUERY,
  RECENT_ARTWORKS_QUERY,
  SEARCH_QUERY,
  SHOP_POLICIES_QUERY,
  SHOP_QUERY,
  SOLD_PRODUCTS_QUERY,
  flattenPolicies,
} from '@/lib/queries/shopify/queries'
import {
  buildShopifyProductFilters,
  createSearchFilterOptions,
  getSearchSortParams,
} from '@/lib/queries/shopify/search-filters'
import {
  PRICE_FILTER_OPTIONS,
  SHOP_SORT_OPTIONS,
  hasActiveShopFilters,
} from '@/lib/shop-filters'
import { shopifyServerFetch } from '@/server/shopify/storefront-client'

/**
 * Edge-cache catalog responses for a few minutes. Catalog data doesn't change
 * often. CDN-Cache-Control is the runtime-portable header (Cloudflare, Vercel,
 * Netlify all read it); we also set a conservative public Cache-Control so
 * intermediaries don't cache aggressively without explicit opt-in.
 */
function setBrowseCacheHeaders() {
  setResponseHeaders(
    new Headers({
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'CDN-Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
    }),
  )
}

function availableProducts<T extends { availableForSale: boolean }>(
  products: T[],
) {
  return products.filter((product) => product.availableForSale)
}

const productSortKeys = [
  'BEST_SELLING',
  'CREATED_AT',
  'ID',
  'PRICE',
  'PRODUCT_TYPE',
  'RELEVANCE',
  'TITLE',
  'UPDATED_AT',
  'VENDOR',
] as const

const collectionSortKeys = [
  'BEST_SELLING',
  'COLLECTION_DEFAULT',
  'CREATED',
  'ID',
  'MANUAL',
  'PRICE',
  'RELEVANCE',
  'TITLE',
] as const

const HIGHLIGHTED_ARTWORKS_COLLECTION_HANDLE = 'highlighted-artworks'
const SOLD_PRODUCTS_LIMIT = 100

const shopSortOptions = SHOP_SORT_OPTIONS.map((option) => option.value) as [
  ShopSearchParams['sort'],
  ...Array<ShopSearchParams['sort']>,
]

const priceFilterOptions = PRICE_FILTER_OPTIONS.map(
  (option) => option.value,
) as [
  NonNullable<ShopSearchParams['price']>,
  ...Array<NonNullable<ShopSearchParams['price']>>,
]

let filterOptionsPromise: Promise<
  ReturnType<typeof createSearchFilterOptions>
> | null = null

async function loadSearchFilterOptions() {
  filterOptionsPromise ??=
    shopifyServerFetch<ProductSearchFilterOptionsQueryResult>({
      query: PRODUCT_SEARCH_FILTER_OPTIONS_QUERY,
    }).then((result) => createSearchFilterOptions(result.search.productFilters))

  try {
    return await filterOptionsPromise
  } catch (error) {
    filterOptionsPromise = null
    throw error
  }
}

function isTitleSort(sort: ShopSearchParams['sort']) {
  return sort === 'title-asc' || sort === 'title-desc'
}

export const getShop = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ShopQueryResult['shop']> => {
    setBrowseCacheHeaders()
    const data = await shopifyServerFetch<ShopQueryResult>({
      query: SHOP_QUERY,
    })
    return data.shop
  },
)

export const getProducts = createServerFn({ method: 'POST' })
  .inputValidator(
    v.object({
      first: v.optional(
        v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
      ),
      after: v.optional(v.nullable(v.string())),
      last: v.optional(
        v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
      ),
      before: v.optional(v.nullable(v.string())),
      sortKey: v.optional(v.picklist(productSortKeys)),
      reverse: v.optional(v.boolean()),
      query: v.optional(v.string()),
    }),
  )
  .handler(async ({ data }): Promise<ProductListPage> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<
      ProductsQueryResult,
      ProductsQueryVariables
    >({
      query: PRODUCTS_QUERY,
      variables: {
        first: data.first ?? (data.last ? null : 24),
        after: data.after ?? null,
        last: data.last ?? null,
        before: data.before ?? null,
        sortKey: data.sortKey ?? null,
        reverse: data.reverse ?? null,
        query: data.query ?? null,
      },
    })
    return result.products
  })

export const getShopProductFilterOptions = createServerFn({
  method: 'GET',
}).handler(async (): Promise<ShopFilterOptions> => {
  setBrowseCacheHeaders()
  const options = await loadSearchFilterOptions()

  return {
    categories: options.categories,
    mediums: options.mediums,
    orientations: options.orientations,
  }
})

export const getShopProducts = createServerFn({ method: 'POST' })
  .inputValidator(
    v.object({
      pageSize: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 24),
      cursor: v.optional(v.string()),
      direction: v.optional(v.picklist(['next', 'prev'])),
      sort: v.optional(v.picklist(shopSortOptions), 'default'),
      category: v.optional(v.array(v.string()), []),
      medium: v.optional(v.array(v.string()), []),
      orientation: v.optional(v.array(v.string()), []),
      price: v.optional(v.picklist(priceFilterOptions)),
    }),
  )
  .handler(
    async ({
      data,
    }): Promise<{
      totalCount: number
      pageInfo: ConnectionPageInfo
      products: ProductListPage['nodes']
    }> => {
      setBrowseCacheHeaders()

      const search: ShopSearchParams = data
      const pagination = getPaginationVariables(search, data.pageSize)
      if (!hasActiveShopFilters(search) && isTitleSort(search.sort)) {
        const result = await shopifyServerFetch<
          ProductsQueryResult,
          ProductsQueryVariables
        >({
          query: PRODUCTS_QUERY,
          variables: {
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
            sortKey: 'TITLE',
            reverse: search.sort === 'title-desc',
            query: 'available_for_sale:true',
          },
        })

        const products = availableProducts(result.products.nodes)

        return {
          totalCount: products.length,
          pageInfo: {
            hasNextPage: result.products.pageInfo.hasNextPage,
            hasPreviousPage: result.products.pageInfo.hasPreviousPage,
            startCursor: result.products.pageInfo.startCursor ?? null,
            endCursor: result.products.pageInfo.endCursor ?? null,
          },
          products,
        }
      }

      const filterOptions = await loadSearchFilterOptions()
      const productFilters = buildShopifyProductFilters(search, filterOptions)
      const { sortKey, reverse } = getSearchSortParams(search)

      const result = await shopifyServerFetch<
        SearchQueryResult,
        SearchQueryVariables
      >({
        query: SEARCH_QUERY,
        variables: {
          query: '*',
          first: pagination.first,
          after: pagination.after,
          last: pagination.last,
          before: pagination.before,
          sortKey,
          reverse,
          productFilters,
        },
      })

      const products = availableProducts(result.search.nodes)

      return {
        totalCount: result.search.totalCount,
        pageInfo: {
          hasNextPage: result.search.pageInfo.hasNextPage,
          hasPreviousPage: result.search.pageInfo.hasPreviousPage,
          startCursor: result.search.pageInfo.startCursor ?? null,
          endCursor: result.search.pageInfo.endCursor ?? null,
        },
        products,
      }
    },
  )

export const getSoldProducts = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<SoldProductListItem>> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<
      SoldProductsQueryResult,
      { first: number }
    >({
      query: SOLD_PRODUCTS_QUERY,
      variables: { first: SOLD_PRODUCTS_LIMIT },
    })

    return result.products.nodes.filter((product) => !product.availableForSale)
  },
)

export const getCollections = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<CollectionListItem>> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<
      CollectionsQueryResult,
      { first: number }
    >({
      query: COLLECTIONS_QUERY,
      variables: { first: 50 },
    })
    return result.collections.nodes
  },
)

export const getProduct = createServerFn({ method: 'POST' })
  .inputValidator(v.object({ handle: v.string() }))
  .handler(async ({ data }): Promise<ProductDetail | null> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<
      ProductQueryResult,
      { handle: string }
    >({
      query: PRODUCT_QUERY,
      variables: { handle: data.handle },
    })
    return result.product
  })

export const getCollection = createServerFn({ method: 'POST' })
  .inputValidator(
    v.object({
      handle: v.string(),
      first: v.optional(
        v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
      ),
      after: v.optional(v.nullable(v.string())),
      last: v.optional(
        v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
      ),
      before: v.optional(v.nullable(v.string())),
      sortKey: v.optional(v.picklist(collectionSortKeys)),
      reverse: v.optional(v.boolean()),
    }),
  )
  .handler(async ({ data }): Promise<CollectionDetail | null> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<
      CollectionQueryResult,
      {
        handle: string
        first: number | null
        after: string | null
        last: number | null
        before: string | null
        sortKey: (typeof collectionSortKeys)[number] | null
        reverse: boolean | null
      }
    >({
      query: COLLECTION_QUERY,
      variables: {
        handle: data.handle,
        first: data.first ?? (data.last ? null : 24),
        after: data.after ?? null,
        last: data.last ?? null,
        before: data.before ?? null,
        sortKey: data.sortKey ?? null,
        reverse: data.reverse ?? null,
      },
    })
    if (!result.collection) return null

    return {
      ...result.collection,
      products: {
        ...result.collection.products,
        nodes: availableProducts(result.collection.products.nodes),
      },
    }
  })

export const getCollectionMetadata = createServerFn({ method: 'POST' })
  .inputValidator(v.object({ handle: v.string() }))
  .handler(async ({ data }): Promise<CollectionMetadata | null> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<
      CollectionMetadataQueryResult,
      { handle: string }
    >({
      query: COLLECTION_METADATA_QUERY,
      variables: { handle: data.handle },
    })
    return result.collection
  })

export const getHighlightedArtworks = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<HighlightedArtworkProduct>> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<
      HighlightedArtworksQueryResult,
      { collectionHandle: string; productsFirst: number; imagesFirst: number }
    >({
      query: HIGHLIGHTED_ARTWORKS_QUERY,
      variables: {
        collectionHandle: HIGHLIGHTED_ARTWORKS_COLLECTION_HANDLE,
        productsFirst: 4,
        imagesFirst: 1,
      },
    })
    return (
      result.collectionByHandle?.products.edges
        .map((edge) => edge.node)
        .filter((product): product is HighlightedArtworkProduct =>
          Boolean(product),
        ) ?? []
    )
  },
)

export const getRecentArtworks = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<RecentArtworkProduct>> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<
      RecentArtworksQueryResult,
      { productsFirst: number; imagesFirst: number }
    >({
      query: RECENT_ARTWORKS_QUERY,
      variables: {
        productsFirst: 4,
        imagesFirst: 1,
      },
    })
    return result.products.edges.map((edge) => edge.node)
  },
)

export const getPage = createServerFn({ method: 'POST' })
  .inputValidator(v.object({ handle: v.string() }))
  .handler(async ({ data }): Promise<PageDetail | null> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<
      PageQueryResult,
      { handle: string }
    >({
      query: PAGE_QUERY,
      variables: { handle: data.handle },
    })
    return result.page
  })

export const getShopPolicies = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<PolicySummary>> => {
    setBrowseCacheHeaders()
    const result = await shopifyServerFetch<ShopPoliciesQueryResult>({
      query: SHOP_POLICIES_QUERY,
    })
    return flattenPolicies(result.shop)
  },
)

export const getShopPolicy = createServerFn({ method: 'POST' })
  .inputValidator(v.object({ handle: v.string() }))
  .handler(
    async ({
      data,
    }): Promise<{ title: string; body: string; handle: string } | null> => {
      setBrowseCacheHeaders()
      const result = await shopifyServerFetch<ShopPoliciesQueryResult>({
        query: SHOP_POLICIES_QUERY,
      })
      const all = [
        result.shop.privacyPolicy,
        result.shop.refundPolicy,
        result.shop.termsOfService,
        result.shop.shippingPolicy,
      ].filter((p): p is NonNullable<ShopPolicy> => p !== null)
      return all.find((p) => p.handle === data.handle) ?? null
    },
  )

export const searchProducts = createServerFn({ method: 'POST' })
  .inputValidator(
    v.object({
      query: v.pipe(v.string(), v.minLength(1)),
      first: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 24),
      after: v.optional(v.nullable(v.string())),
    }),
  )
  .handler(
    async ({
      data,
    }): Promise<{
      totalCount: number
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
      products: ProductListPage['nodes']
    }> => {
      setBrowseCacheHeaders()
      const result = await shopifyServerFetch<
        SearchQueryResult,
        SearchQueryVariables
      >({
        query: SEARCH_QUERY,
        variables: {
          query: data.query,
          first: data.first,
          after: data.after ?? null,
          last: null,
          before: null,
          sortKey: 'RELEVANCE',
          reverse: false,
          productFilters: [{ available: true }],
        },
      })
      const products = availableProducts(result.search.nodes)

      return {
        totalCount: result.search.totalCount,
        pageInfo: {
          hasNextPage: result.search.pageInfo.hasNextPage,
          endCursor: result.search.pageInfo.endCursor ?? null,
        },
        products,
      }
    },
  )
