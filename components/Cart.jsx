import { useStateContext } from "@/context/StateContext";
import { urlFor } from "@/lib/client";
import getStripe from "@/lib/getStripe";
import Link from "next/link";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const cartRef = useRef();
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuanitity,
    onRemove,
  } = useStateContext();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await getStripe();
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItems),
      }); 


      const data = await response.json();

      if (response.ok) {
        toast.loading("Redirecting...");
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (err) {
      toast.error("Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => {
            setShowCart(false);
          }}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart </span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href={"/"}>
              <button
                type="button"
                onClick={() => {
                  setShowCart(false);
                }}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item, i) => (
              <div className="product" key={i}>
                <img
                  src={urlFor(item?.image[0])}
                  className="cart-product-image"
                  alt={item.name}
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, "dec")
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">
                          {item.quantity}
                        </span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, "inc")
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item._id)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  handleCheckout();
                }}
              >
                PAY WITH STRIPE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
