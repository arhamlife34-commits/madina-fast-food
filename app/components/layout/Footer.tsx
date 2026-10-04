"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

type Settings = {
  restaurant_name?: string;
  opening_time?: string;
  closing_time?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
};

export default function Footer() {
  const [settings, setSettings] =
    useState<Settings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) {
      console.error(
        "Footer settings error:",
        error
      );
      return;
    }

    if (data) {
      setSettings(data);
    }
  }

  return (
    <footer className="relative w-full overflow-hidden bg-[#081f18] px-0">

      {/* MAIN PREMIUM FOOTER */}

      <div
        className="
          group
          relative
          w-full
          overflow-hidden
          border-t
          border-[#c9a35b]/30
          bg-[#0d2a21]
          shadow-[0_-20px_70px_rgba(0,0,0,0.35)]
        "
      >

        {/* GREEN GLASS BASE */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-br
            from-[#163d30]/95
            via-[#0d2a21]/95
            to-[#071b15]/98
          "
        />

        {/* GOLD TOP SHINE */}

        <div
          className="
            pointer-events-none
            absolute
            left-[-15%]
            top-0
            h-[2px]
            w-[130%]
            bg-gradient-to-r
            from-transparent
            via-[#f0ca72]
            to-transparent
            opacity-70
          "
        />

        {/* GOLD GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -right-40
            -top-40
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#c9a35b]/[0.12]
            blur-[100px]
          "
        />

        {/* GREEN GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-40
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#1d6b50]/[0.22]
            blur-[100px]
          "
        />

        {/* MAIN FOOTER */}

        <section
          className="
            relative
            z-10
            border-b
            border-[#c9a35b]/15
            px-6
            py-10
            sm:px-10
            sm:py-14
            lg:px-14
            lg:py-16
          "
        >

          <div
            className="
              mx-auto
              grid
              max-w-7xl
              grid-cols-1
              gap-12
              lg:grid-cols-[1.25fr_0.75fr]
              lg:gap-20
            "
          >

            {/* LEFT SIDE */}

            <div className="text-left">

              {/* PREMIUM BADGE */}

              <div
                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#c9a35b]/40
                  bg-white/[0.06]
                  px-4
                  py-2
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#f0ca72]
                  shadow-[0_8px_25px_rgba(0,0,0,0.18)]
                  backdrop-blur-xl
                  sm:text-xs
                "
              >
                ✦ Premium Fast Food Experience
              </div>

              {/* LOGO + NAME */}

              <div className="flex items-center gap-5">

                <div
                  className="
                    relative
                    h-20
                    w-20
                    shrink-0
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#c9a35b]/50
                    bg-white/[0.08]
                    p-1
                    shadow-[0_10px_35px_rgba(0,0,0,0.35)]
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    hover:scale-105
                    hover:border-[#f0ca72]/80
                    hover:shadow-[0_15px_45px_rgba(201,163,91,0.22)]
                    sm:h-24
                    sm:w-24
                  "
                >
                  <Image
                    src="/images/logo.png"
                    alt={
                      settings?.restaurant_name ||
                      "SABZAZAR FAST FOOD"
                    }
                    fill
                    sizes="96px"
                    className="
                      rounded-xl
                      object-cover
                    "
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-3xl
                      font-black
                      tracking-tight
                      text-white
                      sm:text-4xl
                    "
                  >
                    {settings?.restaurant_name ||
                      "SABZAZAR FAST FOOD"}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-[#c9a35b]
                      sm:text-xs
                    "
                  >
                    Fresh • Delicious • Made With Care
                  </p>
                </div>

              </div>

              {/* TAGLINE */}

              <h3
                className="
                  mt-6
                  text-2xl
                  font-black
                  text-[#f0ca72]
                  sm:text-3xl
                "
              >
                TASTE WHAT YOU LOVE
              </h3>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-xs
                  leading-6
                  text-white/60
                  sm:text-sm
                  sm:leading-7
                "
              >
                Fresh Fast Food • Fast Delivery • Best Taste
                in Town • Premium Quality
              </p>

              {/* TIME + ADDRESS */}

              <div
                className="
                  mt-5
                  space-y-2
                  text-[10px]
                  font-semibold
                  leading-5
                  text-white/60
                  sm:mt-6
                  sm:space-y-3
                  sm:text-sm
                "
              >
                <p>
                  🕒{" "}
                  {settings?.opening_time ||
                    "12:00 PM"}{" "}
                  -{" "}
                  {settings?.closing_time ||
                    "12:00 AM"}
                </p>

                <p>
                  📍{" "}
                  {settings?.address ||
                    "Lahore, Pakistan"}
                </p>
              </div>

              {/* BUTTONS */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-3
                  sm:mt-8
                "
              >

                {/* ORDER */}

                <Link
                  href="/"
                  className="
                    rounded-xl
                    border
                    border-red-500/40
                    bg-gradient-to-b
                    from-red-600
                    to-red-700
                    px-4
                    py-2.5
                    text-[10px]
                    font-black
                    text-white
                    shadow-[0_8px_25px_rgba(220,38,38,0.22)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:brightness-110
                    sm:px-6
                    sm:py-3
                    sm:text-sm
                  "
                >
                  🍔 Order Now →
                </Link>

                {/* CALL */}

                <a
                  href={`tel:${settings?.phone || ""}`}
                  className="
                    rounded-xl
                    border
                    border-[#c9a35b]/35
                    bg-white/[0.07]
                    px-4
                    py-2.5
                    text-[10px]
                    font-black
                    text-[#f0ca72]
                    shadow-[0_7px_22px_rgba(0,0,0,0.15)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#c9a35b]/65
                    hover:bg-white/[0.12]
                    sm:px-6
                    sm:py-3
                    sm:text-sm
                  "
                >
                  📞 Call Now
                </a>

                {/* WHATSAPP */}

                <a
                  href={`https://wa.me/${settings?.whatsapp || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    rounded-xl
                    border
                    border-green-400/30
                    bg-green-500/[0.10]
                    px-4
                    py-2.5
                    text-[10px]
                    font-black
                    text-green-300
                    shadow-[0_7px_22px_rgba(0,0,0,0.15)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-green-400/60
                    hover:bg-green-500/[0.18]
                    sm:px-6
                    sm:py-3
                    sm:text-sm
                  "
                >
                  💬 WhatsApp
                </a>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div
              className="
                flex
                flex-col
                justify-center
              "
            >

              {/* QUICK LINKS */}

              <h3
                className="
                  text-2xl
                  font-black
                  text-white
                  sm:text-3xl
                "
              >
                Quick Links
              </h3>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-x-8
                  gap-y-3
                  text-xs
                  font-semibold
                  text-white/60
                  sm:mt-6
                  sm:gap-y-4
                  sm:text-sm
                "
              >

                <Link
                  href="/"
                  className="
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:text-[#f0ca72]
                  "
                >
                  Home
                </Link>

                <Link
                  href="/reviews"
                  className="
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:text-[#f0ca72]
                  "
                >
                  Reviews
                </Link>

                <Link
                  href="/about"
                  className="
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:text-[#f0ca72]
                  "
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className="
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:text-[#f0ca72]
                  "
                >
                  Contact
                </Link>

              </div>

              {/* SOCIAL */}

              <div className="mt-8 sm:mt-10">

                <p
                  className="
                    mb-4
                    text-xs
                    font-bold
                    text-white/55
                    sm:text-sm
                  "
                >
                  Follow Us
                </p>

                <div className="flex gap-3 sm:gap-4">

                  {/* FACEBOOK */}

                  <a
                    href={settings?.facebook || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-blue-500/50
                      bg-blue-600
                      text-white
                      shadow-[0_8px_25px_rgba(37,99,235,0.30)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:scale-105
                      hover:brightness-110
                      sm:h-13
                      sm:w-13
                    "
                  >
                    <FaFacebookF size={20} />
                  </a>

                  {/* INSTAGRAM */}

                  <a
                    href={settings?.instagram || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-pink-400/50
                      bg-gradient-to-br
                      from-yellow-400
                      via-pink-500
                      to-purple-600
                      text-white
                      shadow-[0_8px_25px_rgba(236,72,153,0.30)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:scale-105
                      hover:brightness-110
                      sm:h-13
                      sm:w-13
                    "
                  >
                    <FaInstagram size={21} />
                  </a>

                  {/* TIKTOK */}

                  <a
                    href={settings?.tiktok || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/30
                      bg-black
                      text-white
                      shadow-[0_8px_25px_rgba(0,0,0,0.30)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:scale-105
                      hover:brightness-125
                      sm:h-13
                      sm:w-13
                    "
                  >
                    <FaTiktok size={20} />
                  </a>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* COPYRIGHT */}

        <section
          className="
            relative
            z-10
            border-t
            border-[#c9a35b]/15
            bg-black/[0.15]
            px-6
            py-5
            backdrop-blur-xl
            sm:px-10
            sm:py-6
            lg:px-14
          "
        >

          <div
            className="
              mx-auto
              flex
              max-w-7xl
              flex-col
              items-center
              justify-between
              gap-2
              text-center
              text-[10px]
              text-white/40
              sm:flex-row
              sm:text-left
              sm:text-xs
            "
          >

            <p>
              © 2026{" "}
              {settings?.restaurant_name ||
                "SABZAZAR FAST FOOD"}
              . All rights reserved.
            </p>

            <p>
              Fresh Food • Premium Taste
            </p>

          </div>

        </section>

      </div>

    </footer>
  );
}

