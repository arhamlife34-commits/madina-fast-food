"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
  regular_price?: number;
  large_price?: number;
  jumbo_price?: number;
  small_price?: number;
  medium_price?: number;
  cheese_price?: number;
  fries_price?: number;
  is_deal: boolean;
};

type Props = {
  product: Product | null;

  editName: string;
  setEditName: (v: string) => void;

  editCategory: string;
  setEditCategory: (v: string) => void;

  editPrice: number;
  setEditPrice: (v: number) => void;

  editRegularPrice: number;
  setEditRegularPrice: (v: number) => void;

  editLargePrice: number;
  setEditLargePrice: (v: number) => void;

  editJumboPrice: number;
  setEditJumboPrice: (v: number) => void;

  editSmallPrice: number;
  setEditSmallPrice: (v: number) => void;

  editMediumPrice: number;
  setEditMediumPrice: (v: number) => void;

  editCheesePrice: number;
  setEditCheesePrice: (v: number) => void;

  editFriesPrice: number;
  setEditFriesPrice: (v: number) => void;

  editDescription: string;
  setEditDescription: (v: string) => void;

  editImageFile: File | null;
  setEditImageFile: (v: File | null) => void;

  currentImage: string;

  onSave: () => void;
  onCancel: () => void;
};

export default function EditProductModal({
  product,

  editName,
  setEditName,

  editCategory,
  setEditCategory,

  editPrice,
  setEditPrice,

  editRegularPrice,
  setEditRegularPrice,

  editLargePrice,
  setEditLargePrice,

  editJumboPrice,
  setEditJumboPrice,

  editSmallPrice,
  setEditSmallPrice,

  editMediumPrice,
  setEditMediumPrice,

  editCheesePrice,
  setEditCheesePrice,

  editFriesPrice,
  setEditFriesPrice,

  editDescription,
  setEditDescription,

  editImageFile,
  setEditImageFile,

  currentImage,

  onSave,
  onCancel,
}: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setCategoriesLoading(true);

      const { data, error } = await supabase
        .from("categories")
        .select("name")
      .order("created_at", { ascending: true })

      if (error) {
        console.error("Error loading categories:", error);
        setCategoriesLoading(false);
        return;
      }

      const categoryNames =
        data?.map((item) => item.name).filter(Boolean) || [];

      setCategories(categoryNames);
      setCategoriesLoading(false);
    }

    loadCategories();
  }, []);

  if (!product) return null;

  const isPizza =
    editCategory.trim().toLowerCase() === "pizza";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-2xl w-[600px] max-w-[95%] max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}

        <div className="flex justify-between items-center border-b px-8 py-5 shrink-0">

          <div>
            <h2 className="text-3xl font-bold">
              Edit Product
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update product information
            </p>
          </div>

          <button
            onClick={onCancel}
            className="text-2xl font-bold text-gray-500 hover:text-red-600 transition"
          >
            ✕
          </button>

        </div>

        {/* Body */}

        <div className="p-8 space-y-5 overflow-y-auto">

          {/* Product Name */}

          <div>
            <label className="block font-semibold mb-2">
              Product Name
            </label>

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Product Name"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}

          <div>
            <label className="block font-semibold mb-2">
              Category
            </label>

            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              disabled={categoriesLoading}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {categoriesLoading ? (
                <option value="">
                  Loading categories...
                </option>
              ) : categories.length === 0 ? (
                <option value="">
                  No categories found
                </option>
              ) : (
                <>
                  {!categories.includes(editCategory) && editCategory && (
                    <option value={editCategory}>
                      {editCategory}
                    </option>
                  )}

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Pizza Pricing */}

          {isPizza ? (
            <div className="border rounded-2xl p-5 bg-gray-50 space-y-4">

              <div>
                <h3 className="text-lg font-bold">
                  Pizza Sizes
                </h3>

                <p className="text-sm text-gray-500">
                  Set prices for Small, Medium and Large.
                </p>
              </div>

              {/* Small */}

              <div>
                <label className="block font-semibold mb-2">
                  Small Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={editSmallPrice}
                  onChange={(e) =>
                    setEditSmallPrice(Number(e.target.value))
                  }
                  placeholder="Small Price"
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Medium */}

              <div>
                <label className="block font-semibold mb-2">
                  Medium Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={editMediumPrice}
                  onChange={(e) =>
                    setEditMediumPrice(Number(e.target.value))
                  }
                  placeholder="Medium Price"
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Large */}

              <div>
                <label className="block font-semibold mb-2">
                  Large Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={editLargePrice}
                  onChange={(e) =>
                    setEditLargePrice(Number(e.target.value))
                  }
                  placeholder="Large Price"
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>
          ) : (
            /* All Other Categories */

            <div>
              <label className="block font-semibold mb-2">
                Price
              </label>

              <input
                type="number"
                min="0"
                value={editPrice}
                onChange={(e) =>
                  setEditPrice(Number(e.target.value))
                }
                placeholder="Price"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Description */}

          <div>
            <label className="block font-semibold mb-2">
              Description
            </label>

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(e.target.value)
              }
              placeholder="Product Description"
              className="w-full border rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Current Image */}

          <div className="space-y-3">

            <div>
              <p className="font-semibold mb-2">
                Current Image
              </p>

              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Product"
                  className="w-28 h-28 object-cover rounded-xl border"
                />
              ) : (
                <div className="w-28 h-28 rounded-xl border bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>

            {/* New Image */}

            <div>
              <label className="block font-semibold mb-2">
                Change Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setEditImageFile(e.target.files[0]);
                  }
                }}
                className="w-full border rounded-xl p-3"
              />
            </div>

            {editImageFile && (
              <p className="text-green-600 text-sm">
                Selected: {editImageFile.name}
              </p>
            )}

          </div>

        </div>

        {/* Footer */}

        <div className="border-t px-8 py-5 flex justify-end gap-4 shrink-0">

          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 transition px-6 py-3 rounded-xl font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-semibold"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}