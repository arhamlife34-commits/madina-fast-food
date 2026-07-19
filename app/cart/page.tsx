"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function CartPage() {
  const [deliveryCharge, setDeliveryCharge] = useState(0);

useEffect(() => {
  fetchSettings();
}, []);

async function fetchSettings() {
  const { data } = await supabase
    .from("settings")
    .select("delivery_charges")
    .single();

  if (data) {
    setDeliveryCharge(data.delivery_charges || 0);
  }
}
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery =
  cart.length > 0 ? deliveryCharge : 0;

  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-7xl mb-5">🛒</div>

          <h1 className="text-4xl font-bold">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-4">
            Looks like you haven't added any food yet.
          </p>

          <Link
            href="/menu"
            className="inline-block mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition"
          >
            Browse Menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 min-h-screen py-32">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold mb-12">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">

            {cart.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-5 flex gap-5 items-center"
              >

                <div className="relative w-36 h-28 rounded-xl overflow-hidden">

                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />

                </div>

                <div className="flex-1">

                  <h2 className="text-2xl font-bold">
                    {item.name}
                  </h2>

                  <p className="text-red-600 font-bold mt-2">
                    Rs. {item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-5">

                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="bg-gray-200 w-10 h-10 rounded-lg"
                    >
                      -
                    </button>

                    <span className="font-bold text-xl">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="bg-gray-200 w-10 h-10 rounded-lg"
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="text-right">

                  <p className="font-bold text-2xl">
                    Rs. {item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-5 text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* RIGHT */}

          <div className="bg-white rounded-2xl shadow-xl p-8 h-fit">

            <h2 className="text-3xl font-bold mb-8">
              Order Summary
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Rs. {delivery}</span>
              </div>

              <hr />

              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>

            </div>

            <Link
  href="/checkout"
  className="block w-full mt-10 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-center transition"
>
  Proceed To Checkout
</Link>

            <Link
              href="/menu"
              className="block mt-5 text-center font-bold text-red-600"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}