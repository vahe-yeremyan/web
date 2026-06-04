import { useState } from 'react'

import { toast } from 'sonner'

import { useSubscribeToNewsletter } from '@/hooks/use-newsletter'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const subscribe = useSubscribeToNewsletter()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || subscribe.isPending) return

    subscribe.mutate(trimmed, {
      onSuccess: (result) => {
        if (result.status === 'already-subscribed') {
          toast.info('You’re already subscribed.')
        } else {
          toast.success('Thanks for subscribing!')
        }
        setEmail('')
      },
      onError: (error) => {
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : 'Something went wrong. Please try again.',
        )
      },
    })
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-md text-center">
      <h3 className="font-manrope font-semibold text-black">Newsletter</h3>
      <p className="mt-2 text-sm font-medium text-neutral-600">
        Sign up for updates on new artworks, shows, and more.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="font-manrope min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="hover:bg-primary-accent shrink-0 rounded-md bg-black px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
        >
          {subscribe.isPending ? 'Joining…' : 'Subscribe'}
        </button>
      </form>
    </section>
  )
}
