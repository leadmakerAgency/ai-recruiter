// src/app/page.tsx
import { Mic, Clock, Shield, BarChart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff]">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] rounded-2xl mb-6 shadow-lg">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Interview Platform
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of recruitment with our conversational AI technology. 
            Natural, efficient, and available 24/7.
          </p>
        </div>

        {/* Features Grid - 3 Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Natural Conversations */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-[#5746b2]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Natural Conversations</h3>
            <p className="text-gray-600">
              Engage in human-like voice interviews powered by advanced AI that understands context and provides intelligent responses.
            </p>
          </div>

          {/* Card 2: Available 24/7 */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Available 24/7</h3>
            <p className="text-gray-600">
              Conduct interviews anytime, anywhere. No scheduling conflicts or timezone limitations for candidates.
            </p>
          </div>

          {/* Card 3: Consistent & Fair */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Consistent & Fair</h3>
            <p className="text-gray-600">
              Every candidate receives the same high-quality interview experience with unbiased, standardized evaluation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>© 2025 AI Recruiter Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
