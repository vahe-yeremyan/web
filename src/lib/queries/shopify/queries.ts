import type {
  CartCreateMutation,
  CartDiscountCodesUpdateMutation,
  CartLinesAddMutation,
  CartLinesRemoveMutation,
  CartLinesUpdateMutation,
  CartQuery,
  CollectionQuery,
  CollectionsQuery,
  HighlightedArtworksQuery,
  PageQuery,
  ProductQuery,
  ProductSearchFilterOptionsQuery,
  ProductSearchQuery,
  ProductsQuery,
  RecentArtworksQuery,
  ShopPoliciesQuery,
  ShopQuery,
} from './generated/storefront.generated'
import type {
  ProductFilter,
  ProductSortKeys,
  SearchSortKeys,
} from './generated/storefront.types'

/**
 * GraphQL queries for the Shopify Storefront API.
 *
 * Result types are derived from generated Storefront API operation types.
 * Keep the app-facing aliases in this file so route/components stay stable
 * when query details or generated type names change.
 */

/* ─── Shop info ─────────────────────────────────────────────────────────── */

export const SHOP_QUERY = /* GraphQL */ `
  query Shop {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
  }
`

export type ShopQueryResult = ShopQuery

/* ─── Product card fragment + product list ──────────────────────────────── */

const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    availableForSale
    productType
    tags
    publishedAt
    options {
      name
      values
    }
    featuredImage {
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    medium: metafield(namespace: "custom", key: "medium") {
      value
      type
    }
    dimensions: metafield(namespace: "custom", key: "dimensions_us") {
      value
      type
    }
  }
`

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENT}
  query Products(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(
      first: $first
      after: $after
      last: $last
      before: $before
      sortKey: $sortKey
      reverse: $reverse
      query: $query
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        ...ProductCard
      }
    }
  }
`

export type ProductListPage = ProductsQuery['products']
export type ProductListItem = ProductListPage['nodes'][number]

export type ProductsQueryVariables = {
  first?: number | null
  after?: string | null
  last?: number | null
  before?: string | null
  sortKey?: ProductSortKeys | null
  reverse?: boolean | null
  query?: string | null
}

export type ProductsQueryResult = {
  products: ProductListPage
}

export type SoldProductListItem = ProductListItem & {
  category?: { value: string; type: string } | null
  orientation?: { value: string; type: string } | null
}

export const SOLD_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENT}
  query SoldProducts($first: Int!) {
    products(
      first: $first
      sortKey: PRICE
      reverse: true
      query: "-available_for_sale:true"
    ) {
      nodes {
        ...ProductCard
        category: metafield(namespace: "custom", key: "category") {
          value
          type
        }
        orientation: metafield(namespace: "custom", key: "orientation") {
          value
          type
        }
      }
    }
  }
`

export type SoldProductsQueryResult = {
  products: {
    nodes: Array<SoldProductListItem>
  }
}

/* ─── Single product (PDP) ──────────────────────────────────────────────── */

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      availableForSale
      descriptionHtml
      options {
        id
        name
        values
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      category: metafield(namespace: "custom", key: "category") {
        value
        type
      }
      medium: metafield(namespace: "custom", key: "medium") {
        value
        type
      }
      dimensionsImperial: metafield(namespace: "custom", key: "dimensions_us") {
        value
        type
      }
      dimensionsMetric: metafield(
        namespace: "custom"
        key: "dimensions_global"
      ) {
        value
        type
      }
      seo {
        title
        description
      }
    }
  }
`

export type ProductDetail = NonNullable<ProductQuery['product']>
export type ProductDetailVariant = ProductDetail['variants']['nodes'][number]

export type ProductQueryResult = {
  product: ProductDetail | null
}

