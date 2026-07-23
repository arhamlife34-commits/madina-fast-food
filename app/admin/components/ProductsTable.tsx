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

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editRegularPrice, setEditRegularPrice] = useState(0);
const [editLargePrice, setEditLargePrice] = useState(0);
const [editJumboPrice, setEditJumboPrice] = useState(0);

const [editSmallPrice, setEditSmallPrice] = useState(0);
const [editMediumPrice, setEditMediumPrice] = useState(0);

const [editCheesePrice, setEditCheesePrice] = useState(0);
const [editFriesPrice, setEditFriesPrice] = useState(0);
  const [editDescription, setEditDescription] = useState("");

  const [editImage, setEditImage] = useState("");

  // NEW
  const [editImageFile, setEditImageFile] =
    useState<File | null>(null);


  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id");

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
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

    fetchProducts();
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
  setEditDescription(product.description);

  // Current image
  setEditImage(product.image);

  // New image reset
  setEditImageFile(null);

}

  async function saveProduct() {

  if (!editingProduct) return;

  let imageUrl = editImage;

  // Upload only if admin selected new image

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
        name: editName,
        category: editCategory,
        price: editPrice,
        regular_price: editRegularPrice,
large_price: editLargePrice,
jumbo_price: editJumboPrice,

small_price: editSmallPrice,
medium_price: editMediumPrice,

cheese_price: editCheesePrice,
fries_price: editFriesPrice,
        description: editDescription,
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
  fetchProducts();
}
useEffect(() => {
  fetchProducts();
}, []);
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
  setEditPrice={setEditPrice}
  editDescription={editDescription}
  setEditDescription={setEditDescription}

editImageFile={editImageFile}
setEditImageFile={setEditImageFile}
currentImage={editImage}

  onSave={saveProduct}
  onCancel={() => setEditingProduct(null)}
/>

      <div className="bg-white rounded-2xl shadow-lg mt-10 overflow-hidden">

        <div className="p-6 border-b">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    <h2 className="text-3xl font-bold">
      Products
    </h2>

    <div className="flex gap-3">

      <input
        type="text"
        placeholder="Search Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-xl px-4 py-2 w-72"
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border rounded-xl px-4 py-2"
      >
        <option value="All">All</option>
<option value="Burger">Burger</option>
<option value="Pizza">Pizza</option>
<option value="Shawarma">Shawarma</option>
<option value="Fries">Fries</option>
<option value="Platter">Platter</option>
<option value="Pratha Roll">Pratha Roll</option>
<option value="Special Sandwich">Special Sandwich</option>
<option value="Special Grill Items">Special Grill Items</option>
      </select>

    </div>

  </div>

</div>

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredProducts.map((product) => (

              <tr
                key={product.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">{product.id}</td>

                <td className="p-4">{product.name}</td>

                <td className="p-4">{product.category}</td>
<td className="p-4">

  <img
  src={product.image}
  alt={product.name}
  className="w-16 h-16 object-cover rounded-lg border"
  loading="lazy"
/>

</td>
                <td className="p-4 font-bold text-red-600">
                  Rs. {product.price}
                </td>

                <td className="p-4 text-center">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => startEdit(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
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