import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/prints')({
  beforeLoad: () => {
    throw redirect({ to: '/', statusCode: 301 })
  },
})
