"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [customerName, setCustomerName] = useState("");
const [review, setReview] = useState("");
const [rating, setRating] = useState(5);
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
async function submitReview() {

  if (!customerName || !review) {
    alert("Please fill all fields.");
    return;
  }

  const { error } = await supabase
    .from("reviews")
    .insert([
      {
        customer_name: customerName,
        review,
        rating,
      },
    ]);

  if (error) {
  console.error(error);
  alert(error.message);
  return;
}
  

  setCustomerName("");
  setReview("");
  setRating(5);

  fetchReviews();

  alert("Thank you for your review!");
}
  return (
  <section className="min-h-screen bg-gray-100 py-32">

    <div className="max-w-6xl mx-auto px-6">

      <h1 className="text-5xl font-bold text-center">
        Customer Reviews
      </h1>

      <p className="text-center text-gray-500 mt-4 mb-12">
        See what our customers say about us.
      </p>
<div className="bg-white rounded-2xl shadow-lg p-8 mb-12">

  <h2 className="text-3xl font-bold mb-6">
    Write a Review
  </h2>

  <input
    type="text"
    placeholder="Your Name"
    value={customerName}
    onChange={(e) => setCustomerName(e.target.value)}
    className="w-full border rounded-xl p-4 mb-5"
  />

  <textarea
    placeholder="Write your review..."
    value={review}
    onChange={(e) => setReview(e.target.value)}
    className="w-full border rounded-xl p-4 h-32 mb-5"
  />

  <div className="mb-6">

    <p className="font-bold mb-2">
      Rating
    </p>

    <div className="flex gap-2">

      {[1,2,3,4,5].map((star)=>(

        <button
          key={star}
          type="button"
          onClick={()=>setRating(star)}
          className={`text-4xl ${
            star <= rating
              ? "text-yellow-500"
              : "text-gray-300"
          }`}
        >
          ★
        </button>

      ))}

    </div>

  </div>

  <button
    onClick={submitReview}
    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold"
  >
    Submit Review
  </button>

</div>
      <div className="grid md:grid-cols-2 gap-6">

        {reviews.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg p-6"
          >

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

        ))}

      </div>

    </div>

  </section>
);
}
