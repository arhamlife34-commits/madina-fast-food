import Image from "next/image";

export default function About() {
  return (
    <section className="py-24 bg-gray-100">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image */}

          <div className="relative overflow-hidden rounded-3xl shadow-2xl">

            <Image
              src="/images/about.jpg.jpg"
              alt="About Madina Fast Food"
              width={700}
              height={700}
              sizes="(max-width:768px) 100vw, 50vw"
              className="w-full h-[550px] object-cover hover:scale-105 transition duration-700"
            />

          </div>

          {/* Content */}

          <div>

            <span className="text-red-600 font-bold uppercase tracking-widest">

              About Us

            </span>

            <h2 className="text-5xl font-extrabold mt-4 leading-tight">

              Fresh Food <br />

              Made With Love ❤️

            </h2>

            <p className="text-gray-600 mt-6 leading-8 text-lg">

              Madina Fast Food has been serving delicious,
              fresh and 100% halal meals with premium quality
              ingredients. Every burger, pizza, shawarma and
              platter is prepared with care to give our
              customers the best taste in town.

            </p>

            {/* Features */}

            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="flex items-center gap-3">

                <span className="text-2xl">🍔</span>

                <p className="font-semibold">
                  Premium Ingredients
                </p>

              </div>

              <div className="flex items-center gap-3">

                <span className="text-2xl">🚚</span>

                <p className="font-semibold">
                  Fast Delivery
                </p>

              </div>

              <div className="flex items-center gap-3">

                <span className="text-2xl">🥩</span>

                <p className="font-semibold">
                  100% Halal Food
                </p>

              </div>

              <div className="flex items-center gap-3">

                <span className="text-2xl">⭐</span>

                <p className="font-semibold">
                  Best Quality
                </p>

              </div>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-2 gap-6 mt-12">

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">

                <h3 className="text-4xl font-bold text-red-600">
                  15+
                </h3>

                <p className="mt-2 text-gray-600">
                  Years Experience
                </p>

              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">

                <h3 className="text-4xl font-bold text-red-600">
                  25K+
                </h3>

                <p className="mt-2 text-gray-600">
                  Happy Customers
                </p>

              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">

                <h3 className="text-4xl font-bold text-red-600">
                  100%
                </h3>

                <p className="mt-2 text-gray-600">
                  Halal Food
                </p>

              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">

                <h3 className="text-4xl font-bold text-red-600">
                  30 Min
                </h3>

                <p className="mt-2 text-gray-600">
                  Average Delivery
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}