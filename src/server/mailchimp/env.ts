import * as v from 'valibot'

/**
 * Mailchimp Marketing API credentials.
 *
 * Set these as secrets — they must never reach the browser:
 *   - dev:  add to `.env.local`
 *   - prod: `wrangler secret put MAILCHIMP_API_KEY`
 *           `wrangler secret put MAILCHIMP_AUDIENCE_ID`
 *
 * The server prefix / datacenter (e.g. `us21`) is the suffix of the API key,
 * so it doesn't need to be configured separately.
 *
 * @see https://mailchimp.com/developer/marketing/guides/quick-start/
 */
const MailchimpEnvSchema = v.object({
  MAILCHIMP_API_KEY: v.pipe(v.string(), v.minLength(1)),
  MAILCHIMP_AUDIENCE_ID: v.pipe(v.string(), v.minLength(1)),
})

export type MailchimpEnv = {
  apiKey: string
  audienceId: string
  serverPrefix: string
}

export class MailchimpNotConfiguredError extends Error {
  constructor() {
    super(
      'Mailchimp is not configured. Set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID.',
    )
    this.name = 'MailchimpNotConfiguredError'
  }
}

let cached: MailchimpEnv | null = null

function readEnv(name: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[name]
    if (value && value.length > 0) return value
  }
  return undefined
}

export function getMailchimpEnv(): MailchimpEnv {
  if (cached) return cached

  const parsed = v.safeParse(MailchimpEnvSchema, {
    MAILCHIMP_API_KEY: readEnv('MAILCHIMP_API_KEY'),
    MAILCHIMP_AUDIENCE_ID: readEnv('MAILCHIMP_AUDIENCE_ID'),
  })

  if (!parsed.success) {
    throw new MailchimpNotConfiguredError()
  }

  // The dash is the server prefix used in the API base URL.
  const serverPrefix = parsed.output.MAILCHIMP_API_KEY.split('-').at(-1) ?? ''
  if (!serverPrefix) {
    throw new MailchimpNotConfiguredError()
  }

  cached = {
    apiKey: parsed.output.MAILCHIMP_API_KEY,
    audienceId: parsed.output.MAILCHIMP_AUDIENCE_ID,
    serverPrefix,
  }
  return cached
}
