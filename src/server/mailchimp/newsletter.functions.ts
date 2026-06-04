import { createServerFn } from '@tanstack/react-start'

import * as v from 'valibot'

import { MailchimpNotConfiguredError, getMailchimpEnv } from './env'

export type NewsletterSubscribeResult = {
  status: 'subscribed' | 'already-subscribed'
}

export class NewsletterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NewsletterError'
  }
}

/**
 * Add an email to the Mailchimp audience using the Marketing API.
 *
 * Uses `status: "subscribed"` (single opt-in): the contact is added to the
 * list immediately, with no confirmation email. Change to `"pending"` for
 * double opt-in.
 *
 * @see https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
 * @see https://mailchimp.com/developer/marketing/docs/fundamentals/#authentication
 */
export const subscribeToNewsletter = createServerFn({ method: 'POST' })
  .inputValidator(
    v.object({
      email: v.pipe(v.string(), v.email('Enter a valid email address.')),
    }),
  )
  .handler(async ({ data }): Promise<NewsletterSubscribeResult> => {
    let env
    try {
      env = getMailchimpEnv()
    } catch (error) {
      if (error instanceof MailchimpNotConfiguredError) {
        throw new NewsletterError(
          'Newsletter signup isn’t available right now.',
        )
      }
      throw error
    }

    const url = `https://${env.serverPrefix}.api.mailchimp.com/3.0/lists/${env.audienceId}/members`
    // Mailchimp uses HTTP Basic auth: any username + the API key as password.
    const auth = Buffer.from(`anystring:${env.apiKey}`).toString('base64')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        email_address: data.email,
        status: 'subscribed',
      }),
    })

    if (response.ok) {
      return { status: 'subscribed' }
    }

    const body = (await response.json().catch(() => null)) as {
      title?: string
      detail?: string
    } | null

    // Mailchimp returns 400 "Member Exists" if the address is already on the
    // list (subscribed, pending, or previously unsubscribed). We surface this
    // as a friendly "already subscribed" rather than an error.
    if (response.status === 400 && body?.title === 'Member Exists') {
      return { status: 'already-subscribed' }
    }

    throw new NewsletterError(
      body?.detail ?? 'Something went wrong. Please try again.',
    )
  })
