import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { CartProvider } from "./context/CartContext";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import WebsiteStatusGuard from "./components/layout/WebsiteStatusGuard";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sabzazar Fast Food | Lahore",
  description:
    "Sabzazar Fast Food - Burgers, Shawarma, Fries, Platters,Fresh Salads and Fast Delivery in Lahore.",
     icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <CartProvider>

  <WebsiteStatusGuard>

    <LayoutWrapper>
      {children}
    </LayoutWrapper>

  </WebsiteStatusGuard>

</CartProvider>

      </body>
    </html>
  );
}