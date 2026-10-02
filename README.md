# Tade Footwear

A Next.js storefront starter for a handmade Nigerian footwear brand. It includes a responsive storefront, a browser-persisted cart, a Stripe-hosted checkout, Supabase product/order storage, Google sign-in through Supabase Auth, and Mailgun order confirmation from a signed Stripe webhook.

## Run locally

1. Install Node.js 20 or later.
2. Copy .env.example to .env.local and fill in the keys below.
3. Run npm install, then npm run dev; open http://localhost:3000.
4. Apply supabase/migrations/202610020001_initial_schema.sql in the Supabase SQL Editor.
5. For local payment testing, run stripe listen --forward-to localhost:3000/api/stripe-webhook, then copy the displayed whsec value into STRIPE_WEBHOOK_SECRET.

Checkout requires Supabase and Stripe configuration. Google sign-in and email are optional until configured.

## Provider setup

### Supabase (database and Google sign-in)

1. Create a Supabase project and run the SQL migration above. It creates a public product catalog and private orders table. Product prices are stored in kobo as integers; the storefront displays naira.
2. In Project Settings → API, copy the project URL and publishable/anon key to NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy the service_role key to SUPABASE_SERVICE_ROLE_KEY as a server-only secret. Never put the service-role key in a NEXT_PUBLIC_ variable or commit it.
3. In Authentication → URL Configuration, set the Site URL to your local URL while developing and later to your Vercel production domain. Add redirect URLs http://localhost:3000/auth/callback and https://YOUR_DOMAIN/auth/callback (plus Vercel preview URLs if you use preview deployments).
4. In Google Cloud Console, create/select a project. Configure the OAuth consent screen (app name, support email, developer contact; publish/verify it before general public launch). Create an OAuth client ID → Web application. Add https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback as an authorized redirect URI in Google Cloud. Copy the Google client ID and secret into Supabase → Authentication → Providers → Google and enable the provider.
5. Set NEXT_PUBLIC_SITE_URL for local and production environments.

Google redirects to Supabase first; Supabase then redirects to the app callback. The callback exchanges the authorization code for a session. Do not put the Google secret in the frontend.

See the official [Supabase Google provider guide](https://supabase.com/docs/guides/auth/social-login/auth-google) and [redirect URL guide](https://supabase.com/docs/guides/auth/redirect-urls) while following the dashboard steps; copy the callback URL shown in your own Supabase project rather than guessing its project reference.

### Stripe payments

For a Nigeria-first shop, compare Paystack before committing to Stripe: Paystack documents Nigerian bank transfer and local card channels. Stripe lists Nigeria under its Extended network, so verify that your merchant account can be activated for your business before choosing it. This starter is wired to Stripe Checkout; switching to Paystack means replacing the payment-session and signature-verification routes, not just changing environment keys. See the [Paystack channel guide](https://paystack.com/docs/payments/payment-channels/) and [Stripe availability](https://stripe.com/global).

1. If Stripe confirms your eligibility, create a Stripe account, enable a supported settlement/payment method for your market, and add test keys to STRIPE_SECRET_KEY.
2. Add a webhook endpoint for https://YOUR_DOMAIN/api/stripe-webhook and subscribe to checkout.session.completed. Put its signing secret in STRIPE_WEBHOOK_SECRET. Use the Stripe CLI forwarding command above for local testing.
3. Test with Stripe test-mode cards before switching to live keys. Configure tax, shipping rates, refunds, and Nigerian payment methods in Stripe before taking real orders. This starter currently lets Stripe-hosted Checkout collect payment; shipping details and delivery pricing need to be tailored to your fulfilment policy.
4. The server reads product prices from Supabase, creates a pending order, and only marks it paid on a verified Stripe webhook. Do not mark an order paid based on a browser redirect.

### Confirmation emails (Mailgun)

Mailgun is the suggested email provider for this starter because the confirmation is sent by a small server-side webhook and can use an authenticated sending domain. Verify a domain you control in Mailgun, publish its required DNS records (including SPF/DKIM), and use a verified sender. Set MAILGUN_API_KEY, MAILGUN_DOMAIN, and MAILGUN_FROM. Keep the API key server-side. Deliverability is limited until the sending domain is verified; use Mailgun's sandbox only for its authorized recipients. See [Mailgun domain verification](https://documentation.mailgun.com/docs/mailgun/user-manual/domains/domains-verify). The webhook logs delivery failures; add an email retry/queue and delivery-status tracking before relying on transactional email at scale.

## Deploy to GitHub and Vercel

1. Create an empty GitHub repository. From this directory run git init, git add ., git commit -m "Build Tade Footwear storefront", then git branch -M main, git remote add origin YOUR_GITHUB_REPOSITORY_URL, and git push -u origin main.
2. In Vercel choose Add New → Project, import that GitHub repository, and keep the detected Next.js settings.
3. Add every needed variable from .env.example in Vercel Project Settings → Environment Variables. Use test Stripe keys first and add secrets separately for Preview and Production.
4. Deploy, then update Supabase Site URL and allowed redirects to the actual Vercel domain. Add the production Stripe webhook URL and copy its signing secret into Vercel, then redeploy.
5. Run a full test purchase and Google login on the deployed domain before switching to Stripe live mode.

## Before launch

- Replace the sample product photography, confirm product descriptions, prices, sizes, inventory, return terms, delivery rates, and contact details.
- The product grid and checkout read the active catalogue and authoritative prices from Supabase. Product-photo design and categories are maintained in that table.
- The current bag uses browser local storage. Add server-side carts/customer profiles if carts must follow a customer between devices.
- Associate orders with Supabase Auth users when customers sign in; this starter records orders by email and keeps them inaccessible to browser clients.
- Add inventory reservation/decrement, failed/expired checkout handling, order management, accessible size guidance, and robust email retries before production.
- The newsletter is a visual starter form and currently opens the visitor's email client; connect a consent-aware mailing-list provider before collecting subscriptions.
- Product photo URLs are remote Unsplash demo images. Replace them with brand-owned images before launch.

## Configuration

See .env.example. Never commit .env.local, Stripe secrets, Mailgun keys, Google client secrets, or the Supabase service-role key.
