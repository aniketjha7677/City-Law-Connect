# CityLaw Connect

A comprehensive web-based legal assistance platform that leverages artificial intelligence to help users understand legal issues, navigate rule violations, and connect with qualified legal professionals.

## Features

- **AI Legal Chatbot**: Intelligent conversational assistant powered by GPT-4o
- **Case Analysis**: AI-powered analysis of legal situations
- **Lawyer Matching**: Location-based lawyer discovery with specialization filtering
- **Legal Document Library**: Repository of common legal documents and templates
- **Case History Tracking**: Save and track legal consultations and case progress
- **Emergency Legal Assistance**: Quick access for urgent legal matters
- **Appointment Scheduling**: Integrated booking system for consultations
- **User Authentication**: Secure account management with Supabase

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (authentication, database, storage, real-time)
- **AI Integration**: OpenAI GPT-4o
- **Routing**: React Router v6
- **UI Components**: Lucide React Icons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (for backend services)
- OpenAI API key (for AI chatbot)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CityLawConnect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable React components
├── contexts/        # React context providers (Auth, etc.)
├── lib/             # Utility libraries and configurations
├── pages/           # Page components
│   ├── auth/       # Authentication pages
│   └── ...         # Other pages
└── main.tsx        # Application entry point
```

## Supabase Setup

You'll need to set up the following tables in Supabase:

1. **profiles** - User profiles
2. **lawyers** - Lawyer information
3. **cases** - Legal cases
4. **appointments** - Consultation bookings
5. **documents** - Case documents
6. **messages** - Chat messages
7. **reviews** - Lawyer reviews

## Features in Development

- Real-time chat with AI assistant
- Google Maps integration for lawyer locations
- Stripe payment integration
- Email/SMS notifications
- Legal database API integration

## License

MIT License

## Support

For support, email support@citylawconnect.com

