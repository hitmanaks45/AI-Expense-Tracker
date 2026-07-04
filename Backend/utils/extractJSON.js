const extractJSON = (text) => {
  try {
    // Remove markdown code fences
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Find first '{' and last '}'
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON object found.");
    }

    const jsonString = cleaned.substring(start, end + 1);

    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Failed to parse Gemini JSON response.");
  }
};

module.exports = extractJSON;