import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method.toLocaleLowerCase() !== "post") {
    return res.status(405).end();
  }
  try {
    const { price, quantity, items } = req.body;
    if (!items) return res.redirect(301, session.url);

    const lineItems = items
      ? items.map((item) => ({
          price: item.id,
          quantity: item.quantity,
          adjustable_quantity: {
            enabled: true,
          },
        }))
      : [
          {
            price,
            quantity,
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
              maximum: 10,
            },
          },
        ];

    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: "2022-11-15",
      maxNetworkRetries: 3,
    });

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${req.headers.origin}`,
      cancel_url: `${req.headers.origin}`,
    });

    res.status(200).json({
      url: session.url,
    });
  } catch (e) {
    console.log(e);
    res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
}
