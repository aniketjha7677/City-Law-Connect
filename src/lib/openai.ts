// OpenRouter integration for AI Legal Chatbot

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

  console.log("chatWithAI called");

  const lastMessage = messages[messages.length - 1]?.content || "";
  const lower = lastMessage.toLowerCase().trim();

  console.log("User message:", lastMessage);

  if (["hi", "hello", "hey"].includes(lower)) {
    console.log("Greeting detected");
    return "Hello! I can help you with legal questions.";
  }

  if (!isLegal(lastMessage)) {
    console.log("Blocked: Not legal question");
    return "Please ask a legal question";
  }

  console.log("Sending request to backend...");

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    console.log("Fetch executed");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API ERROR:", errorText);
      return "Server error: " + errorText;
    }

    const data = await response.json();
    console.log("Response:", data);

    return data.reply || "No response from AI";

  } catch (error) {
    console.error("FETCH ERROR:", error);
    return "Error connecting to AI service";
  }
}





