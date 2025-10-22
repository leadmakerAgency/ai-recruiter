// src/app/terms/page.tsx
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-600 mb-6">
            Last Updated: October 21, 2025
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using this AI Interview platform, you agree to be bound by these Terms of Use. 
              If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Interview Process</h2>
            <p className="text-gray-700 mb-2">
              Our AI-powered interview system is designed to assess candidate suitability for available positions. 
              By participating, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Your interview will be recorded and analyzed</li>
              <li>Your responses will be reviewed by our hiring team</li>
              <li>You are providing truthful and accurate information</li>
              <li>You understand this is a preliminary screening, not a job offer</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Conduct</h2>
            <p className="text-gray-700">
              You agree to use the platform in a professional manner and not to engage in any abusive, 
              harassing, or inappropriate behavior during the interview process.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Privacy & Data</h2>
            <p className="text-gray-700">
              Your personal information and interview data will be handled in accordance with our Privacy Policy. 
              We collect and process your data solely for recruitment purposes.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. No Guarantee of Employment</h2>
            <p className="text-gray-700">
              Completing the AI interview does not guarantee employment or further interviews. 
              We reserve the right to decline any application at our discretion.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Technical Requirements</h2>
            <p className="text-gray-700">
              You are responsible for ensuring you have a working microphone and stable internet connection. 
              We are not liable for technical issues that prevent completion of the interview.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p className="text-gray-700">
              All content on this platform, including but not limited to text, graphics, logos, and software, 
              is our property and protected by copyright and intellectual property laws.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Continued use of the platform 
              constitutes acceptance of updated terms.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
            <p className="text-gray-700">
              For questions about these Terms of Use, please contact us at:{" "}
              <a href="mailto:support@example.com" className="text-[#5746b2] hover:underline">
                support@example.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
