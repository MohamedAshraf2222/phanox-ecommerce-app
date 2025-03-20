"use client";

import { useState } from "react";
import { urlFor } from "@/lib/client";
import Product from "@/components/Product";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { useStateContext } from "@/context/StateContext";

export default function ProductDetails({ product, products }) {
  const { image, name, details, price, reviews = [] } = product;
  const [index, setIndex] = useState(0);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<AiFillStar key={i} />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<AiOutlineStar key={i} />);
      } else {
        stars.push(<AiOutlineStar key={i} />);
      }
    }
    return stars;
  };

  const averageRating = calculateAverageRating(reviews);
  const totalReviews = reviews.length;
  const { onAdd, qty, incQty, decQty, setShowCart } = useStateContext();
  const handleBuyNow = () => {
    onAdd(product, qty);
    setShowCart(true);
  };
  return (
    <div>
      <div className="product-detail-container">
        <div className="">
          <div className="img-container">
            <img
              className="product-detail-image"
              src={urlFor(image && image[index])}
              alt={name}
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                src={urlFor(item)}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
                alt=""
                key={i}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>{renderStars(averageRating)}</div>
            <p>({totalReviews} reviews)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                onAdd(product, qty);
              }}
            >
              Add to Cart
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
