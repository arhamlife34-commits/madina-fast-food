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
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

         <h2 className="text-5xl font-bold text-center">
            Browse Our Menu
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Choose Your Favourite Category
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {categories.map((category) => (

            <Link
              key={category.name}
              href={`/menu?category=${encodeURIComponent(category.name)}`}
              className="group"
            >

             <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                <div className="relative h-72 overflow-hidden">

                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-6 left-6">

                    <div className="text-5xl mb-2">
                      {category.emoji}
                    </div>

                    <h3 className="text-white text-3xl font-bold">
                      {category.title}
                    </h3>

                  </div>

                </div>

               <div className="p-5 flex items-center justify-between bg-white">
                 <span className="font-bold text-lg text-gray-800">
                    Explore Menu
                  </span>

                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl transition-all duration-300 group-hover:bg-red-700 group-hover:translate-x-2">
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