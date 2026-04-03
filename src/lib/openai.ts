// OpenRouter integration for AI Legal Chatbot
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}
// 🔒 Legal keyword filter (improved)
const isLegal = (text: string): boolean => {
  const lower = text.toLowerCase().trim();

  // allow basic legal questions even if simple
  if (lower.includes("law")) return true;

  const legalKeywords = [
    "court", "police", "rights", "contract", "case",
    "crime", "judge", "tenant", "property",
    "divorce", "arrest", "agreement", "complaint",
    "fir", "cybercrime", "ipc", "section", "act",
    "constitution"
  ];

  return legalKeywords.some(word => lower.includes(word));
};

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    return "AI service is not configured. Please add API key."
  }
  const lastMessage = messages[messages.length - 1]?.content || ""
  // 🚫 Block non-legal questions
  const lower = lastMessage.toLowerCase().trim()
// 👋 allow greetings
if (["hi", "hello", "hey"].includes(lower)) {
  return "Hello! I can help you with legal questions. What would you like to know?"
}
// 🚫 block non-legal
if (!isLegal(lastMessage)) {
  return "I can only assist with legal-related questions."
}
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "CityLawConnect"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // stable model
        temperature: 0,
        messages: [
          {
            role: "system",
            content: `
You are a STRICT legal assistant.
RULES:
- ONLY answer legal-related questions
- If NOT legal → reply EXACTLY:
  "I can only assist with legal-related questions."
- Keep answers simple and clear
- Suggest consulting a lawyer if needed
            `
          },
          ...messages,
        ],
      }),
    })

    // 🔥 Handle API errors
    if (!response.ok) {
      const errorText = await response.text()
      console.error("API ERROR:", errorText)
      return "API Error: " + errorText
    }

    const data = await response.json()
    console.log("FULL RESPONSE:", data)

    // ✅ Safe response handling
    if (data?.choices && data.choices.length > 0) {
      return data.choices[0].message.content
    }

    return "No valid response from AI"

  } catch (error) {
    console.error("FETCH ERROR:", error)
    return "Error connecting to AI service"
  }
}