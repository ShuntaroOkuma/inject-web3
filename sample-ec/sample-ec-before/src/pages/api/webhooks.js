import Stripe from "stripe";
import { buffer } from "micro";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2022-11-15",
});

export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(request, response) {
  const sig = request.headers["stripe-signature"];
  const buf = await buffer(request);

  let event;
  try {
    if (!sig) throw new Error("No signature provided");
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (e) {
    const err = e instanceof Error ? e : new Error("Bad Request");
    console.log(err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const data = event.data.object;
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return response.status(200).end();
  }
  // Run after payment completed
  if (data.payment_status === "paid") {
    const item = await stripe.checkout.sessions.listLineItems(data.id);
    console.log(item);
  }

  return response.status(200).end();
}
