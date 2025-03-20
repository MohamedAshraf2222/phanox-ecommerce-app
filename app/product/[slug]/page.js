import { client } from "@/lib/client";
import ProductDetails from "./ProductDetails";

// Generate static paths for dynamic routes
export async function generateStaticParams() {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;
  const products = await client.fetch(query);

  return products.map((product) => ({
    slug: product.slug.current,
  }));
}

// Fetch product data
async function getProductData(slug) {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const product = await client.fetch(query);
  return product;
}

// Fetch all products (optional, if needed)
async function getAllProducts() {
  const productQuery = '*[_type == "product"]';
  const products = await client.fetch(productQuery);
  return products;
}

// Server Component
export default async function Page({ params }) {
  const { slug } = params;

  // Fetch data
  const product = await getProductData(slug);
  const products = await getAllProducts();

  // Pass data to Client Component
  return <ProductDetails product={product} products={products} />;
}
