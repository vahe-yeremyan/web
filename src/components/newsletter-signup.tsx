import { useState } from 'react'

import { toast } from 'sonner'

import { useSubscribeToNewsletter } from '@/hooks/use-newsletter'

export function NewsletterSignup() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const subscribe = useSubscribeToNewsletter()

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    }
    if (!input.firstName || !input.lastName || !input.email) return
    if (subscribe.isPending) return

    subscribe.mutate(input, {
      onSuccess: () => {
        toast.success('Thanks for subscribing!')
        setFirstName('')
        setLastName('')
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

      <form onSubmit={handleSubmit} className="mt-4 grid gap-2 sm:grid-cols-2">
        <label htmlFor="newsletter-first-name" className="sr-only">
          First name
        </label>
        <input
          id="newsletter-first-name"
          type="text"
          required
          autoComplete="given-name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="First name"
          className="font-manrope min-w-0 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
        />

        <label htmlFor="newsletter-last-name" className="sr-only">
          Last name
        </label>
        <input
          id="newsletter-last-name"
          type="text"
          required
          autoComplete="family-name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Last name"
          className="font-manrope min-w-0 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
        />

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
          className="font-manrope min-w-0 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none sm:col-span-2"
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="hover:bg-primary-accent rounded-md bg-black px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 sm:col-span-2"
        >
          {subscribe.isPending ? 'Joining…' : 'Subscribe'}
        </button>
      </form>
    </section>
  )
}
