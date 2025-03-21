// app/api/checkout_sessions/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const cartItems = await request.json();

    const lineItems = cartItems.map((item) => {
      const img = item.image[0].asset._ref;
      const newImage = img
        .replace("image-", "https://cdn.sanity.io/images/cjfs3ie7/production/")
        .replace("-webp", ".webp");

      return {
        price_data: {
          currency: "aed",
          product_data: {
            name: item.name,
            images: [newImage],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        { shipping_rate: "shr_1R3zxSENZnKBGNxF3WNTRJDq" },
        { shipping_rate: "shr_1R3zygENZnKBGNxFpdWtMYd8" },
      ],
      line_items: lineItems,
      success_url: `${origin}/success`,
      cancel_url: `${origin}/?canceled=true`,
    };

    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ id: session.id });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
