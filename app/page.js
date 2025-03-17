import Product from "@/components/Product";
import { client } from "../lib/client";

import React from "react";
import HeroBanner from "@/components/HeroBanner";
import FooterBanner from "@/components/FooterBanner";
export default async function Home() {
  // Fetch data directly in the component
  const productQuery = '*[_type == "product"]';
  const products = await client.fetch(productQuery);
  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return (
    <div>
      <div>
        <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
        <div className="products-heading">
          <h2>Best Seller Products</h2>
          <p>speaker There are many variations passages</p>
        </div>

        <div className="products-container">
          {products?.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>

        <FooterBanner footerBanner={bannerData && bannerData[0]} />
      </div>
    </div>
  );
}
