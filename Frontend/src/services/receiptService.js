import api from "../utils/api";

export const scanReceipt = async (file) => {
  const formData = new FormData();

  formData.append("receipt", file);

  const response = await api.post("/api/receipts/scan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};