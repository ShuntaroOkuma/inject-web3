import { CartProvider, DebugCart } from "use-shopping-cart";

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY}
      currency="JPY"
      successUrl="http://localhost:3000/success"
      cancelUrl="http://localhost:3000"
    >
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;
