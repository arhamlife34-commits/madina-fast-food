"use client";
import Image from "next/image";
import { products } from "@/app/data/products";
import { useCart } from "@/app/context/CartContext";
export default function FeaturedMenu() {
  const { addToCart } = useCart();
  const items = products;

  return (
    <section className="py-24 bg-gray-100">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <h2 className="text-5xl font-bold">
            Featured Menu
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Our Most Popular Items
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {items.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >

              <div className="relative h-56">

                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-6">

                <h3 className="text-2xl font-bold">

                  {item.name}

                </h3>

                <p className="text-gray-500 mt-3">

                  {item.description}

                </p>

                <div className="flex justify-between items-center mt-6">

                  <span className="text-2xl font-bold text-red-600">

                    {item.price}

                  </span>

                  <button
  onClick={() => addToCart(item)}
  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold transition"
>
  Add
</button>
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}