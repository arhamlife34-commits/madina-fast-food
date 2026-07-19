"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function ReviewsTable() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("id", { ascending: false });

    setReviews(data || []);
  }

  async function deleteReview(id: number) {
    if (!confirm("Delete this review?")) return;

    await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    fetchReviews();
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

      <h2 className="text-3xl font-bold mb-8">
        Customer Reviews
      </h2>

      <div className="space-y-6">

        {reviews.map((item) => (

          <div
            key={item.id}
            className="border rounded-xl p-6 flex justify-between items-start"
          >

            <div>

              <h3 className="text-2xl font-bold">
                {item.customer_name}
              </h3>

              <div className="text-yellow-500 text-xl mt-2">
                {"⭐".repeat(item.rating)}
              </div>

              <p className="mt-4 text-gray-600">
                {item.review}
              </p>

            </div>

            <button
              onClick={() => deleteReview(item.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}