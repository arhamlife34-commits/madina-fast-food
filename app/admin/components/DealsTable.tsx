"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import EditDealModal from "./EditDealModal";
type Deal = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function DealsTable() {
  const [deals, setDeals] = useState<Deal[]>([]);
const [editingDeal, setEditingDeal] =
  useState<Deal | null>(null);

const [editName, setEditName] = useState("");
const [editPrice, setEditPrice] = useState(0);
const [editDescription, setEditDescription] = useState("");

const [editImage, setEditImage] = useState("");

const [editImageFile, setEditImageFile] =
  useState<File | null>(null);
  async function fetchDeals() {
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("id");

    if (error) {
      console.error(error);
      return;
    }

    setDeals(data || []);
  }

  async function deleteDeal(id: number) {
    const ok = confirm(
      "Delete this deal permanently?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("deals")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete Failed");
      console.error(error);
      return;
    }

    alert("Deal Deleted");

    fetchDeals();
  }
function startEdit(deal: Deal) {

  setEditingDeal(deal);

  setEditName(deal.name);
  setEditPrice(deal.price);
  setEditDescription(deal.description);

  setEditImage(deal.image);

  setEditImageFile(null);

}
async function saveDeal() {

  if (!editingDeal) return;

  let imageUrl = editImage;

  if (editImageFile) {

    const fileName =
      `${Date.now()}-${editImageFile.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from("products")
        .upload(fileName, editImageFile, {
          upsert: false,
        });

    if (uploadError) {
      alert("Image Upload Failed");
      console.error(uploadError);
      return;
    }

    const { data } =
      supabase.storage
        .from("products")
        .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  const { error } =
    await supabase
      .from("deals")
      .update({
        name: editName,
        price: editPrice,
        description: editDescription,
        image: imageUrl,
      })
      .eq("id", editingDeal.id);

  if (error) {
    alert("Update Failed");
    console.error(error);
    return;
  }

  alert("Deal Updated Successfully!");

  setEditingDeal(null);
  setEditImageFile(null);

  fetchDeals();
}
  useEffect(() => {
    fetchDeals();
  }, []);  return (
    <div className="bg-white rounded-2xl shadow-lg mt-10 overflow-hidden">

      <div className="p-6 border-b">
        <h2 className="text-3xl font-bold">
          Deals
        </h2>
      </div>

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-4 text-left">
              #
            </th>

            <th className="p-4 text-left">
              Image
            </th>

            <th className="p-4 text-left">
              Name
            </th>

            <th className="p-4 text-left">
              Price
            </th>

            <th className="p-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {deals.map((deal, index) => (

            <tr
              key={deal.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4 font-bold">
                #{index + 1}
              </td>

              <td className="p-4">

                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-16 h-16 rounded-lg object-cover border"
                />

              </td>

              <td className="p-4 font-semibold">
                {deal.name}
              </td>

              <td className="p-4 font-bold text-red-600">
                Rs. {deal.price}
              </td>

              <td className="p-4">

                <div className="flex justify-center gap-3">

                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteDeal(deal.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
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
  );
}