import ReceiptUploader from "../components/ReceiptUploader";

const ReceiptScanner = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Receipt Scanner
        </h1>

        <p className="text-gray-500 mt-2">
          Upload a receipt and let AI extract the expense automatically.
        </p>
      </div>

      <ReceiptUploader />
    </div>
  );
};

export default ReceiptScanner;