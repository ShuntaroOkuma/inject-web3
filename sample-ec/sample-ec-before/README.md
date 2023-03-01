# Sample EC app BEFORE web3 injection

This is the sample EC app **before** injecting web3.

This app uses Stripe API, so you need to prepare Stripe API Key and set env params to `.env` file.

`.env` file sample:

```
STRIPE_API_KEY=rk_test_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY=pk_test_xxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx
```

## Run app

- Run nextjs app

```sh
npm install
npm run dev
```

- Run stripe webhook

```sh
stripe listen --forward-to http://localhost:3000/api/webhooks
```

You need to install Stripe CLI (https://stripe.com/docs/stripe-cli)
