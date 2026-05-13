/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontTypes from './storefront.types.js';

export type ShopQueryVariables = StorefrontTypes.Exact<{ [key: string]: never; }>;


export type ShopQuery = { shop: (
    Pick<StorefrontTypes.Shop, 'name' | 'description'>
    & { primaryDomain: Pick<StorefrontTypes.Domain, 'url'> }
  ) };

export type ProductCardFragment = (
  Pick<StorefrontTypes.Product, 'id' | 'handle' | 'title' | 'productType' | 'tags' | 'publishedAt'>
  & { options: Array<Pick<StorefrontTypes.ProductOption, 'name' | 'values'>>, featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, variants: { nodes: Array<Pick<StorefrontTypes.ProductVariant, 'id' | 'availableForSale'>> }, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
);

export type ProductsQueryVariables = StorefrontTypes.Exact<{
  first: StorefrontTypes.Scalars['Int']['input'];
  after?: StorefrontTypes.InputMaybe<StorefrontTypes.Scalars['String']['input']>;
  sortKey?: StorefrontTypes.InputMaybe<StorefrontTypes.ProductSortKeys>;
  reverse?: StorefrontTypes.InputMaybe<StorefrontTypes.Scalars['Boolean']['input']>;
}>;


export type ProductsQuery = { products: { pageInfo: Pick<StorefrontTypes.PageInfo, 'hasNextPage' | 'endCursor'>, nodes: Array<(
      Pick<StorefrontTypes.Product, 'id' | 'handle' | 'title' | 'productType' | 'tags' | 'publishedAt'>
      & { options: Array<Pick<StorefrontTypes.ProductOption, 'name' | 'values'>>, featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, variants: { nodes: Array<Pick<StorefrontTypes.ProductVariant, 'id' | 'availableForSale'>> }, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
    )> } };

export type ProductQueryVariables = StorefrontTypes.Exact<{
  handle: StorefrontTypes.Scalars['String']['input'];
}>;


export type ProductQuery = { product?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Product, 'id' | 'handle' | 'title' | 'descriptionHtml'>
    & { options: Array<Pick<StorefrontTypes.ProductOption, 'id' | 'name' | 'values'>>, images: { nodes: Array<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }, variants: { nodes: Array<(
        Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
        & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }
      )> }, seo: Pick<StorefrontTypes.Seo, 'title' | 'description'> }
  )> };

export type CollectionsQueryVariables = StorefrontTypes.Exact<{
  first: StorefrontTypes.Scalars['Int']['input'];
}>;


export type CollectionsQuery = { collections: { nodes: Array<(
      Pick<StorefrontTypes.Collection, 'id' | 'handle' | 'title' | 'description'>
      & { image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }
    )> } };

export type CollectionQueryVariables = StorefrontTypes.Exact<{
  handle: StorefrontTypes.Scalars['String']['input'];
  first: StorefrontTypes.Scalars['Int']['input'];
  after?: StorefrontTypes.InputMaybe<StorefrontTypes.Scalars['String']['input']>;
  sortKey?: StorefrontTypes.InputMaybe<StorefrontTypes.ProductCollectionSortKeys>;
  reverse?: StorefrontTypes.InputMaybe<StorefrontTypes.Scalars['Boolean']['input']>;
}>;


export type CollectionQuery = { collection?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Collection, 'id' | 'handle' | 'title' | 'description' | 'descriptionHtml'>
    & { image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, seo: Pick<StorefrontTypes.Seo, 'title' | 'description'>, products: { pageInfo: Pick<StorefrontTypes.PageInfo, 'hasNextPage' | 'endCursor'>, nodes: Array<(
        Pick<StorefrontTypes.Product, 'id' | 'handle' | 'title' | 'productType' | 'tags' | 'publishedAt'>
        & { options: Array<Pick<StorefrontTypes.ProductOption, 'name' | 'values'>>, featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, variants: { nodes: Array<Pick<StorefrontTypes.ProductVariant, 'id' | 'availableForSale'>> }, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
      )> } }
  )> };

