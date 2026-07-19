"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Burger");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isDeal, setIsDeal] = useState(false);

  const [loading, setLoading] = useState(false);

  async function addProduct() {
    if (
  !name.trim() ||
  !category.trim() ||
  !price ||
  !description.trim() ||
  !imageFile
) {
      alert("Please fill all fields.");
      return;
    }
    setLoading(true);
     let imageUrl = "";

if (imageFile) {
  const fileName = `${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(fileName, imageFile);

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
}

    const { error } = await supabase
      .from("products")
      .insert([
        {
          name,
          category,
          price: Number(price),
          image: imageUrl,
          description,
          is_deal: isDeal,
        },
      ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to add product.");
      return;
    }

    alert("Product Added Successfully!");

    setName("");
    setCategory("Burger");
    setPrice("");
   setImageFile(null);
    setDescription("");
    setIsDeal(false);

    // Refresh page so ProductsTable updates automatically
    window.location.reload();
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

      <h2 className="text-3xl font-bold mb-8">
        Add New Product
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-xl p-4"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-xl p-4"
        >
          <option>Burger</option>
          <option>Pizza</option>
          <option>Shawarma</option>
          <option>Fries</option>
          <option>Platter</option>
        </select>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-xl p-4"
        />

        <div className="flex flex-col gap-2">

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
      }
    }}
    className="border rounded-xl p-3"
  />

  {imageFile && (
    <p className="text-green-600 text-sm">
      Selected: {imageFile.name}
    </p>
  )}

</div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-xl p-4 md:col-span-2 h-32"
        />

        <label className="flex items-center gap-3 md:col-span-2">

          <input
            type="checkbox"
            checked={isDeal}
            onChange={(e) => setIsDeal(e.target.checked)}
          />

          Featured Deal

        </label>

      </div>

      <button
        onClick={addProduct}
        disabled={loading}
        className="mt-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white px-8 py-4 rounded-xl font-bold transition"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>

    </div>
  );
}