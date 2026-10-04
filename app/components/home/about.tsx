import Image from "next/image";

export default function About() {
  return (
    <main className="bg-[#f8f8f6] text-gray-900">

      {/* =========================================
          HERO / INTRO
      ========================================= */}

      <section className="relative overflow-hidden bg-[#102d24] py-24 sm:py-28 lg:py-32">

        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#c9a35b]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">

            {/* Logo */}

            <div className="flex justify-center">

              <div className="relative">

                <div className="absolute -inset-8 rounded-full bg-[#c9a35b]/10 blur-3xl" />

                <div className="relative flex h-[330px] w-[330px] items-center justify-center rounded-[40px] border border-[#c9a35b]/30 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:h-[400px] sm:w-[400px]">

                  <Image
                    src="/images/logo.png"
                    alt="Sabzazar Fast Food Logo"
                    width={420}
                    height={420}
                    priority
                    className="h-full w-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.45)]"
                  />

                </div>

              </div>

            </div>

            {/* Content */}

            <div>

              <span className="inline-flex rounded-full border border-[#c9a35b]/40 bg-[#c9a35b]/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#f0ca72]">
                About Sabzazar Fast Food
              </span>

              <h1 className="mt-6 text-5xl font-black leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                Good Food.
                <br />
                <span className="text-[#f0ca72]">
                  Great Moments.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                At Sabzazar Fast Food, we believe great food
                is more than just a meal. It is about fresh
                ingredients, bold flavours, generous portions
                and the moments people share around the table.
              </p>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">
                From juicy burgers and loaded fries to pizzas,
                shawarmas, platters and much more, every order
                is prepared with care so you can enjoy the
                taste you love, whenever you want.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">

                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">
                    🍔
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white/70">
                    Made Fresh
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">
                    ❤️
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white/70">
                    Made With Care
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">
                    ⭐
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white/70">
                    Quality First
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          OUR STORY
      ========================================= */}

      <section className="py-24 sm:py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <span className="font-bold uppercase tracking-[0.25em] text-red-600">
              Our Story
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Built Around Taste,
              <br />
              Quality & People
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Sabzazar Fast Food was created with one simple
              idea: serve food that people genuinely enjoy
              coming back for. We focus on flavour, freshness,
              consistency and a dining experience that feels
              welcoming every time.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Whether you are grabbing a quick meal, ordering
              dinner for the family or enjoying food with
              friends, our goal is to make every order feel
              worth it.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================
          VALUES
      ========================================= */}

      <section className="bg-white py-24 sm:py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <span className="font-bold uppercase tracking-[0.25em] text-red-600">
              What We Stand For
            </span>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              More Than Just Fast Food
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Every part of our experience is built around
              giving you food you can enjoy with confidence.
            </p>

          </div>


          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="group rounded-3xl border border-gray-100 bg-[#fafafa] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl transition group-hover:scale-110">
                🥬
              </div>

              <h3 className="mt-6 text-xl font-black">
                Fresh Ingredients
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We believe better ingredients create better
                food. Freshness and quality remain at the
                heart of what we serve.
              </p>

            </div>


            <div className="group rounded-3xl border border-gray-100 bg-[#fafafa] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl transition group-hover:scale-110">
                🍳
              </div>

              <h3 className="mt-6 text-xl font-black">
                Prepared With Care
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Every order is prepared with attention to
                flavour, presentation and consistency so it
                reaches you just the way it should.
              </p>

            </div>


            <div className="group rounded-3xl border border-gray-100 bg-[#fafafa] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl transition group-hover:scale-110">
                🧼
              </div>

              <h3 className="mt-6 text-xl font-black">
                Hygiene & Cleanliness
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Clean preparation and proper food handling are
                essential parts of delivering a meal our
                customers can enjoy comfortably.
              </p>

            </div>


            <div className="group rounded-3xl border border-gray-100 bg-[#fafafa] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl transition group-hover:scale-110">
                🤝
              </div>

              <h3 className="mt-6 text-xl font-black">
                Customer First
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Your satisfaction matters to us. We listen,
                improve and work every day to make your
                experience better.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          EXPERIENCE
      ========================================= */}

      <section className="bg-[#102d24] py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">

              <div className="text-4xl">
                ⚡
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                Fast Service
              </h3>

              <p className="mt-3 leading-7 text-white/60">
                Quick preparation and smooth ordering for
                busy days and hungry moments.
              </p>

            </div>


            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">

              <div className="text-4xl">
                🛵
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                Convenient Delivery
              </h3>

              <p className="mt-3 leading-7 text-white/60">
                Enjoy your favourite meals from the comfort
                of your home.
              </p>

            </div>


            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">

              <div className="text-4xl">
                🌶️
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                Bold Flavours
              </h3>

              <p className="mt-3 leading-7 text-white/60">
                Delicious combinations and satisfying flavours
                made for every kind of craving.
              </p>

            </div>


            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">

              <div className="text-4xl">
                ❤️
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                Made For You
              </h3>

              <p className="mt-3 leading-7 text-white/60">
                From the first bite to the last, your
                satisfaction is what matters most.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          WHY CHOOSE US
      ========================================= */}

      <section className="py-24 sm:py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div>

              <span className="font-bold uppercase tracking-[0.25em] text-red-600">
                Why Choose Us
              </span>

              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                The Taste You Crave.
                <br />
                The Quality You Trust.
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                We combine fresh preparation, quality
                ingredients and customer-focused service to
                create food that keeps people coming back.
              </p>

              <div className="mt-9 space-y-5">

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-black">
                      Quality You Can Taste
                    </h3>

                    <p className="mt-1 text-gray-600">
                      Carefully selected ingredients and
                      attention to preparation.
                    </p>
                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-black">
                      A Menu For Every Craving
                    </h3>

                    <p className="mt-1 text-gray-600">
                      From burgers and pizzas to shawarmas,
                      fries, platters and more.
                    </p>
                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-black">
                      Food Worth Sharing
                    </h3>

                    <p className="mt-1 text-gray-600">
                      Meals made for family dinners,
                      gatherings and good times with friends.
                    </p>
                  </div>

                </div>

              </div>

            </div>


            <div className="relative">

              <div className="absolute -inset-5 rounded-[40px] bg-red-600/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[36px] border border-gray-200 bg-white p-8 shadow-2xl">

                <div className="rounded-3xl bg-[#102d24] p-10 text-center">

                  <Image
                    src="/images/logo.png"
                    alt="Sabzazar Fast Food"
                    width={360}
                    height={360}
                    className="mx-auto h-[280px] w-[280px] object-contain sm:h-[340px] sm:w-[340px]"
                  />

                  <div className="mt-7 h-px bg-white/10" />

                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[#f0ca72]">
                    Sabzazar Fast Food
                  </p>

                  <p className="mt-3 text-white/60">
                    Fresh food. Great taste. Happy moments.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="bg-red-600 py-20">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/70">
            Hungry Yet?
          </p>

          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
            Your Next Favourite Meal
            <br />
            Is Just An Order Away.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Freshly prepared, packed with flavour and made
            with care. Order from Sabzazar Fast Food and
            make your next meal a delicious one.
          </p>

          <a
            href="/"
            className="mt-9 inline-flex rounded-2xl bg-white px-8 py-4 text-base font-black text-red-600 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-gray-100"
          >
            Explore Our Menu →
          </a>

        </div>

      </section>

    </main>
  );
}

