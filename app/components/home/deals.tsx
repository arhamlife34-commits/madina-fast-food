"use client";

import { useCart } from "@/app/context/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
export default function Deals() {
  const { addToCart } = useCart();

const [deals, setDeals] = useState<any[]>([]);

useEffect(() => {
  fetchDeals();
}, []);

async function fetchDeals() {
  const { data, error } = await supabase
    .from("deals")
.select("*")
.order("id");

  if (error) {
    console.error(error);
    return;
  }

  setDeals(data || []);
}

  return (
    <section className="bg-black text-white py-20">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <h2 className="text-5xl font-bold">
            Today's Deals
          </h2>

          <p className="text-gray-400 mt-4">
            Limited Time Offers
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {deals.map((deal) => (

            <div
              key={deal.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden shadow-xl border border-zinc-800 hover:border-red-600 hover:-translate-y-2 transition duration-300"
            >

              <div className="bg-red-600 text-center py-3 font-bold">
  🔥 DEAL
</div>

<img
  src={deal.image}
  alt={deal.name}
  className="w-full h-60 object-cover"
/>

<div className="p-8">

  <h3 className="text-3xl font-bold mb-4">
    {deal.name}
  </h3>

  <p className="text-gray-400 mb-8">
    {deal.description}
  </p>

  <div className="text-3xl text-yellow-400 font-bold mb-8">
    Rs. {deal.price}
  </div>

  <button
    onClick={() => addToCart(deal)}
    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition"
  >
    Add to Cart
  </button>

</div>

</div>

          ))}

        </div>

      </div>

    </section>
  );
}