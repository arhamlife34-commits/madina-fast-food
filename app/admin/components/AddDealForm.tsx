"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AddDealForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function addDeal() {
    if (
      !name.trim() ||
      !price ||
      !description.trim() ||
      !imageFile
    ) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    let imageUrl = "";

    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, imageFile, {
        upsert: false,
      });

    if (uploadError) {
      setLoading(false);
      alert("Image Upload Failed!");
      console.error(uploadError);
      return;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;

    const { error } = await supabase
      .from("deals")
      .insert([
        {
          name,
          description,
          price: Number(price),
          image: imageUrl,
        },
      ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to add deal.");
      return;
    }

    alert("Deal Added Successfully!");

    setName("");
    setPrice("");
    setDescription("");
    setImageFile(null);

    const fileInput =
      document.getElementById("deal-image") as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }

    window.location.reload();
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

      <h2 className="text-3xl font-bold mb-8">
        Add New Deal
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          type="text"
          placeholder="Deal Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-xl p-4"
        />

        <input
          type="number"
          placeholder="Deal Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-xl p-4"
        />

        <div className="md:col-span-2">

          <input
            id="deal-image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="border rounded-xl p-3 w-full"
          />

          {imageFile && (
            <p className="text-green-600 text-sm mt-2">
              Selected: {imageFile.name}
            </p>
          )}

        </div>

        <textarea
          placeholder="Deal Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-xl p-4 md:col-span-2 h-32"
        />

      </div>

      <button
        onClick={addDeal}
        disabled={loading}
        className="mt-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-8 py-4 rounded-xl font-bold transition"
      >
        {loading ? "Adding..." : "Add Deal"}
      </button>

    </div>
  );
}