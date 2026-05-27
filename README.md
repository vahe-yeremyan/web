Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
bun install
bun --bun run dev
```

# Building For Production

To build this application for production:

```bash
bun --bun run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bun --bun run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Uninstall the packages: `bun install @tailwindcss/vite tailwindcss -D`

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
bun --bun run lint
bun --bun run format
bun --bun run check
```

## Deploy to Cloudflare Workers

This project uses the Cloudflare Vite plugin (configured in `vite.config.ts`) and `wrangler.jsonc`:

1. Install Wrangler: `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Deploy: `npx wrangler deploy`

For production env vars, run `wrangler secret put MY_VAR` for each secret listed in `.env.example`. Public (non-secret) vars go in `wrangler.jsonc` under `vars`.

KV, D1, R2, and Durable Object bindings are configured in `wrangler.jsonc` — see https://developers.cloudflare.com/workers/wrangler/configuration/.

# Shopify

Headless Shopify storefront for TanStack Start. Mounts `/shop/*` routes
alongside your existing app — your home page stays untouched.

The default `.env.local` points at Shopify's public Hydrogen demo store, so the
storefront renders real products on first run with zero setup.

## Routes

| Route                       | What it does                                   |
| --------------------------- | ---------------------------------------------- |
| `/shop`                     | Shop landing — featured products + collections |
| `/shop/products/$handle`    | Product detail (variants, images, options)     |
| `/shop/collections/$handle` | Collection grid with sort + pagination         |
| `/shop/cart`                | Cart line items, discount codes, checkout      |
| `/shop/search`              | Product search                                 |
| `/shop/pages/$handle`       | Shopify CMS pages (about, etc.)                |
| `/shop/policies/$handle`    | Privacy, refund, terms, shipping               |

If you opted into customer accounts during scaffold:

| Route                      | What it does             |
| -------------------------- | ------------------------ |
| `/shop/account/login`      | Kick off Shopify OAuth   |
| `/shop/account/callback`   | OAuth callback handler   |
| `/shop/account/logout`     | End the customer session |
| `/shop/account`            | Dashboard                |
| `/shop/account/orders`     | Order history            |
| `/shop/account/orders/$id` | Order detail             |
| `/shop/account/addresses`  | Manage saved addresses   |

## Connect your store

1. In Shopify admin, go to **Settings > Apps and sales channels > Develop apps**.
2. Create a new app, enable the **Storefront API**, and copy the public access token.
3. Set in `.env.local`:
   ```
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_PUBLIC_STOREFRONT_TOKEN=...
   ```
4. (Optional) For higher rate limits + buyer-IP forwarding, also create a private
   token and set `SHOPIFY_PRIVATE_STOREFRONT_TOKEN`.

## Enable customer accounts

If `customerAccount=enabled` was selected during scaffold:

1. In Shopify admin, go to **Settings > Customer accounts > Headless**.
2. Register a public client. Add `http://localhost:3000/shop/account/callback`
   _and_ your production callback URL to the redirect URIs.
3. Copy the Client ID and Shop ID into `.env.local`:
   ```
   SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=...
   SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID=...
   SHOPIFY_SESSION_SECRET=$(openssl rand -hex 32)
   ```

The Hydrogen demo store doesn't have customer accounts configured, so the
default demo creds won't work for `/shop/account/*` — you'll need a real store.

## Architecture

- **Storefront API client** — server-only fetch in `src/server/shopify/storefront-client.ts`.
  All product/cart reads go through the server (private token never reaches the browser).
- **Cart state** — Cart ID stored in an httpOnly cookie (`tanstack_cart_id`). React
  Query owns the cache (single key `['shopify', 'cart']`); optimistic updates with
  a module-level mutation counter to batch invalidations.
- **GraphQL queries** — hand-written strings in `src/lib/queries/shopify/queries.ts`, with
  Storefront API operation types generated into `src/lib/queries/shopify/generated`.
- **Customer accounts** — hand-rolled OAuth 2.1 PKCE with `.well-known` discovery
  (no usable npm client exists yet). Tokens in a signed httpOnly cookie.
- **Checkout** — redirects to `cart.checkoutUrl` (Shopify-hosted).

## Deployment

Works anywhere TanStack Start runs:

- **Node** — `npm run build && npm start`
- **Cloudflare Workers / Shopify Oxygen** — Oxygen is just Workers under the hood;
  build with the Workers preset and deploy to either platform.
- **Vercel / Netlify** — set the env vars in the dashboard.
- **Bun, Deno** — supported via Start's adapters.

For the customer-account flow, register both your local _and_ production
callback URLs in the Shopify admin's headless app config.

## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpm dlx shadcn@latest add button
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router'
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')

  useEffect(() => {
    getServerTime().then(setTime)
  }, [])

  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
