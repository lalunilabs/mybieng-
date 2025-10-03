export const metadata = {
  title: 'Terms of Service - MyBeing',
  description: 'Terms and conditions for using MyBeing self-discovery platform.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using MyBeing, you agree to be bound by these Terms of Service. 
            If you disagree with any part of these terms, you may not access our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use of Service</h2>
          <p className="text-gray-700 mb-4">
            MyBeing provides self-discovery and personality assessment tools. You agree to use our services:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>For personal, non-commercial use</li>
            <li>Without violating any laws or regulations</li>
            <li>Without attempting to reverse engineer or hack our systems</li>
            <li>Without creating multiple accounts to manipulate results</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            You are responsible for maintaining the confidentiality of your account and password. 
            You agree to accept responsibility for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            All content, features, and functionality on MyBeing are owned by us and are protected by 
            international copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            MyBeing provides self-assessment tools for educational and self-reflection purposes only. 
            Our assessments are not medical diagnoses and should not replace professional advice.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            MyBeing shall not be liable for any indirect, incidental, special, consequential, or 
            punitive damages arising from your use of our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, 
            for any reason, including breach of these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. Changes will be effective immediately 
            upon posting on this page.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            For questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-gray-700">
            Email: <a href="mailto:legal@mybeing.com" className="text-blue-600 hover:text-blue-800">legal@mybeing.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
