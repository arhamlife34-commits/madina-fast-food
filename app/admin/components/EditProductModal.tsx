"use client";

type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
  is_deal: boolean;
};

type Props = {
  product: Product | null;

  editName: string;
  setEditName: (v: string) => void;

  editCategory: string;
  setEditCategory: (v: string) => void;

  editPrice: number;
  setEditPrice: (v: number) => void;

  editDescription: string;
  setEditDescription: (v: string) => void;

  editImageFile: File | null;
  setEditImageFile: (v: File | null) => void;

  currentImage: string;

  editDeal: boolean;
  setEditDeal: (v: boolean) => void;

  onSave: () => void;
  onCancel: () => void;
};

export default function EditProductModal({
  product,

  editName,
  setEditName,

  editCategory,
  setEditCategory,

  editPrice,
  setEditPrice,

  editDescription,
  setEditDescription,

  editImageFile,
  setEditImageFile,

  currentImage,

  editDeal,
  setEditDeal,

  onSave,
  onCancel,
}: Props) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[600px] max-w-[95%] shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex justify-between items-center border-b px-8 py-5">

          <h2 className="text-3xl font-bold">
            Edit Product
          </h2>

          <button
            onClick={onCancel}
            className="text-2xl font-bold text-gray-500 hover:text-red-600 transition"
          >
            ✕
          </button>

        </div>

        {/* Body */}

        <div className="p-8 space-y-5">

          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Product Name"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            placeholder="Category"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(Number(e.target.value))}
            placeholder="Price"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Product Description"
            className="w-full border rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="space-y-3">

            <div>

              <p className="font-semibold mb-2">
                Current Image
              </p>

              <img
                src={currentImage}
                alt="Product"
                className="w-28 h-28 object-cover rounded-xl border"
              />

            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEditImageFile(e.target.files[0]);
                }
              }}
              className="w-full border rounded-xl p-3"
            />

            {editImageFile && (
              <p className="text-green-600 text-sm">
                Selected: {editImageFile.name}
              </p>
            )}

          </div>

          <label className="flex items-center gap-3 font-medium">

            <input
              type="checkbox"
              checked={editDeal}
              onChange={(e) => setEditDeal(e.target.checked)}
              className="w-5 h-5"
            />

            Featured Deal

          </label>

        </div>

        {/* Footer */}

        <div className="border-t px-8 py-5 flex justify-end gap-4">

          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 transition px-6 py-3 rounded-xl font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-semibold"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}