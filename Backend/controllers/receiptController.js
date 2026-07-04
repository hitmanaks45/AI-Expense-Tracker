const fs = require("fs");

const {
  scanReceiptWithAI,
} = require("../services/aiService");

const extractJSON = require("../utils/extractJSON");

const scanReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No receipt uploaded",
      });
    }

    const aiResult = await scanReceiptWithAI(req.file.path);

    // Gemini sometimes wraps JSON in ```json ... ```
    const parsed = extractJSON(aiResult);

    // delete uploaded image after processing
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      expense: parsed,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Receipt scan failed",
    });
  }
};

module.exports = {
  scanReceipt,
};