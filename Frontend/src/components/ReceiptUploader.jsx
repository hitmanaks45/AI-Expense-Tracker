import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiUpload, HiTrash } from "react-icons/hi";
import { scanReceipt } from "../services/receiptService";
import { saveExpense } from "../services/expenseService";
import toast from "react-hot-toast"

const ReceiptUploader = () => {
  const inputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
 const [result, setResult] = useState({
  merchant: "",
  amount: "",
  category: "",
  description: "",
  date: "",
});
  const [saving, setSaving] = useState(false);
  

  const navigate=useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setResult(null);
  };

  const handleScan = async () => {
    if (!image) return;

    try {
      setLoading(true);

      const data = await scanReceipt(image);

      setResult({
  merchant: data.expense.merchant || "",
  amount: data.expense.amount || "",
  category: data.expense.category || "",
  description: data.expense.description || "",
  date: data.expense.date || "",
});
    } catch (error) {
      console.error(error);
      toast.error("Receipt scanning failed.");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveExpense = async () => {
  try {
    setSaving(true);

    await saveExpense({
  merchant: result.merchant,
  amount: Number(result.amount),
  category: result.category,
  description: result.description,
  date: result.date,
  source: "ocr",
});

    toast.success("Expense saved successfully!");

    setImage(null);
    setResult(null);

    setTimeout(() => {
    navigate("/expenses"); 
    }, 1200);
    
  } catch (error) {
    console.error(error);
    toast.error("Failed to save expense.");
  } finally {
    setSaving(false);
  }
};

  const removeImage = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="card max-w-3xl">
      {!image ? (
        <div
          onClick={() => inputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:border-primary-500 transition"
        >
          <div className="flex flex-col items-center">
            <HiUpload size={60} className="text-primary-600 mb-4" />

            <h2 className="text-xl font-semibold">
              Upload Receipt
            </h2>

            <p className="text-gray-500 mt-2">
              JPG • PNG • JPEG
            </p>
          </div>
        </div>
      ) : (
        <div>
          <img
            src={URL.createObjectURL(image)}
            alt="receipt"
            className="rounded-xl w-full max-h-[500px] object-contain"
          />

          <button
            onClick={removeImage}
            className="mt-5 flex items-center gap-2 text-red-500"
          >
            <HiTrash />
            Remove Image
          </button>

          <button
            onClick={handleScan}
            disabled={loading}
            className="btn-primary mt-4"
          >
            {loading ? "Scanning Receipt..." : "Scan Receipt"}
          </button>

          {result && (
            <div className="card mt-6">
              <h2 className="text-xl font-bold mb-4">
                AI Extracted Expense
              </h2>

              <div className="space-y-2">
              <div className="space-y-4">

  <div>
    <label className="font-medium">Merchant</label>
    <input
      className="input-field mt-1"
      value={result.merchant}
      onChange={(e) =>
        setResult({
          ...result,
          merchant: e.target.value,
        })
      }
    />
  </div>

  <div>
    <label className="font-medium">Amount</label>
    <input
      type="number"
      className="input-field mt-1"
      value={result.amount}
      onChange={(e) =>
        setResult({
          ...result,
          amount: e.target.value,
        })
      }
    />
  </div>

  <div>
    <label className="font-medium">Category</label>

    <select
      className="input-field mt-1"
      value={result.category}
      onChange={(e) =>
        setResult({
          ...result,
          category: e.target.value,
        })
      }
    >
      <option>Food</option>
      <option>Shopping</option>
      <option>Travel</option>
      <option>Bills</option>
      <option>Entertainment</option>
      <option>Healthcare</option>
      <option>Education</option>
      <option>Other</option>
    </select>
  </div>

  <div>
    <label className="font-medium">Description</label>

    <input
      className="input-field mt-1"
      value={result.description}
      onChange={(e) =>
        setResult({
          ...result,
          description: e.target.value,
        })
      }
    />
  </div>

  <div>
    <label className="font-medium">Date</label>

    <input
      type="date"
      className="input-field mt-1"
      value={result.date}
      onChange={(e) =>
        setResult({
          ...result,
          date: e.target.value,
        })
      }
    />
  </div>

</div>
              </div>
                            <button
                onClick={handleSaveExpense}
                disabled={saving}
                className="btn-primary mt-6 w-full"
                >
                {saving ? "Saving..." : "Save Expense"}
                </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleImage}
      />
    </div>
  );
};

export default ReceiptUploader;