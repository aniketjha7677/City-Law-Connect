import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response - in real app, this would call OpenAI API
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${input}". Based on your question, I can provide some general guidance. However, please note that I'm an AI assistant and cannot provide specific legal advice. For your situation, I recommend consulting with a qualified lawyer who specializes in this area. Would you like me to help you find a lawyer in your area?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setLoading(false)
    }, 1500)
  }

  const handleQuickTopic = (topic: string) => {
    setInput(`I need help with ${topic}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-primary mb-2">AI Legal Assistant</h1>
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
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-gray-200' : 'text-gray-500'
                  }`}>
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
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Emergency Escalation */}
        <div className="mb-4">
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
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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

