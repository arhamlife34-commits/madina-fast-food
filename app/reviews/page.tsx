"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
  Star,
  X,
  PenLine,
  MessageCircle,
  Clock3,
} from "lucide-react";

type Review = {
  id: number;
  customer_name: string;
  review: string;
  rating: number;
  created_at: string;
};

/* =====================================================
   LIVE RELATIVE TIME
===================================================== */

function getRelativeTime(dateString: string) {
  const created = new Date(dateString).getTime();
  const now = Date.now();

  const difference = Math.max(0, now - created);

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  if (days < 7) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  }

  if (weeks < 5) {
    return `${weeks} ${
      weeks === 1 ? "week" : "weeks"
    } ago`;
  }

  if (months < 12) {
    return `${months} ${
      months === 1 ? "month" : "months"
    } ago`;
  }

  return `${years} ${
    years === 1 ? "year" : "years"
  } ago`;
}

/* =====================================================
   PAGE
===================================================== */

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [customerName, setCustomerName] =
    useState("");

  const [review, setReview] = useState("");

  const [rating, setRating] = useState(5);

  const [writeOpen, setWriteOpen] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  /* =====================================================
     LIVE TIME REFRESH
  ===================================================== */

  const [, setCurrentTime] =
    useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /* =====================================================
     FETCH REVIEWS
  ===================================================== */

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        "id, customer_name, review, rating, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Reviews fetch error:",
        error
      );

      return;
    }

    setReviews(
      (data || []) as Review[]
    );
  }

  /* =====================================================
     SUBMIT REVIEW
  ===================================================== */

  async function submitReview() {
    if (
      !customerName.trim() ||
      !review.trim()
    ) {
      alert(
        "Please enter your name and write your review."
      );

      return;
    }

    setSubmitting(true);

    const createdAt =
      new Date().toISOString();

    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          customer_name:
            customerName.trim(),

          review: review.trim(),

          rating,

          created_at: createdAt,
        },
      ]);

    if (error) {
      console.error(
        "Review submit error:",
        error
      );

      setSubmitting(false);

      alert(error.message);

      return;
    }

    setCustomerName("");
    setReview("");
    setRating(5);
    setWriteOpen(false);

    await fetchReviews();

    setSubmitting(false);

    alert("Thank you for your review!");
  }

  /* =====================================================
     RESET FORM
  ===================================================== */

  function resetForm() {
    setWriteOpen(false);
    setCustomerName("");
    setReview("");
    setRating(5);
  }

  /* =====================================================
     STARS
  ===================================================== */

  function renderStars(value: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={15}
              strokeWidth={2.2}
              fill={
                star <= value
                  ? "currentColor"
                  : "none"
              }
              className={
               star <= value
  ? "text-yellow-400"
  : "text-[#d8cbb8]"
              }
            />
          )
        )}
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <section
      className="
        min-h-screen
        bg-[#f5f0e8]
        px-4
        pb-24
        pt-32
        sm:px-6
        sm:pt-36
        lg:px-8
      "
    >
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 text-center sm:mb-14">

          <div
            className="
              mx-auto
              mb-4
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-[#d8c6aa]
              bg-white/80
              px-4
              py-2
              shadow-[0_5px_20px_rgba(94,72,42,0.06)]
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#c79b62]
              "
            />

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.3em]
                text-[#9b805d]
                sm:text-[10px]
              "
            >
              Customer Experiences
            </span>

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#c79b62]
              "
            />
          </div>

          <h1
            className="
              text-4xl
              font-black
              tracking-tight
              text-[#302a22]
              sm:text-5xl
              lg:text-6xl
            "
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >
            Customer Reviews
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-[#817666]
              sm:text-base
            "
          >
            Real experiences from customers
            who have enjoyed our food and
            service.
          </p>

        </div>

        {/* =================================================
            WRITE REVIEW — CLOSED
        ================================================= */}

        {!writeOpen && (
          <button
            type="button"
            onClick={() =>
              setWriteOpen(true)
            }
            className="
              group
              mb-10
              flex
              w-full
              items-center
              justify-between
              rounded-[22px]
              border
              border-[#ded2c0]
              bg-white
              px-5
              py-5
              text-left
              shadow-[0_12px_35px_rgba(91,70,43,0.08)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#cdb28e]
              hover:shadow-[0_18px_45px_rgba(91,70,43,0.12)]
              sm:px-7
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-4
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#dfcdb2]
                  bg-[#f7f0e5]
                  text-[#a98455]
                "
              >
                <PenLine
                  size={21}
                />
              </div>

              <div className="min-w-0">

                <p
                  className="
                    text-sm
                    font-black
                    text-[#302a22]
                    sm:text-base
                  "
                >
                  Write a Review
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-xs
                    text-[#958978]
                    sm:text-sm
                  "
                >
                  Share your experience
                  with us
                </p>

              </div>

            </div>

            <span
              className="
                ml-3
                shrink-0
                text-2xl
                text-[#b18b5b]
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>

          </button>
        )}

        {/* =================================================
            WRITE REVIEW — OPEN
        ================================================= */}

        {writeOpen && (
          <div
            className="
              relative
              mb-12
              overflow-hidden
              rounded-[26px]
              border
              border-[#d9c8ae]
              bg-white
              shadow-[0_20px_60px_rgba(86,65,38,0.11)]
            "
          >

            {/* TOP ACCENT */}

            <div
              className="
                absolute
                left-1/2
                top-0
                h-[3px]
                w-40
                -translate-x-1/2
                rounded-b-full
                bg-gradient-to-r
                from-[#d8c19c]
                via-[#b98b52]
                to-[#d8c19c]
              "
            />

            {/* HEADER */}

            <div
              className="
                flex
                items-start
                justify-between
                border-b
                border-[#eee6da]
                px-5
                py-5
                sm:px-7
                sm:py-6
              "
            >

              <div>

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.3em]
                    text-[#ad8a5d]
                  "
                >
                  Your Experience
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-black
                    text-[#302a22]
                    sm:text-3xl
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  Write a Review
                </h2>

              </div>

              <button
                type="button"
                onClick={resetForm}
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#dfd3c2]
                  bg-[#faf7f1]
                  text-[#776957]
                  transition
                  hover:border-[#c79b62]
                  hover:bg-[#f3eadc]
                "
                aria-label="Close review form"
              >
                <X size={19} />
              </button>

            </div>

            {/* FORM */}

            <div className="p-5 sm:p-7">

              {/* RATING */}

              <div
                className="
                  mb-5
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <span
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.22em]
                    text-[#938473]
                  "
                >
                  Your Rating
                </span>
                
                <div
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-xl
                    border
                    border-[#e0d2bd]
                    bg-[#faf7f1]
                    px-3
                    py-2
                  "
                >

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setRating(star)
                        }
                        aria-label={`Rate ${star} stars`}
                        className={`
                          transition-all
                          duration-200
                          hover:scale-110
                          ${
                           star <= rating
  ? "text-yellow-400"
  : "text-[#d7c9b5]"
                          }
                        `}
                      >
                        <Star
                          size={25}
                          fill={
                            star <= rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* NAME */}

              <div className="mb-4">

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                  placeholder="Your Name"
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-[#e0d5c5]
                    bg-[#fcfaf6]
                    px-5
                    text-sm
                    font-semibold
                    text-[#302a22]
                    outline-none
                    transition
                    placeholder:text-[#afa292]
                    focus:border-[#c9a477]
                    focus:bg-white
                    sm:text-base
                  "
                />

              </div>

              {/* REVIEW */}

              <div>

                <textarea
                  value={review}
                  onChange={(e) =>
                    setReview(
                      e.target.value
                    )
                  }
                  placeholder="Tell us about your experience..."
                  className="
                    min-h-[190px]
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-[#e0d5c5]
                    bg-[#fcfaf6]
                    px-5
                    py-5
                    text-sm
                    font-medium
                    leading-7
                    text-[#302a22]
                    outline-none
                    transition
                    placeholder:text-[#afa292]
                    focus:border-[#c9a477]
                    focus:bg-white
                    sm:min-h-[210px]
                    sm:text-base
                  "
                />

              </div>

              {/* ACTIONS */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <span
                  className="
                    hidden
                    text-xs
                    font-semibold
                    text-[#9c8e7d]
                    sm:block
                  "
                >
                  Rating: {rating}/5
                </span>

                <div
                  className="
                    ml-auto
                    flex
                    gap-2
                  "
                >

                  <button
                    type="button"
                    onClick={resetForm}
                    className="
                      rounded-xl
                      border
                      border-[#ded2c1]
                      bg-white
                      px-5
                      py-3
                      text-xs
                      font-black
                      text-[#786a59]
                      transition
                      hover:bg-[#f7f1e8]
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={submitReview}
                    disabled={
                      submitting ||
                      !customerName.trim() ||
                      !review.trim()
                    }
                    className={`
                      rounded-xl
                      px-6
                      py-3
                      text-xs
                      font-black
                      transition-all
                      sm:px-7
                      sm:text-sm
                      ${
                        submitting ||
                        !customerName.trim() ||
                        !review.trim()
                          ? "cursor-not-allowed bg-[#ddd5ca] text-[#a49b90]"
                          : "bg-gradient-to-br from-[#d5b07a] via-[#bf9560] to-[#a87945] text-white shadow-[0_8px_20px_rgba(166,125,73,0.2)] hover:-translate-y-0.5 hover:brightness-105"
                      }
                    `}
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            FEEDBACK HEADER
        ================================================= */}

        <div
          className="
            mb-6
            flex
            items-end
            justify-between
          "
        >

          <div>

            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.3em]
                text-[#ad8a5d]
              "
            >
              What People Say
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-black
                text-[#302a22]
                sm:text-3xl
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              Customer Feedback
            </h2>

          </div>

          <div
            className="
              hidden
              rounded-full
              border
              border-[#ded2c1]
              bg-white
              px-4
              py-2
              text-xs
              font-bold
              text-[#887a69]
              shadow-[0_4px_15px_rgba(91,70,43,0.05)]
              sm:block
            "
          >
            {reviews.length}{" "}
            {reviews.length === 1
              ? "Review"
              : "Reviews"}
          </div>

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {reviews.length === 0 ? (
          <div
            className="
              rounded-[26px]
              border
              border-[#ded2c1]
              bg-white
              px-6
              py-16
              text-center
              shadow-[0_12px_35px_rgba(91,70,43,0.06)]
            "
          >

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[#f5eee3]
                text-[#a8875e]
              "
            >
              <MessageCircle
                size={28}
              />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-black
                text-[#302a22]
              "
            >
              No reviews yet
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-[#958978]
              "
            >
              Be the first customer to
              share your experience.
            </p>

          </div>
        ) : (

          /* =================================================
             REVIEW GRID
          ================================================= */

          <div
            className="
              grid
              gap-5
              md:grid-cols-2
            "
          >

            {reviews.map((item) => (

              <article
                key={item.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#ded3c3]
                  bg-white
                  p-5
                  shadow-[0_12px_35px_rgba(91,70,43,0.07)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#cdb38f]
                  hover:shadow-[0_20px_45px_rgba(91,70,43,0.11)]
                  sm:p-6
                "
              >

                {/* TOP SOFT GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-28
                    w-28
                    rounded-full
                    bg-[#e9dbc7]/60
                    blur-3xl
                  "
                />

                {/* =================================================
                    REVIEW HEADER
                ================================================= */}

                <div
                  className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  {/* CUSTOMER */}

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#d7c3a4]
                        bg-gradient-to-br
                        from-[#f4e8d5]
                        to-[#dfc7a3]
                        text-sm
                        font-black
                        uppercase
                        text-[#71583a]
                        shadow-[0_4px_12px_rgba(91,70,43,0.08)]
                      "
                    >
                      {item.customer_name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "C"}
                    </div>

                    <div
                      className="
                        min-w-0
                      "
                    >

                      <h3
                        className="
                          truncate
                          text-base
                          font-black
                          text-[#302a22]
                          sm:text-lg
                        "
                      >
                        {item.customer_name}
                      </h3>

                      <div
                        className="
                          mt-1
                          flex
                          items-center
                          gap-1.5
                        "
                      >

                        <Clock3
                          size={11}
                          className="
                            text-[#b69a73]
                          "
                        />

                        <span
                          className="
                            text-[10px]
                            font-semibold
                            text-[#a09383]
                          "
                        >
                          {getRelativeTime(
                            item.created_at
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* RATING */}

                  <div
                    className="
                      shrink-0
                      rounded-xl
                      border
                      border-[#e2d7c7]
                      bg-[#faf7f1]
                      px-2.5
                      py-1.5
                    "
                  >
                    {renderStars(
                      Number(item.rating) || 0
                    )}
                  </div>

                </div>

                {/* DIVIDER */}

                <div
                  className="
                    my-5
                    h-px
                    bg-gradient-to-r
                    from-[#d6c2a3]
                    via-[#e9e0d3]
                    to-transparent
                  "
                />

                {/* REVIEW TEXT */}

                <p
                  className="
                    text-sm
                    leading-7
                    text-[#655b4e]
                    sm:text-[15px]
                  "
                >
                  “{item.review}”
                </p>

              </article>

            ))}

          </div>

        )}

      </div>
    </section>
  );
}