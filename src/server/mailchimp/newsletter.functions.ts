import { createHash } from 'node:crypto'

import { createServerFn } from '@tanstack/react-start'

import * as v from 'valibot'

import { MailchimpNotConfiguredError, getMailchimpEnv } from './env'

export type NewsletterSubscribeResult = {
  status: 'subscribed'
}

export class NewsletterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NewsletterError'
  }
}

/**
 * Add or update a contact in the Mailchimp audience using the Marketing API.
 *
 * Uses `status_if_new: "subscribed"` (single opt-in): new contacts are added
 * immediately, with no confirmation email. Existing contacts keep their
 * current subscription status and have their merge fields updated.
 *
 * @see https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/
 * @see https://mailchimp.com/developer/marketing/docs/fundamentals/#authentication
 */
export const subscribeToNewsletter = createServerFn({ method: 'POST' })
  .inputValidator(
    v.object({
      email: v.pipe(v.string(), v.email('Enter a valid email address.')),
      firstName: v.string(),
      lastName: v.string(),
    }),
  )
  .handler(async ({ data }): Promise<NewsletterSubscribeResult> => {
    const firstName = data.firstName.trim()
    const lastName = data.lastName.trim()
    const email = data.email.trim().toLowerCase()

    if (!firstName) {
      throw new NewsletterError('Enter your first name.')
    }
    if (!lastName) {
      throw new NewsletterError('Enter your last name.')
    }

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

    const subscriberHash = createHash('md5').update(email).digest('hex')
    const url = `https://${env.serverPrefix}.api.mailchimp.com/3.0/lists/${env.audienceId}/members/${subscriberHash}`
    // Mailchimp uses HTTP Basic auth: any username + the API key as password.
    const auth = Buffer.from(`anystring:${env.apiKey}`).toString('base64')

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      }),
    })

    if (response.ok) {
      return { status: 'subscribed' }
    }

    const body = (await response.json().catch(() => null)) as {
      title?: string
      detail?: string
    } | null

    throw new NewsletterError(
      body?.detail ?? 'Something went wrong. Please try again.',
    )
  })
