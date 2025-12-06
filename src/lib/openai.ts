// OpenAI integration for AI Legal Chatbot
// This file will handle communication with OpenAI GPT-4o API

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured')
    // Return a fallback response
    return "I'm sorry, but the AI service is not currently configured. Please contact support or try again later."
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful legal assistant. Provide general legal information and guidance, but always remind users that you cannot provide specific legal advice and recommend consulting with a qualified lawyer for their specific situation.',
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI')
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    return "I'm sorry, but I'm experiencing technical difficulties. Please try again later or contact support."
  }
}

export async function analyzeCase(caseDescription: string): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'user',
      content: `Please analyze this legal situation and provide general guidance: ${caseDescription}`,
    },
  ]
  
  return chatWithAI(messages)
}

