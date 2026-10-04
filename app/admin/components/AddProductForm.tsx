"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [price, setPrice] = useState("");
  const [largePrice, setLargePrice] = useState("");
  const [mediumPrice, setMediumPrice] = useState("");
  const [smallPrice, setSmallPrice] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isDeal, setIsDeal] = useState(false);

  const [loading, setLoading] = useState(false);

  // LOAD CATEGORIES FROM SUPABASE
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);

      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Categories load error:", error);
        setCategories([]);
        setCategoriesLoading(false);
        return;
      }

      const categoryNames = (data || [])
        .map((item) => item.name?.trim())
        .filter(
          (name): name is string =>
            Boolean(name)
        );

      setCategories(categoryNames);

      if (categoryNames.length > 0) {
        setCategory((current) =>
          current && categoryNames.includes(current)
            ? current
            : categoryNames[0]
        );
      } else {
        setCategory("");
      }

      setCategoriesLoading(false);
    };

    loadCategories();
  }, []);

  // ONLY PIZZA HAS SIZES
  const hasSizes =
    category.trim().toLowerCase() === "pizza";

  async function addProduct() {
    if (
      !name.trim() ||
      !category.trim() ||
      !description.trim() ||
      !imageFile
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (categories.length === 0) {
      alert("Please add a category first.");
      return;
    }

    // NORMAL CATEGORIES NEED ONE PRICE
    if (!hasSizes && !price) {
      alert("Please enter the product price.");
      return;
    }

    // PIZZA NEEDS SMALL + MEDIUM + LARGE
    if (
      hasSizes &&
      (!smallPrice ||
        !mediumPrice ||
        !largePrice)
    ) {
      alert(
        "Please enter Small, Medium and Large prices."
      );
      return;
    }

    setLoading(true);

    let imageUrl = "";

    // IMAGE UPLOAD
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("products")
          .upload(
            fileName,
            imageFile,
            {
              upsert: false,
            }
          );

      if (uploadError) {
        setLoading(false);
        alert("Image Upload Failed!");
        console.error(uploadError);
        return;
      }

      const { data } =
        supabase.storage
          .from("products")
          .getPublicUrl(
            fileName
          );

      imageUrl = data.publicUrl;
    }

    // ADD PRODUCT
    const { error } =
      await supabase
        .from("products")
        .insert([
          {
            name: name.trim(),
            category: category.trim(),

            // NORMAL CATEGORY = SINGLE PRICE
            // PIZZA = SIZE PRICES
            price: hasSizes
              ? 0
              : Number(price),

            // PIZZA MEDIUM
            medium_price: hasSizes
              ? Number(mediumPrice)
              : null,

            // PIZZA LARGE
            large_price: hasSizes
              ? Number(largePrice)
              : null,

            // PIZZA SMALL
            small_price: hasSizes
              ? Number(smallPrice)
              : null,

            // OLD SIZE / ADDON FIELDS
            regular_price: null,
            jumbo_price: null,
            cheese_price: 0,
            fries_price: 0,

            image: imageUrl,
            description:
              description.trim(),
            is_deal: isDeal,
          },
        ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to add product.");
      return;
    }

    alert(
      "Product Added Successfully!"
    );

    // RESET FORM
    setName("");

    if (categories.length > 0) {
      setCategory(categories[0]);
    } else {
      setCategory("");
    }

    setPrice("");
    setMediumPrice("");
    setLargePrice("");
    setSmallPrice("");

    setImageFile(null);
    setDescription("");
    setIsDeal(false);

    const fileInput =
      document.getElementById(
        "product-image"
      ) as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }

    // REFRESH PAGE
    window.location.reload();
  }

  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold">
        Add New Product
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        {/* PRODUCT NAME */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="rounded-xl border p-4"
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          disabled={
            categoriesLoading ||
            categories.length === 0
          }
          className="rounded-xl border p-4 disabled:bg-gray-100 disabled:text-gray-500"
        >
          {categoriesLoading ? (
            <option value="">
              Loading Categories...
            </option>
          ) : categories.length === 0 ? (
            <option value="">
              No Categories Available
            </option>
          ) : (
            <>
              <option value="">
                Select Category
              </option>

              {categories.map(
                (categoryName) => (
                  <option
                    key={categoryName}
                    value={categoryName}
                  >
                    {categoryName}
                  </option>
                )
              )}
            </>
          )}
        </select>

        {/* NORMAL CATEGORY SINGLE PRICE */}
        {!hasSizes && (
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="rounded-xl border p-4"
          />
        )}

        {/* PIZZA SIZES ONLY */}
        {hasSizes && (
          <>
            <input
              type="number"
              placeholder="Small Price (S)"
              value={smallPrice}
              onChange={(e) =>
                setSmallPrice(
                  e.target.value
                )
              }
              className="rounded-xl border p-4"
            />

            <input
              type="number"
              placeholder="Medium Price (M)"
              value={mediumPrice}
              onChange={(e) =>
                setMediumPrice(
                  e.target.value
                )
              }
              className="rounded-xl border p-4"
            />

            <input
              type="number"
              placeholder="Large Price (L)"
              value={largePrice}
              onChange={(e) =>
                setLargePrice(
                  e.target.value
                )
              }
              className="rounded-xl border p-4"
            />
          </>
        )}

        {/* PRODUCT IMAGE */}
        <input
          id="product-image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (
              e.target.files &&
              e.target.files[0]
            ) {
              setImageFile(
                e.target.files[0]
              );
            }
          }}
          className="rounded-xl border p-3"
        />

        {imageFile && (
          <p className="text-sm text-gray-600 md:col-span-2">
            Selected:{" "}
            {imageFile.name}
          </p>
        )}

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="h-32 rounded-xl border p-4 md:col-span-2"
        />

        {/* FEATURED DEAL */}
        <label className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={isDeal}
            onChange={(e) =>
              setIsDeal(
                e.target.checked
              )
            }
          />

          Featured Deal
        </label>
      </div>

      {/* ADD PRODUCT */}
      <button
        onClick={addProduct}
        disabled={
          loading ||
          categoriesLoading ||
          categories.length === 0
        }
        className="mt-8 rounded-xl bg-green-600 px-8 py-4 font-bold text-white transition hover:bg-green-700 disabled:bg-gray-500"
      >
        {loading
          ? "Adding..."
          : "Add Product"}
      </button>
    </div>
  );
}