export type CartFieldsFragment = (
  Pick<StorefrontTypes.Cart, 'id' | 'checkoutUrl' | 'totalQuantity'>
  & { cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, subtotalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, totalTaxAmount?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>> }, lines: { nodes: Array<(
      Pick<StorefrontTypes.CartLine, 'id' | 'quantity'>
      & { merchandise: (
        Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
        & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
      ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
    ) | (
      Pick<StorefrontTypes.ComponentizableCartLine, 'id' | 'quantity'>
      & { merchandise: (
        Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
        & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
      ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
    )> }, discountCodes: Array<Pick<StorefrontTypes.CartDiscountCode, 'code' | 'applicable'>> }
);

export type CartQueryVariables = StorefrontTypes.Exact<{
  cartId: StorefrontTypes.Scalars['ID']['input'];
}>;


export type CartQuery = { cart?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Cart, 'id' | 'checkoutUrl' | 'totalQuantity'>
    & { cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, subtotalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, totalTaxAmount?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>> }, lines: { nodes: Array<(
        Pick<StorefrontTypes.CartLine, 'id' | 'quantity'>
        & { merchandise: (
          Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
          & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
        ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
      ) | (
        Pick<StorefrontTypes.ComponentizableCartLine, 'id' | 'quantity'>
        & { merchandise: (
          Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
          & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
        ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
      )> }, discountCodes: Array<Pick<StorefrontTypes.CartDiscountCode, 'code' | 'applicable'>> }
  )> };

export type CartCreateMutationVariables = StorefrontTypes.Exact<{
  input: StorefrontTypes.CartInput;
}>;


export type CartCreateMutation = { cartCreate?: StorefrontTypes.Maybe<{ cart?: StorefrontTypes.Maybe<(
      Pick<StorefrontTypes.Cart, 'id' | 'checkoutUrl' | 'totalQuantity'>
      & { cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, subtotalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, totalTaxAmount?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>> }, lines: { nodes: Array<(
          Pick<StorefrontTypes.CartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        ) | (
          Pick<StorefrontTypes.ComponentizableCartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        )> }, discountCodes: Array<Pick<StorefrontTypes.CartDiscountCode, 'code' | 'applicable'>> }
    )>, userErrors: Array<Pick<StorefrontTypes.CartUserError, 'field' | 'message'>> }> };

export type CartLinesAddMutationVariables = StorefrontTypes.Exact<{
  cartId: StorefrontTypes.Scalars['ID']['input'];
  lines: Array<StorefrontTypes.CartLineInput> | StorefrontTypes.CartLineInput;
}>;


export type CartLinesAddMutation = { cartLinesAdd?: StorefrontTypes.Maybe<{ cart?: StorefrontTypes.Maybe<(
      Pick<StorefrontTypes.Cart, 'id' | 'checkoutUrl' | 'totalQuantity'>
      & { cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, subtotalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, totalTaxAmount?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>> }, lines: { nodes: Array<(
          Pick<StorefrontTypes.CartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        ) | (
          Pick<StorefrontTypes.ComponentizableCartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        )> }, discountCodes: Array<Pick<StorefrontTypes.CartDiscountCode, 'code' | 'applicable'>> }
    )>, userErrors: Array<Pick<StorefrontTypes.CartUserError, 'field' | 'message'>> }> };

export type CartLinesUpdateMutationVariables = StorefrontTypes.Exact<{
  cartId: StorefrontTypes.Scalars['ID']['input'];
  lines: Array<StorefrontTypes.CartLineUpdateInput> | StorefrontTypes.CartLineUpdateInput;
}>;


export type CartLinesUpdateMutation = { cartLinesUpdate?: StorefrontTypes.Maybe<{ cart?: StorefrontTypes.Maybe<(
      Pick<StorefrontTypes.Cart, 'id' | 'checkoutUrl' | 'totalQuantity'>
      & { cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, subtotalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, totalTaxAmount?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>> }, lines: { nodes: Array<(
          Pick<StorefrontTypes.CartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        ) | (
          Pick<StorefrontTypes.ComponentizableCartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        )> }, discountCodes: Array<Pick<StorefrontTypes.CartDiscountCode, 'code' | 'applicable'>> }
    )>, userErrors: Array<Pick<StorefrontTypes.CartUserError, 'field' | 'message'>> }> };

export type CartLinesRemoveMutationVariables = StorefrontTypes.Exact<{
  cartId: StorefrontTypes.Scalars['ID']['input'];
  lineIds: Array<StorefrontTypes.Scalars['ID']['input']> | StorefrontTypes.Scalars['ID']['input'];
}>;


export type CartLinesRemoveMutation = { cartLinesRemove?: StorefrontTypes.Maybe<{ cart?: StorefrontTypes.Maybe<(
      Pick<StorefrontTypes.Cart, 'id' | 'checkoutUrl' | 'totalQuantity'>
      & { cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, subtotalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, totalTaxAmount?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>> }, lines: { nodes: Array<(
          Pick<StorefrontTypes.CartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        ) | (
          Pick<StorefrontTypes.ComponentizableCartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        )> }, discountCodes: Array<Pick<StorefrontTypes.CartDiscountCode, 'code' | 'applicable'>> }
    )>, userErrors: Array<Pick<StorefrontTypes.CartUserError, 'field' | 'message'>> }> };

export type CartDiscountCodesUpdateMutationVariables = StorefrontTypes.Exact<{
  cartId: StorefrontTypes.Scalars['ID']['input'];
  discountCodes: Array<StorefrontTypes.Scalars['String']['input']> | StorefrontTypes.Scalars['String']['input'];
}>;


export type CartDiscountCodesUpdateMutation = { cartDiscountCodesUpdate?: StorefrontTypes.Maybe<{ cart?: StorefrontTypes.Maybe<(
      Pick<StorefrontTypes.Cart, 'id' | 'checkoutUrl' | 'totalQuantity'>
      & { cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, subtotalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, totalTaxAmount?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>> }, lines: { nodes: Array<(
          Pick<StorefrontTypes.CartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        ) | (
          Pick<StorefrontTypes.ComponentizableCartLine, 'id' | 'quantity'>
          & { merchandise: (
            Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
            & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, product: Pick<StorefrontTypes.Product, 'handle' | 'title'> }
          ), cost: { totalAmount: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        )> }, discountCodes: Array<Pick<StorefrontTypes.CartDiscountCode, 'code' | 'applicable'>> }
    )>, userErrors: Array<Pick<StorefrontTypes.CartUserError, 'field' | 'message'>> }> };

export type PageQueryVariables = StorefrontTypes.Exact<{
  handle: StorefrontTypes.Scalars['String']['input'];
}>;


export type PageQuery = { page?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Page, 'id' | 'handle' | 'title' | 'body' | 'bodySummary'>
    & { seo?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Seo, 'title' | 'description'>> }
  )> };

