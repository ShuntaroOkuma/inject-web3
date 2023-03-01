import Stripe from "stripe";
import { buffer } from "micro";
import { sha256 } from "@/lib/hash";

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
    const userHash = await sha256(data.metadata.userId);

    if (item) {
      item.data.map((i) => {
        // Call API to mint NFT
        const result = fetch("http://localhost:5001/nfts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userHash: userHash,
            name: i.description,
            description: i.description,
            thumbnail: "test",
            metadata: {
              amount_subtotal: String(i.amount_subtotal),
              currency: i.currency,
              quantity: String(i.quantity),
            },
          }),
        }).then((response) => response.json());

        console.log(result);
      });
    }
  }

  return response.status(200).end();
}
