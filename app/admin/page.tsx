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

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
 const [notifications, setNotifications] = useState(0);
const [showNotifications, setShowNotifications] = useState(false);
const [pendingOrders, setPendingOrders] = useState<any[]>([]);
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
    await new Promise((resolve) => setTimeout(resolve, 300));
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

const todayOrders = orders.filter((order: any) => {
  const orderDate = new Date(order.created_at);

  return (
    orderDate.getFullYear() === now.getFullYear() &&
    orderDate.getMonth() === now.getMonth() &&
    orderDate.getDate() === now.getDate()
  );
}).length;
const todayRevenue = orders
  .filter((order: any) => {
    const orderDate = new Date(order.created_at);

    return (
      orderDate.getFullYear() === now.getFullYear() &&
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getDate() === now.getDate()
    );
  })
  .reduce(
    (sum: number, order: any) => sum + Number(order.total),
    0
  );
    setStats({
      totalOrders: orders.length,

      totalProducts: products.length,

     totalDeals: deals?.length || 0,

      revenue: orders.reduce(
        (sum: number, order: any) => sum + Number(order.total),
        0
      ),

      pending: orders.filter(
        (o: any) => o.status === "Pending"
      ).length,

      preparing: orders.filter(
        (o: any) => o.status === "Preparing"
      ).length,

      onTheWay: orders.filter(
        (o: any) => o.status === "On The Way"
      ).length,

      delivered: orders.filter(
        (o: any) => o.status === "Delivered"
      ).length,
      todayOrders: todayOrders,
      todayRevenue: todayRevenue,
    });
  }
  async function fetchNotifications() {
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "Pending")
    .order("created_at", { ascending: false });

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
  console.log("ORDER EVENT RECEIVED");
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
  console.log("Realtime Status:", status);
});

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      router.replace("/login");
    } else {
      setLoading(false);
      fetchDashboardStats();
      fetchNotifications();
    }
  }, [router]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading...
        </h1>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 py-32">
      <div className="max-w-7xl mx-auto px-6">

       <div className="flex justify-between items-center mb-10">

  <h1 className="text-5xl font-bold">
    Admin Dashboard
  </h1>

  <div className="flex items-center gap-4">

    <div className="relative">

      <button
        onClick={() =>
          setShowNotifications(!showNotifications)
        }
        className="bg-white shadow-lg px-4 py-3 rounded-xl text-2xl"
      >
        🔔
      </button>

      {notifications > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
          {notifications}
        </span>
      )}

      {showNotifications && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border z-50">

          <div className="p-4 border-b font-bold">
            Pending Orders
          </div>

          {pendingOrders.length === 0 ? (
            <p className="p-4 text-gray-500">
              No Pending Orders
            </p>
          ) : (
            pendingOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 border-b hover:bg-gray-50"
              >
                <h4 className="font-bold">
                  {order.customer_name}
                </h4>

                <p className="text-sm text-gray-500">
                  Rs. {order.total}
                </p>

                <p className="text-xs text-red-600">
                  {order.status}
                </p>
              </div>
            ))
          )}

        </div>
      )}

    </div>

    <button
      onClick={() => {
        localStorage.removeItem("adminLoggedIn");
        router.push("/login");
      }}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold"
    >
      Logout
    </button>

  </div>

</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-gray-500">📦 Total Orders</h3>
            <p className="text-4xl font-bold mt-3">
              {stats.totalOrders}
            </p>
          </div>
          <div className="bg-purple-50 rounded-2xl shadow-lg p-6">
  <h3 className="text-purple-700">📅 Today's Orders</h3>
  <p className="text-4xl font-bold mt-3">
    {stats.todayOrders}
  </p>
</div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-gray-500">💰 Revenue</h3>
            <p className="text-4xl font-bold mt-3 text-green-600">
              Rs. {stats.revenue}
            </p>
          </div>
<div className="bg-green-50 rounded-2xl shadow-lg p-6">
  <h3 className="text-green-700">💵 Today's Revenue</h3>

  <p className="text-4xl font-bold mt-3 text-green-600">
    Rs. {stats.todayRevenue}
  </p>
</div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-gray-500">🍔 Products</h3>
            <p className="text-4xl font-bold mt-3">
              {stats.totalProducts}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-gray-500">🔥 Deals</h3>
            <p className="text-4xl font-bold mt-3">
              {stats.totalDeals}
            </p>
          </div>

          <div className="bg-yellow-50 rounded-2xl shadow-lg p-6">
            <h3 className="text-yellow-700">⏳ Pending</h3>
            <p className="text-4xl font-bold mt-3">
              {stats.pending}
            </p>
          </div>

          <div className="bg-orange-50 rounded-2xl shadow-lg p-6">
            <h3 className="text-orange-700">👨‍🍳 Preparing</h3>
            <p className="text-4xl font-bold mt-3">
              {stats.preparing}
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl shadow-lg p-6">
            <h3 className="text-blue-700">🚚 On The Way</h3>
            <p className="text-4xl font-bold mt-3">
              {stats.onTheWay}
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl shadow-lg p-6">
            <h3 className="text-green-700">✅ Delivered</h3>
            <p className="text-4xl font-bold mt-3">
              {stats.delivered}
            </p>
          </div>

        </div>

        <AddProductForm />

<div className="mt-10">
  <AddDealForm />
</div>

<OrdersTable
  onOrdersChanged={fetchDashboardStats}
/>

<div className="mt-10">
  <ProductsTable />
</div>
<div className="mt-10">
  <DealsTable />
</div>
<div className="mt-10">
  <SettingsForm />
</div>
<div className="mt-10">
 <GalleryManager />
</div>
<div className="mt-10">
  <ReviewsTable />
</div>
          </div>
    </section>
  );
}