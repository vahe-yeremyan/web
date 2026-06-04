import { useMutation } from '@tanstack/react-query'

import { subscribeToNewsletter } from '@/server/mailchimp/newsletter.functions'

export function useSubscribeToNewsletter() {
  return useMutation({
    mutationFn: (email: string) => subscribeToNewsletter({ data: { email } }),
  })
}
