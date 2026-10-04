"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Order = {
  id: number;
  customer_name: string;
  phone: string;

  order_type: "delivery" | "pickup";

  city_region: string;
  area_sub_region: string;
  pickup_branch: string;

  address: string;
  payment_method: string;

  total: number;
  subtotal: number;
  delivery: number;

  notes: string;
  created_at: string;
  status: string;

  items: any[];
};

type Props = {
  onOrdersChanged: () => void;
};

export default function OrdersTable({
  onOrdersChanged,
}: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setRefreshKey((p) => p + 1);
    setLoading(false);
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Status update failed");
      console.error(error);
      return;
    }

    await fetchOrders();
    await onOrdersChanged();
  }

  async function deleteOrder(id: number) {
    const confirmDelete = confirm(
      "Delete this order permanently?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete Failed");
      console.error(error);
      return;
    }

    alert("Order Deleted");

    await fetchOrders();
    await onOrdersChanged();
  }

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          console.log("Realtime Order:", payload);

          await fetchOrders();
          await onOrdersChanged();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function badgeColor(status: string) {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Preparing":
        return "bg-orange-100 text-orange-700";

      case "On The Way":
        return "bg-blue-100 text-blue-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.customer_name || "";

    const customerPhone =
      order.phone || "";

    const matchSearch =
      customerName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customerPhone.includes(search);

    const matchStatus =
      selectedStatus === "All" ||
      order.status === selectedStatus;

    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        Loading Orders...
      </div>
    );
  }

  return (
    <>
      {/* ================================
          ORDER DETAILS POPUP
      ================================= */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-[650px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

            <div className="mb-6 flex items-center justify-between gap-4">

              <h2 className="text-2xl font-bold sm:text-3xl">
                Order Details
              </h2>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Close
              </button>

            </div>

            {/* ORDER TYPE */}

            <div
              className={`mb-6 rounded-xl p-4 ${
                selectedOrder.order_type === "pickup"
                  ? "bg-green-50 border border-green-200"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >

              <p className="text-sm font-semibold text-gray-500">
                Order Type
              </p>

              <p
                className={`mt-1 text-xl font-black ${
                  selectedOrder.order_type === "pickup"
                    ? "text-green-700"
                    : "text-blue-700"
                }`}
              >
                {selectedOrder.order_type === "pickup"
                  ? "🏪 Pick-Up"
                  : "🛵 Delivery"}
              </p>

            </div>

            {/* CUSTOMER INFORMATION */}

            <div className="mb-8 space-y-3">

              <p>
                <b>Customer:</b>{" "}
                {selectedOrder.customer_name}
              </p>

              <p>
                <b>Phone:</b>{" "}
                {selectedOrder.phone}
              </p>

              
              {/* DELIVERY AREA */}

              {selectedOrder.order_type ===
                "delivery" && (
                <>
                  <p>
                    <b>Address:</b>{" "}
                    {selectedOrder.address ||
                      "Not provided"}
                  </p>
                </>
              )}

              <p>
                <b>Payment:</b>{" "}
                {selectedOrder.payment_method}
              </p>

              <p>
                <b>Status:</b>{" "}
                {selectedOrder.status}
              </p>

              <p>
                <b>Notes:</b>{" "}
                {selectedOrder.notes ||
                  "No Notes"}
              </p>

            </div>

            {/* ORDERED ITEMS */}

            <h3 className="mb-4 text-2xl font-bold">
              Ordered Items
            </h3>

            <div className="space-y-3">

              {selectedOrder.items?.map(
                (item, index) => (

                  <div
                    key={index}
                    className="flex justify-between gap-4 rounded-xl border p-3"
                  >

                    <span>

                      {item.name}

                      {item.selectedSize && (
                        <span className="ml-2 font-semibold text-red-600">
                          ({item.selectedSize})
                        </span>
                      )}

                      {" × "}
                      {item.quantity}

                      {item.selectedAddon && (
                        <span className="ml-2 block text-sm text-green-600">
                          + {item.selectedAddon}

                          {item.addonPrice
                            ? ` (+Rs. ${item.addonPrice})`
                            : ""}
                        </span>
                      )}

                    </span>

                    <span className="whitespace-nowrap">
                      Rs.{" "}
                      {item.price *
                        item.quantity}
                    </span>

                  </div>
                )
              )}

            </div>

            <hr className="my-6" />

            {/* PRICE DETAILS */}

            <div className="space-y-2">

              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>
                  Rs.{" "}
                  {selectedOrder.subtotal}
                </span>
              </div>

              {selectedOrder.order_type ===
                "delivery" && (
                <div className="flex justify-between">
                  <span>Delivery</span>

                  <span>
                    Rs.{" "}
                    {selectedOrder.delivery}
                  </span>
                </div>
              )}


              <div className="flex justify-between text-2xl font-bold text-red-600">

                <span>Total</span>

                <span>
                  Rs.{" "}
                  {selectedOrder.total}
                </span>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================================
          MAIN ORDERS TABLE
      ================================= */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

        <div className="border-b p-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <h2 className="text-3xl font-bold">
              Customer Orders
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                type="text"
                placeholder="Search Customer / Phone..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-2 sm:w-72"
              />

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value
                  )
                }
                className="rounded-xl border px-4 py-2"
              >

                <option value="All">
                  All
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Preparing">
                  Preparing
                </option>

                <option value="On The Way">
                  On The Way
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

            </div>
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Order Type
                </th>

                <th className="p-4 text-left">
                  Payment
                </th>

                <th className="p-4 text-left">
                  Total
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody key={refreshKey}>

              {filteredOrders.map((order) => (

               
  <tr
  key={order.id}
  className={`border-t ${
    order.status === "Pending"
      ? "bg-red-100"
      : order.status === "Delivered"
      ? "bg-green-100"
      : ""
  }`}
>


                  <td className="p-4 font-semibold">
                    {order.customer_name}
                  </td>

                  <td className="p-4">
                    {order.phone}
                  </td>

                  {/* ORDER TYPE */}

                  <td className="p-4">

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        order.order_type ===
                        "pickup"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.order_type ===
                      "pickup"
                        ? "Pick-Up"
                        : "Delivery"}
                    </span>

                  </td>
                  <td className="p-4">
                    {order.payment_method}
                  </td>

                  <td className="p-4 font-bold text-red-600">
                    Rs. {order.total}
                  </td>

                  <td className="p-4">

                    <select
                      value={
                        order.status ||
                        "Pending"
                      }
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className={`rounded-lg px-3 py-2 font-semibold ${badgeColor(
                        order.status ||
                          "Pending"
                      )}`}
                    >

                      <option>
                        Pending
                      </option>

                      <option>
                        Preparing
                      </option>

                      <option>
                        On The Way
                      </option>

                      <option>
                        Delivered
                      </option>

                      <option>
                        Cancelled
                      </option>

                    </select>

                  </td>

                  <td className="p-4">
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          setSelectedOrder(
                            order
                          )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          deleteOrder(
                            order.id
                          )
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {filteredOrders.length ===
                0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="p-10 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}