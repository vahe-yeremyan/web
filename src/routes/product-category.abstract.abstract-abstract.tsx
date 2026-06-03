import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/product-category/abstract/abstract-abstract',
)({
  beforeLoad: () => {
    throw redirect({
      to: '/product-category/$handle',
      params: { handle: 'abstract' },
      statusCode: 301,
    })
  },
})
