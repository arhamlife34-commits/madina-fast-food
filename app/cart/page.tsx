"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function CartPage() {
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  /* ================================
     LOAD DELIVERY CHARGE
  ================================= */

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("settings")
      .select("delivery_charges")
      .single();

    if (error) {
      console.error("Settings Error:", error);
      return;
    }

    if (data) {
      setDeliveryCharge(
        Number(data.delivery_charges || 0)
      );
    }
  }

  /* ================================
     SUBTOTAL
  ================================= */

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /* ================================
     ORDER TYPE
  ================================= */

  const orderType =
    typeof window !== "undefined"
      ? localStorage.getItem("orderType") ||
        "delivery"
      : "delivery";

  /* ================================
     DELIVERY
  ================================= */

  const delivery =
    cart.length > 0 &&
    orderType === "delivery"
      ? deliveryCharge
      : 0;

  const total = subtotal + delivery;

  /* ================================
     EMPTY CART
  ================================= */

  if (cart.length === 0) {
    return (
      <section
        className="
          min-h-screen
          bg-[#f8f6f2]
          px-4
          py-24
          sm:px-6
          sm:py-32
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[60vh]
            max-w-5xl
            items-center
            justify-center
          "
        >
          <div
            className="
              w-full
              max-w-2xl
              rounded-[28px]
              border
              border-[#e8e1d7]
              bg-white
              px-6
              py-14
              text-center
              shadow-[0_20px_60px_rgba(58,42,25,0.08)]
              sm:px-12
              sm:py-16
            "
          >
            {/* ICON */}

            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-[#f5eee5]
                text-4xl
                shadow-[inset_0_0_0_1px_rgba(120,88,52,0.08)]
              "
            >
              🛒
            </div>

            {/* TITLE */}

            <h1
              className="
                mt-7
                text-3xl
                font-black
                tracking-tight
                text-[#29241f]
                sm:text-4xl
              "
            >
              Your Cart is Empty
            </h1>

            {/* LINE */}

            <div className="my-5 flex items-center justify-center">
              <div className="h-px w-12 bg-[#ded2c2]" />

              <div className="mx-3 h-1.5 w-1.5 rotate-45 bg-[#c9a66b]" />

              <div className="h-px w-12 bg-[#ded2c2]" />
            </div>

            <p className="text-sm text-[#82776c] sm:text-base">
              Looks like you haven't added any food yet.
            </p>

            {/* BUTTON */}

            <Link
              href="/"
              className="
                mt-8
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#b91c1c]
                px-8
                py-3.5
                text-sm
                font-black
                uppercase
                tracking-wide
                text-white
                shadow-[0_8px_20px_rgba(185,28,28,0.18)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#991b1b]
                hover:shadow-[0_12px_25px_rgba(185,28,28,0.22)]
              "
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ================================
     CART PAGE
  ================================= */

  return (
    <section
      className="
        min-h-screen
        bg-[#f8f6f2]
        px-4
        py-24
        sm:px-6
        sm:py-28
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* =========================================
            PAGE TITLE
        ========================================= */}

        <div className="mb-10 sm:mb-12">

          <p
            className="
              mb-2
              text-center
              text-[10px]
              font-black
              uppercase
              tracking-[0.35em]
              text-[#b91c1c]
              sm:text-xs
            "
          >
            Your Order
          </p>

          <h1
            className="
              text-center
              text-3xl
              font-black
              tracking-tight
              text-[#29241f]
              sm:text-5xl
            "
          >
            Shopping Cart
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center">
            <div className="h-px w-14 bg-[#ded2c2] sm:w-20" />

            <div className="mx-3 h-1.5 w-1.5 rotate-45 bg-[#c9a66b]" />

            <div className="h-px w-14 bg-[#ded2c2] sm:w-20" />
          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">

          {/* ================================
              LEFT SIDE
          ================================= */}

          <div className="space-y-4 lg:col-span-2">

            {cart.map((item, index) => (

              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedAddon}-${index}`}
                className="
                  group
                  rounded-[22px]
                  border
                  border-[#e8e1d7]
                  bg-white
                  p-3
                  shadow-[0_8px_30px_rgba(58,42,25,0.055)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#d9cdbd]
                  hover:shadow-[0_15px_40px_rgba(58,42,25,0.09)]
                  sm:p-4
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:gap-5
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      relative
                      h-40
                      w-full
                      shrink-0
                      overflow-hidden
                      rounded-[17px]
                      bg-[#f3eee7]
                      sm:h-28
                      sm:w-36
                    "
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-[1.04]
                        "
                      />
                    )}
                  </div>

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">

                    <h2
                      className="
                        line-clamp-2
                        text-lg
                        font-black
                        uppercase
                        tracking-wide
                        text-[#29241f]
                        sm:text-xl
                      "
                    >
                      {item.name}
                    </h2>

                    {item.selectedSize && (
                      <p className="mt-1.5 text-sm font-medium text-[#81766b]">
                        Size:{" "}
                        <span className="font-bold text-[#554b42]">
                          {item.selectedSize}
                        </span>
                      </p>
                    )}

                    {item.selectedAddon && (
                      <p className="mt-1 text-sm font-medium text-[#81766b]">
                        + {item.selectedAddon}

                        {item.addonPrice
                          ? ` (+Rs. ${item.addonPrice})`
                          : ""}
                      </p>
                    )}

                    <p
                      className="
                        mt-2
                        text-base
                        font-black
                        text-[#a16207]
                      "
                    >
                      Rs. {item.price}
                    </p>

                    {/* QUANTITY */}

                    <div className="mt-4 flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQty(
                            item.id,
                            item.selectedSize,
                            item.selectedAddon
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-[#ddd3c7]
                          bg-[#faf8f5]
                          text-lg
                          font-bold
                          text-[#4b433c]
                          transition-all
                          hover:border-[#c8b8a5]
                          hover:bg-[#f2ece4]
                          active:scale-95
                        "
                      >
                        −
                      </button>

                      <span
                        className="
                          min-w-[30px]
                          text-center
                          text-base
                          font-black
                          text-[#29241f]
                        "
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQty(
                            item.id,
                            item.selectedSize,
                            item.selectedAddon
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-[#ddd3c7]
                          bg-[#faf8f5]
                          text-lg
                          font-bold
                          text-[#4b433c]
                          transition-all
                          hover:border-[#c8b8a5]
                          hover:bg-[#f2ece4]
                          active:scale-95
                        "
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-t
                      border-[#eee8df]
                      pt-3
                      sm:block
                      sm:min-w-[130px]
                      sm:border-t-0
                      sm:pt-0
                      sm:text-right
                    "
                  >

                    <p
                      className="
                        text-lg
                        font-black
                        text-[#29241f]
                        sm:text-xl
                      "
                    >
                      Rs.{" "}
                      {item.price * item.quantity}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(
                          item.id,
                          item.selectedSize,
                          item.selectedAddon
                        )
                      }
                      className="
                        text-xs
                        font-black
                        uppercase
                        tracking-wide
                        text-[#b91c1c]
                        transition
                        hover:text-[#991b1b]
                        hover:underline
                      "
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* ================================
              RIGHT SIDE SUMMARY
          ================================= */}

          <div
            className="
              h-fit
              rounded-[24px]
              border
              border-[#e4dbcf]
              bg-white
              p-6
              shadow-[0_12px_40px_rgba(58,42,25,0.07)]
              lg:sticky
              lg:top-28
              sm:p-8
            "
          >

            <h2
              className="
                text-2xl
                font-black
                tracking-tight
                text-[#29241f]
                sm:text-3xl
              "
            >
              Order Summary
            </h2>

            <div className="mt-5 flex items-center">
              <div className="h-px flex-1 bg-[#e7dfd5]" />

              <div className="mx-3 h-1.5 w-1.5 rotate-45 bg-[#c9a66b]" />

              <div className="h-px flex-1 bg-[#e7dfd5]" />
            </div>

            <div className="mt-7 space-y-5 text-sm">

              {/* SUBTOTAL */}

              <div className="flex justify-between gap-4">

                <span className="text-[#746a61]">
                  Subtotal
                </span>

                <span className="font-black text-[#29241f]">
                  Rs. {subtotal}
                </span>

              </div>

              {/* DELIVERY */}

              {orderType === "delivery" && (
                <div className="flex justify-between gap-4">

                  <span className="text-[#746a61]">
                    Delivery
                  </span>

                  <span className="font-black text-[#29241f]">
                    Rs. {delivery}
                  </span>

                </div>
              )}

              {/* PICKUP */}

              {orderType === "pickup" && (
                <div className="flex justify-between gap-4">

                  <span className="text-[#746a61]">
                    Pick-Up
                  </span>

                  <span className="font-black text-green-600">
                    Free
                  </span>

                </div>
              )}

              <div className="h-px bg-[#e7dfd5]" />

              {/* TOTAL */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  text-xl
                  font-black
                  sm:text-2xl
                "
              >

                <span className="text-[#29241f]">
                  Total
                </span>

                <span className="text-[#a16207]">
                  Rs. {total}
                </span>

              </div>

            </div>

            {/* CHECKOUT */}

            <Link
              href="/checkout"
              className="
                mt-8
                block
                w-full
                rounded-xl
                bg-[#b91c1c]
                py-4
                text-center
                text-sm
                font-black
                uppercase
                tracking-wide
                text-white
                shadow-[0_8px_20px_rgba(185,28,28,0.18)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#991b1b]
                hover:shadow-[0_12px_25px_rgba(185,28,28,0.23)]
                active:translate-y-0
              "
            >
              Proceed To Checkout
            </Link>

            {/* CONTINUE */}

            <Link
              href="/"
              className="
                mt-5
                block
                text-center
                text-sm
                font-bold
                text-[#8b5e34]
                transition
                hover:text-[#5f3d21]
                hover:underline
              "
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}