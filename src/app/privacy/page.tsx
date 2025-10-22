// src/app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-600 mb-6">
            Last Updated: October 21, 2025
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="text-gray-700 mb-2">
              During the AI interview process, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Personal information (name, location, contact details)</li>
              <li>Voice recordings of your interview responses</li>
              <li>Professional background and work history</li>
              <li>Career goals and salary expectations</li>
              <li>Technical data (IP address, browser type, device information)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-2">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Evaluate your suitability for available positions</li>
              <li>Schedule follow-up interviews with our hiring team</li>
              <li>Communicate about your application status</li>
              <li>Improve our AI interview platform</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Sharing</h2>
            <p className="text-gray-700">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Our hiring team and management</li>
              <li>Service providers who assist in our recruitment process (e.g., AI processing providers)</li>
              <li>Legal authorities if required by law</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
            <p className="text-gray-700">
              We implement industry-standard security measures to protect your personal information from unauthorized 
              access, disclosure, or misuse. However, no internet transmission is completely secure.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
            <p className="text-gray-700">
              We retain your interview data for up to 12 months for recruitment purposes. After this period, 
              or if you request deletion, your data will be securely removed from our systems.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="text-gray-700 mb-2">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Opt out of future communications</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies & Tracking</h2>
            <p className="text-gray-700">
              We use minimal cookies and tracking technologies to ensure the platform functions correctly 
              and to analyze usage patterns for improvement purposes.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Third-Party Services</h2>
            <p className="text-gray-700">
              Our platform uses third-party services for AI voice processing and scheduling. 
              These services have their own privacy policies.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. We will notify users of significant changes 
              via email or platform notification.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
            <p className="text-gray-700">
              For privacy-related questions or to exercise your rights, contact us at:{" "}
              <a href="mailto:privacy@example.com" className="text-[#5746b2] hover:underline">
                privacy@example.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
