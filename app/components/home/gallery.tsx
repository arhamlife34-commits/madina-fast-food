"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";

export default function Gallery() {
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("id");

    if (data) {
      setGallery(data);
    }
  }

  return (
    <section className="relative py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Heading */}

        <div className="mb-16 text-center">

          <p className="mb-3 text-xs font-black tracking-[0.35em] text-yellow-300">
            A TASTE OF SABZAZAR FAST FOOD
          </p>

          <h2 className="text-4xl font-black text-white sm:text-5xl md:text-6xl">

            Food{" "}

            <span className="text-yellow-300">
              Gallery
            </span>

          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
            Fresh ingredients, delicious flavours and premium
            food made with quality in every bite.
          </p>

        </div>


        {/* Gallery grid */}

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

          {gallery.map((item) => (

            <div
              key={item.id}
              className="group relative overflow-hidden rounded-[28px] border border-yellow-400/20 bg-black/60 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-yellow-400/65 hover:shadow-[0_25px_70px_rgba(234,179,8,0.18)]"
            >

              {/* Image */}

              <div className="relative h-80 w-full overflow-hidden">

                <Image
                  src={item.image}
                  alt={item.title || "SABZAZAR FAST FOOD Food"}
                  fill
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 1024px) 50vw,
                         33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

              </div>


              {/* Dark image overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />


              {/* Gold glow */}

              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-yellow-400/20 blur-3xl transition duration-500 group-hover:bg-yellow-400/35" />


              {/* Red accent */}

              <div className="absolute left-0 top-0 h-1.5 w-0 bg-gradient-to-r from-red-600 to-yellow-400 transition-all duration-500 group-hover:w-full" />


              {/* Title */}

              <div className="absolute bottom-0 left-0 right-0 p-6">

                <p className="mb-2 text-[10px] font-black tracking-[0.25em] text-yellow-300">
                  SABZAZAR FAST FOOD SPECIAL
                </p>

                <h3 className="text-2xl font-black text-white">

                  {item.title || "Delicious Food"}

                </h3>

              </div>


              {/* Hover button */}

              <div className="absolute right-5 top-5 flex h-12 w-12 translate-y-[-8px] items-center justify-center rounded-2xl border border-yellow-400/35 bg-black/55 text-xl text-yellow-300 opacity-0 backdrop-blur-md transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">

                ✦

              </div>

            </div>

          ))}

        </div>


        {/* Empty gallery */}

        {gallery.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-black/50 py-20 text-center backdrop-blur-xl">

            <div className="text-5xl">
              🍽️
            </div>

            <h3 className="mt-5 text-2xl font-black text-white">
              Gallery Coming Soon
            </h3>

            <p className="mt-3 text-zinc-400">
              Delicious food photos will appear here.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}