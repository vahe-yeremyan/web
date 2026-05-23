import type {
  ErrorComponentProps,
  NotFoundRouteProps,
} from '@tanstack/react-router'

import { Link } from '@tanstack/react-router'

type RouteFallbackProps = {
  title: string
  message: string
  action?: React.ReactNode
}

function RouteFallback({ title, message, action }: RouteFallbackProps) {
  return (
    <main className="min-h-[calc(100dvh-var(--header-height))] pt-[22dvh] pb-16 text-center">
      <section className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-pretty text-neutral-600">
          {message}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {action}
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  )
}

export function NotFoundPage(_props: NotFoundRouteProps) {
  return (
    <RouteFallback
      title="We could not find that page."
      message="The page may have moved, the address may be mistyped, or the artwork you are looking for may no longer be available here."
    />
  )
}

export function ErrorPage({ reset }: ErrorComponentProps) {
  return (
    <RouteFallback
      title="Something went wrong."
      message="This page did not load as expected. You can try again or return to the gallery home page."
      action={
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-black transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
          onClick={reset}
        >
          Try again
        </button>
      }
    />
  )
}
