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
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <h2 className="text-5xl font-bold">
            Food Gallery
          </h2>

          <p className="text-gray-500 mt-4">
            Fresh • Delicious • 100% Halal
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {gallery.map((item, index) => (

            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
            >

              <div className="relative w-full h-72">

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width:768px) 100vw,
                         (max-width:1200px) 50vw,
                         33vw"
                  className="object-cover group-hover:scale-110 transition duration-500"
                />

              </div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300" />

              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {item.title}
              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}