export type ShopPoliciesQueryVariables = StorefrontTypes.Exact<{ [key: string]: never; }>;


export type ShopPoliciesQuery = { shop: { privacyPolicy?: StorefrontTypes.Maybe<Pick<StorefrontTypes.ShopPolicy, 'handle' | 'title' | 'body'>>, refundPolicy?: StorefrontTypes.Maybe<Pick<StorefrontTypes.ShopPolicy, 'handle' | 'title' | 'body'>>, termsOfService?: StorefrontTypes.Maybe<Pick<StorefrontTypes.ShopPolicy, 'handle' | 'title' | 'body'>>, shippingPolicy?: StorefrontTypes.Maybe<Pick<StorefrontTypes.ShopPolicy, 'handle' | 'title' | 'body'>> } };

export type SearchQueryVariables = StorefrontTypes.Exact<{
  query: StorefrontTypes.Scalars['String']['input'];
  first: StorefrontTypes.Scalars['Int']['input'];
  after?: StorefrontTypes.InputMaybe<StorefrontTypes.Scalars['String']['input']>;
}>;


export type SearchQuery = { search: (
    Pick<StorefrontTypes.SearchResultItemConnection, 'totalCount'>
    & { pageInfo: Pick<StorefrontTypes.PageInfo, 'hasNextPage' | 'endCursor'>, nodes: Array<(
      Pick<StorefrontTypes.Product, 'id' | 'handle' | 'title' | 'productType' | 'tags' | 'publishedAt'>
      & { options: Array<Pick<StorefrontTypes.ProductOption, 'name' | 'values'>>, featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, variants: { nodes: Array<Pick<StorefrontTypes.ProductVariant, 'id' | 'availableForSale'>> }, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
    )> }
  ) };

interface GeneratedQueryTypes {
  "\n  query Shop {\n    shop {\n      name\n      description\n      primaryDomain {\n        url\n      }\n    }\n  }\n": {return: ShopQuery, variables: ShopQueryVariables},
  "\n  \n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    productType\n    tags\n    publishedAt\n    options {\n      name\n      values\n    }\n    featuredImage {\n      url\n      altText\n      width\n      height\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        availableForSale\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  query Products(\n    $first: Int!\n    $after: String\n    $sortKey: ProductSortKeys\n    $reverse: Boolean\n  ) {\n    products(\n      first: $first\n      after: $after\n      sortKey: $sortKey\n      reverse: $reverse\n    ) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n": {return: ProductsQuery, variables: ProductsQueryVariables},
  "\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      handle\n      title\n      descriptionHtml\n      options {\n        id\n        name\n        values\n      }\n      images(first: 10) {\n        nodes {\n          url\n          altText\n          width\n          height\n        }\n      }\n      variants(first: 100) {\n        nodes {\n          id\n          title\n          availableForSale\n          selectedOptions {\n            name\n            value\n          }\n          price {\n            amount\n            currencyCode\n          }\n          image {\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n      seo {\n        title\n        description\n      }\n    }\n  }\n": {return: ProductQuery, variables: ProductQueryVariables},
  "\n  query Collections($first: Int!) {\n    collections(first: $first, sortKey: TITLE) {\n      nodes {\n        id\n        handle\n        title\n        description\n        image {\n          url\n          altText\n          width\n          height\n        }\n      }\n    }\n  }\n": {return: CollectionsQuery, variables: CollectionsQueryVariables},
  "\n  \n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    productType\n    tags\n    publishedAt\n    options {\n      name\n      values\n    }\n    featuredImage {\n      url\n      altText\n      width\n      height\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        availableForSale\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  query Collection(\n    $handle: String!\n    $first: Int!\n    $after: String\n    $sortKey: ProductCollectionSortKeys\n    $reverse: Boolean\n  ) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      descriptionHtml\n      image {\n        url\n        altText\n        width\n        height\n      }\n      seo {\n        title\n        description\n      }\n      products(\n        first: $first\n        after: $after\n        sortKey: $sortKey\n        reverse: $reverse\n      ) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          ...ProductCard\n        }\n      }\n    }\n  }\n": {return: CollectionQuery, variables: CollectionQueryVariables},
  "\n  \n  fragment CartFields on Cart {\n    id\n    checkoutUrl\n    totalQuantity\n    cost {\n      totalAmount {\n        amount\n        currencyCode\n      }\n      subtotalAmount {\n        amount\n        currencyCode\n      }\n      totalTaxAmount {\n        amount\n        currencyCode\n      }\n    }\n    lines(first: 100) {\n      nodes {\n        id\n        quantity\n        merchandise {\n          ... on ProductVariant {\n            id\n            title\n            availableForSale\n            selectedOptions {\n              name\n              value\n            }\n            price {\n              amount\n              currencyCode\n            }\n            image {\n              url\n              altText\n              width\n              height\n            }\n            product {\n              handle\n              title\n            }\n          }\n        }\n        cost {\n          totalAmount {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    discountCodes {\n      code\n      applicable\n    }\n  }\n\n  query Cart($cartId: ID!) {\n    cart(id: $cartId) {\n      ...CartFields\n    }\n  }\n": {return: CartQuery, variables: CartQueryVariables},
  "\n  query Page($handle: String!) {\n    page(handle: $handle) {\n      id\n      handle\n      title\n      body\n      bodySummary\n      seo {\n        title\n        description\n      }\n    }\n  }\n": {return: PageQuery, variables: PageQueryVariables},
  "\n  query ShopPolicies {\n    shop {\n      privacyPolicy {\n        handle\n        title\n        body\n      }\n      refundPolicy {\n        handle\n        title\n        body\n      }\n      termsOfService {\n        handle\n        title\n        body\n      }\n      shippingPolicy {\n        handle\n        title\n        body\n      }\n    }\n  }\n": {return: ShopPoliciesQuery, variables: ShopPoliciesQueryVariables},
  "\n  \n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    productType\n    tags\n    publishedAt\n    options {\n      name\n      values\n    }\n    featuredImage {\n      url\n      altText\n      width\n      height\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        availableForSale\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  query Search($query: String!, $first: Int!, $after: String) {\n    search(\n      query: $query\n      first: $first\n      after: $after\n      types: [PRODUCT]\n      productFilters: [{ available: true }]\n    ) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      nodes {\n        ... on Product {\n          ...ProductCard\n        }\n      }\n    }\n  }\n": {return: SearchQuery, variables: SearchQueryVariables},
}

interface GeneratedMutationTypes {
  "\n  \n  fragment CartFields on Cart {\n    id\n    checkoutUrl\n    totalQuantity\n    cost {\n      totalAmount {\n        amount\n        currencyCode\n      }\n      subtotalAmount {\n        amount\n        currencyCode\n      }\n      totalTaxAmount {\n        amount\n        currencyCode\n      }\n    }\n    lines(first: 100) {\n      nodes {\n        id\n        quantity\n        merchandise {\n          ... on ProductVariant {\n            id\n            title\n            availableForSale\n            selectedOptions {\n              name\n              value\n            }\n            price {\n              amount\n              currencyCode\n            }\n            image {\n              url\n              altText\n              width\n              height\n            }\n            product {\n              handle\n              title\n            }\n          }\n        }\n        cost {\n          totalAmount {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    discountCodes {\n      code\n      applicable\n    }\n  }\n\n  mutation CartCreate($input: CartInput!) {\n    cartCreate(input: $input) {\n      cart {\n        ...CartFields\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CartCreateMutation, variables: CartCreateMutationVariables},
  "\n  \n  fragment CartFields on Cart {\n    id\n    checkoutUrl\n    totalQuantity\n    cost {\n      totalAmount {\n        amount\n        currencyCode\n      }\n      subtotalAmount {\n        amount\n        currencyCode\n      }\n      totalTaxAmount {\n        amount\n        currencyCode\n      }\n    }\n    lines(first: 100) {\n      nodes {\n        id\n        quantity\n        merchandise {\n          ... on ProductVariant {\n            id\n            title\n            availableForSale\n            selectedOptions {\n              name\n              value\n            }\n            price {\n              amount\n              currencyCode\n            }\n            image {\n              url\n              altText\n              width\n              height\n            }\n            product {\n              handle\n              title\n            }\n          }\n        }\n        cost {\n          totalAmount {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    discountCodes {\n      code\n      applicable\n    }\n  }\n\n  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {\n    cartLinesAdd(cartId: $cartId, lines: $lines) {\n      cart {\n        ...CartFields\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CartLinesAddMutation, variables: CartLinesAddMutationVariables},
  "\n  \n  fragment CartFields on Cart {\n    id\n    checkoutUrl\n    totalQuantity\n    cost {\n      totalAmount {\n        amount\n        currencyCode\n      }\n      subtotalAmount {\n        amount\n        currencyCode\n      }\n      totalTaxAmount {\n        amount\n        currencyCode\n      }\n    }\n    lines(first: 100) {\n      nodes {\n        id\n        quantity\n        merchandise {\n          ... on ProductVariant {\n            id\n            title\n            availableForSale\n            selectedOptions {\n              name\n              value\n            }\n            price {\n              amount\n              currencyCode\n            }\n            image {\n              url\n              altText\n              width\n              height\n            }\n            product {\n              handle\n              title\n            }\n          }\n        }\n        cost {\n          totalAmount {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    discountCodes {\n      code\n      applicable\n    }\n  }\n\n  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {\n    cartLinesUpdate(cartId: $cartId, lines: $lines) {\n      cart {\n        ...CartFields\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CartLinesUpdateMutation, variables: CartLinesUpdateMutationVariables},
  "\n  \n  fragment CartFields on Cart {\n    id\n    checkoutUrl\n    totalQuantity\n    cost {\n      totalAmount {\n        amount\n        currencyCode\n      }\n      subtotalAmount {\n        amount\n        currencyCode\n      }\n      totalTaxAmount {\n        amount\n        currencyCode\n      }\n    }\n    lines(first: 100) {\n      nodes {\n        id\n        quantity\n        merchandise {\n          ... on ProductVariant {\n            id\n            title\n            availableForSale\n            selectedOptions {\n              name\n              value\n            }\n            price {\n              amount\n              currencyCode\n            }\n            image {\n              url\n              altText\n              width\n              height\n            }\n            product {\n              handle\n              title\n            }\n          }\n        }\n        cost {\n          totalAmount {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    discountCodes {\n      code\n      applicable\n    }\n  }\n\n  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {\n    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {\n      cart {\n        ...CartFields\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CartLinesRemoveMutation, variables: CartLinesRemoveMutationVariables},
  "\n  \n  fragment CartFields on Cart {\n    id\n    checkoutUrl\n    totalQuantity\n    cost {\n      totalAmount {\n        amount\n        currencyCode\n      }\n      subtotalAmount {\n        amount\n        currencyCode\n      }\n      totalTaxAmount {\n        amount\n        currencyCode\n      }\n    }\n    lines(first: 100) {\n      nodes {\n        id\n        quantity\n        merchandise {\n          ... on ProductVariant {\n            id\n            title\n            availableForSale\n            selectedOptions {\n              name\n              value\n            }\n            price {\n              amount\n              currencyCode\n            }\n            image {\n              url\n              altText\n              width\n              height\n            }\n            product {\n              handle\n              title\n            }\n          }\n        }\n        cost {\n          totalAmount {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    discountCodes {\n      code\n      applicable\n    }\n  }\n\n  mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {\n    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {\n      cart {\n        ...CartFields\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CartDiscountCodesUpdateMutation, variables: CartDiscountCodesUpdateMutationVariables},
}
declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
