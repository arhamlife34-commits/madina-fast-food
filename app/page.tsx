"use client";

import Hero from "./components/home/Hero";
import PageBackground from "./components/layout/PageBackground";


import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  ShoppingCart,
  ArrowUp,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/app/data/products";

type Deal = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function Home() {
  const { addToCart } = useCart();

  /*
  =========================================================
  DATA
  =========================================================
  */

  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] =
    useState<string[]>([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [searchPlaceholder, setSearchPlaceholder] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState<{
      [key: number]: string;
    }>({});

  /*
  =========================================================
  CATEGORY BAR REFS
  =========================================================
  */

  const categoryBarRef =
    useRef<HTMLElement>(null);

  const categorySectionRefs =
    useRef<{
      [key: string]: HTMLElement | null;
    }>({});

  /*
  =========================================================
  STICKY CATEGORY BAR
  =========================================================
  */

  const [showStickyCategoryBar, setShowStickyCategoryBar] =
    useState(false);

  /*
  =========================================================
  FETCH PRODUCTS
  =========================================================
  */

  async function fetchProducts() {
    const {
      data,
      error,
    } = await supabase
      .from("products")
      .select("*")
      .order("id");

    if (error) {
      console.error(
        "Products fetch error:",
        error
      );

      setProducts([]);
      return;
    }

    setProducts(data || []);
  }

  /*
  =========================================================
  FETCH CATEGORIES
  =========================================================
  */

  async function fetchCategories() {
    const {
  data,
  error,
} = await supabase
  .from("categories")
  .select("name")
  .order("created_at", {
    ascending: true,
  });
    if (error) {
      console.error(
        "Categories fetch error:",
        error
      );

      return;
    }

    const databaseCategories =
      data
        ?.map((item) =>
          item.name?.trim()
        )
        .filter(Boolean) || [];

    setCategories(databaseCategories);
  }

  /*
  =========================================================
  FETCH DEALS
  =========================================================
  */

  async function fetchDeals() {
    const {
      data,
      error,
    } = await supabase
      .from("deals")
      .select("*")
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Deals fetch error:",
        error
      );

      setDeals([]);
      return;
    }

    setDeals((data || []) as Deal[]);
  }

  /*
  =========================================================
  INITIAL LOAD
  =========================================================
  */

  useEffect(() => {
    async function loadAll() {
      setLoading(true);

      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchDeals(),
      ]);

      setLoading(false);
    }

    loadAll();
  }, []);

  /*
  =========================================================
  ONLY SHOW CATEGORIES THAT HAVE PRODUCTS
  =========================================================
  */

  const visibleCategories =
    useMemo(() => {
      return categories.filter(
        (categoryName) =>
          products.some(
            (product) =>
              product.category
                ?.trim()
                .toLowerCase() ===
              categoryName
                .trim()
                .toLowerCase()
          )
      );
    }, [
      categories,
      products,
    ]);

  /*
  =========================================================
  DEAL STATUS
  =========================================================
  */

  const hasDeals =
    deals.length > 0;

  /*
  =========================================================
  ALL MENU TABS
  =========================================================
  */

  const menuTabs =
    useMemo(() => {
      if (hasDeals) {
        return [
          ...visibleCategories,
          "Deals",
        ];
      }

      return visibleCategories;
    }, [
      visibleCategories,
      hasDeals,
    ]);

  /*
  =========================================================
  KEEP SELECTED CATEGORY VALID
  =========================================================
  */

  useEffect(() => {
    setCategory((currentCategory) => {
      if (
        currentCategory &&
        menuTabs.includes(
          currentCategory
        )
      ) {
        return currentCategory;
      }

      return menuTabs[0] || "";
    });
  }, [menuTabs]);

  /*
  =========================================================
  REALTIME UPDATES
  =========================================================
  */

  useEffect(() => {
    const channel = supabase
      .channel(
        "smart-cook-menu-updates"
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          fetchProducts();
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
        },
        () => {
          fetchCategories();
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deals",
        },
        () => {
          fetchDeals();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  /*
  =========================================================
  STICKY BAR DETECTION
  =========================================================
  */

  useEffect(() => {
    const element =
      categoryBarRef.current;

    if (!element) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setShowStickyCategoryBar(
            !entry.isIntersecting
          );
        },
        {
          threshold: 0,
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [loading, menuTabs.length]);

  /*
  =========================================================
  CATEGORY CLICK
  =========================================================
  */

  function handleCategoryClick(
    categoryItem: string
  ) {
    setCategory(categoryItem);

    if (
      categoryItem
        .trim()
        .toLowerCase() ===
      "deals"
    ) {
      handleDealsClick();
      return;
    }

    const section =
      categorySectionRefs.current[
        categoryItem
      ];

    if (!section) return;

    const navbarOffset = 115;

    const top =
      section.getBoundingClientRect()
        .top +
      window.scrollY -
      navbarOffset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  /*
  =========================================================
  DEALS CLICK
  =========================================================
  */

  function handleDealsClick() {
    setCategory("Deals");

    const dealsSection =
      document.getElementById(
        "deals-section"
      );

    if (!dealsSection) return;

    const navbarOffset = 115;

    const top =
      dealsSection.getBoundingClientRect()
        .top +
      window.scrollY -
      navbarOffset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  /*
  =========================================================
  SEARCH PLACEHOLDER
  =========================================================
  */

  useEffect(() => {
    if (
      search ||
      menuTabs.length === 0
    ) {
      setSearchPlaceholder("");
      return;
    }

    let cancelled = false;

    let typingTimeout:
      ReturnType<typeof setTimeout>;

    let deletingTimeout:
      ReturnType<typeof setTimeout>;

    let cycleTimeout:
      ReturnType<typeof setTimeout>;

    let categoryIndex = 0;
    let characterIndex = 0;

    const typeText = () => {
      if (cancelled) return;

      const currentCategory =
        menuTabs[categoryIndex];

      if (!currentCategory) return;

      if (
        characterIndex <
        currentCategory.length
      ) {
        characterIndex++;

        setSearchPlaceholder(
          currentCategory.slice(
            0,
            characterIndex
          )
        );

        typingTimeout =
          setTimeout(
            typeText,
            80
          );
      } else {
        cycleTimeout =
          setTimeout(
            deleteText,
            1200
          );
      }
    };

    const deleteText = () => {
      if (cancelled) return;

      const currentCategory =
        menuTabs[categoryIndex];

      if (!currentCategory) return;

      if (characterIndex > 0) {
        characterIndex--;

        setSearchPlaceholder(
          currentCategory.slice(
            0,
            characterIndex
          )
        );

        deletingTimeout =
          setTimeout(
            deleteText,
            50
          );
      } else {
        categoryIndex =
          (categoryIndex + 1) %
          menuTabs.length;

        characterIndex = 0;

        cycleTimeout =
          setTimeout(
            typeText,
            300
          );
      }
    };

    setSearchPlaceholder("");

    cycleTimeout =
      setTimeout(
        typeText,
        400
      );

    return () => {
      cancelled = true;

      clearTimeout(
        typingTimeout
      );

      clearTimeout(
        deletingTimeout
      );

      clearTimeout(
        cycleTimeout
      );
    };
  }, [
    search,
    menuTabs,
  ]);

  /*
  =========================================================
  PRODUCT PRICE
  =========================================================
  */

  function getProductPrice(
    product: Product
  ) {
    const size =
      selectedSize[product.id];

    const isPizza =
      product.category
        ?.trim()
        .toLowerCase() ===
      "pizza";

    if (isPizza) {
      if (size === "S") {
        return (
          product.small_price ||
          0
        );
      }

      if (size === "M") {
        return (
          product.medium_price ||
          0
        );
      }

      if (size === "L") {
        return (
          product.large_price ||
          0
        );
      }

      return (
        product.medium_price ||
        0
      );
    }

    return product.price;
  }

  /*
  =========================================================
  ONLY PIZZA HAS SIZES
  =========================================================
  */

  function hasSizes(
    categoryName: string
  ) {
    return (
      categoryName
        .trim()
        .toLowerCase() ===
      "pizza"
    );
  }

  /*
  =========================================================
  ADD PRODUCT TO CART
  =========================================================
  */

  function addProductToCart(
    product: Product
  ) {
    const finalPrice =
      getProductPrice(product);

    const selected =
      selectedSize[product.id];

    addToCart({
      ...product,
      price: finalPrice,
      selectedSize:
        selected || undefined,
    });
  }

  /*
  =========================================================
  ADD DEAL TO CART
  =========================================================
  */

  function addDealToCart(
    deal: Deal
  ) {
    const dealProduct =
      {
        ...deal,
        category: "Deals",
        price: deal.price,
        is_deal: true,
        regular_price: null,
        large_price: null,
        jumbo_price: null,
        small_price: null,
        medium_price: null,
        cheese_price: null,
        fries_price: null,
        weight: null,
        rating: 0,
        review_count: 0,
        sku: `DEAL-${deal.id}`,
        slug: `deal-${deal.id}`,
        brand_id: null,
        category_id: null,
        short_description:
          deal.description,
        stock_quantity: 999,
        is_active: true,
        is_featured: false,
        is_best_seller: false,
        is_on_sale: false,
      } as unknown as Product;

    addToCart(dealProduct);
  }

  /*
  =========================================================
  SEARCH RESULT CHECK
  =========================================================
  */

  const hasSearchResults =
    useMemo(() => {
      if (!search.trim()) {
        return true;
      }

      const query =
        search
          .trim()
          .toLowerCase();

      const normalProductMatch =
        products.some(
          (product) =>
            product.name
              ?.toLowerCase()
              .includes(query)
        );

      const dealMatch =
        deals.some(
          (deal) =>
            deal.name
              ?.toLowerCase()
              .includes(query) ||
            deal.description
              ?.toLowerCase()
              .includes(query)
        );

      return (
        normalProductMatch ||
        dealMatch
      );
    }, [
      search,
      products,
      deals,
    ]);

  /*
  =========================================================
  CATEGORY BAR COMPONENT
  =========================================================
  */

  function CategoryBar({
    sticky = false,
  }: {
    sticky?: boolean;
  }) {
    return (
      <div
        className={`
          w-full
          border-y
          border-[#ddd6ca]
          bg-[#ffd83d]
          px-3
          py-2.5
          shadow-[0_5px_20px_rgba(60,45,30,0.08)]
          sm:px-5
          sm:py-3
          ${
            sticky
              ? "rounded-none border-b"
              : ""
          }
        `}
      >
        <div className="relative w-full overflow-x-auto scrollbar-hide">
          <div
            className="
              flex
              min-w-max
              items-center
              justify-center
              gap-1.5
              px-1
              sm:gap-2
            "
          >
            {menuTabs.map(
              (categoryItem) => {
                const isDeals =
                  categoryItem
                    .trim()
                    .toLowerCase() ===
                  "deals";

                const isActive =
                  category ===
                  categoryItem;

                return (
                  <button
                    key={categoryItem}
                    type="button"
                    onClick={() =>
                      handleCategoryClick(
                        categoryItem
                      )
                    }
                    className={`
                      shrink-0
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.04em]
                      transition-all
                      duration-200

                      sm:px-4
                      sm:py-2.5
                      sm:text-xs

                      lg:px-5
                      lg:text-sm

                      ${
  isActive
    ? `
      border-[#b91c1c]
      bg-[#dc2626]
      text-white
      shadow-[0_4px_12px_rgba(180,30,30,0.25)]
    `
                         : `
  border-[#d4a900]
  bg-[#ffd83d]
  text-[#29251f]
  hover:bg-[#f5c928]
`
                      }
                    `}
                  >
                    {categoryItem}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
    );
  }

  /*
  =========================================================
  LOADING
  =========================================================
  */

  if (loading) {
    return (
      <PageBackground type="main">
        <div className="min-h-screen w-full bg-[#f4f0e8]">

          <div className="relative h-[260px] w-full overflow-hidden bg-[#e9e3d8] sm:h-[380px] lg:h-[480px]">
            <div className="absolute inset-0 animate-pulse bg-[#ddd5c8]" />
          </div>

          <div className="w-full border-y border-[#ddd6ca] bg-[#f4f0e8] px-3 py-3 sm:px-5">
            <div className="flex min-w-max items-center justify-center gap-2 overflow-hidden">
              {[
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="
                      h-9
                      w-24
                      animate-pulse
                      rounded-lg
                      bg-[#ded7cc]
                      sm:h-10
                      sm:w-28
                    "
                  />
                )
              )}
            </div>
          </div>

          <div className="mx-auto w-full max-w-7xl px-3 pb-20 pt-8 sm:px-5 lg:px-8">

            <div className="mb-6">
              <div className="h-10 w-52 animate-pulse rounded-lg bg-[#ddd5c8] sm:h-12 sm:w-72" />
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:gap-5
                lg:grid-cols-4
              "
            >
              {[
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#ded7cc]
                      bg-[#faf8f3]
                      p-2
                      shadow-[0_8px_25px_rgba(60,45,30,0.07)]
                    "
                  >
                    <div className="h-32 animate-pulse rounded-xl bg-[#ded7cc] sm:h-48 lg:h-52" />

                    <div className="px-1 pb-1 pt-4">
                      <div className="mx-auto h-5 w-3/4 animate-pulse rounded bg-[#ded7cc]" />

                      <div className="mt-4 h-3 w-full animate-pulse rounded bg-[#e3ddd3]" />

                      <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-[#e3ddd3]" />

                      <div className="mt-4 h-10 animate-pulse rounded-xl bg-[#e1dbd1]" />
                    </div>
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      </PageBackground>
    );
  }

  /*
  =========================================================
  PAGE
  =========================================================
  */

  return (
    <>
      

      <PageBackground type="main">

       <div className="min-h-screen w-full bg-[#080808] text-white">

          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <Hero />

          {/* ================================================= */}
          {/* MAIN CATEGORY BAR */}
          {/* ================================================= */}

          <section
            ref={categoryBarRef}
            className="relative z-40 w-full"
          >
            <CategoryBar />
          </section>

          {/* ================================================= */}
          {/* STICKY CATEGORY BAR */}
          {/* ================================================= */}

          {showStickyCategoryBar &&
  menuTabs.length > 0 && (
    <div
      className="
        fixed
        left-0
        right-0
        top-[72px]
        z-[100]
        w-full
        animate-in
        fade-in
        slide-in-from-top-2
        duration-200
      "
    >
      <CategoryBar sticky />
    </div>
  )}
          {/* ================================================= */}
          {/* SEARCH */}
          {/* ================================================= */}

          <section className="w-full bg-[#f8f5ef]">

            <div
              className="
                mx-auto
                flex
                h-[62px]
                w-full
                max-w-7xl
                items-center
                border-b
                border-[#d8d0c4]
                px-3
                sm:h-[68px]
                sm:px-5
                lg:px-8
              "
            >

              <Search
                size={21}
                strokeWidth={2.2}
                className="
                  mr-4
                  shrink-0
                  text-[#5e5549]
                  sm:mr-5
                  sm:h-[23px]
                  sm:w-[23px]
                "
              />

              <div className="relative min-w-0 flex-1">

                {!search && (
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      left-0
                      flex
                      items-center
                      whitespace-nowrap
                      overflow-hidden
                      text-[14px]
                      font-medium
                      text-[#9b9184]
                      sm:text-[15px]
                    "
                  >
                    <span>
                      Search for{" "}
                    </span>

                    <span className="ml-1 font-semibold text-[#87633d]">
                      {searchPlaceholder}

                      <span className="ml-[1px] animate-pulse">
                        |
                      </span>
                    </span>
                  </div>
                )}

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  aria-label="Search menu"
                  autoComplete="off"
                  className="
                    h-full
                    w-full
                    bg-transparent
                    py-2
                    text-[14px]
                    font-medium
                    text-[#29251f]
                    outline-none
                    placeholder:text-transparent
                    sm:text-[15px]
                  "
                />

              </div>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                  className="
                    ml-3
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-xl
                    font-light
                    text-[#766d62]
                    transition
                    hover:bg-[#e9e3d8]
                    hover:text-[#29251f]
                  "
                >
                  ×
                </button>
              )}

            </div>

          </section>

          {/* ================================================= */}
          {/* MENU CONTENT */}
          {/* ================================================= */}

          <main
            className="
              mx-auto
              w-full
              max-w-7xl
              px-3
              pb-24
              pt-9
              sm:px-5
              sm:pt-12
              lg:px-8
            "
          >

            {/* ================================================= */}
            {/* NORMAL CATEGORIES */}
            {/* ================================================= */}

            {visibleCategories.map(
              (categoryName) => {

                const categoryProducts =
                  products.filter(
                    (product) => {

                      const matchesCategory =
                        product.category
                          ?.trim()
                          .toLowerCase() ===
                        categoryName
                          .trim()
                          .toLowerCase();

                      const matchesSearch =
                        product.name
                          ?.toLowerCase()
                          .includes(
                            search
                              .toLowerCase()
                          );

                      return (
                        matchesCategory &&
                        matchesSearch
                      );
                    }
                  );

                if (
                  categoryProducts.length ===
                  0
                ) {
                  return null;
                }

                return (
                  <section
                    key={categoryName}
                    ref={(element) => {
                      categorySectionRefs.current[
                        categoryName
                      ] = element;
                    }}
                    className="
                      mb-16
                      scroll-mt-28
                      sm:mb-20
                    "
                  >

                    {/* ================================================= */}
                    {/* CATEGORY HEADING */}
                    {/* ================================================= */}

                    <div
                      className="
                        mb-6
                        border-b
                        border-[#d8d0c4]
                        pb-4
                        sm:mb-8
                        sm:pb-5
                      "
                    >

                      <h2
                        className="
                          text-[27px]
                          font-black
                          leading-none
                          tracking-[-0.035em]
                        text-[#f5c542]
                          sm:text-[36px]
                          lg:text-[44px]
                        "
                      >
                        {categoryName}
                      </h2>

                      <div
                        className="
                          mt-2
                          h-[3px]
                          w-12
                          rounded-full
                          bg-[#a77b4d]
                          sm:mt-3
                          sm:w-16
                        "
                      />

                    </div>

                    {/* ================================================= */}
                    {/* PRODUCTS GRID */}
                    {/* ================================================= */}

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:gap-5
                        lg:grid-cols-4
                      "
                    >

                      {categoryProducts.map(
                        (product) => {

                          const sizeCategory =
                            hasSizes(
                              categoryName
                            );

                          const finalPrice =
                            getProductPrice(
                              product
                            );

                          const selected =
                            selectedSize[
                              product.id
                            ];

                          return (
                            <article
                              key={product.id}
                              className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-[#ded7cc]
                                bg-[#faf8f3]
                                p-2
                                shadow-[0_7px_22px_rgba(60,45,30,0.07)]
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-[#c9b89f]
                                hover:shadow-[0_14px_32px_rgba(60,45,30,0.12)]
                                sm:rounded-[20px]
                                sm:p-2.5
                              "
                            >

                              {/* ================================================= */}
                              {/* IMAGE */}
                              {/* ================================================= */}

                              <div
                                className="
                                  overflow-hidden
                                  rounded-xl
                                  bg-[#e8e1d6]
                                  sm:rounded-[16px]
                                "
                              >

                                <div
                                  className="
                                    relative
                                    h-32
                                    w-full
                                    sm:h-48
                                    lg:h-52
                                  "
                                >

                                  <img
                                    src={
                                      product.image
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                      transition-transform
                                      duration-500
                                      hover:scale-[1.03]
                                    "
                                  />

                                </div>

                              </div>

                              {/* ================================================= */}
                              {/* INFO */}
                              {/* ================================================= */}

                              <div className="px-1 pb-1 pt-3 sm:px-1.5 sm:pt-4">

                                {/* PRODUCT NAME */}

                                <h3
                                  className="
                                    min-h-[38px]
                                    text-center
                                    text-[15px]
                                    font-extrabold
                                    leading-[1.15]
                                    tracking-[-0.01em]
                                    text-[#29251f]
                                    sm:min-h-[44px]
                                    sm:text-[19px]
                                  "
                                >
                                  {product.name}
                                </h3>

                                {/* DESCRIPTION */}

                                {product.description && (
                                  <p
                                    className="
                                      mt-2
                                      line-clamp-2
                                      min-h-[28px]
                                      text-center
                                      text-[9px]
                                      leading-4
                                      text-[#81786c]
                                      sm:min-h-[36px]
                                      sm:text-[11px]
                                      sm:leading-5
                                    "
                                  >
                                    {
                                      product.description
                                    }
                                  </p>
                                )}

                                {/* ================================================= */}
                                {/* PIZZA SIZES */}
                                {/* ================================================= */}

                                {sizeCategory && (
                                  <div className="mt-3 sm:mt-4">

                                    <div
                                      className="
                                        flex
                                        justify-center
                                        gap-1.5
                                        sm:gap-2
                                      "
                                    >

                                      {[
                                        "S",
                                        "M",
                                        "L",
                                      ].map(
                                        (size) => (
                                          <button
                                            key={
                                              size
                                            }
                                            type="button"
                                            onClick={() =>
                                              setSelectedSize(
                                                (
                                                  previous
                                                ) => ({
                                                  ...previous,
                                                  [product.id]:
                                                    size,
                                                })
                                              )
                                            }
                                            className={`
                                              min-w-[31px]
                                              rounded-lg
                                              border
                                              px-2
                                              py-1
                                              text-[9px]
                                              font-bold
                                              transition
                                              sm:min-w-[38px]
                                              sm:px-2.5
                                              sm:py-1.5
                                              sm:text-[11px]

                                              ${
                                                selected ===
                                                size
                                                  ? `
                                                    border-[#87633d]
                                                    bg-[#87633d]
                                                    text-white
                                                  `
                                                  : `
                                                    border-[#d5cbbb]
                                                    bg-[#f4f0e8]
                                                    text-[#554b40]
                                                    hover:border-[#a88a67]
                                                    hover:bg-white
                                                  `
                                              }
                                            `}
                                          >
                                            {size}
                                          </button>
                                        )
                                      )}

                                    </div>

                                  </div>
                                )}

                                {/* ================================================= */}
                                {/* PRICE + ADD */}
                                {/* ================================================= */}

                                <div
                                  className="
                                    mt-3
                                    flex
                                    items-center
                                    justify-between
                                    gap-1.5
                                    rounded-xl
                                    border
                                    border-[#ddd5c9]
                                    bg-[#f1ece4]
                                    p-1.5
                                    sm:mt-4
                                    sm:gap-2
                                    sm:p-2
                                  "
                                >

                                  <div className="min-w-0 flex-1 px-1">

                                    <span
                                      className="
                                        block
                                        truncate
                                        text-[12px]
                                        font-extrabold
                                        text-[#29251f]
                                        sm:text-[16px]
                                      "
                                    >
                                      Rs.{" "}
                                      {
                                        finalPrice
                                      }
                                    </span>

                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      addProductToCart(
                                        product
                                      )
                                    }
                                    className="
                                      flex
                                      shrink-0
                                      items-center
                                      justify-center
                                      gap-1
                                      rounded-lg
                                      bg-[#87633d]
                                      px-2.5
                                      py-2
                                      text-[9px]
                                      font-bold
                                      text-white
                                      transition
                                      hover:bg-[#725231]
                                      active:scale-95
                                      sm:gap-1.5
                                      sm:px-3.5
                                      sm:py-2.5
                                      sm:text-xs
                                    "
                                  >

                                    <ShoppingCart
                                      size={
                                        13
                                      }
                                      strokeWidth={
                                        2.4
                                      }
                                      className="
                                        sm:h-4
                                        sm:w-4
                                      "
                                    />

                                    <span>
                                      Add
                                    </span>

                                  </button>

                                </div>

                              </div>

                            </article>
                          );
                        }
                      )}

                    </div>

                  </section>
                );
              }
            )}

            {/* ================================================= */}
            {/* DEALS */}
            {/* ================================================= */}

            {hasDeals &&
              deals.some(
                (deal) =>
                  !search.trim() ||
                  deal.name
                    ?.toLowerCase()
                    .includes(
                      search
                        .toLowerCase()
                    ) ||
                  deal.description
                    ?.toLowerCase()
                    .includes(
                      search
                        .toLowerCase()
                    )
              ) && (
                <section
                  id="deals-section"
                  className="
                    mb-16
                    scroll-mt-28
                    sm:mb-20
                  "
                >

                  {/* DEAL HEADING */}

                  <div
                    className="
                      mb-6
                      border-b
                      border-[#d8d0c4]
                      pb-4
                      sm:mb-8
                      sm:pb-5
                    "
                  >

                    <h2
                      className="
                        text-[27px]
                        font-black
                        leading-none
                        tracking-[-0.035em]
                        text-[#29251f]
                        sm:text-[36px]
                        lg:text-[44px]
                      "
                    >
                      Deals
                    </h2>

                    <div
                      className="
                        mt-2
                        h-[3px]
                        w-12
                        rounded-full
                        bg-[#c49345]
                        sm:mt-3
                        sm:w-16
                      "
                    />

                  </div>

                  {/* DEAL CARDS */}

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-3
                      sm:gap-5
                      lg:grid-cols-4
                    "
                  >

                    {deals
                      .filter(
                        (deal) =>
                          !search.trim() ||
                          deal.name
                            ?.toLowerCase()
                            .includes(
                              search
                                .toLowerCase()
                            ) ||
                          deal.description
                            ?.toLowerCase()
                            .includes(
                              search
                                .toLowerCase()
                            )
                      )
                      .map(
                        (deal) => (
                          <article
                            key={
                              deal.id
                            }
                            className="
                              overflow-hidden
                              rounded-2xl
                              border
                              border-[#ddcfb8]
                              bg-[#faf8f3]
                              p-2
                              shadow-[0_7px_22px_rgba(60,45,30,0.07)]
                              transition-all
                              duration-300
                              hover:-translate-y-1
                              hover:border-[#c7a66e]
                              hover:shadow-[0_14px_32px_rgba(60,45,30,0.12)]
                              sm:rounded-[20px]
                              sm:p-2.5
                            "
                          >

                            {/* DEAL IMAGE */}

                            <div
                              className="
                                overflow-hidden
                                rounded-xl
                                bg-[#e8e1d6]
                                sm:rounded-[16px]
                              "
                            >

                              <div
                                className="
                                  relative
                                  h-32
                                  w-full
                                  sm:h-48
                                  lg:h-52
                                "
                              >

                                <img
                                  src={
                                    deal.image
                                  }
                                  alt={
                                    deal.name
                                  }
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-500
                                    hover:scale-[1.03]
                                  "
                                />

                              </div>

                            </div>

                            {/* DEAL INFO */}

                            <div className="px-1 pb-1 pt-3 sm:px-1.5 sm:pt-4">

                              <h3
                                className="
                                  min-h-[38px]
                                  text-center
                                  text-[15px]
                                  font-extrabold
                                  leading-[1.15]
                                  text-[#29251f]
                                  sm:min-h-[44px]
                                  sm:text-[19px]
                                "
                              >
                                {
                                  deal.name
                                }
                              </h3>

                              {deal.description && (
                                <p
                                  className="
                                    mt-2
                                    line-clamp-2
                                    min-h-[28px]
                                    text-center
                                    text-[9px]
                                    leading-4
                                    text-[#81786c]
                                    sm:min-h-[36px]
                                    sm:text-[11px]
                                    sm:leading-5
                                  "
                                >
                                  {
                                    deal.description
                                  }
                                </p>
                              )}

                              <div
                                className="
                                  mt-3
                                  flex
                                  items-center
                                  justify-between
                                  gap-1.5
                                  rounded-xl
                                  border
                                  border-[#ddd5c9]
                                  bg-[#f1ece4]
                                  p-1.5
                                  sm:mt-4
                                  sm:gap-2
                                  sm:p-2
                                "
                              >

                                <span
                                  className="
                                    px-1
                                    text-[12px]
                                    font-extrabold
                                    text-[#29251f]
                                    sm:text-[16px]
                                  "
                                >
                                  Rs.{" "}
                                  {
                                    deal.price
                                  }
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addDealToCart(
                                      deal
                                    )
                                  }
                                  className="
                                    flex
                                    shrink-0
                                    items-center
                                    justify-center
                                    gap-1
                                    rounded-lg
                                    bg-[#87633d]
                                    px-2.5
                                    py-2
                                    text-[9px]
                                    font-bold
                                    text-white
                                    transition
                                    hover:bg-[#725231]
                                    active:scale-95
                                    sm:gap-1.5
                                    sm:px-3.5
                                    sm:py-2.5
                                    sm:text-xs
                                  "
                                >

                                  <ShoppingCart
                                    size={
                                      13
                                    }
                                    strokeWidth={
                                      2.4
                                    }
                                    className="
                                      sm:h-4
                                      sm:w-4
                                    "
                                  />

                                  <span>
                                    Add
                                  </span>

                                </button>

                              </div>

                            </div>

                          </article>
                        )
                      )}

                  </div>

                </section>
              )}

            {/* ================================================= */}
            {/* NO SEARCH RESULTS */}
            {/* ================================================= */}

            {search &&
              !hasSearchResults && (
                <div
                  className="
                    py-20
                    text-center
                  "
                >

                  <h2
                    className="
                      text-2xl
                      font-black
                      text-[#29251f]
                      sm:text-3xl
                    "
                  >
                    No Products Found
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-[#81786c]
                    "
                  >
                    Try searching for another food item.
                  </p>

                </div>
              )}

          </main>
          {/* ================================================= */}
          {/* FLOATING SEARCH + BACK TO TOP */}
          {/* ================================================= */}

          {showStickyCategoryBar && (
            <div
              className="
                fixed
                bottom-5
                right-4
                z-[110]
                flex
                flex-col
                items-center
                gap-2
                sm:bottom-6
                sm:right-6
              "
            >

              {/* SEARCH BUTTON */}

              <button
                type="button"
                onClick={() => {
                  const searchSection =
                    document.querySelector(
                      "section.w-full.bg-\\[\\#f8f5ef\\]"
                    );

                  if (!searchSection) return;

                  const top =
                    searchSection.getBoundingClientRect()
                      .top +
                    window.scrollY -
                    85;

                  window.scrollTo({
                    top,
                    behavior: "smooth",
                  });
                }}
                aria-label="Search menu"
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#d8cbbb]
                  bg-[#faf8f3]
text-[#dc2626]
                  shadow-[0_8px_25px_rgba(60,45,30,0.18)]
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:bg-white
                  hover:text-[#b91c1c]
                  active:scale-95
                  sm:h-14
                  sm:w-14
                "
              >
                <Search
                  size={20}
                  strokeWidth={2.3}
                  className="sm:h-[22px] sm:w-[22px]"
                />
              </button>

              {/* BACK TO TOP */}

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                aria-label="Back to top"
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#d8cbbb]
                  bg-[#dc2626]
text-white
                  shadow-[0_8px_25px_rgba(60,45,30,0.20)]
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:bg-[#b91c1c]
                  active:scale-95
                  sm:h-14
                  sm:w-14
                "
              >
                <ArrowUp
                  size={20}
                  strokeWidth={2.5}
                  className="sm:h-[22px] sm:w-[22px]"
                />
              </button>

            </div>
          )}
        </div>

      </PageBackground>
    </>
  );
}