export default function Contact() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Contact Us
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            We'd love to hear from you
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Left Side */}

          <div className="bg-gray-100 rounded-3xl p-10 shadow-lg">

            <h3 className="text-3xl font-bold mb-8">
              Get In Touch
            </h3>

            <div className="space-y-8">

              <div>

                <h4 className="font-bold text-xl">
                  📍 Address
                </h4>

                <p className="text-gray-600 mt-2">
                  Chowk Yateem Khana,Thana Nawankot,Bund Road, Lahore
                </p>

              </div>

              <div>

                <h4 className="font-bold text-xl">
                  📞 Phone
                </h4>

                <p className="text-gray-600 mt-2">
                  03224972944 ,                                                                                                                                                                                                                      
                  03134972944
                </p>

              </div>

              <div>

                <h4 className="font-bold text-xl">
                  📧 Email
                </h4>

                <p className="text-gray-600 mt-2">
                  madinafastfood@gmail.com
                </p>

              </div>

              <div>

                <h4 className="font-bold text-xl">
                  🕒 Opening Hours
                </h4>

                <p className="text-gray-600 mt-2">
                  Monday - Sunday
                </p>

                <p className="text-gray-600">
                  6:00 PM - 3:00 AM
                </p>

              </div>

              <a
                href="https://wa.me/03224972944"
                target="_blank"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold transition"
              >
                💬 Chat on WhatsApp
              </a>

            </div>

          </div>

          {/* Right Side */}

          <div>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-xl p-4 focus:outline-none focus:border-red-600"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border rounded-xl p-4 focus:outline-none focus:border-red-600"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-xl p-4 focus:outline-none focus:border-red-600"
              />

              <textarea
                placeholder="Your Message"
                className="w-full border rounded-xl p-4 h-40 focus:outline-none focus:border-red-600"
              />

              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition"
              >
                Send Message
              </button>

            </form>

            {/* Google Map */}

            <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">

              <iframe
                src="https://www.google.com/maps?q=Lahore&output=embed"
                width="100%"
                height="300"
                loading="lazy"
                className="border-0"
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}