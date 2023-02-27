# Sample EC app before web3 injection

## Run app

- Run nextjs app

```sh
npm run dev
```

- Run stripe webhook

```sh
stripe listen --forward-to http://localhost:3000/api/webhooks
```

You need to install Stripe CLI (https://stripe.com/docs/stripe-cli)
