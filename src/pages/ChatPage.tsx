import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, AlertCircle, Briefcase, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { chatWithAI } from "@/lib/openai"
import toast from 'react-hot-toast'
import { getLawyers } from "@/lib/lawyers";
import RatingStars from "@/components/RatingStars";

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Lawyer {
  id: string;
  display_name?: string;
  city?: string | null;
  state?: string | null;
  specializations?: string[] | null;
  years_experience?: number | null;
  consultation_fee?: number | null;
  avgRating?: number | null;
  reviewsCount?: number | null;
  successRate?: number | null;
}


// ✅ Smart city detection
function extractCitySmart(text: string, lawyers: Lawyer[]): string | null {
  const lowerText = text.toLowerCase();

  const citySet: Set<string> = new Set(
    lawyers
      .map(l => l.city?.toLowerCase().trim())
      .filter((c): c is string => Boolean(c))
  );

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const city of citySet) {
    if (lowerText.includes(city)) return city;

    const words = lowerText.split(/\s+/);

    for (const word of words) {
      const score = similarity(word, city);
      if (score > bestScore && score > 0.7) {
        bestScore = score;
        bestMatch = city;
      }
    }
  }

  return bestMatch;
}

function similarity(a: string, b: string): number {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;

  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;

  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(a: string, b: string): number {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}


async function getUserCityFromGPS(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village;

          resolve(city?.toLowerCase() || null);
        } catch {
          resolve(null);
        }
      },
      () => resolve(null)
    );
  });
}


function detectCategory(text: string): string {
  const t = text
    .toLowerCase()
    .replace(/[^\w\s₹]/g, " ")   // remove punctuation
    .replace(/\s+/g, " ")        // normalize spaces
    .trim();

  // helper
  const has = (word: string) => new RegExp(`\\b${word}\\b`).test(t);

  // ===== FAMILY =====
  if (
    has("divorce") ||
    has("marriage") ||
    has("wife") ||
    has("husband") ||
    t.includes("left me") ||
    has("separation") ||
    has("alimony") ||
    has("maintenance") ||
    has("custody")
  ) return "family";

  // ===== CRIMINAL =====
  if (
    has("fraud") ||
    has("cheating") ||
    has("theft") ||
    has("crime") ||
    has("police") ||
    has("fir") ||
    has("scam")
  ) return "criminal";

  // ===== PROPERTY =====
  if (
    has("land") ||
    has("property") ||
    has("plot") ||
    t.includes("property dispute") ||
    t.includes("land dispute")
  ) return "property";

  // ===== CIVIL (money / disputes) =====
  if (
    has("money") ||
    has("loan") ||
    has("borrow") ||
    has("borrowed") ||
    has("gave") ||
    has("given") ||
    has("taken") ||
    has("payment") ||
    has("amount") ||
    has("return") ||
    t.includes("not returning") ||
    t.includes("did not return") ||
    has("rupee") ||
    has("lakh") ||
    has("lakhs") ||
    has("cash") ||
    /\brs\b/.test(t) ||   // safe "Rs"
    t.includes("₹")
  ) return "civil";

  return "general";
}

// Check if the message is a greeting
function isGreeting(text: string): boolean {
  const t = text.toLowerCase().trim();
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings", "howdy"];
  return greetings.includes(t) || t.startsWith("hi ") || t.startsWith("hello ") || t.startsWith("hey ");
}

// Helper to filter lawyers by category
function filterLawyersByCategory(lawyers: Lawyer[], category: string): Lawyer[] {
  if (category === "general") return lawyers;

  return lawyers.filter(lawyer => {
    if (!Array.isArray(lawyer.specializations)) return false;

    return lawyer.specializations.some(spec =>
      spec.toLowerCase().includes(category.toLowerCase())
    );
  });
}



