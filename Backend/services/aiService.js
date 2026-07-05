const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Text model
const textModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Vision model
const visionModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// ---------- TEXT ----------
const generateResponse = async (prompt) => {
  try {
    const result = await textModel.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate AI response");
  }
};

// ---------- IMAGE ----------
const scanReceiptWithAI = async (imageBuffer, mimeType) => {
  try {
    const image = {
      inlineData: {
        data: imageBuffer.toString("base64"),
          mimeType,
      },
    };

    const prompt = `
You are an OCR and Finance AI.

Analyze the uploaded receipt image and extract the expense details.

Return ONLY a valid JSON object.

Do NOT include:
- Markdown
- Code fences
- Explanations
- Notes
- Extra text
- Comments

The first character of your response must be {
The last character of your response must be }

Use this exact JSON format:

{
  "merchant": "",
  "amount": 0,
  "category": "",
  "description": "",
  "date": ""
}

Rules:
- amount should be the final payable total.
- category must be one of:
  Food
  Shopping
  Travel
  Bills
  Entertainment
  Healthcare
  Education
  Other
- description should be short (3-8 words).
- date format must be YYYY-MM-DD.
- If a field cannot be determined, use an empty string ("") instead of guessing.
`;

    const result = await visionModel.generateContent([
      prompt,
      image,
    ]);

    return result.response.text();
  } catch (error) {
    console.error(error);
    throw new Error("Receipt OCR failed");
  }
};

module.exports = {
  generateResponse,
  scanReceiptWithAI,
};