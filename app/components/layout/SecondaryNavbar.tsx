"use client";

import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Deals", href: "/deals" },
  { name: "Gallery", href: "/gallery" },
  { name: "Reviews", href: "/reviews" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function SecondaryNavbar() {
  return (
    <section className="relative z-30 -mt-7 px-3 sm:-mt-9 sm:px-4">

      <div className="mx-auto max-w-6xl">

        <nav className="overflow-x-auto rounded-2xl border border-yellow-400/30 bg-black/90 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl scrollbar-hide">

          <div className="flex min-w-max items-center justify-start gap-1 md:justify-center">

            {navLinks.map((link) => (

              <Link
                key={link.name}
                href={link.href}
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-black text-zinc-300 transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 hover:text-black"
              >
                {link.name}
              </Link>

            ))}

          </div>

        </nav>

      </div>

    </section>
  );
}