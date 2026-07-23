"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function Hero() {
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

  return (
    <section className="relative pt-24 h-[90vh]">

      {/* Background Image */}
      <Image
        src={settings?.hero_image || "/images/her.jpg"}
        alt={settings?.restaurant_name || "Restaurant"}
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">

        <div className="text-center text-white px-6 max-w-4xl">

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            {settings?.restaurant_name || "Madina Fast Food"}
            <span className="block text-yellow-400">
              Fast Food
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-2xl text-gray-200">
            {settings?.hero_subtitle ||
"Fresh Burgers • Shawarma • Pizza • Crispy Chicken"}
          </p>

          {/* Opening & Closing Time */}
          <p className="mt-4 text-yellow-300 text-lg font-semibold">
            🕒 {settings?.opening_time} - {settings?.closing_time}
          </p>

          {/* Address */}
          <p className="mt-2 text-gray-300">
            📍 {settings?.address}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">

            <a
              href="/menu"
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold text-white transition duration-300 shadow-xl"
            >
              {settings?.order_button_text || "🍔 Order Now"}
            </a>

            <a
              href={`tel:${settings?.phone}`}
              className="bg-yellow-400 hover:bg-yellow-500 px-8 py-4 rounded-xl font-bold text-black transition duration-300 shadow-xl"
            >
              {settings?.call_button_text || "📞 Call Now"}
            </a>

            <a
              href={`https://wa.me/${settings?.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-bold text-white transition duration-300 shadow-xl"
            >
              💬 WhatsApp
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}