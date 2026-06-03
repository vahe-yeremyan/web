import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/product-category/prints')({
  beforeLoad: () => {
    throw redirect({ to: '/', statusCode: 301 })
  },
})
