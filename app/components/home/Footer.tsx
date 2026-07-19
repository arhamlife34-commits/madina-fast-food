export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">

      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold text-red-500">
          Madina Fast Food
        </h2>

        <p className="mt-4 text-gray-400">
          Fresh • Delicious • 100% Halal
        </p>

        <div className="flex justify-center gap-8 mt-8">

          <a href="#">Home</a>
          <a href="#">Menu</a>
          <a href="#">Deals</a>
          <a href="#">Contact</a>

        </div>

        <p className="mt-8 text-gray-500">
          © 2026 Madina Fast Food. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}