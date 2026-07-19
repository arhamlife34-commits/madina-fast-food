"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/app/lib/supabase";
import type { Product } from "@/app/data/products";

export default function MenuPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id");

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  }

  const categories = [
    "All",
    "Burger",
    "Pizza",
    "Shawarma",
    "Fries",
    "Platter",
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "All" || product.category === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  if (loading) {
    return (
      <section className="py-32 text-center">
        <h2 className="text-3xl font-bold">
          Loading Menu...
        </h2>
      </section>
    );
  }

  return (
    <section className="py-32 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold text-center">
          Our Menu
        </h1>

        <p className="text-center text-gray-500 mt-4 mb-12">
          Fresh • Delicious • 100% Halal
        </p>

        <div className="max-w-xl mx-auto mb-8">

          <input
            type="text"
            placeholder="Search Menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-red-600"
          />

        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-5 py-2 rounded-full font-bold transition ${
                category === item
                  ? "bg-red-600 text-white"
                  : "bg-white hover:bg-red-100"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {filteredProducts.map((product) => (

            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >

              <div className="relative h-56">

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="300px"
                  className="object-cover"
                />

              </div>

              <div className="p-6">

                <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  {product.category}
                </span>

                <h2 className="text-2xl font-bold mt-4">
                  {product.name}
                </h2>

                <p className="text-gray-500 mt-3">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mt-6">

                  <span className="text-2xl font-bold text-red-600">
                    Rs. {product.price}
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold"
                  >
                    Add
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {filteredProducts.length === 0 && (

          <div className="text-center mt-20">

            <h2 className="text-3xl font-bold">
              No Products Found
            </h2>

          </div>

        )}

      </div>
    </section>
  );
}