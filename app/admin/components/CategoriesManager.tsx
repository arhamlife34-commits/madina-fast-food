"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Category = {
  id: number;
  name: string;
  created_at: string;
};

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setMessage("Categories can't be loaded.");
      return;
    }

    setCategories(data || []);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async () => {
    const categoryName = name.trim();

    if (!categoryName) {
      setMessage("Write Category Name.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("categories").insert({
      name: categoryName,
    });

    if (error) {
      if (error.code === "23505") {
        setMessage("This Category is already Exists.");
      } else {
        console.error(error);
        setMessage("Category can't be added.");
      }

      setLoading(false);
      return;
    }

    setName("");
    setMessage("Category successfully added.");
    await loadCategories();

    setLoading(false);
  };

  const deleteCategory = async (category: Category) => {
    const confirmed = window.confirm(
      `"${category.name}" Are you sure you want to delete this category?`
    );

    if (!confirmed) return;

    setDeletingId(category.id);
    setMessage("");

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("category", category.name)
      .limit(1);

    if (productError) {
      console.error(productError);
      setMessage("Products could'nt be added.");
      setDeletingId(null);
      return;
    }

    if (products && products.length > 0) {
      setMessage(
        `"${category.name}" products is available in it. Please shift that products to another category.`
      );
      setDeletingId(null);
      return;
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      console.error(error);
      setMessage("Category can't be deleted.");
      setDeletingId(null);
      return;
    }

    setMessage("Category deleted successfully.");
    await loadCategories();

    setDeletingId(null);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Categories</h2>
        <p className="mt-1 text-sm text-white/60">
          Manage your Product Categories from here.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addCategory();
            }
          }}
          placeholder="Category name"
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-yellow-400"
        />

        <button
          type="button"
          onClick={addCategory}
          disabled={loading}
          className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
          {message}
        </div>
      )}

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
          Existing Categories
        </h3>

        {categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-white/50">
            No categories exists yet.
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <span className="font-medium text-white">
                  {category.name}
                </span>

                <button
                  type="button"
                  onClick={() => deleteCategory(category)}
                  disabled={deletingId === category.id}
                  className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === category.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}