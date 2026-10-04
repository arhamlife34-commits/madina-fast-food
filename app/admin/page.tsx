"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

import OrdersTable from "./components/OrdersTable";
import ProductsTable from "./components/ProductsTable";
import AddProductForm from "./components/AddProductForm";
import AddDealForm from "./components/AddDealForm";
import DealsTable from "./components/DealsTable";
import SettingsForm from "./components/SettingsForm";
import GalleryManager from "./components/GalleryManager";
import ReviewsTable from "./components/ReviewsTable";
import CategoriesManager from "./components/CategoriesManager";

type Stats = {
  totalOrders: number;
  totalProducts: number;
  totalDeals: number;
  revenue: number;
  pending: number;
  preparing: number;
  onTheWay: number;
  delivered: number;
  todayOrders: number;
  todayRevenue: number;
};

type Section =
  | "dashboard"
  | "products"
  | "categories"
  | "deals"
  | "gallery"
  | "reviews"
  | "settings";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] =
    useState(0);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [pendingOrders, setPendingOrders] =
    useState<any[]>([]);

  const [activeSection, setActiveSection] =
    useState<Section>("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalProducts: 0,
    totalDeals: 0,
    revenue: 0,
    pending: 0,
    preparing: 0,
    onTheWay: 0,
    delivered: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });

  async function fetchDashboardStats() {
    const { data: orders } = await supabase
      .from("orders")
      .select("*");

    const { data: products } = await supabase
      .from("products")
      .select("*");

    const { data: deals } = await supabase
      .from("deals")
      .select("*");

    if (!orders || !products || !deals) return;

    const now = new Date();

    const todayOrders = orders.filter(
      (order: any) => {
        const orderDate = new Date(
          order.created_at
        );

        return (
          orderDate.getFullYear() ===
            now.getFullYear() &&
          orderDate.getMonth() ===
            now.getMonth() &&
          orderDate.getDate() ===
            now.getDate()
        );
      }
    ).length;

    const todayRevenue = orders
      .filter((order: any) => {
        const orderDate = new Date(
          order.created_at
        );

        return (
          orderDate.getFullYear() ===
            now.getFullYear() &&
          orderDate.getMonth() ===
            now.getMonth() &&
          orderDate.getDate() ===
            now.getDate()
        );
      })
      .reduce(
        (sum: number, order: any) =>
          sum + Number(order.total),
        0
      );

    setStats({
      totalOrders: orders.length,

      totalProducts: products.length,

      totalDeals: deals.length,

      revenue: orders.reduce(
        (sum: number, order: any) =>
          sum + Number(order.total),
        0
      ),

      pending: orders.filter(
        (o: any) =>
          o.status === "Pending"
      ).length,

      preparing: orders.filter(
        (o: any) =>
          o.status === "Preparing"
      ).length,

      onTheWay: orders.filter(
        (o: any) =>
          o.status === "On The Way"
      ).length,

      delivered: orders.filter(
        (o: any) =>
          o.status === "Delivered"
      ).length,

      todayOrders,

      todayRevenue,
    });

    await fetchNotifications();
  }

  async function fetchNotifications() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "Pending")
      .order("created_at", {
        ascending: false,
      });

    setPendingOrders(data || []);
    setNotifications(data?.length || 0);
  }

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-live")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchDashboardStats();
          fetchNotifications();
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          fetchDashboardStats();
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
          fetchDashboardStats();
        }
      )

      .subscribe((status) => {
        console.log(
          "Realtime Status:",
          status
        );
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    checkAdmin();

    async function checkAdmin() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setLoading(false);

      fetchDashboardStats();
      fetchNotifications();
    }
  }, [router]);

  function changeSection(
    section: Section
  ) {
    setActiveSection(section);
    setSidebarOpen(false);
    setShowNotifications(false);
  }

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f4f6f5]">
        <h1 className="text-3xl font-bold text-[#102d24]">
          Loading...
        </h1>
      </section>
    );
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#f4f6f5] text-[#17221e]">

      {/* ================================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[270px]
          flex-col
          border-r
          border-[#c9a35b]/20
          bg-[#102d24]
          shadow-[8px_0_30px_rgba(0,0,0,0.12)]
          transition-transform
          duration-300
          lg:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* SIDEBAR HEADER */}

        <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-[#c9a35b]/15 px-6">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a35b]">
              Madina Fast Food
            </p>

            <h2 className="mt-1 text-xl font-black text-[#f3dfad]">
              Admin Panel
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#f3dfad] hover:bg-white/10 lg:hidden"
          >
            ×
          </button>

        </div>

        {/* SETTINGS TITLE */}

        <div className="px-5 pb-3 pt-6">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a35b]/70">
            Settings
          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-6">

          {/* DASHBOARD */}

          <button
            type="button"
            onClick={() =>
              changeSection("dashboard")
            }
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              font-bold
              transition-all
              ${
                activeSection ===
                "dashboard"
                  ? "bg-[#c9a35b] text-[#102d24] shadow-lg"
                  : "text-[#e9dfc8] hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <span className="text-lg">
              📊
            </span>

            Dashboard
          </button>

          {/* PRODUCTS */}

          <button
            type="button"
            onClick={() =>
              changeSection("products")
            }
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              font-bold
              transition-all
              ${
                activeSection ===
                "products"
                  ? "bg-[#c9a35b] text-[#102d24] shadow-lg"
                  : "text-[#e9dfc8] hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <span className="text-lg">
              🍔
            </span>

            Products
          </button>

          {/* CATEGORIES */}

          <button
            type="button"
            onClick={() =>
              changeSection("categories")
            }
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              font-bold
              transition-all
              ${
                activeSection ===
                "categories"
                  ? "bg-[#c9a35b] text-[#102d24] shadow-lg"
                  : "text-[#e9dfc8] hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <span className="text-lg">
              📂
            </span>

            Categories
          </button>

          {/* DEALS */}

          <button
            type="button"
            onClick={() =>
              changeSection("deals")
            }
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              font-bold
              transition-all
              ${
                activeSection ===
                "deals"
                  ? "bg-[#c9a35b] text-[#102d24] shadow-lg"
                  : "text-[#e9dfc8] hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <span className="text-lg">
              🔥
            </span>

            Deals
          </button>

          {/* GALLERY */}

          <button
            type="button"
            onClick={() =>
              changeSection("gallery")
            }
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              font-bold
              transition-all
              ${
                activeSection ===
                "gallery"
                  ? "bg-[#c9a35b] text-[#102d24] shadow-lg"
                  : "text-[#e9dfc8] hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <span className="text-lg">
              🖼️
            </span>

            Gallery
          </button>

          {/* REVIEWS */}

          <button
            type="button"
            onClick={() =>
              changeSection("reviews")
            }
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              font-bold
              transition-all
              ${
                activeSection ===
                "reviews"
                  ? "bg-[#c9a35b] text-[#102d24] shadow-lg"
                  : "text-[#e9dfc8] hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <span className="text-lg">
              ⭐
            </span>

            Reviews
          </button>

          {/* STORE SETTINGS */}

          <button
            type="button"
            onClick={() =>
              changeSection("settings")
            }
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              font-bold
              transition-all
              ${
                activeSection ===
                "settings"
                  ? "bg-[#c9a35b] text-[#102d24] shadow-lg"
                  : "text-[#e9dfc8] hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <span className="text-lg">
              ⚙️
            </span>

            Store Settings
          </button>

        </nav>

        {/* SIDEBAR FOOTER */}

        <div className="border-t border-[#c9a35b]/15 p-5">

          <p className="text-center text-[10px] font-medium text-[#c9a35b]/60">
            Sabzazar Fast Food
          </p>

          <p className="mt-1 text-center text-[9px] text-[#e9dfc8]/40">
            Admin Management Panel
          </p>

        </div>

      </aside>

      {/* ================================================= */}
      {/* MAIN AREA */}
      {/* ================================================= */}

      <div className="min-h-screen min-w-0 lg:pl-[270px]">

        {/* ================================================= */}
        {/* TOP BAR */}
        {/* ================================================= */}

        <header className="sticky top-0 z-30 border-b border-[#d8dfdb] bg-[#f4f6f5]/95 shadow-sm backdrop-blur-md">

          <div className="flex h-[78px] min-w-0 items-center justify-between px-4 sm:px-6 lg:px-8">

            <div className="flex min-w-0 items-center gap-3">

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d7ddd9] bg-white text-xl shadow-sm lg:hidden"
              >
                ☰
              </button>

              <div className="min-w-0">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a17b3f]">
                  Admin
                </p>

                <h1 className="truncate text-xl font-black text-[#102d24] sm:text-2xl">
                  {activeSection ===
                    "dashboard" &&
                    "Dashboard"}

                  {activeSection ===
                    "products" &&
                    "Products"}

                  {activeSection ===
                    "categories" &&
                    "Categories"}

                  {activeSection ===
                    "deals" &&
                    "Deals"}

                  {activeSection ===
                    "gallery" &&
                    "Gallery"}

                  {activeSection ===
                    "reviews" &&
                    "Reviews"}

                  {activeSection ===
                    "settings" &&
                    "Store Settings"}
                </h1>

              </div>

            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">

              {/* NOTIFICATIONS */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(
                      !showNotifications
                    )
                  }
                  className={`
                    relative
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#d7ddd9]
                    bg-white
                    text-xl
                    shadow-sm
                    transition
                    hover:border-[#c9a35b]
                    hover:bg-[#fffaf0]
                    ${
                      notifications > 0
                        ? "animate-pulse border-red-500 bg-red-50"
                        : ""
                    }
                  `}
                >
                  🔔

                  {notifications > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                      {notifications}
                    </span>
                  )}

                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-[52px] z-[100] w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#d8dfdb] bg-white shadow-2xl">

                    <div className="border-b border-[#e5e9e7] bg-[#fafcfb] p-4">

                      <div className="flex items-center justify-between">

                        <h3 className="font-black text-[#102d24]">
                          Pending Orders
                        </h3>

                        {notifications > 0 && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-600">
                            {notifications}
                          </span>
                        )}

                      </div>

                    </div>

                    {pendingOrders.length ===
                    0 ? (
                      <p className="p-5 text-sm text-gray-500">
                        No Pending Orders
                      </p>
                    ) : (
                      <div className="max-h-[360px] overflow-y-auto">

                        {pendingOrders.map(
                          (order) => (
                            <div
                              key={order.id}
                              className="border-b border-[#edf0ee] p-4 transition hover:bg-[#fafcfb]"
                            >

                              <h4 className="font-bold text-[#17221e]">
                                {
                                  order.customer_name
                                }
                              </h4>

                              <p className="mt-1 text-sm text-gray-500">
                                Rs.{" "}
                                {order.total}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-red-600">
                                {
                                  order.status
                                }
                              </p>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/login");
                }}
                className="
                  rounded-xl
                  bg-red-600
                  px-3
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-red-700
                  sm:px-6
                "
              >
                Logout
              </button>

            </div>

          </div>

        </header>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <main className="min-w-0 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

          {/* ================================================= */}
          {/* DASHBOARD */}
          {/* ================================================= */}

          {activeSection ===
            "dashboard" && (
            <>

              {/* STATS */}

              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">

                <div className="min-w-0 rounded-2xl border border-[#e0e5e2] bg-white p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-500">
                    📦 Total Orders
                  </h3>

                  <p className="mt-3 text-3xl font-black text-[#17221e]">
                    {stats.totalOrders}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-purple-100 bg-purple-50 p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-purple-700">
                    📅 Today&apos;s Orders
                  </h3>

                  <p className="mt-3 text-3xl font-black text-purple-900">
                    {stats.todayOrders}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-[#e0e5e2] bg-white p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-500">
                    💰 Revenue
                  </h3>

                  <p className="mt-3 text-2xl font-black text-green-600 sm:text-3xl">
                    Rs.{" "}
                    {stats.revenue}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-green-700">
                    💵 Today&apos;s Revenue
                  </h3>

                  <p className="mt-3 text-2xl font-black text-green-600 sm:text-3xl">
                    Rs.{" "}
                    {stats.todayRevenue}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-[#e0e5e2] bg-white p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-500">
                    🍔 Products
                  </h3>

                  <p className="mt-3 text-3xl font-black text-[#17221e]">
                    {stats.totalProducts}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-[#e0e5e2] bg-white p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-500">
                    🔥 Deals
                  </h3>

                  <p className="mt-3 text-3xl font-black text-[#17221e]">
                    {stats.totalDeals}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-yellow-100 bg-yellow-50 p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-yellow-700">
                    ⏳ Pending
                  </h3>

                  <p className="mt-3 text-3xl font-black text-yellow-800">
                    {stats.pending}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-orange-100 bg-orange-50 p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-orange-700">
                    👨‍🍳 Preparing
                  </h3>

                  <p className="mt-3 text-3xl font-black text-orange-800">
                    {stats.preparing}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-blue-700">
                    🚚 On The Way
                  </h3>

                  <p className="mt-3 text-3xl font-black text-blue-800">
                    {stats.onTheWay}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm sm:p-5">
                  <h3 className="text-sm font-semibold text-green-700">
                    ✅ Delivered
                  </h3>

                  <p className="mt-3 text-3xl font-black text-green-800">
                    {stats.delivered}
                  </p>
                </div>

              </div>

              {/* CUSTOMER ORDERS */}

              <div className="mt-8 min-w-0 overflow-x-auto">
                <OrdersTable
                  onOrdersChanged={async () => {
                    await fetchDashboardStats();
                    await fetchNotifications();
                  }}
                />
              </div>

            </>
          )}

          {/* ================================================= */}
          {/* PRODUCTS */}
          {/* ================================================= */}

          {activeSection ===
            "products" && (
            <div className="min-w-0 space-y-8">

              <div className="min-w-0 overflow-x-auto">
                <AddProductForm />
              </div>

              <div className="min-w-0 overflow-x-auto">
                <ProductsTable />
              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* CATEGORIES */}
          {/* ================================================= */}

          {activeSection ===
            "categories" && (
            <div className="min-w-0 overflow-x-auto">
              <CategoriesManager />
            </div>
          )}

          {/* ================================================= */}
          {/* DEALS */}
          {/* ================================================= */}

          {activeSection ===
            "deals" && (
            <div className="min-w-0 space-y-8">

              <div className="min-w-0 overflow-x-auto">
                <AddDealForm />
              </div>

              <div className="min-w-0 overflow-x-auto">
                <DealsTable />
              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* GALLERY */}
          {/* ================================================= */}

          {activeSection ===
            "gallery" && (
            <div className="min-w-0 overflow-x-auto">
              <GalleryManager />
            </div>
          )}

          {/* ================================================= */}
          {/* REVIEWS */}
          {/* ================================================= */}

          {activeSection ===
            "reviews" && (
            <div className="min-w-0 overflow-x-auto">
              <ReviewsTable />
            </div>
          )}

          {/* ================================================= */}
          {/* STORE SETTINGS */}
          {/* ================================================= */}

          {activeSection ===
            "settings" && (
            <div className="min-w-0">
              <SettingsForm />
            </div>
          )}

        </main>

      </div>

    </section>
  );
}

