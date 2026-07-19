"use client";

type Deal = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type Props = {
  deal: Deal | null;

  editName: string;
  setEditName: (v: string) => void;

  editPrice: number;
  setEditPrice: (v: number) => void;

  editDescription: string;
  setEditDescription: (v: string) => void;

  currentImage: string;

  editImageFile: File | null;
  setEditImageFile: (v: File | null) => void;

  onSave: () => void;
  onCancel: () => void;
};

export default function EditDealModal({
  deal,
  editName,
  setEditName,
  editPrice,
  setEditPrice,
  editDescription,
  setEditDescription,
  currentImage,
  editImageFile,
  setEditImageFile,
  onSave,
  onCancel,
}: Props) {
  if (!deal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-[650px] max-w-[95%] shadow-2xl overflow-hidden">

        <div className="flex justify-between items-center border-b px-8 py-5">

          <h2 className="text-3xl font-bold">
            Edit Deal
          </h2>

          <button
            onClick={onCancel}
            className="text-2xl font-bold text-gray-500 hover:text-red-600"
          >
            ✕
          </button>

        </div>

        <div className="p-8 space-y-5">

          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Deal Name"
            className="w-full border rounded-xl p-4"
          />

          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(Number(e.target.value))}
            placeholder="Price"
            className="w-full border rounded-xl p-4"
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
            className="w-full border rounded-xl p-4 h-32"
          />

          <div>

            <p className="font-bold mb-2">
              Current Image
            </p>

            <img
              src={currentImage}
              className="w-28 h-28 rounded-xl border object-cover"
            />

          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setEditImageFile(e.target.files[0]);
              }
            }}
            className="w-full border rounded-xl p-3"
          />

          {editImageFile && (
            <p className="text-green-600">
              {editImageFile.name}
            </p>
          )}

        </div>

        <div className="border-t px-8 py-5 flex justify-end gap-4">

          <button
            onClick={onCancel}
            className="bg-gray-300 px-6 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}