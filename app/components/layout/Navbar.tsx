"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function Navbar() {
  const [settings, setSettings] = useState<any>(null);
const [notifications, setNotifications] = useState(0);
const [showNotifications, setShowNotifications] = useState(false);
const [orders, setOrders] = useState<any[]>([]);

useEffect(() => {
  fetchSettings();
  fetchNotifications();
  fetchPendingOrders();
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
async function fetchNotifications() {
  const { count } = await supabase
    .from("orders")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("status", "Pending");

  setNotifications(count || 0);
}
async function fetchPendingOrders() {
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "Pending")
    .order("id", { ascending: false })
    .limit(5);

  setOrders(data || []);
}
useEffect(() => {

  const channel = supabase
    .channel("notification-live")

    .on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "orders",
  },
  () => {
    fetchNotifications();
    fetchPendingOrders();
  }
)

    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, []);
  const { cart } = useCart();


  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );


  return (

    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-lg">


      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">



        {/* Logo */}

        {/* Logo */}

<Link href="/">

<h1 className="text-3xl font-extrabold text-red-700 cursor-pointer">

  {settings?.restaurant_name || "Madina Fast Food"}

</h1>

</Link>




        {/* Navigation */}
<nav
  className="
    flex-1
    overflow-x-auto
    whitespace-nowrap
    mx-6
  "
>

  <div className="flex gap-8 font-semibold text-gray-700 w-max">

    <Link href="/" className="hover:text-red-600">
      Home
    </Link>

    <Link href="/menu" className="hover:text-red-600">
      Menu
    </Link>

    <Link href="/deals" className="hover:text-red-600">
      Deals
    </Link>

    <Link href="/gallery" className="hover:text-red-600">
      Gallery
    </Link>

    <Link href="/reviews" className="hover:text-red-600">
      Reviews
    </Link>

    <Link href="/about" className="hover:text-red-600">
      About
    </Link>

    <Link href="/contact" className="hover:text-red-600">
      Contact
    </Link>

  </div>

</nav>

        {/* Right Side */}

        <div className="flex items-center gap-2 lg:gap-4">

<div className="relative">

  <button
  onClick={() => setShowNotifications(!showNotifications)}
  className="bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-lg lg:text-xl"
>
  🔔
</button>

  {notifications > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
      {notifications}
    </span>
  )}
{showNotifications && (

  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border z-50">

    <div className="p-4 border-b">

      <h3 className="font-bold text-lg">
        Pending Orders
      </h3>

    </div>

    {orders.length === 0 ? (

      <p className="p-4 text-gray-500">
        No Pending Orders
      </p>

    ) : (

      orders.map((order) => (

        <div
          key={order.id}
          className="p-4 border-b hover:bg-gray-50"
        >

          <h4 className="font-bold">
            {order.customer_name}
          </h4>

          <p className="text-sm text-gray-500">
            Rs. {order.total}
          </p>

          <p className="text-xs text-red-600">
            {order.status}
          </p>

        </div>

      ))

    )}

  </div>

)}
</div>
          {/* Cart Button */}

          <Link
  href="/cart"
 className="relative bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 lg:py-3 rounded-xl font-bold transition text-sm lg:text-base"
>

            🛒 Cart


            {cartCount > 0 && (

              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">

                {cartCount}

              </span>

            )}


          </Link>





          {/* Call Button */}

          <a
  href={`tel:${settings?.phone}`}
  className="bg-red-600 hover:bg-red-700 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-xl font-bold transition duration-300 shadow-lg text-sm lg:text-base"
>
  Call Now
</a>


        </div>



      </div>


    </header>

  );

}