export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI legal assistant. How can I help you today? You can ask me about legal issues, get guidance on laws, or request help finding a lawyer.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recommendedLawyers, setRecommendedLawyers] = useState<Lawyer[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickTopics = [
    'Employment Law',
    'Family Law',
    'Criminal Law',
    'Contract Review',
    'Tenant Rights',
    'Personal Injury',
  ]


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setInput('');
    setLoading(true);

    // ✅ show user message
    setMessages(prev => [...prev, userMessage]);

    try {
      const category = detectCategory(userMessage.content);

      // ✅ Greeting
      if (isGreeting(userMessage.content)) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Hello! 👋 How can I help you today?",
            timestamp: new Date()
          }
        ]);
        setRecommendedLawyers([]);
        return;
      }

      // ✅ AI response (ONLY ONCE)
      const response = await chatWithAI([
        ...messages,
        userMessage
      ]);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: String(response),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // ❌ If not legal → stop ONLY lawyers
      if (category === "general") {
        setRecommendedLawyers([]);
        return;
      }

      // ✅ Fetch lawyers
      const lawyers = await getLawyers(category);

      // 📍 detect city
      let userCity = await getUserCityFromGPS();

      // fallback → show all
      if (!userCity) {
        setRecommendedLawyers(lawyers);
        return;
      }

      // ✅ filter by city (FIXED)
      let filteredLawyers = lawyers.filter(lawyer =>
        lawyer.city?.toLowerCase().includes(userCity!)
      );

      // fallback if no match
      if (filteredLawyers.length === 0) {
        setRecommendedLawyers(lawyers);

        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "No lawyers found in your exact city, showing nearby options.",
            timestamp: new Date()
          }
        ]);
        return;
      }

      setRecommendedLawyers(filteredLawyers);

    } catch (error) {
      console.error(error);
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTopic = (topic: string) => {
    setInput(`I need help with ${topic}`)
  }

  const getFee = (lawyer: Lawyer) => {
    return lawyer.consultation_fee ?? 0;
  };
  const getExperience = (lawyer: Lawyer) => {
    return lawyer.years_experience || 5;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-primary mb-1">AI Legal Assistant</h1>
          <p className="text-secondary">
            Get instant legal guidance powered by GPT-4o
          </p>
        </div>

        {/* Quick Topics */}
        <div className="mb-4">
          <p className="text-sm text-secondary mb-2">Quick Start:</p>
          <div className="flex flex-wrap gap-2">
            {quickTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleQuickTopic(topic)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 card overflow-y-auto mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {message.content}
                  </div>
                  <p
                    className={`text-xs mt-2 ${message.role === 'user' ? 'text-gray-200' : 'text-gray-500'
                      }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {recommendedLawyers.length > 0 && (
              <div className="mt-4 p-4 bg-white border rounded-lg">
                <h3 className="font-bold mb-4 text-primary text-lg">
                  Recommended Lawyers
                </h3>

                {recommendedLawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="border border-gray-200 p-4 rounded-lg mb-4 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-lg text-gray-900">
                              {lawyer.display_name || lawyer.id}
                            </p>
                            <div className="mt-1">
                              <RatingStars
                                rating={lawyer.avgRating || 0}
                                reviewCount={lawyer.reviewsCount || 0}
                                size={16}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Specialization:</span> {lawyer.specializations?.join(", ") || "General Practice"}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Location:</span> {
                              lawyer.city && lawyer.state
                                ? `${lawyer.city}, ${lawyer.state}`
                                : "Not specified"
                            }
                          </p>

                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <Briefcase size={14} className="text-gray-500" />
                              <span>{getExperience(lawyer)}+ years experience</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <DollarSign size={14} className="text-gray-500" />
                              <span>${getFee(lawyer)}/hr</span>
                            </div>
                            {lawyer.successRate && (
                              <div className="flex items-center gap-1 text-sm text-gray-700">
                                <span className="font-medium">Success Rate:</span>
                                <span>{lawyer.successRate}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Link
                          to={`/book/${lawyer.id}`}
                          className="btn-primary px-5 py-2.5 text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          <span>Hire Now</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Emergency Escalation */}
        <div className="mb-2">
          <Link
            to="/emergency"
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm"
          >
            <AlertCircle size={16} />
            <span>Need urgent legal help? Click here for emergency assistance</span>
          </Link>
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Paperclip size={20} className="text-secondary" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Type your legal question here..."
            className="flex-1 input-field"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
