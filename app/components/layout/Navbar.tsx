"use client";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function Navbar() {
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
  const { cart } = useCart();


  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
const [mobileMenu, setMobileMenu] = useState(false);

  return (

    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-lg">


     <div className="max-w-7xl mx-auto flex items-center justify-between px-3 lg:px-6 py-3 lg:py-4">



        {/* Logo */}

        {/* Logo */}

<Link href="/" className="flex items-center gap-3">

  <Image
    src="/images/her.jpg"
    alt="Madina Fast Food Logo"
    width={55}
    height={55}
    priority
    className="rounded-full object-cover"
  />

  <h1 className="text-xl lg:text-3xl font-extrabold text-red-700 cursor-pointer whitespace-nowrap">

    {settings?.restaurant_name || "Madina Fast Food"}

  </h1>

</Link>




        {/* Navigation */}
<nav className="hidden lg:flex flex-1 justify-center gap-8 font-semibold text-gray-700">

  <Link href="/" className="hover:text-red-600">Home</Link>

  <Link href="/menu" className="hover:text-red-600">Menu</Link>

  <Link href="/deals" className="hover:text-red-600">Deals</Link>

  <Link href="/gallery" className="hover:text-red-600">Gallery</Link>

  <Link href="/reviews" className="hover:text-red-600">Reviews</Link>

  <Link href="/about" className="hover:text-red-600">About</Link>

  <Link href="/contact" className="hover:text-red-600">Contact</Link>

</nav>
        {/* Right Side */}

        <div className="flex items-center gap-2 lg:gap-4">

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
<button
  onClick={() => setMobileMenu(!mobileMenu)}
  className="lg:hidden p-2"
>
  {mobileMenu ? <X size={28} /> : <Menu size={28} />}
</button>

        </div>



      </div>

{mobileMenu && (

  <div className="lg:hidden bg-white shadow-xl border-t">

    <Link
      href="/"
      onClick={() => setMobileMenu(false)}
      className="block px-6 py-4 border-b"
    >
      Home
    </Link>

    <Link
      href="/menu"
      onClick={() => setMobileMenu(false)}
      className="block px-6 py-4 border-b"
    >
      Menu
    </Link>

    <Link
      href="/deals"
      onClick={() => setMobileMenu(false)}
      className="block px-6 py-4 border-b"
    >
      Deals
    </Link>

    <Link
      href="/gallery"
      onClick={() => setMobileMenu(false)}
      className="block px-6 py-4 border-b"
    >
      Gallery
    </Link>

    <Link
      href="/reviews"
      onClick={() => setMobileMenu(false)}
      className="block px-6 py-4 border-b"
    >
      Reviews
    </Link>

    <Link
      href="/about"
      onClick={() => setMobileMenu(false)}
      className="block px-6 py-4 border-b"
    >
      About
    </Link>

    <Link
      href="/contact"
      onClick={() => setMobileMenu(false)}
      className="block px-6 py-4"
    >
      Contact
    </Link>

  </div>

)}
    </header>

  );

}