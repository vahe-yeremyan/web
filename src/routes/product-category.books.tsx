import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/product-category/books')({
  beforeLoad: () => {
    throw redirect({ to: '/books', statusCode: 301 })
  },
})
