"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  ShoppingBag,
  MapPin,
  CreditCard,
  User,
  Clock,
  Truck,
  Store,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

type Order = {
  customer_name: string;
  phone: string;
  orderType: "delivery" | "pickup";
  cityRegion: string;
  areaSubRegion: string;
  pickupBranch: string;
  address: string;
  payment: string;
  notes: string;
  subtotal: number;
  delivery: number;
  total: number;
  estimatedTime: string;
  items: any[];
};

export default function OrderSuccessPage() {
  const [order, setOrder] =
    useState<Order | null>(null);

  const [settings, setSettings] =
    useState<any>(null);

  useEffect(() => {
    const savedOrder =
      localStorage.getItem("lastOrder");

    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }

    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (data) {
      setSettings(data);
    }
  }

  if (!order) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-black px-6">

        <div className="text-center">

          <ShoppingBag
            size={70}
            className="mx-auto text-yellow-400"
          />

          <h1 className="mt-6 text-4xl font-black text-white">
            No Order Found
          </h1>

          <p className="mt-3 text-zinc-400">
            We couldn't find your recent order.
          </p>

          <Link
            href="/"
            className="mt-7 inline-block rounded-xl bg-red-600 px-7 py-4 font-black text-white transition hover:bg-yellow-400 hover:text-black"
          >
            Browse Menu
          </Link>

        </div>

      </section>
    );
  }

  const isDelivery =
    order.orderType === "delivery";

  const whatsappNumber =
    settings?.whatsapp?.replace(/\D/g, "") ||
    "923097171862";

  const phoneNumber =
    settings?.phone || "";

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-4 py-32 sm:px-6">

      <div className="mx-auto max-w-4xl">

        {/* SUCCESS CARD */}

        <div className="overflow-hidden rounded-[35px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.6)]">

          {/* HEADER */}

          <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 px-6 py-12 text-center sm:px-10">

            <div className="flex justify-center">

              <div className="rounded-full bg-white p-5 shadow-2xl">

                <CheckCircle2
                  size={80}
                  className="text-green-600"
                />

              </div>

            </div>

            <h1 className="mt-7 text-4xl font-black text-white sm:text-5xl">
              Order Placed Successfully!
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-green-50 sm:text-base">

              Thank you for ordering from{" "}

              <span className="font-black">
                {settings?.restaurant_name ||
                  "SABZAZAR FAST FOOD"}
              </span>

              . Your order has been received
              successfully.

            </p>

          </div>

          {/* ORDER TYPE MESSAGE */}

          <div className="px-5 pt-8 sm:px-10">

            {isDelivery ? (

              <div className="rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">

                    <Truck size={28} />

                  </div>

                  <div>

                    <h2 className="text-2xl font-black text-gray-900">
                      Your order will be delivered
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">

                      Our team is preparing your
                      order. Once it is ready, it
                      will be sent to the delivery
                      address provided below.

                    </p>

                    <div className="mt-4 flex items-center gap-2 font-black text-red-600">

                      <Clock size={19} />

                      Estimated delivery:
                      {" "}
                      {order.estimatedTime}

                    </div>

                  </div>

                </div>

              </div>

            ) : (

              <div className="rounded-3xl border border-green-200 bg-gradient-to-r from-green-50 to-yellow-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white">

                    <Store size={28} />

                  </div>

                  <div>

                    <h2 className="text-2xl font-black text-gray-900">
                      Your order will be ready for pick-up
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">

                      Your order is being prepared
                      at the selected branch. Please
                      collect it once it is ready.

                    </p>

                    <div className="mt-4 flex items-center gap-2 font-black text-green-700">

                      <Clock size={19} />

                      Estimated preparation:
                      {" "}
                      {order.estimatedTime}

                    </div>

                  </div>

                </div>

              </div>

            )}

          </div>

          {/* BODY */}

          <div className="p-5 sm:p-10">

            <h2 className="mb-7 text-3xl font-black text-gray-900">
              Order Details
            </h2>

            <div className="space-y-4">

              {/* CUSTOMER */}

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-100 p-4">

                <div className="flex items-center gap-3">

                  <User className="text-red-600" />

                  <span className="font-medium text-gray-600">
                    Customer
                  </span>

                </div>

                <span className="text-right font-black text-gray-900">
                  {order.customer_name}
                </span>

              </div>

              {/* PHONE */}

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-100 p-4">

                <div className="flex items-center gap-3">

                  <Phone className="text-red-600" />

                  <span className="font-medium text-gray-600">
                    Phone
                  </span>

                </div>

                <span className="font-black text-gray-900">
                  {order.phone}
                </span>

              </div>

              {/* ORDER TYPE */}

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-100 p-4">

                <div className="flex items-center gap-3">

                  {isDelivery ? (
                    <Truck className="text-red-600" />
                  ) : (
                    <Store className="text-green-600" />
                  )}

                  <span className="font-medium text-gray-600">
                    Order Type
                  </span>

                </div>

                <span className="font-black text-gray-900">
                  {isDelivery
                    ? "Delivery"
                    : "Pick-Up"}
                </span>

              </div>

              {/* DELIVERY ADDRESS */}

              {isDelivery && (

                <div className="rounded-2xl bg-red-50 p-5">

                  <div className="flex items-center gap-3">

                    <MapPin className="text-red-600" />

                    <span className="font-black text-gray-900">
                      Delivery Address
                    </span>

                  </div>

                  <p className="mt-3 leading-6 text-gray-700">
                    {order.address}
                  </p>

                </div>

              )}

              {/* PICKUP BRANCH */}

              {!isDelivery && (

                <div className="rounded-2xl bg-green-50 p-5">

                  <div className="flex items-center gap-3">

                    <Store className="text-green-600" />

                    <span className="font-black text-gray-900">
                      Pick-Up Branch
                    </span>

                  </div>

                  <p className="mt-3 font-bold text-green-700">
                    {order.pickupBranch}
                  </p>

                </div>

              )}

              {/* PAYMENT */}

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-100 p-4">

                <div className="flex items-center gap-3">

                  <CreditCard className="text-red-600" />

                  <span className="font-medium text-gray-600">
                    Payment
                  </span>

                </div>

                <span className="font-black text-gray-900">
                  {order.payment}
                </span>

              </div>

            </div>

            <hr className="my-10" />

            {/* ORDERED ITEMS */}

            <h3 className="mb-6 text-3xl font-black text-gray-900">
              Ordered Items
            </h3>

            <div className="space-y-4">

              {order.items.map(
                (item: any, index: number) => (

                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >

                    <div className="flex items-center justify-between gap-5">

                      <div>

                        <h4 className="text-xl font-black text-gray-900">
                          {item.name}
                        </h4>

                        {item.selectedSize && (
                          <p className="mt-1 text-sm font-semibold text-red-600">
                            Size: {item.selectedSize}
                          </p>
                        )}

                        {item.selectedAddon && (
                          <p className="mt-1 text-sm font-semibold text-green-600">

                            + {item.selectedAddon}

                            {item.addonPrice
                              ? ` (+Rs. ${item.addonPrice})`
                              : ""}

                          </p>
                        )}

                      </div>

                      <div className="text-right">

                        <p className="font-bold text-gray-600">
                          Qty: {item.quantity}
                        </p>

                        <p className="mt-2 text-lg font-black text-red-600">
                          Rs.{" "}
                          {item.price *
                            item.quantity}
                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* BILL */}

            <div className="mt-8 rounded-3xl bg-black p-6 text-white">

              <div className="space-y-4">

                <div className="flex justify-between">

                  <span className="text-zinc-400">
                    Subtotal
                  </span>

                  <span className="font-bold">
                    Rs. {order.subtotal}
                  </span>

                </div>

                {isDelivery && (

                  <div className="flex justify-between">

                    <span className="text-zinc-400">
                      Delivery Charges
                    </span>

                    <span className="font-bold">
                      Rs. {order.delivery}
                    </span>

                  </div>

                )}

                <div className="border-t border-white/10 pt-4">

                  <div className="flex justify-between">

                    <span className="text-xl font-black">
                      Grand Total
                    </span>

                    <span className="text-2xl font-black text-yellow-400">
                      Rs. {order.total}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* CONTACT */}

            <div className="mt-10 rounded-3xl border border-green-200 bg-gradient-to-r from-green-50 to-yellow-50 p-7 text-center">

              <h3 className="text-2xl font-black text-gray-900">
                Need Help With Your Order?
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                If you have any questions about your
                order, feel free to contact our team.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-black text-white transition hover:bg-green-700"
                >

                  <MessageCircle size={20} />

                  WhatsApp

                </a>

                <a
                  href={`tel:${phoneNumber}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-black text-white transition hover:bg-red-700"
                >

                  <Phone size={20} />

                  Call Now

                </a>

              </div>

            </div>

            {/* HOME */}

            <Link
              href="/"
              className="mt-8 block text-center text-lg font-black text-red-600 transition hover:text-red-700"
            >
              ← Back to Home
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}