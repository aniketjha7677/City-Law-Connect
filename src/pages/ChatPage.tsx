import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { chatWithAI } from "@/lib/openai"
import toast from 'react-hot-toast'
import { getLawyers } from "@/lib/lawyers";

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Lawyer {
  id: string;
  display_name?: string;
  location?: string;
  specializations?: string[];
}

function detectCategory(text: string): string {
  const t = text.toLowerCase();

  if (t.includes("divorce")) return "family";
  if (t.includes("ipc") || t.includes("fraud")) return "criminal";
  if (t.includes("property")) return "civil";
  if (t.includes("company")) return "corporate";

  return "general";
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
    console.log("SEND BUTTON CLICKED");

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setInput('');
    setLoading(true);

    // ✅ Add user message first
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await chatWithAI([
        ...messages,
        userMessage
      ]);

      // ✅ detect category
      const category = detectCategory(userMessage.content);
      // ✅ fetch lawyers
      const lawyers = await getLawyers(category);
      console.log("LAWYERS:", lawyers);
      // ✅ save to state
      setRecommendedLawyers(lawyers);

      console.log("AI RESPONSE:", response);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: String(response),
        timestamp: new Date(),
      };

      // ✅ Add AI message
      setMessages(prev => [...prev, assistantMessage]);

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
                <h3 className="font-bold mb-2 text-primary">
                  Recommended Lawyers
                </h3>

                {recommendedLawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="border p-3 rounded mb-2 hover:shadow-md transition"
                  >
                    <p className="font-semibold">
                      {lawyer.display_name || "Unknown"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Specialization: {lawyer.specializations?.join(", ") || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Location: {lawyer.location || "N/A"}
                    </p>
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


