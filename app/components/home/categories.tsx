export default function Categories() {

  const categories = [

    { emoji: "🍔", title: "Burgers" },

    { emoji: "🌯", title: "Shawarma" },

    { emoji: "🍕", title: "Pizza" },

    { emoji: "🍟", title: "Fries" },

    { emoji: "🍗", title: "Crispy Chicken" },

    { emoji: "🔥", title: "Platters" },

  ];

  return (

    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">

          Categories

        </h2>

        <p className="text-center text-gray-500 mt-3 mb-12">

          What are you hungry for?

        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {categories.map((item) => (

            <div

              key={item.title}

              className="bg-gray-100 rounded-xl p-8 text-center hover:bg-red-600 hover:text-white transition duration-300 cursor-pointer"

            >

              <div className="text-5xl mb-4">

                {item.emoji}

              </div>

              <h3 className="font-bold">

                {item.title}

              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}