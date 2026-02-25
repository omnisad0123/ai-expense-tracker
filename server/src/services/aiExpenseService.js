const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

console.log("=== GEMINI DEBUG ===");
console.log("API KEY LOADED:", process.env.GEMINI_API_KEY ? "YES ✓" : "NO - KEY MISSING ✗");
console.log("API KEY VALUE:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + "..." : "UNDEFINED");
console.log("====================");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.5-flash";

const testGemini = async () => {
  try {
    console.log("Testing Gemini API connection...");
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent("Reply with only: Gemini API is working!");
    const response = await result.response;
    console.log("✓ Gemini API Test:", response.text().trim());
  } catch (error) {
    console.log("✗ Gemini API Test Failed:", error.status, error.message);
  }
};

testGemini();

// ── Fallback: keyword matching (used only if Gemini fails) ──────────────────
const keywordFallback = (description) => {
  const text = description.toLowerCase();
  const categories = {
    Food: [
      "swiggy", "zomato", "biryani", "food", "restaurant", "cafe", "bakery",
      "dinner", "lunch", "breakfast", "pizza", "burger", "hotel", "dhaba",
      "tea", "coffee", "snack", "juice", "meal", "eat", "dine",
    ],
    Travel: [
      "uber", "ola", "bus", "train", "petrol", "fuel", "flight", "cab",
      "metro", "auto", "rickshaw", "toll", "parking", "rapido",
    ],
    Rent: ["rent", "house", "pg", "lease", "apartment", "hostel", "room"],
    Bills: [
      "electricity", "water", "bill", "recharge", "wifi", "internet",
      "gas", "mobile", "phone", "broadband", "dth", "subscription",
    ],
    Entertainment: [
      "netflix", "movie", "spotify", "prime", "gaming", "concert",
      "hotstar", "youtube", "zee5", "theatre", "game", "cricket",
    ],
    Health: [
      "doctor", "medicine", "hospital", "pharmacy", "clinic",
      "medical", "health", "chemist", "tablet", "injection",
    ],
    Shopping: [
      "amazon", "flipkart", "mall", "clothes", "shoes", "myntra",
      "meesho", "ajio", "market", "shop", "purchase", "buy",
    ],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      console.log(`⚠ Keyword fallback matched → Category: ${category}`);
      return category;
    }
  }

  return "Other";
};

// ── Main categorizer: Gemini first, keyword fallback on failure ─────────────
const categorizeExpense = async (description) => {
  console.log("\n--- categorizeExpense called ---");
  console.log("Description:", description);

  try {
    console.log("Asking Gemini AI...");
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Categorize this expense into exactly ONE of these categories: Food, Travel, Rent, Bills, Entertainment, Health, Shopping, or Other.
Description: "${description}"
Return only the category name, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiCategory = response.text().trim();

    console.log("✓ Gemini categorized as:", aiCategory);
    return aiCategory;

  } catch (error) {
    console.log("\n=== GEMINI FAILED - Using keyword fallback ===");
    console.log("Error status:", error.status);
    console.log("Error message:", error.message);
    console.log("=============================================\n");

    // Fallback to keyword matching
    const fallbackCategory = keywordFallback(description);
    console.log("Fallback category:", fallbackCategory);
    return fallbackCategory;
  }
};

module.exports = { categorizeExpense };