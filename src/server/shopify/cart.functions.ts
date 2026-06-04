import type {
  CartCreateResult,
  CartDetail,
  CartLinesAddResult,
  CartLinesRemoveResult,
  CartQueryResult,
  CartUserError,
} from '@/lib/queries/shopify/queries'

import { createServerFn } from '@tanstack/react-start'
import { setResponseHeaders } from '@tanstack/react-start/server'

import * as v from 'valibot'

import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_QUERY,
} from '@/lib/queries/shopify/queries'
import { clearCartId, getCartId, setCartId } from '@/server/shopify/cookies'
import { shopifyServerFetch } from '@/server/shopify/storefront-client'

export class CartUserErrorsError extends Error {
  constructor(public readonly userErrors: Array<CartUserError>) {
    super(userErrors.map((e) => e.message).join('\n'))
    this.name = 'CartUserErrorsError'
  }
}

function throwIfUserErrors(errs: Array<CartUserError>) {
  if (errs.length > 0) throw new CartUserErrorsError(errs)
}

function setCartResponseHeaders() {
  // Cart is per-user; do not edge-cache.
  setResponseHeaders(
    new Headers({ 'Cache-Control': 'private, no-store, must-revalidate' }),
  )
}

async function fetchCartById(cartId: string): Promise<CartDetail | null> {
  const result = await shopifyServerFetch<CartQueryResult, { cartId: string }>({
    query: CART_QUERY,
    variables: { cartId },
  })
  return result.cart
}

export const getCart = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CartDetail | null> => {
    setCartResponseHeaders()
    const cartId = getCartId()
    if (!cartId) return null

    const cart = await fetchCartById(cartId)
    // If Shopify pruned the cart (expired/abandoned), clear the stale cookie.
    if (!cart) clearCartId()
    return cart
  },
)

export const addToCart = createServerFn({ method: 'POST' })
  .inputValidator(
    v.object({
      variantId: v.string(),
      quantity: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
    }),
  )
  .handler(async ({ data }): Promise<CartDetail> => {
    setCartResponseHeaders()
    const existingCartId = getCartId()

    if (!existingCartId) {
      const result = await shopifyServerFetch<CartCreateResult>({
        query: CART_CREATE_MUTATION,
        variables: {
          input: {
            lines: [{ merchandiseId: data.variantId, quantity: data.quantity }],
          },
        },
      })
      throwIfUserErrors(result.cartCreate.userErrors)
      const cart = result.cartCreate.cart
      if (!cart) throw new Error('Shopify returned no cart after create.')
      setCartId(cart.id)
      return cart
    }

    const result = await shopifyServerFetch<CartLinesAddResult>({
      query: CART_LINES_ADD_MUTATION,
      variables: {
        cartId: existingCartId,
        lines: [{ merchandiseId: data.variantId, quantity: data.quantity }],
      },
    })
    throwIfUserErrors(result.cartLinesAdd.userErrors)
    const cart = result.cartLinesAdd.cart
    // Existing cart was pruned between requests — recover by creating fresh.
    if (!cart) {
      clearCartId()
      const createResult = await shopifyServerFetch<CartCreateResult>({
        query: CART_CREATE_MUTATION,
        variables: {
          input: {
            lines: [{ merchandiseId: data.variantId, quantity: data.quantity }],
          },
        },
      })
      throwIfUserErrors(createResult.cartCreate.userErrors)
      const newCart = createResult.cartCreate.cart
      if (!newCart)
        throw new Error('Shopify returned no cart after recovery create.')
      setCartId(newCart.id)
      return newCart
    }
    return cart
  })

export const removeCartLine = createServerFn({ method: 'POST' })
  .inputValidator(v.object({ lineId: v.string() }))
  .handler(async ({ data }): Promise<CartDetail> => {
    setCartResponseHeaders()
    const cartId = getCartId()
    if (!cartId) throw new Error('No cart exists to remove from.')

    const result = await shopifyServerFetch<CartLinesRemoveResult>({
      query: CART_LINES_REMOVE_MUTATION,
      variables: { cartId, lineIds: [data.lineId] },
    })
    throwIfUserErrors(result.cartLinesRemove.userErrors)
    const cart = result.cartLinesRemove.cart
    if (!cart) throw new Error('Shopify returned no cart after remove.')
    return cart
  })

export const clearCart = createServerFn({ method: 'POST' }).handler(
  async (): Promise<CartDetail | null> => {
    setCartResponseHeaders()
    const cartId = getCartId()
    if (!cartId) return null

    const cart = await fetchCartById(cartId)
    if (!cart) {
      clearCartId()
      return null
    }

    const lineIds = cart.lines.nodes.map((line) => line.id)
    if (lineIds.length === 0) return cart

    const result = await shopifyServerFetch<CartLinesRemoveResult>({
      query: CART_LINES_REMOVE_MUTATION,
      variables: { cartId, lineIds },
    })
    throwIfUserErrors(result.cartLinesRemove.userErrors)
    const updated = result.cartLinesRemove.cart
    if (!updated) throw new Error('Shopify returned no cart after clear.')
    return updated
  },
)
