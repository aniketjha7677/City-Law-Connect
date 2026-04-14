export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow rounded-xl p-6 space-y-6">
        
        <h1 className="text-3xl font-bold">Privacy Policy</h1>

        <p>
          The protection of your privacy and personal data is very important to us. 
          We ensure your data is handled securely and in accordance with applicable laws.
        </p>

        <h2 className="text-xl font-semibold">Who We Are</h2>
        <p>
          CityLaw Connect is a platform connecting users with legal professionals.
          For any queries: support@citylawconnect.com
        </p>

        <h2 className="text-xl font-semibold">Data We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name, email, and location</li>
          <li>Account details</li>
          <li>Usage data (pages visited, activity)</li>
        </ul>

        <h2 className="text-xl font-semibold">Why We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide legal services</li>
          <li>To connect users with lawyers</li>
          <li>To improve platform experience</li>
        </ul>

        <h2 className="text-xl font-semibold">Data Storage & Security</h2>
        <p>
          Your data is securely stored using Supabase and protected with industry-standard security measures.
        </p>

        <h2 className="text-xl font-semibold">Data Sharing</h2>
        <p>
          We do not sell your data. Information is only shared with relevant lawyers when necessary.
        </p>

        <h2 className="text-xl font-semibold">Cookies</h2>
        <p>
          We may use cookies and analytics tools to improve user experience.
        </p>

        <h2 className="text-xl font-semibold">Your Rights</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access your data</li>
          <li>Update or delete your data</li>
          <li>Withdraw consent anytime</li>
        </ul>

        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          Email: support@citylawconnect.com
        </p>

        <p className="text-sm text-gray-500">
          Last updated: 2026
        </p>

      </div>
    </div>
  )
}