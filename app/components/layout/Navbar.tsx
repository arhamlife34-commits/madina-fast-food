"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  X,
  Menu,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/app/lib/supabase";

/* =====================================================
   NAVIGATION
===================================================== */

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Reviews", href: "/reviews" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

/* =====================================================
   CATEGORY DATA
===================================================== */

const stickyCategories = [
  { emoji: "🍔", title: "Burgers" },
  { emoji: "🌯", title: "Shawarma" },
  { emoji: "🍕", title: "Pizza" },
  { emoji: "🍟", title: "Fries" },
  { emoji: "🍗", title: "Crispy Chicken" },
  { emoji: "🔥", title: "Platters" },
];

/* =====================================================
   STICKY CATEGORY ITEMS
===================================================== */

function StickyCategoryItems() {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-2
        sm:grid-cols-3
        md:grid-cols-6
        md:gap-2.5
      "
    >
      {stickyCategories.map((item) => (
        <button
          type="button"
          key={item.title}
          className="
            group
            flex
            min-h-[64px]
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#c9a35b]/30
            bg-[#f8f1df]
            px-3
            py-2.5
            text-center
            text-[#30463d]
            shadow-[0_3px_12px_rgba(15,23,42,0.06)]
            backdrop-blur-md
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-[#c9a35b]
            hover:bg-[#f3dfad]
            hover:text-[#17382d]
            hover:shadow-[0_7px_20px_rgba(16,45,36,0.14)]
            active:scale-[0.98]
          "
        >
          <span
            className="
              text-xl
              leading-none
              transition-transform
              duration-300
              group-hover:scale-110
              sm:text-2xl
            "
          >
            {item.emoji}
          </span>

          <span
            className="
              text-[11px]
              font-extrabold
              leading-tight
              sm:text-xs
              md:text-[13px]
            "
          >
            {item.title}
          </span>
        </button>
      ))}
    </div>
  );
}

/* =====================================================
   NAVBAR
===================================================== */

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { cart } = useCart();

  const [settings, setSettings] = useState<any>(null);

  const [cartDrawer, setCartDrawer] = useState(false);
  const [searchPopup, setSearchPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [showStickyCategories, setShowStickyCategories] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  /* =====================================================
     IS HOME
  ===================================================== */

  const isHomePage = pathname === "/";

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchSettings();
  }, []);

  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  useEffect(() => {
    setMenuOpen(false);
    setShowStickyCategories(false);
  }, [pathname]);

  /* =====================================================
     STICKY CATEGORY BAR
  ===================================================== */

  useEffect(() => {
    if (!isHomePage) {
      setShowStickyCategories(false);
      return;
    }

    function handleCategoryPosition(event: Event) {
      const customEvent =
        event as CustomEvent<{
          top: number;
          bottom: number;
        }>;

      const categoryTop = customEvent.detail.top;

      const navbarHeight = 82;

      if (categoryTop <= navbarHeight) {
        setShowStickyCategories(true);
      } else {
        setShowStickyCategories(false);
      }
    }

    window.addEventListener(
      "categoryBarPosition",
      handleCategoryPosition
    );

    return () => {
      window.removeEventListener(
        "categoryBarPosition",
        handleCategoryPosition
      );
    };
  }, [isHomePage]);

  /* =====================================================
     SETTINGS
  ===================================================== */

  async function fetchSettings() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (data) {
      setSettings(data);
    }
  }

  /* =====================================================
     SEARCH
  ===================================================== */

  function openSearch() {
    setMenuOpen(false);
    setSearchPopup(true);
  }

  function handleSearch() {
    const trimmedSearch = searchQuery.trim();

    if (!trimmedSearch) {
      return;
    }

    setSearchPopup(false);

    router.push(
      `/?search=${encodeURIComponent(trimmedSearch)}`
    );
  }

  /* =====================================================
     FLOATING SEARCH
  ===================================================== */

  function handleFloatingSearch() {
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =====================================================
     BACK TO TOP
  ===================================================== */

  function handleBackToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =====================================================
     CART
  ===================================================== */

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <header
        className="
          fixed
          left-0
          top-0
          z-50
          w-full
          border-b
          border-[#c9a35b]/20
       bg-[#000000]
          shadow-[0_5px_30px_rgba(0,0,0,0.55)]
        "
      >
        <div
          className="
            relative
            mx-auto
            flex
            h-[82px]
            max-w-7xl
            items-center
            justify-between
            px-2
            sm:px-4
            lg:px-6
          "
        >

          {/* ================================================= */}
          {/* LEFT SIDE — LOGO */}
          {/* ================================================= */}

          <div
            className="
              relative
              z-20
              flex
              min-w-0
              flex-1
              items-center
              gap-2
              sm:gap-3
            "
          >

            {/* ================================================= */}
            {/* SQUARE LOGO */}
            {/* ================================================= */}

<Link
  href="/"
  aria-label="Home"
  className="
    group
    relative
    flex
    h-[76px]
    w-[76px]
    shrink-0
    items-center
    justify-center
    transition-transform
    duration-300
    hover:scale-[1.04]
    sm:h-[88px]
    sm:w-[88px]
  "
>
  <Image
    src="/images/logo.png"
    alt="Sabzazar Fast Food Logo"
    width={110}
    height={110}
    priority
    className="
      h-[76px]
      w-[76px]
      object-contain
      transition-transform
      duration-300
      sm:h-[88px]
      sm:w-[88px]
    "
  />
</Link>
<div
  className="
    ml-1
    flex
    items-center
    sm:ml-2
  "
>
  <span
    className="
      text-3xl
      font-black
      italic
      tracking-[0.12em]
      text-transparent
      bg-clip-text
      bg-gradient-to-b
      from-[#fff3a3]
      via-[#ffd000]
      to-[#d71920]
      drop-shadow-[0_0_8px_rgba(255,210,0,0.65)]
      sm:text-4xl
      lg:text-5xl
    "
    style={{
      fontFamily: "Georgia, 'Times New Roman', serif",
      textShadow:
        "0 0 6px rgba(255,215,0,0.8), 0 0 14px rgba(215,25,32,0.55)",
    }}
  >
    SFF
  </span>
</div>
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDE */}
          {/* ================================================= */}

          <div
            className="
              relative
              z-20
              flex
              flex-1
              items-center
              justify-end
              gap-1.5
              sm:gap-2
              lg:gap-3
            "
          >

            {/* ================================================= */}
            {/* HAMBURGER */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              aria-label="Open menu"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.10]
                bg-white/[0.045]
                text-[#f3dfad]
                transition
                duration-300
                hover:border-[#c9a35b]/50
                hover:bg-[#c9a35b]/10
                hover:text-[#f0ca72]
                sm:h-11
                sm:w-11
              "
            >
              {menuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

            {/* ================================================= */}
            {/* DESKTOP CALL */}
            {/* ================================================= */}

            <a
              href={`tel:${settings?.phone || ""}`}
              className="
                hidden
                rounded-xl
                bg-gradient-to-b
                from-[#e84b3c]
                to-[#b92d24]
                px-4
                py-3
                text-sm
                font-black
                text-white
                shadow-[0_6px_0_#7d211b]
                transition
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_8px_0_#7d211b]
                lg:inline-flex
              "
            >
              📞 Call Now
            </a>

            {/* ================================================= */}
            {/* MOBILE CALL */}
            {/* ================================================= */}

            <a
              href={`tel:${settings?.phone || ""}`}
              aria-label="Call Now"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-b
                from-[#e84b3c]
                to-[#b92d24]
                text-base
                font-black
                text-white
                shadow-[0_5px_0_#7d211b]
                sm:h-11
                sm:w-11
                lg:hidden
              "
            >
              📞
            </a>

            {/* ================================================= */}
            {/* CART */}
            {/* ================================================= */}

            <Link
              href="/cart"
              aria-label="Open full cart page"
              className="
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.10]
                bg-white/[0.045]
                text-[#f3dfad]
                transition
                duration-300
                hover:-translate-y-0.5
                hover:border-[#c9a35b]/50
                hover:bg-[#c9a35b]/10
                hover:text-[#f0ca72]
                sm:h-11
                sm:w-11
              "
            >
              <ShoppingCart size={20} />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-6
                    min-w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-[#d9362b]
                    px-1
                    text-xs
                    font-black
                    text-white
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ================================================= */}
            {/* QUICK CART */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() =>
                setCartDrawer(!cartDrawer)
              }
              aria-label="Open quick cart"
              className="
                flex
                h-10
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.10]
                bg-white/[0.045]
                text-[#f3dfad]
                transition
                duration-300
                hover:border-[#c9a35b]/50
                hover:bg-[#c9a35b]/10
                hover:text-[#f0ca72]
                sm:h-11
              "
            >
              {cartDrawer ? (
                <ChevronUp size={21} />
              ) : (
                <ChevronDown size={21} />
              )}
            </button>

          </div>
        </div>
      </header>

      {/* =====================================================
          STICKY CATEGORY BAR
      ===================================================== */}

      {isHomePage && (
        <div
          className={`
            fixed
            left-0
            right-0
            top-[82px]
            z-[45]
            border-b
            border-[#c9a35b]/25
           bg-[#176b4f]/95
            shadow-[0_8px_28px_rgba(15,23,42,0.20)]
            backdrop-blur-xl
            transition-all
            duration-500
            ease-out
            ${
              showStickyCategories
                ? "translate-y-0 opacity-100"
                : "-translate-y-6 pointer-events-none opacity-0"
            }
          `}
        >
          <div
            className="
              mx-auto
              max-w-7xl
              px-3
              py-2.5
              sm:px-5
              sm:py-3
              lg:px-8
            "
          >
            <StickyCategoryItems />
          </div>
        </div>
      )}

      {/* =====================================================
          FLOATING SEARCH + BACK TO TOP
      ===================================================== */}

      {isHomePage && (
        <div
          className={`
            fixed
            bottom-5
            right-5
            z-[60]
            flex
            flex-col
            items-center
            gap-2
            transition-all
            duration-500
            ${
              showStickyCategories
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-5 opacity-0"
            }
          `}
        >

          {/* SEARCH */}

          <button
            type="button"
            onClick={handleFloatingSearch}
            aria-label="Search menu"
            title="Search menu"
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#c9a35b]/50
              bg-[#176b4f]/95
              text-[#c9a35b]
              shadow-[0_8px_28px_rgba(15,23,42,0.22)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#e0b86a]
              hover:bg-[#12543e]
              hover:text-[#f3dfad]
              active:scale-95
            "
          >
            <Search
              size={21}
              strokeWidth={2.4}
            />
          </button>

          {/* BACK TO TOP */}

          <button
            type="button"
            onClick={handleBackToTop}
            aria-label="Back to top"
            title="Back to top"
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#c9a35b]/50
              bg-[#176b4f]/95
              text-[#c9a35b]
              shadow-[0_8px_28px_rgba(15,23,42,0.22)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#e0b86a]
              hover:bg-[#12543e]
              hover:text-[#f3dfad]
              active:scale-95
            "
          >
            <ChevronUp
              size={23}
              strokeWidth={2.5}
            />
          </button>

        </div>
      )}

      {/* =====================================================
          HAMBURGER OVERLAY
      ===================================================== */}

      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="
            fixed
            inset-0
            z-[60]
            bg-black/45
            backdrop-blur-[2px]
          "
        />
      )}

      {/* =====================================================
          HAMBURGER LEFT DRAWER
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-[70]
          flex
          h-screen
          w-full
          max-w-[390px]
          flex-col
          border-r
          border-[#c9a35b]/25
          bg-[#fffdf8]
          shadow-[20px_0_60px_rgba(0,0,0,0.18)]
          transition-transform
          duration-500
          ease-out
          ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ================================================= */}
        {/* DRAWER HEADER */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[#dfd1b8]
            px-6
            py-6
          "
        >

          <div>

            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.3em]
                text-[#a58b5c]
              "
            >
              Navigation
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-black
                text-[#29251f]
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              Menu
            </h2>

          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[#d8c7a5]
              bg-[#f7f1e5]
              text-[#514735]
              transition-all
              duration-300
              hover:bg-[#e9dcc2]
              hover:text-[#29251f]
              active:scale-95
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* ================================================= */}
        {/* NAVIGATION */}
        {/* ================================================= */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-6
            py-4
          "
        >

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="
                group
                flex
                items-center
                justify-between
                border-b
                border-[#e4d9c5]
                py-5
                text-[17px]
                font-bold
                text-[#373127]
                transition-all
                duration-300
                hover:pl-2
                hover:text-[#a1814b]
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >

              <span>
                {link.name}
              </span>

              <span
                className="
                  text-[18px]
                  text-[#b9a47d]
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:opacity-100
                "
              >
                →
              </span>

            </Link>
          ))}

        </nav>

        {/* ================================================= */}
        {/* DRAWER FOOTER */}
        {/* ================================================= */}

        <div
          className="
            border-t
            border-[#dfd1b8]
            bg-[#faf5eb]
            px-6
            py-5
          "
        >

          <p
            className="
              text-center
              text-[9px]
              font-black
              uppercase
              tracking-[0.3em]
              text-[#a58b5c]
            "
          >
            Welcome
          </p>

        </div>

      </aside>

      {/* =====================================================
          SEARCH POPUP
      ===================================================== */}

      {searchPopup && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-start
            justify-center
            bg-black/80
            px-4
            pt-24
            backdrop-blur-md
            sm:items-center
            sm:pt-4
          "
          onClick={() =>
            setSearchPopup(false)
          }
        >
          <div
            className="
              w-full
              max-w-2xl
              overflow-hidden
              rounded-[28px]
              border
              border-[#c9a35b]/20
              bg-[#121212]
              shadow-[0_30px_100px_rgba(0,0,0,0.85)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/10
                px-5
                py-5
                sm:px-7
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    font-black
                    tracking-[0.3em]
                    text-[#d9b46a]
                  "
                >
                  FIND YOUR FOOD
                </p>

                <h2
                  className="
                    mt-1
                    text-xl
                    font-black
                    text-white
                    sm:text-2xl
                  "
                >
                  Search Our Menu
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSearchPopup(false)
                }
                aria-label="Close search"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  text-white
                  transition
                  hover:border-red-500
                  hover:bg-red-600
                  hover:text-black
                "
              >
                <X size={21} />
              </button>

            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
              className="p-5 sm:p-7"
            >

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >

                <div
                  className="
                    relative
                    flex-1
                  "
                >

                  <Search
                    size={21}
                    className="
                      absolute
                      left-5
                      top-1/2
                      -translate-y-1/2
                      text-[#d9b46a]
                    "
                  />

                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(
                        event.target.value
                      )
                    }
                    placeholder="Search burgers, pizza, fries..."
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-black
                      px-14
                      pr-5
                      text-sm
                      font-semibold
                      text-white
                      outline-none
                      transition
                      placeholder:text-zinc-500
                      focus:border-[#c9a35b]
                      sm:text-base
                    "
                  />

                </div>

                <button
                  type="submit"
                  disabled={
                    !searchQuery.trim()
                  }
                  className={`
                    h-14
                    rounded-2xl
                    px-7
                    font-black
                    transition
                    ${
                      searchQuery.trim()
                        ? "bg-[#c9a35b] text-black hover:bg-red-600 hover:text-white"
                        : "cursor-not-allowed bg-zinc-700 text-zinc-400"
                    }
                  `}
                >
                  Search
                </button>

              </div>

              <p
                className="
                  mt-4
                  text-center
                  text-xs
                  text-zinc-500
                "
              >
                Search any food item available
                in our menu.
              </p>

            </form>

          </div>
        </div>
      )}

      {/* =====================================================
          CART OVERLAY
      ===================================================== */}

      {cartDrawer && (
        <button
          type="button"
          aria-label="Close cart drawer"
          onClick={() =>
            setCartDrawer(false)
          }
          className="
            fixed
            inset-0
            z-[60]
            bg-black/75
            backdrop-blur-sm
          "
        />
      )}

      {/* =====================================================
          CART DRAWER
      ===================================================== */}

      <aside
        className={`
          fixed
          right-0
          top-0
          z-[70]
          flex
          h-screen
          w-full
          max-w-[420px]
          flex-col
          border-l
          border-[#c9a35b]/25
          bg-[#0b0b0b]
          shadow-[-25px_0_80px_rgba(0,0,0,0.65)]
          transition-transform
          duration-500
          ${
            cartDrawer
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            px-6
            py-5
          "
        >

          <div>

            <p
              className="
                text-xs
                font-black
                tracking-[0.25em]
                text-[#d9b46a]
              "
            >
              YOUR ORDER
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-black
                text-white
              "
            >
              Quick Cart
            </h2>

          </div>

          <button
            type="button"
            onClick={() =>
              setCartDrawer(false)
            }
            aria-label="Close cart"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/5
              text-white
              transition
              hover:bg-red-600
              hover:text-black
            "
          >
            <X size={22} />
          </button>

        </div>

        {/* ITEMS */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-5
            py-5
          "
        >

          {cart.length === 0 ? (
            <div
              className="
                flex
                h-full
                flex-col
                items-center
                justify-center
                text-center
              "
            >

              <div className="text-6xl">
                🛒
              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-black
                  text-white
                "
              >
                Your cart is empty
              </h3>

              <p
                className="
                  mt-2
                  max-w-xs
                  text-sm
                  leading-6
                  text-zinc-400
                "
              >
                Add your favourite food items
                and they will appear here.
              </p>

              <Link
                href="/"
                onClick={() =>
                  setCartDrawer(false)
                }
                className="
                  mt-7
                  rounded-xl
                  bg-[#c9a35b]
                  px-6
                  py-3
                  font-black
                  text-black
                "
              >
                Explore Menu
              </Link>

            </div>
          ) : (

            <div className="space-y-4">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="
                    flex
                    gap-4
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    p-3
                  "
                >

                  <div
                    className="
                      relative
                      h-20
                      w-20
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      bg-zinc-800
                    "
                  >

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    )}

                  </div>

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >

                    <h3
                      className="
                        truncate
                        font-black
                        text-white
                      "
                    >
                      {item.name}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-bold
                        text-[#d9b46a]
                      "
                    >
                      Rs. {item.price}
                    </p>

                    <p
                      className="
                        mt-2
                        text-xs
                        text-zinc-400
                      "
                    >
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <div className="text-right">

                    <p
                      className="
                        font-black
                        text-white
                      "
                    >
                      Rs.{" "}
                      {item.price *
                        item.quantity}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* FOOTER */}

        <div
          className="
            border-t
            border-white/10
            bg-black/60
            p-5
          "
        >

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                font-bold
                text-zinc-400
              "
            >
              Subtotal
            </span>

            <span
              className="
                text-2xl
                font-black
                text-[#d9b46a]
              "
            >
              Rs. {cartTotal}
            </span>

          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
            "
          >

            <Link
              href="/cart"
              onClick={() =>
                setCartDrawer(false)
              }
              className="
                rounded-xl
                border
                border-[#c9a35b]/35
                bg-[#c9a35b]/10
                px-4
                py-4
                text-center
                font-black
                text-[#d9b46a]
                transition
                hover:bg-[#c9a35b]
                hover:text-black
              "
            >
              View Cart
            </Link>

            <Link
              href="/checkout"
              onClick={() =>
                setCartDrawer(false)
              }
              className="
                rounded-xl
                bg-gradient-to-b
                from-[#e84b3c]
                to-[#b92d24]
                px-4
                py-4
                text-center
                font-black
                text-white
              "
            >
              Checkout
            </Link>

          </div>

        </div>

      </aside>
    </>
  );
}