/* ─── Collections list ──────────────────────────────────────────────────── */

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first, sortKey: TITLE) {
      nodes {
        id
        handle
        title
        description
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`

export type CollectionListItem =
  CollectionsQuery['collections']['nodes'][number]

export type CollectionsQueryResult = {
  collections: { nodes: Array<CollectionListItem> }
}

/* ─── Collection by handle ──────────────────────────────────────────────── */

export const COLLECTION_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      image {
        url
        altText
        width
        height
      }
      seo {
        title
        description
      }
      products(
        first: $first
        after: $after
        last: $last
        before: $before
        sortKey: $sortKey
        reverse: $reverse
        filters: [{ available: true }]
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          ...ProductCard
        }
      }
    }
  }
`

export type CollectionDetail = NonNullable<CollectionQuery['collection']>

export type CollectionQueryResult = {
  collection: CollectionDetail | null
}

export const COLLECTION_METADATA_QUERY = /* GraphQL */ `
  query CollectionMetadata($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
    }
  }
`

export type CollectionMetadata = Pick<
  CollectionDetail,
  'id' | 'handle' | 'title' | 'description' | 'seo'
>

export type CollectionMetadataQueryResult = {
  collection: CollectionMetadata | null
}

/* ─── Homepage artwork sections ─────────────────────────────────────────── */

const HOME_ARTWORK_PRODUCT_FIELDS = /* GraphQL */ `
  fragment HomeArtworkProduct on Product {
    id
    title
    handle
    images(first: $imagesFirst) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    dimensionsImperial: metafield(namespace: "custom", key: "dimensions_us") {
      value
      type
    }
    dimensionsMetric: metafield(namespace: "custom", key: "dimensions_global") {
      value
      type
    }
    medium: metafield(namespace: "custom", key: "medium") {
      value
      type
    }
  }
`

export const HIGHLIGHTED_ARTWORKS_QUERY = /* GraphQL */ `
  ${HOME_ARTWORK_PRODUCT_FIELDS}
  query HighlightedArtworks(
    $collectionHandle: String!
    $productsFirst: Int = 4
    $imagesFirst: Int = 1
  ) {
    collectionByHandle(handle: $collectionHandle) {
      products(
        first: $productsFirst
        sortKey: COLLECTION_DEFAULT
        filters: [{ available: true }]
      ) {
        edges {
          node {
            ...HomeArtworkProduct
          }
        }
      }
    }
  }
`

export type HighlightedArtworksQueryResult = HighlightedArtworksQuery
export type HighlightedArtworkProduct = NonNullable<
  NonNullable<
    HighlightedArtworksQuery['collectionByHandle']
  >['products']['edges'][number]
>['node']

export const RECENT_ARTWORKS_QUERY = /* GraphQL */ `
  ${HOME_ARTWORK_PRODUCT_FIELDS}
  query RecentArtworks($productsFirst: Int = 4, $imagesFirst: Int = 1) {
    products(
      first: $productsFirst
      sortKey: CREATED_AT
      reverse: true
      query: "available_for_sale:true"
    ) {
      edges {
        node {
          ...HomeArtworkProduct
        }
      }
    }
  }
`

export type RecentArtworksQueryResult = RecentArtworksQuery
export type RecentArtworkProduct =
  RecentArtworksQuery['products']['edges'][number]['node']

/* ─── Cart fragment + queries + mutations ───────────────────────────────── */

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
            product {
              handle
              title
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
    discountCodes {
      code
      applicable
    }
  }
`

export const CART_QUERY = /* GraphQL */ `
  ${CART_FRAGMENT}
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`

export const CART_CREATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const CART_DISCOUNT_CODES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

export type CartDetail = NonNullable<CartQuery['cart']>
export type CartLineDetail = CartDetail['lines']['nodes'][number]
export type CartLineMerchandise = CartLineDetail['merchandise']

export type CartQueryResult = { cart: CartDetail | null }
export type CartUserError = NonNullable<
  CartCreateMutation['cartCreate']
>['userErrors'][number]

export type CartCreateResult = {
  cartCreate: NonNullable<CartCreateMutation['cartCreate']>
}
export type CartLinesAddResult = {
  cartLinesAdd: NonNullable<CartLinesAddMutation['cartLinesAdd']>
}
export type CartLinesUpdateResult = {
  cartLinesUpdate: NonNullable<CartLinesUpdateMutation['cartLinesUpdate']>
}
export type CartLinesRemoveResult = {
  cartLinesRemove: NonNullable<CartLinesRemoveMutation['cartLinesRemove']>
}
export type CartDiscountCodesUpdateResult = {
  cartDiscountCodesUpdate: NonNullable<
    CartDiscountCodesUpdateMutation['cartDiscountCodesUpdate']
  >
}

/* ─── Sort options ──────────────────────────────────────────────────────── */

export const SORT_OPTIONS = [
  { key: 'BEST_SELLING', reverse: false, label: 'Best selling' },
  { key: 'CREATED_AT', reverse: true, label: 'Newest' },
  { key: 'PRICE', reverse: false, label: 'Price: low to high' },
  { key: 'PRICE', reverse: true, label: 'Price: high to low' },
  { key: 'TITLE', reverse: false, label: 'Title: A–Z' },
] as const satisfies ReadonlyArray<{
  key: ProductSortKeys
  reverse: boolean
  label: string
}>

export type SortOption = (typeof SORT_OPTIONS)[number]
export type SortOptionId = `${SortOption['key']}${'' | ':rev'}`

export function sortOptionId(opt: SortOption): SortOptionId {
  return opt.reverse ? `${opt.key}:rev` : opt.key
}

export function resolveSortOption(id: string | undefined): SortOption {
  if (!id) return SORT_OPTIONS[0]
  for (const opt of SORT_OPTIONS) {
    if (sortOptionId(opt) === id) return opt
  }
  return SORT_OPTIONS[0]
}

export const COLLECTION_SORT_OPTIONS = [
  { key: 'COLLECTION_DEFAULT', reverse: false, label: 'Featured' },
  { key: 'BEST_SELLING', reverse: false, label: 'Best selling' },
  { key: 'CREATED', reverse: true, label: 'Newest' },
  { key: 'PRICE', reverse: false, label: 'Price: low to high' },
  { key: 'PRICE', reverse: true, label: 'Price: high to low' },
  { key: 'TITLE', reverse: false, label: 'Title: A–Z' },
] as const satisfies ReadonlyArray<{
  key: string
  reverse: boolean
  label: string
}>

export type CollectionSortOption = (typeof COLLECTION_SORT_OPTIONS)[number]

export function resolveCollectionSortOption(
  id: string | undefined,
): CollectionSortOption {
  if (!id) return COLLECTION_SORT_OPTIONS[0]
  const expected = (opt: CollectionSortOption) =>
    opt.reverse ? `${opt.key}:rev` : opt.key
  for (const opt of COLLECTION_SORT_OPTIONS) {
    if (expected(opt) === id) return opt
  }
  return COLLECTION_SORT_OPTIONS[0]
}

/* ─── Pages + policies ──────────────────────────────────────────────────── */

export const PAGE_QUERY = /* GraphQL */ `
  query Page($handle: String!) {
    page(handle: $handle) {
      id
      handle
      title
      body
      bodySummary
      seo {
        title
        description
      }
    }
  }
`

export type PageDetail = NonNullable<PageQuery['page']>

export type PageQueryResult = { page: PageDetail | null }

export const SHOP_POLICIES_QUERY = /* GraphQL */ `
  query ShopPolicies {
    shop {
      privacyPolicy {
        handle
        title
        body
      }
      refundPolicy {
        handle
        title
        body
      }
      termsOfService {
        handle
        title
        body
      }
      shippingPolicy {
        handle
        title
        body
      }
    }
  }
`

export type ShopPolicy = NonNullable<
  ShopPoliciesQuery['shop']['privacyPolicy']
> | null

export type ShopPoliciesQueryResult = ShopPoliciesQuery

export type PolicySummary = { handle: string; title: string }

export function flattenPolicies(
  shop: ShopPoliciesQueryResult['shop'],
): Array<PolicySummary> {
  const keys = [
    'shippingPolicy',
    'refundPolicy',
    'privacyPolicy',
    'termsOfService',
  ] as const
  return keys.flatMap((k) => {
    const p = shop[k]
    return p ? [{ handle: p.handle, title: p.title }] : []
  })
}

/* ─── Search ────────────────────────────────────────────────────────────── */

export const SEARCH_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENT}
  query ProductSearch(
    $query: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $productFilters: [ProductFilter!]
  ) {
    search(
      query: $query
      first: $first
      after: $after
      last: $last
      before: $before
      types: [PRODUCT]
      sortKey: $sortKey
      reverse: $reverse
      productFilters: $productFilters
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        ... on Product {
          ...ProductCard
        }
      }
    }
  }
`

export const PRODUCT_SEARCH_FILTER_OPTIONS_QUERY = /* GraphQL */ `
  query ProductSearchFilterOptions {
    search(
      query: "*"
      first: 1
      types: [PRODUCT]
      productFilters: [{ available: true }]
    ) {
      productFilters {
        id
        label
        values {
          label
          input
        }
      }
    }
  }
`

export type SearchQueryResult = ProductSearchQuery

export type SearchQueryVariables = {
  query: string
  first?: number | null
  after?: string | null
  last?: number | null
  before?: string | null
  sortKey?: SearchSortKeys | null
  reverse?: boolean | null
  productFilters?: ProductFilter[] | null
}

export type ProductSearchFilterOptionsQueryResult =
  ProductSearchFilterOptionsQuery
