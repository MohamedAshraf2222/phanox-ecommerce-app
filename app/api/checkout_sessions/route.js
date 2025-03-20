// app/api/checkout_sessions/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
// cjfs3ie7;
// [
//   {
//     price: 55,
//     _createdAt: "2025-03-17T07:52:33Z",
//     _rev: "gUA6qUatzsy41LSS7FWcci",
//     details: "A second pair of headphones",
//     _id: "7d17221a-db4d-40a5-a7ee-5bf1153d8d99",
//     _updatedAt: "2025-03-17T07:56:13Z",
//     slug: {
//       current: "headphone_c",
//       _type: "slug",
//     },
//     image: [
//       {
//         asset: {
//           _ref: "image-797f8df56017feb72288e218fd6957ef068d7b44-700x700-webp",
//           _type: "reference",
//         },
//         _type: "image",
//         _key: "4a3b5ddd973e",
//       },
//       {
//         _type: "image",
//         _key: "b511ac030d3c",
//         asset: {
//           _ref: "image-04f8a489a3f3b726d8cf0709fbe561ff0ed82fad-900x900-webp",
//           _type: "reference",
//         },
//       },
//       {
//         asset: {
//           _type: "reference",
//           _ref: "https://cdn.sanity.io/images/cjfs3ie7/production/058225fc820fe15a1c63697367a905959a5f32a6-555x555.webp",
//         },
//         _type: "image",
//         _key: "1adc375c83f9",
//       },
//       {
//         asset: {
//           _ref: "image-a099db30fab841ce69c573f7409251824748e490-600x600-webp",
//           _type: "reference",
//         },
//         _type: "image",
//         _key: "66a7b2cb492a",
//       },
//     ],
//     _type: "product",
//     name: "Headphone",
//     quantity: 1,
//   },
// ];

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
