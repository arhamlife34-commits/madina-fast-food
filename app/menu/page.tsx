"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/app/lib/supabase";
import type { Product } from "@/app/data/products";
export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading Menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}

function MenuContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

const categoryFromUrl =
  searchParams.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categoryFromUrl);
  const [selectedSize, setSelectedSize] = useState<{
  [key: number]: string;
}>({});
const [selectedAddon, setSelectedAddon] = useState<{
  [key: number]: string;
}>({});

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
  const selectedCategory =
    searchParams.get("category");

  if (selectedCategory) {
    setCategory(selectedCategory);
  }
}, [searchParams]);

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
  "Pratha Roll",
  "Special Sandwich",
  "Special Grill Items",
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

  {category === "Burger" && "🍔 Signature Burgers"}

  {category === "Pizza" && "🍕 Stone Baked Pizza"}

  {category === "Shawarma" && "🌯 Special Shawarma"}

  {category === "Fries" && "🍟 Special Fries"}

  {category === "Platter" && "🍗 Family Platters"}

  {category === "Pratha Roll" && "🌮 Pratha Rolls"}

  {category === "Special Sandwich" &&
    "🥪 Club Sandwiches"}

  {category === "Special Grill Items" &&
    "🔥 Grill Specials"}

  {category === "All" && "🍽️ Our Menu"}

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

       <div className="flex overflow-x-auto whitespace-nowrap gap-3 mb-12 pb-2 scrollbar-hide">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() => setCategory(item)}
             className={`flex-shrink-0 px-5 py-2 rounded-full font-bold transition ${
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

                  <div className="space-y-3">

{/* Shawarma Sizes */}
{product.category?.trim().toLowerCase() === "shawarma" && (

  <div className="flex gap-2 flex-wrap">

    {["R", "L", "J"].map((size) => (

      <button
        key={size}
      onClick={() =>
  setSelectedSize({
    ...selectedSize,
    [product.id]: size,
  })
}
        className="px-3 py-1 bg-gray-200 rounded-lg"
      >
        {size}
      </button>

    ))}

    <button
  onClick={() =>
    setSelectedAddon({
      ...selectedAddon,
      [product.id]:
        selectedAddon[product.id] === "Cheese"
          ? ""
          : "Cheese",
    })
  }
      className="px-3 py-1 bg-gray-200 rounded-lg"
    >
      Cheese
    </button>

  </div>

)}

{/* Pizza Sizes */}
{product.category?.trim().toLowerCase() === "pizza" && (
  <div className="flex gap-2">
    {["S", "M", "L"].map((size) => (
      <button
        key={size}
        onClick={() =>
          setSelectedSize({
            ...selectedSize,
            [product.id]: size,
          })
        }
        className="px-3 py-1 bg-gray-200 rounded-lg"
      >
        {size}
      </button>
    ))}
  </div>
)}


{/* Pratha Roll */}
{product.category?.trim().toLowerCase() === "pratha roll" && (
  <div className="flex gap-2">
    {["R", "L"].map((size) => (
      <button
        key={size}
        onClick={() =>
          setSelectedSize({
            ...selectedSize,
            [product.id]: size,
          })
        }
        className={`px-3 py-1 rounded-lg ${
  selectedSize[product.id] === size
    ? "bg-red-600 text-white"
    : "bg-gray-200"
}`}
      >
        {size}
      </button>
    ))}
    <button
  onClick={() =>
  setSelectedAddon({
    ...selectedAddon,
    [product.id]:
      selectedAddon[product.id] === "Cheese"
        ? ""
        : "Cheese",
  })
}
  className={`px-3 py-1 rounded-lg ${
    selectedAddon[product.id] === "Cheese"
      ? "bg-red-600 text-white"
      : "bg-gray-200"
  }`}
>
  Cheese
</button>
  </div>
)}


{/* Burger Addons */}
{product.category?.trim().toLowerCase() === "burger" && (
  <div className="flex gap-2">
    {["Cheese", "Fries"].map((addon) => (
      <button
        key={addon}
        onClick={() =>
  setSelectedAddon({
    ...selectedAddon,
    [product.id]:
      selectedAddon[product.id] === addon
        ? ""
        : addon,
  })
}
        className={`px-3 py-1 rounded-lg ${
  selectedAddon[product.id] === addon
    ? "bg-red-600 text-white"
    : "bg-gray-200"
}`}
      >
        {addon}
      </button>
    ))}
  </div>
)}


{/* Platter */}
{product.category?.trim().toLowerCase() === "platter" && (
  <button
    onClick={() =>
  setSelectedAddon({
    ...selectedAddon,
    [product.id]:
      selectedAddon[product.id] === "Cheese"
        ? ""
        : "Cheese",
  })
}
    className={`px-3 py-1 rounded-lg ${
 selectedAddon[product.id] === "Cheese"
    ? "bg-red-600 text-white"
    : "bg-gray-200"
}`}
  >
    Cheese
  </button>
)}
     
 <h3 className="text-2xl font-bold text-red-600">

  Rs. {

    (
      selectedSize[product.id] === "R"
       ? product.regular_price || product.price
        : selectedSize[product.id] === "L"
        ? product.large_price || product.price
        : selectedSize[product.id] === "J"
       ? product.jumbo_price || product.price
        : selectedSize[product.id] === "S"
       ? product.small_price || product.price
        : selectedSize[product.id] === "M"
       ? product.medium_price || product.price
        : product.price
    )

    +

    (
      selectedAddon[product.id] === "Cheese"
        ? product.cheese_price || 0
        : selectedAddon[product.id] === "Fries"
        ? product.fries_price || 0
        : 0
    )

  }

</h3>
</div>

                  <button
                    onClick={() => {

  let finalPrice = product.price;


// Size price
if (selectedSize[product.id] === "R")
  finalPrice = product.regular_price || product.price;

if (selectedSize[product.id] === "L")
  finalPrice = product.large_price || product.price;

if (selectedSize[product.id] === "J")
  finalPrice = product.jumbo_price || product.price;

if (selectedSize[product.id] === "S")
  finalPrice = product.small_price || product.price;

if (selectedSize[product.id] === "M")
  finalPrice = product.medium_price || product.price;


// Addon price
if (selectedAddon[product.id] === "Cheese")
  finalPrice += product.cheese_price || 0;

if (selectedAddon[product.id] === "Fries")
  finalPrice += product.fries_price || 0;
  addToCart({
  ...product,

  selectedSize:
    ["R", "L", "J", "S", "M"].includes(
      selectedSize[product.id] || ""
    )
      ? selectedSize[product.id]
      : undefined,

  selectedAddon: selectedAddon[product.id],

  addonPrice:
    selectedAddon[product.id] === "Cheese"
      ? product.cheese_price
      : selectedAddon[product.id] === "Fries"
      ? product.fries_price
      : undefined,

  price: finalPrice,
});
                    }}
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