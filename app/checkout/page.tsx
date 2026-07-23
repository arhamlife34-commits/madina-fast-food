"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { cart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("COD");
  const [settings, setSettings] = useState<any>(null);

useEffect(() => {
  fetchSettings();
}, []);

async function fetchSettings() {
  const { data } = await supabase
    .from("settings")
    .select("*")
    .single();

  if (data) {
    setSettings(data);
  }
}

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery =
  cart.length > 0
    ? Number(settings?.delivery_charges || 200)
    : 0;
  const total = subtotal + delivery;

async function placeOrder() {
  if (!name.trim()) {
    alert("Please enter your full name.");
    return;
  }

  if (!phone.trim()) {
    alert("Please enter your phone number.");
    return;
  }

  if (!address.trim()) {
    alert("Please enter your delivery address.");
    return;
  }

  let orderText = `🍔 *Madina Fast Food*%0A%0A`;

  orderText += `👤 *Customer:* ${name}%0A`;
  orderText += `📞 *Phone:* ${phone}%0A`;
  orderText += `📍 *Address:* ${address}%0A`;
  orderText += `💳 *Payment:* ${payment}%0A`;

  if (notes.trim()) {
    orderText += `📝 *Notes:* ${notes}%0A`;
  }

  orderText += `%0A🍽️ *Order Details*%0A`;

  cart.forEach((item) => {

  orderText += `• ${item.name}`;

  if (
    item.selectedSize &&
    item.selectedSize !== "Cheese" &&
    item.selectedSize !== "Fries"
  ) {
    orderText += ` (${item.selectedSize})`;
  }

  orderText += ` × ${item.quantity}%0A`;

  if (item.selectedAddon) {
  orderText += `   + ${item.selectedAddon}`;

  if (item.addonPrice) {
    orderText += ` (+Rs. ${item.addonPrice})`;
  }

  orderText += `%0A`;
}
});
  orderText += `%0A------------------------%0A`;
  orderText += `Subtotal: Rs. ${subtotal}%0A`;
  orderText += `Delivery: Rs. ${delivery}%0A`;
  orderText += `*Grand Total: Rs. ${total}*`;
const { error } = await supabase
  .from("orders")
  .insert([
    {
      customer_name: name,
      phone: phone,
      address: address,
      notes: notes,
      payment_method: payment,
      order_items: cart,
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
  const whatsappNumber =
  settings?.whatsapp?.replace(/\D/g, "") || "923097171862";

window.open(
  `https://wa.me/${whatsappNumber}?text=${orderText}`,
  "_blank"
);

}   

return (
    <section className="bg-gray-100 min-h-screen py-32">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold mb-10">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT */}

          <div className="bg-white rounded-2xl shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Customer Details
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full border rounded-xl p-4"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                className="w-full border rounded-xl p-4"
              />

              <textarea
                placeholder="Delivery Address"
                value={address}
                onChange={(e)=>setAddress(e.target.value)}
                className="w-full border rounded-xl p-4 h-32"
              />

              <textarea
                placeholder="Order Notes (Optional)"
                value={notes}
                onChange={(e)=>setNotes(e.target.value)}
                className="w-full border rounded-xl p-4 h-28"
              />

              <h2 className="text-3xl font-bold mt-10 mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">

                <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:border-red-500 transition">

                  <input
                    type="radio"
                    name="payment"
                    checked={payment==="COD"}
                    onChange={()=>setPayment("COD")}
                  />

                  <span className="font-medium">
                    💵 Cash On Delivery (COD)
                  </span>

                </label>

                <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:border-red-500 transition">

                  <input
                    type="radio"
                    name="payment"
                    checked={payment==="JazzCash"}
                    onChange={()=>setPayment("JazzCash")}
                  />

                  <span className="font-medium">
                    💳 JazzCash
                  </span>

                </label>

                <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:border-red-500 transition">

                  <input
                    type="radio"
                    name="payment"
                    checked={payment==="EasyPaisa"}
                    onChange={()=>setPayment("EasyPaisa")}
                  />

                  <span className="font-medium">
                    💳 Easypaisa
                  </span>

                </label>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="bg-white rounded-2xl shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Order Summary
            </h2>

            <div className="space-y-4">

              {cart.map((item, index)=>(

  <div
    key={index}
    className="flex justify-between"
  >

    <div>

  <span className="font-semibold">
    {item.name}

    {item.selectedSize && (
  <span className="text-red-600 ml-2">
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
      Rs. {item.price * item.quantity}
    </span>

  </div>

))}

              <hr />

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

            <button
              onClick={placeOrder}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold"
            >
              Place Order
            </button>

            <Link
              href="/cart"
              className="block text-center mt-5 text-red-600 font-bold"
            >
              ← Back to Cart
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}