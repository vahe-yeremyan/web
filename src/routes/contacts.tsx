import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/contacts')({
  beforeLoad: () => {
    throw redirect({ href: '/about#contact', statusCode: 301 })
  },
})
