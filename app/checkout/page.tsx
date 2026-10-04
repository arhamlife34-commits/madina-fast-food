"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

type OrderType = "delivery" | "pickup";

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("COD");

  const [settings, setSettings] = useState<any>(null);

  const [orderType, setOrderType] =
    useState<OrderType>("delivery");

  const [pickupBranch, setPickupBranch] =
    useState("");

  /* ================================
     LOAD SETTINGS
  ================================= */

  useEffect(() => {
    fetchSettings();
  }, []);

  /* ================================
     SETTINGS
  ================================= */

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("settings")
      .select("delivery_charges")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setSettings(data);
    }
  }

  /* ================================
     TOTALS
  ================================= */

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const delivery =
    orderType === "delivery"
      ? Number(settings?.delivery_charges ?? 0)
      : 0;

  const total = subtotal + delivery;

  /* ================================
     ESTIMATED TIME
  ================================= */

  const estimatedTime =
    orderType === "pickup"
      ? "15–20 mins"
      : "30–40 mins";

  /* ================================
     PLACE ORDER
  ================================= */

  async function placeOrder() {
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (orderType === "delivery" && !address.trim()) {
      alert("Please enter your complete delivery address.");
      return;
    }

    if (orderType === "pickup" && !pickupBranch.trim()) {
      alert("Please enter your pickup branch.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    /* ================================
       WHATSAPP ORDER
    ================================= */

    let orderText =
      `🍔 *SABZAZAR FAST FOOD*%0A%0A`;

    orderText +=
      `👤 *Customer:* ${name}%0A`;

    orderText +=
      `📞 *Phone:* ${phone}%0A`;

    orderText +=
      `📦 *Order Type:* ${
        orderType === "delivery"
          ? "Delivery"
          : "Pick-Up"
      }%0A`;

    if (orderType === "delivery") {
      orderText +=
        `🏠 *Address:* ${address}%0A`;
    }

    if (orderType === "pickup") {
      orderText +=
        `🏪 *Pickup Branch:* ${pickupBranch}%0A`;
    }

    orderText +=
      `💳 *Payment:* ${payment}%0A`;

    orderText +=
      `⏱️ *Estimated Time:* ${estimatedTime}%0A`;

    if (notes.trim()) {
      orderText +=
        `📝 *Notes:* ${notes}%0A`;
    }

    orderText +=
      `%0A🍽️ *Order Details*%0A`;

    cart.forEach((item) => {
      orderText +=
        `• ${item.name}`;

      if (
        item.selectedSize &&
        item.selectedSize !== "Cheese" &&
        item.selectedSize !== "Fries"
      ) {
        orderText +=
          ` (${item.selectedSize})`;
      }

      orderText +=
        ` × ${item.quantity}%0A`;

      if (item.selectedAddon) {
        orderText +=
          `   + ${item.selectedAddon}`;

        if (item.addonPrice) {
          orderText +=
            ` (+Rs. ${item.addonPrice})`;
        }

        orderText += `%0A`;
      }
    });

    orderText +=
      `%0A------------------------%0A`;

    orderText +=
      `Subtotal: Rs. ${subtotal}%0A`;

    if (orderType === "delivery") {
      orderText +=
        `Delivery: Rs. ${delivery}%0A`;
    }

    orderText +=
      `*Grand Total: Rs. ${total}*`;

    /* ================================
       SAVE ORDER TO SUPABASE
    ================================= */

    const { error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: name,
          phone: phone,

          order_type: orderType,

          city_region: null,

          area_sub_region: null,

          pickup_branch:
            orderType === "pickup"
              ? pickupBranch
              : null,

          address:
            orderType === "delivery"
              ? address
              : null,

          notes: notes,

          payment_method: payment,

          items: cart,

          subtotal: subtotal,

          delivery: delivery,

          total: total,

          status: "Pending",
        },
      ]);

    if (error) {
      alert("Database Error!");
      console.error(error);
      return;
    }

    /* ================================
       SAVE LAST ORDER
    ================================= */

    localStorage.setItem(
      "lastOrder",
      JSON.stringify({
        customer_name: name,

        phone,

        orderType,

        cityRegion: "",

        areaSubRegion: "",

        pickupBranch:
          orderType === "pickup"
            ? pickupBranch
            : "",

        address:
          orderType === "delivery"
            ? address
            : "",

        payment,

        notes,

        subtotal,

        delivery,

        total,

        estimatedTime,

        items: cart,

        whatsappText: orderText,
      })
    );

    /* ================================
       CLEAR CART
    ================================= */

    clearCart();

    localStorage.removeItem("cart");

    /* ================================
       SUCCESS PAGE
    ================================= */

    router.push("/order-success");
  }

  return (
    <section className="min-h-screen bg-gray-100 py-32">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="mb-10 text-5xl font-bold">
          Checkout
        </h1>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* =================================
              LEFT SIDE
          ================================= */}

          <div className="rounded-2xl bg-white p-8 shadow-xl">

            <h2 className="mb-8 text-3xl font-bold">
              Customer Details
            </h2>

            <div className="space-y-5">

              {/* NAME */}

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-xl border p-4"
              />

              {/* PHONE */}

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="w-full rounded-xl border p-4"
              />

              {/* ORDER TYPE */}

              <div>
                <p className="mb-3 text-sm font-bold text-gray-600">
                  Order Type
                </p>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setOrderType("delivery")
                    }
                    className={`
                      rounded-xl
                      border
                      p-4
                      font-black
                      transition
                      ${
                        orderType === "delivery"
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-red-400"
                      }
                    `}
                  >
                    🚚 Delivery
                  </button>

        
                </div>
              </div>

              {/* DELIVERY ADDRESS */}

              {orderType === "delivery" && (
                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-600">
                    Complete Delivery Address
                  </label>

                  <textarea
                    placeholder="House / Shop No, Street, Block, Road, Landmark..."
                    value={address}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                    className="h-32 w-full rounded-xl border p-4 outline-none focus:border-red-500"
                  />

                </div>
              )}

  
              {/* NOTES */}

              <textarea
                placeholder="Order Notes (Optional)"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                className="h-28 w-full rounded-xl border p-4"
              />

              {/* PAYMENT */}

              <h2 className="mb-6 mt-10 text-3xl font-bold">
                Payment Method
              </h2>

              <div className="space-y-4">

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition hover:border-red-500">

                  <input
                    type="radio"
                    name="payment"
                    checked={payment === "COD"}
                    onChange={() =>
                      setPayment("COD")
                    }
                  />

                  <span className="font-medium">
                    💵 Cash On Delivery (COD)
                  </span>

                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition hover:border-red-500">

                  <input
                    type="radio"
                    name="payment"
                    checked={
                      payment === "JazzCash"
                    }
                    onChange={() =>
                      setPayment("JazzCash")
                    }
                  />

                  <span className="font-medium">
                    💳 JazzCash
                  </span>

                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition hover:border-red-500">

                  <input
                    type="radio"
                    name="payment"
                    checked={
                      payment === "EasyPaisa"
                    }
                    onChange={() =>
                      setPayment("EasyPaisa")
                    }
                  />

                  <span className="font-medium">
                    💳 Easypaisa
                  </span>

                </label>

              </div>

            </div>
          </div>

          {/* =================================
              RIGHT SIDE
          ================================= */}

          <div className="rounded-2xl bg-white p-8 shadow-xl">

            <h2 className="mb-8 text-3xl font-bold">
              Order Summary
            </h2>

            {/* ITEMS */}

            <div className="space-y-4">

              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedAddon}-${index}`}
                  className="flex justify-between"
                >

                  <div>

                    <span className="font-semibold">

                      {item.name}

                      {item.selectedSize && (
                        <span className="ml-2 text-red-600">
                          ({item.selectedSize})
                        </span>
                      )}

                      {" × "}
                      {item.quantity}

                    </span>

                    {item.selectedAddon && (
                      <p className="text-sm text-green-600">
                        + {item.selectedAddon}

                        {item.addonPrice
                          ? ` (+Rs. ${item.addonPrice})`
                          : ""}
                      </p>
                    )}

                  </div>

                  <span>
                    Rs.{" "}
                    {item.price * item.quantity}
                  </span>

                </div>
              ))}

              <hr />

              {/* SUBTOTAL */}

              <div className="flex justify-between">
                <span>
                  Subtotal
                </span>

                <span>
                  Rs. {subtotal}
                </span>
              </div>

              {/* DELIVERY CHARGES */}

              {orderType === "delivery" && (
                <div className="flex justify-between">
                  <span>
                    Delivery
                  </span>

                  <span>
                    Rs. {delivery}
                  </span>
                </div>
              )}

             

              {/* ESTIMATED TIME */}

              <div className="flex justify-between rounded-xl bg-gray-50 p-4">

                <span className="font-semibold">
                  Estimated Time
                </span>

                <span className="font-black text-red-600">
                  {estimatedTime}
                </span>

              </div>

              <hr />

              {/* TOTAL */}

              <div className="flex justify-between text-2xl font-bold">

                <span>
                  Total
                </span>

                <span>
                  Rs. {total}
                </span>

              </div>

            </div>

            {/* PLACE ORDER */}

            <button
              onClick={placeOrder}
              className="mt-8 w-full rounded-xl bg-green-600 py-4 font-bold text-white hover:bg-green-700"
            >
              Place Order
            </button>

            <Link
              href="/cart"
              className="mt-5 block text-center font-bold text-red-600"
            >
              ← Back to Cart
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}