"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

type Slider = {
  id: number;
  title: string;
  image: string;
};

export default function Hero() {
  const pathname = usePathname();

  const [slides, setSlides] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);

  const [slideIndex, setSlideIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] =
    useState(true);

  // ==========================================
  // FETCH SLIDERS
  // ==========================================

  useEffect(() => {
    let mounted = true;

    async function fetchSliders() {
      if (!mounted) return;

      setLoading(true);
      setSlides([]);
      setSlideIndex(0);
      setTransitionEnabled(true);

      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("id, title, image")
          .eq("type", "slider")
          .order("id", { ascending: true });

        if (error) {
          console.error(
            "Slider fetch error:",
            error
          );

          if (mounted) {
            setSlides([]);
            setLoading(false);
          }

          return;
        }

        const fetchedSlides =
          (data || []) as Slider[];

        if (!mounted) return;

        const validSlides =
          fetchedSlides.filter(
            (slide) =>
              slide.image &&
              slide.image.trim() !== ""
          );

        setSlides(validSlides);

        // Start from first real slide
        setSlideIndex(
          validSlides.length > 1 ? 1 : 0
        );

        setTransitionEnabled(true);
        setLoading(false);
      } catch (error) {
        console.error(
          "Unexpected slider error:",
          error
        );

        if (mounted) {
          setSlides([]);
          setLoading(false);
        }
      }
    }

    fetchSliders();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  // ==========================================
  // PRELOAD ALL SLIDER IMAGES
  // ==========================================

  useEffect(() => {
    if (slides.length === 0) return;

    slides.forEach((slide) => {
      const image = new window.Image();

      image.onload = () => {
        // Image successfully loaded
      };

      image.onerror = () => {
        console.error(
          "Slider image failed to load:",
          slide.image
        );
      };

      image.src = slide.image;
    });
  }, [slides]);

  // ==========================================
  // LOOP SLIDES
  // ==========================================

  const loopSlides =
    slides.length > 1
      ? [
          slides[slides.length - 1],
          ...slides,
          slides[0],
        ]
      : slides;

  // ==========================================
  // AUTO SLIDE
  // ==========================================

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setSlideIndex((current) => {
        // Safety guard:
        // Never allow the index to go beyond
        // the available cloned slide.
        if (current >= slides.length + 1) {
          return 1;
        }

        return current + 1;
      });
    }, 4500);

    return () => {
      clearInterval(interval);
    };
  }, [slides.length]);

  // ==========================================
  // SAFETY CHECK
  // ==========================================

  useEffect(() => {
    if (slides.length <= 1) {
      setSlideIndex(0);
      setTransitionEnabled(true);
      return;
    }

    // If for any reason the index goes outside
    // the valid slider range, immediately recover.
    if (slideIndex > slides.length + 1) {
      setTransitionEnabled(false);
      setSlideIndex(1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }

    if (slideIndex < 0) {
      setTransitionEnabled(false);
      setSlideIndex(slides.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }
  }, [slideIndex, slides.length]);

  // ==========================================
  // INFINITE LOOP RESET
  // ==========================================

  function handleTransitionEnd() {
    if (slides.length <= 1) return;

    // Reached copied first slide
    if (
      slideIndex ===
      slides.length + 1
    ) {
      setTransitionEnabled(false);
      setSlideIndex(1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });

      return;
    }

    // Reached copied last slide
    if (slideIndex === 0) {
      setTransitionEnabled(false);
      setSlideIndex(slides.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-transparent">
        <div
          className="
            mx-auto
            w-full
            max-w-[1500px]
            px-0
            pb-0
            sm:px-4
            lg:px-5
          "
        >
          <div
            className="
              flex
              aspect-[16/9]
              w-full
              items-center
              justify-center
              overflow-hidden
              rounded-[18px]
              bg-black
              sm:aspect-[16/8]
              sm:rounded-[22px]
              lg:h-[410px]
              lg:aspect-auto
            "
          >
            <p className="font-bold text-white/60">
              Loading...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // NO SLIDERS
  // ==========================================

  if (slides.length === 0) {
    return null;
  }

  // ==========================================
  // HERO SLIDER
  // ==========================================

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-transparent
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-0
          pb-0
          sm:px-4
          lg:max-w-none
          lg:px-0
        "
      >
        {/* ======================================
            SLIDER WINDOW
        ====================================== */}

        <div
          className="
            relative
            w-full
            overflow-hidden
            bg-transparent
            aspect-[16/9]
            sm:aspect-[16/8]
            lg:h-[440px]
            lg:aspect-auto
          "
        >
          {/* ======================================
              SLIDER TRACK
          ====================================== */}

          <div
            onTransitionEnd={
              handleTransitionEnd
            }
            className={`
              flex
              h-full
              w-full
              ${
                transitionEnabled
                  ? "transition-transform duration-700 ease-in-out"
                  : ""
              }
            `}
            style={{
              transform:
                slides.length > 1
                  ? `translateX(-${
                      slideIndex * 100
                    }%)`
                  : "translateX(0%)",
            }}
          >
            {loopSlides.map(
              (slide, index) => (
                <div
                  key={`${slide.id}-${index}`}
                  className="
                    relative
                    h-full
                    min-w-full
                    shrink-0
                    overflow-hidden
                    bg-transparent
                  "
                >
                  {/* =================================
                      IMAGE
                  ================================= */}

                  <img
                    src={slide.image}
                    alt={
                      slide.title ||
                      "SABZAZAR FAST FOOD "
                    }
                    loading="eager"
                    decoding="async"
                    fetchPriority={
                      index === 1
                        ? "high"
                        : "auto"
                    }
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                      object-center
                    "
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}