"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Burger",
    title: "Signature Burgers",
    image: "/categories/burger.jpg",
    emoji: "🍔",
  },
  {
    name: "Pizza",
    title: "Stone Baked Pizza",
    image: "/categories/pizza.jpg",
    emoji: "🍕",
  },
  {
    name: "Shawarma",
    title: "Special Shawarma",
    image: "/categories/shawarma.jpg",
    emoji: "🌯",
  },
  {
    name: "Fries",
    title: "Loaded Fries",
    image: "/categories/fries.jpg",
    emoji: "🍟",
  },
  {
    name: "Platter",
    title: "Family Platters",
    image: "/categories/platter.jpg",
    emoji: "🍗",
  },
  {
    name: "Pratha Roll",
    title: "Pratha Rolls",
    image: "/categories/pratha.jpg",
    emoji: "🌮",
  },
  {
    name: "Special Sandwich",
    title: "Club Sandwiches",
    image: "/categories/sandwich.jpg",
    emoji: "🥪",
  },
  {
    name: "Special Grill Items",
    title: "Grill Specials",
    image: "/categories/grill.jpg",
    emoji: "🔥",
  },
];

export default function FeaturedMenu() {
  return (
    <section className="relative py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Heading */}

        <div className="mb-16 text-center">

          <p className="mb-3 text-xs font-black tracking-[0.35em] text-yellow-300">
            EXPLORE OUR FLAVOURS
          </p>

          <h2 className="text-4xl font-black text-white sm:text-5xl md:text-6xl">
            Browse Our{" "}

            <span className="text-yellow-300">
              Menu
            </span>

          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
            Choose your favourite category and discover fresh,
            delicious and premium food made for every craving.
          </p>

        </div>


        {/* Category cards */}

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (

            <Link
              key={category.name}
              href={`/menu?category=${encodeURIComponent(
                category.name
              )}`}
              className="group"
            >

              <div className="relative overflow-hidden rounded-[28px] border border-yellow-400/25 bg-black/65 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-yellow-400/70 hover:shadow-[0_25px_70px_rgba(234,179,8,0.2)]">


                {/* Image */}

                <div className="relative h-72 overflow-hidden">

                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />


                  {/* Image overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />


                  {/* Red glow */}

                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-600/30 blur-3xl transition duration-500 group-hover:bg-red-500/50" />


                  {/* Emoji */}

                  <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/35 bg-black/55 text-3xl backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:rotate-6">

                    {category.emoji}

                  </div>


                  {/* Title */}

                  <div className="absolute bottom-6 left-6 right-6">

                    <p className="mb-2 text-[10px] font-black tracking-[0.25em] text-yellow-300">
                      SABZAZAR FAST FOOD SPECIAL
                    </p>

                    <h3 className="text-2xl font-black leading-tight text-white">
                      {category.title}
                    </h3>

                  </div>

                </div>


                {/* Bottom area */}

                <div className="flex items-center justify-between bg-black/75 px-5 py-5">

                  <div>

                    <p className="text-xs font-bold text-zinc-500">
                      Discover our
                    </p>

                    <span className="text-base font-black text-white">
                      Explore Menu
                    </span>

                  </div>


                  {/* Arrow */}

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-red-500 to-red-700 text-xl font-black text-black shadow-[0_6px_0_#991b1b] transition duration-300 group-hover:translate-x-2 group-hover:scale-110">

                    →

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}