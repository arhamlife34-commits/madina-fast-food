"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function GalleryManager() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

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
    if (!title || !image) {
      alert("Fill all fields");
      return;
    }

    const { error } = await supabase
      .from("gallery")
      .insert([
        {
          title,
          image,
        },
      ]);

    if (error) {
      alert("Insert Failed");
      console.error(error);
      return;
    }

    setTitle("");
    setImage("");

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
          onChange={(e)=>setTitle(e.target.value)}
          className="border rounded-xl p-4"
        />

        <input
          placeholder="Image URL"
          value={image}
          onChange={(e)=>setImage(e.target.value)}
          className="border rounded-xl p-4"
        />

      </div>

      <button
        onClick={addImage}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold"
      >
        Add Image
      </button>

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        {gallery.map((item)=>(
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
                onClick={()=>deleteImage(item.id)}
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