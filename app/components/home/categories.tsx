"use client";

import { useEffect, useRef } from "react";

const categories = [
  { emoji: "🍔", title: "Burgers" },
  { emoji: "🌯", title: "Shawarma" },
  { emoji: "🍕", title: "Pizza" },
  { emoji: "🍟", title: "Fries" },
  { emoji: "🍗", title: "Crispy Chicken" },
  { emoji: "🔥", title: "Platters" },
];

/* =====================================================
   CATEGORY ITEMS
   Original aur sticky dono jagah EXACT same content
===================================================== */

export function CategoryItems() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
      {categories.map((item) => (
        <div
          key={item.title}
          className="
            cursor-pointer
            rounded-xl
            bg-gray-100
            p-8
            text-center
            transition
            duration-300
            hover:bg-red-600
            hover:text-white
          "
        >
          <div className="mb-4 text-5xl">
            {item.emoji}
          </div>

          <h3 className="font-bold">
            {item.title}
          </h3>
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   ORIGINAL CATEGORY SECTION
===================================================== */

export default function Categories() {
  const categoryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const checkCategoryPosition = () => {
      if (!categoryRef.current) return;

      const rect =
        categoryRef.current.getBoundingClientRect();

      const categoryTop = rect.top;

      /*
        Navbar height = 82px.

        Original category bar jab navbar ke
        neeche se upar chali jaye:
          categoryTop <= 82

        → sticky category bar show.

        Jab user wapas upar aaye aur original
        category bar dobara navbar ke neeche aaye:
          categoryTop > 82

        → sticky category bar hide.
      */

      window.dispatchEvent(
        new CustomEvent("categoryBarPosition", {
          detail: {
            top: categoryTop,
            bottom: rect.bottom,
            isHiddenBehindNavbar: categoryTop <= 82,
          },
        })
      );

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(
          checkCategoryPosition
        );

        ticking = true;
      }
    };

    const handleResize = () => {
      checkCategoryPosition();
    };

    /* Initial position */
    checkCategoryPosition();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  return (
    <section
      ref={categoryRef}
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold">
          Categories
        </h2>

        <p className="mb-12 mt-3 text-center text-gray-500">
          What are you hungry for?
        </p>

        <CategoryItems />
      </div>
    </section>
  );
}