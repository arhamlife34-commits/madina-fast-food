"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import EditProductModal from "./EditProductModal";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;

  regular_price?: number;
  large_price?: number;
  jumbo_price?: number;

  small_price?: number;
  medium_price?: number;

  cheese_price?: number;
  fries_price?: number;

  description: string;
  image: string;
  is_deal: boolean;
};

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [editPrice, setEditPrice] = useState(0);

  const [editRegularPrice, setEditRegularPrice] =
    useState(0);

  const [editLargePrice, setEditLargePrice] =
    useState(0);

  const [editJumboPrice, setEditJumboPrice] =
    useState(0);

  const [editSmallPrice, setEditSmallPrice] =
    useState(0);

  const [editMediumPrice, setEditMediumPrice] =
    useState(0);

  const [editCheesePrice, setEditCheesePrice] =
    useState(0);

  const [editFriesPrice, setEditFriesPrice] =
    useState(0);

  const [editDescription, setEditDescription] =
    useState("");

  const [editImage, setEditImage] = useState("");

  const [editImageFile, setEditImageFile] =
    useState<File | null>(null);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id");

    if (error) {
      console.error("Products fetch error:", error);
      return;
    }

    setProducts(data || []);
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Categories fetch error:", error);
      return;
    }

    const categoryNames =
      data?.map((item) => item.name).filter(Boolean) || [];

    setCategories(categoryNames);
  }

  async function deleteProduct(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete product.");
      return;
    }

    alert("Product Deleted Successfully!");

    await fetchProducts();
  }

  function startEdit(product: Product) {
    setEditingProduct(product);

    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(product.price);

    setEditRegularPrice(product.regular_price || 0);
    setEditLargePrice(product.large_price || 0);
    setEditJumboPrice(product.jumbo_price || 0);

    setEditSmallPrice(product.small_price || 0);
    setEditMediumPrice(product.medium_price || 0);

    setEditCheesePrice(product.cheese_price || 0);
    setEditFriesPrice(product.fries_price || 0);

    setEditDescription(product.description || "");

    setEditImage(product.image || "");

    setEditImageFile(null);
  }

  async function saveProduct() {
    if (!editingProduct) return;

    const isPizza =
      editCategory.trim().toLowerCase() === "pizza";

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
        .from("products")
        .update({
          name: editName.trim(),
          category: editCategory.trim(),

          /*
           * Pizza:
           * Small / Medium / Large
           *
           * Other categories:
           * Single Price
           */

          price: isPizza ? 0 : Number(editPrice),

          small_price: isPizza
            ? Number(editSmallPrice)
            : null,

          medium_price: isPizza
            ? Number(editMediumPrice)
            : null,

          large_price: isPizza
            ? Number(editLargePrice)
            : null,

          /*
           * Old pricing fields are no longer used.
           */

          regular_price: null,
          jumbo_price: null,
          cheese_price: 0,
          fries_price: 0,

          description: editDescription.trim(),

          image: imageUrl,
        })
        .eq("id", editingProduct.id);

    if (error) {
      alert("Update Failed");
      console.error(error);
      return;
    }

    alert("Product Updated Successfully!");

    setEditingProduct(null);
    setEditImageFile(null);

    await fetchProducts();
    await fetchCategories();
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /*
   * If a category is deleted from the categories table,
   * reset the filter to All.
   */

  useEffect(() => {
    if (
      selectedCategory !== "All" &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory("All");
    }
  }, [categories, selectedCategory]);

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <>
      <EditProductModal
        product={editingProduct}

        editName={editName}
        setEditName={setEditName}

        editCategory={editCategory}
        setEditCategory={setEditCategory}

        editPrice={editPrice}
        setEditPrice={setEditPrice}

        editRegularPrice={editRegularPrice}
        setEditRegularPrice={setEditRegularPrice}

        editLargePrice={editLargePrice}
        setEditLargePrice={setEditLargePrice}

        editJumboPrice={editJumboPrice}
        setEditJumboPrice={setEditJumboPrice}

        editSmallPrice={editSmallPrice}
        setEditSmallPrice={setEditSmallPrice}

        editMediumPrice={editMediumPrice}
        setEditMediumPrice={setEditMediumPrice}

        editCheesePrice={editCheesePrice}
        setEditCheesePrice={setEditCheesePrice}

        editFriesPrice={editFriesPrice}
        setEditFriesPrice={setEditFriesPrice}

        editDescription={editDescription}
        setEditDescription={setEditDescription}

        editImageFile={editImageFile}
        setEditImageFile={setEditImageFile}

        currentImage={editImage}

        onSave={saveProduct}

        onCancel={() => {
          setEditingProduct(null);
          setEditImageFile(null);
        }}
      />

      <div className="bg-white rounded-2xl shadow-lg mt-10 overflow-hidden">

        {/* Header */}

        <div className="p-6 border-b">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <h2 className="text-3xl font-bold">
              Products
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">

              {/* Search */}

              <input
                type="text"
                placeholder="Search Product..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="border rounded-xl px-4 py-2 w-72"
              />

              {/* Dynamic Category Filter */}

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="border rounded-xl px-4 py-2"
              >
                <option value="All">
                  All
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

        {/* Products Table */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  ID
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Image
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

              {filteredProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-500"
                  >
                    No products found.
                  </td>

                </tr>

              ) : (

                filteredProducts.map((product) => {

                  const isPizza =
                    product.category
                      ?.trim()
                      .toLowerCase() === "pizza";

                  return (
                    <tr
                      key={product.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {product.id}
                      </td>

                      <td className="p-4">
                        {product.name}
                      </td>

                      <td className="p-4">
                        {product.category}
                      </td>

                      <td className="p-4">

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg border bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}

                      </td>

                      <td className="p-4 font-bold text-red-600">

                        {isPizza ? (
                          <div className="text-sm space-y-1">
                            <div>
                              S: Rs. {product.small_price || 0}
                            </div>

                            <div>
                              M: Rs. {product.medium_price || 0}
                            </div>

                            <div>
                              L: Rs. {product.large_price || 0}
                            </div>
                          </div>
                        ) : (
                          `Rs. ${product.price}`
                        )}

                      </td>

                      <td className="p-4 text-center">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              startEdit(product)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteProduct(product.id)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}