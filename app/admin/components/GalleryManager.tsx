"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function GalleryManager() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("id");

    setGallery(data || []);
  }

  async function addImage() {
    if (!title || !imageFile) {
      alert("Fill all fields");
      return;
    }

    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, imageFile);

    if (uploadError) {
      alert("Upload Failed");
      console.error(uploadError);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from("gallery")
      .insert([
        {
          title,
          image: publicUrl,
        },
      ]);

    if (error) {
      alert("Insert Failed");
      console.error(error);
      return;
    }

    setTitle("");
    setImageFile(null);

    // Reset file input
    const input = document.getElementById(
      "gallery-file"
    ) as HTMLInputElement;

    if (input) input.value = "";

    fetchGallery();
  }

  async function deleteImage(id: number) {
    if (!confirm("Delete Image?")) return;

    await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    fetchGallery();
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

      <h2 className="text-3xl font-bold mb-6">
        Gallery Manager
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          placeholder="Image Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-xl p-4"
        />

        <input
          id="gallery-file"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files?.[0] || null)
          }
          className="hidden"
        />

        <label
          htmlFor="gallery-file"
          className="border rounded-xl p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 text-center font-medium"
        >
          {imageFile ? imageFile.name : "Choose Image"}
        </label>

      </div>

      <button
        onClick={addImage}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold"
      >
        Add Image
      </button>

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        {gallery.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl overflow-hidden shadow"
          >

            <img
              src={item.image}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">

              <h3 className="font-bold">
                {item.title}
              </h3>

              <button
                onClick={() => deleteImage(item.id)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}