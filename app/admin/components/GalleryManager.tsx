"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

const categories = [
  "Special Pizza",
  "Master Pieces",
  "Signature Series",
  "Oven Baked",
  "Pizza Sandwich",
  "Mazedar Deals",
  "Exclusive Deals",
  "Platters",
  "Shawarma",
  "Sandwich",
  "Burgers",
  "Pasta",
  "Specials",
  "Fries/Cheese",
  "Bavarages",
];

type MediaItem = {
  id: number;
  title: string | null;
  image: string;
  type: string;
  category: string | null;
};

export default function GalleryManager() {
  const [media, setMedia] = useState<MediaItem[]>([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("slider");
  const [category, setCategory] = useState("Special Pizza");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("id");

    if (error) {
      console.error(error);
      return;
    }

    setMedia(data || []);
  }

  async function addMedia() {
    // Image is ALWAYS required
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    // Title is required ONLY for category posters
    if (type === "category_poster" && !title.trim()) {
      alert("Please enter a title for the category poster.");
      return;
    }

    if (type === "category_poster" && !category) {
      alert("Please select a category.");
      return;
    }

    setLoading(true);

    const fileName = `${Date.now()}-${imageFile.name}`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, imageFile, {
        upsert: false,
      });

    if (uploadError) {
      setLoading(false);
      console.error(uploadError);
      alert("Image Upload Failed!");
      return;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    // Save image information in gallery table
    const { error } = await supabase.from("gallery").insert([
      {
        title: type === "category_poster" ? title.trim() : null,
        image: publicUrl,
        type,
        category:
          type === "category_poster"
            ? category
            : null,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to save image.");
      return;
    }

    alert("Image Added Successfully!");

    // Reset form
    setTitle("");
    setImageFile(null);

    const input = document.getElementById(
      "media-file"
    ) as HTMLInputElement;

    if (input) {
      input.value = "";
    }

    fetchMedia();
  }

  async function deleteMedia(id: number) {
    if (!confirm("Delete this image?")) {
      return;
    }

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Delete Failed!");
      return;
    }

    fetchMedia();
  }

  const sliders = media.filter(
    (item) => item.type === "slider"
  );

  const posters = media.filter(
    (item) => item.type === "category_poster"
  );

  return (
    <div>
      <h2 className="mb-8 text-3xl font-black">
        Media Manager
      </h2>

      {/* ================================================= */}
      {/* ADD MEDIA */}
      {/* ================================================= */}

      <div className="rounded-2xl border bg-white p-6 shadow">

        <h3 className="mb-6 text-xl font-bold">
          Add New Image
        </h3>

        <div className="grid gap-5 md:grid-cols-2">

          {/* TITLE — ONLY FOR CATEGORY POSTER */}

          {type === "category_poster" && (
            <input
              type="text"
              placeholder="Poster Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="rounded-xl border p-4"
            />
          )}

          {/* TYPE */}

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);

              // Clear title when switching to slider
              if (e.target.value === "slider") {
                setTitle("");
              }
            }}
            className="rounded-xl border p-4"
          >
            <option value="slider">
              Hero Slider
            </option>

            <option value="category_poster">
              Category Poster
            </option>
          </select>

          {/* CATEGORY — ONLY FOR POSTER */}

          {type === "category_poster" && (
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-xl border p-4 md:col-span-2"
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          )}

          {/* IMAGE */}

          <input
            id="media-file"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(
                e.target.files?.[0] || null
              )
            }
            className="rounded-xl border p-3 md:col-span-2"
          />

        </div>

        {imageFile && (
          <p className="mt-3 text-sm text-gray-600">
            Selected: {imageFile.name}
          </p>
        )}

        <button
          type="button"
          onClick={addMedia}
          disabled={loading}
          className="mt-6 rounded-xl bg-red-600 px-8 py-3 font-bold text-white transition hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading
            ? "Uploading..."
            : "Upload Image"}
        </button>

      </div>

      {/* ================================================= */}
      {/* HERO SLIDERS */}
      {/* ================================================= */}

      <div className="mt-12">

        <h3 className="mb-6 text-2xl font-bold">
          Hero Sliders
        </h3>

        {sliders.length === 0 ? (
          <p className="text-gray-500">
            No slider images uploaded yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">

            {sliders.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border bg-white shadow"
              >

                <img
                  src={item.image}
                  alt="Hero Slider"
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">

                  <p className="text-xs font-semibold text-gray-500">
                    Hero Slider
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      deleteMedia(item.id)
                    }
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* CATEGORY POSTERS */}
      {/* ================================================= */}

      <div className="mt-12">

        <h3 className="mb-6 text-2xl font-bold">
          Category Posters
        </h3>

        {posters.length === 0 ? (
          <p className="text-gray-500">
            No category posters uploaded yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">

            {posters.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border bg-white shadow"
              >

                <img
                  src={item.image}
                  alt={
                    item.title ||
                    "Category Poster"
                  }
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">

                  <h4 className="font-bold">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-sm font-semibold text-red-600">
                    {item.category}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      deleteMedia(item.id)
                    }
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}