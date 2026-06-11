import { useMutation } from '@tanstack/react-query'

import { subscribeToNewsletter } from '@/server/mailchimp/newsletter.functions'

export type NewsletterSubscribeInput = {
  firstName: string
  lastName: string
  email: string
}

export function useSubscribeToNewsletter() {
  return useMutation({
    mutationFn: (input: NewsletterSubscribeInput) =>
      subscribeToNewsletter({ data: input }),
  })
}
