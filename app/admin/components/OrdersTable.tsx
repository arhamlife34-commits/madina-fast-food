"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Order = {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  payment_method: string;
  total: number;
  subtotal: number;
  delivery: number;
  notes: string;
  created_at: string;
  status: string;
  order_items: any[];
};
type Props = {
  onOrdersChanged: () => void;
};
export default function OrdersTable({
  onOrdersChanged,
}: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

const [selectedStatus, setSelectedStatus] =
  useState("All");
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
  .from("orders")
  .update({ status })
  .eq("id", id);

if (error) {
  alert("Status update failed");
  console.error(error);
  return;
}

// Database se latest data dubara lo
await fetchOrders();

// Dashboard ko bhi refresh karo
onOrdersChanged();
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

onOrdersChanged();
  }

  useEffect(() => {
    fetchOrders();
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
  const matchSearch =
    order.customer_name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    order.phone.includes(search);

  const matchStatus =
    selectedStatus === "All" ||
    order.status === selectedStatus;

  return matchSearch && matchStatus;
});
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        Loading Orders...
      </div>
    );
  }

  return (
    <>      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[650px] max-h-[90vh] overflow-y-auto rounded-2xl p-8 shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                Order Details
              </h2>

              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 mb-8">

              <p><b>Customer:</b> {selectedOrder.customer_name}</p>

              <p><b>Phone:</b> {selectedOrder.phone}</p>

              <p><b>Address:</b> {selectedOrder.address}</p>

              <p><b>Payment:</b> {selectedOrder.payment_method}</p>

              <p><b>Status:</b> {selectedOrder.status}</p>

              <p><b>Notes:</b> {selectedOrder.notes || "No Notes"}</p>

            </div>

            <h3 className="text-2xl font-bold mb-4">
              Ordered Items
            </h3>

            <div className="space-y-3">

              {selectedOrder.order_items?.map((item, index) => (
  <div
    key={index}
    className="flex justify-between border rounded-xl p-3"
  >

    <span>
      {item.name}

      {item.selectedSize && (
        <span className="text-red-600 ml-2 font-semibold">
          ({item.selectedSize})
        </span>
      )}

      {" × "}{item.quantity}
    </span>

    <span>
      Rs. {item.price * item.quantity}
    </span>

  </div>
))}
            </div>

            <hr className="my-6" />

            <div className="space-y-2">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {selectedOrder.subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Rs. {selectedOrder.delivery}</span>
              </div>

              <div className="flex justify-between text-2xl font-bold text-red-600">
                <span>Total</span>
                <span>Rs. {selectedOrder.total}</span>
              </div>

            </div>

          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    <h2 className="text-3xl font-bold">
      Customer Orders
    </h2>

    <div className="flex gap-3">

      <input
        type="text"
        placeholder="Search Customer / Phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-xl px-4 py-2 w-72"
      />

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border rounded-xl px-4 py-2"
      >
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Preparing">Preparing</option>
        <option value="On The Way">On The Way</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>

    </div>

  </div>

</div>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-center p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-semibold">
                  {order.customer_name}
                </td>

                <td className="p-4">
                  {order.phone}
                </td>

                <td className="p-4">
                  {order.payment_method}
                </td>

                <td className="p-4 font-bold text-red-600">
                  Rs. {order.total}
                </td>

                <td className="p-4">

                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    className={`px-3 py-2 rounded-lg font-semibold ${badgeColor(
                      order.status || "Pending"
                    )}`}
                  >
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>On The Way</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                </td>

                <td className="p-4">
                  {new Date(order.created_at).toLocaleString()}
                </td>

                <td className="p-4">

                  <div className="flex gap-2 justify-center">

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>
  );
}