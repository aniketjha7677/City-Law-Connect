// OpenRouter integration for AI Legal Chatbot
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}
// 🔒 Legal keyword filter (improved)
const isLegal = (text: string): boolean => {
  const lower = text.toLowerCase().trim();

  // ✅ allow greetings
  if (["hi", "hello", "hey"].includes(lower)) return true;

  // ✅ detect patterns like:
  // article 370, section 420, ipc 302
  const legalPatterns = [
    /article\s*\d+/i,
    /section\s*\d+/i,
    /ipc\s*\d+/i,
    /crpc\s*\d+/i,
    /\d+\s*ipc/i,
  ];

  if (legalPatterns.some(pattern => pattern.test(lower))) {
    return true;
  }

  // ✅ keywords
  const legalKeywords = [
    "law", "court", "police", "rights", "contract",
    "case", "crime", "judge", "tenant", "property",
    "divorce", "arrest", "agreement", "complaint",
    "fir", "cybercrime", "ipc", "section",
    "act", "constitution", "article"
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
    return "Please ask a legal question"
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
        model: "openai/gpt-4o-mini", // better model
        temperature: 0,
        max_tokens: 500, // 🔥 IMPORTANT FIX
        messages: [
          {
            role: "system",
            content: `
You are an Indian legal assistant.
Answer clearly and simply.
If unsure, suggest consulting a lawyer.
      `
          },
          ...messages,
        ],
      })
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
