// Scales of Justice Icon Component
export default function ScalesIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Base */}
      <path d="M10 22h4M12 22v-18" />
      
      {/* Top horizontal bar */}
      <path d="M6 4h12" />
      
      {/* Left chain and scale */}
      <path d="M6 4l-2 4h4l-2-4z" />
      <path d="M4 8v2" />
      <ellipse cx="4" cy="12" rx="2.5" ry="1" />
      
      {/* Right chain and scale */}
      <path d="M18 4l2 4h-4l2-4z" />
      <path d="M20 8v2" />
      <ellipse cx="20" cy="12" rx="2.5" ry="1" />
    </svg>
  )
}

