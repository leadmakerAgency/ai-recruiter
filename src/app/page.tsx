// src/app/page.tsx
import Link from 'next/link';
import { Mic, Users, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff]">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Interview Platform
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of recruitment with our conversational AI agents. 
            Natural, efficient, and available 24/7.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-[#5746b2]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Interviews</h3>
            <p className="text-gray-600">
              Conduct natural voice conversations with AI agents trained for recruitment.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Agents</h3>
            <p className="text-gray-600">
              Choose from specialized AI agents tailored for different roles and positions.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Leverage advanced AI technology for consistent, unbiased candidate screening.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] rounded-2xl p-8 sm:p-12 shadow-xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Select an AI agent below to begin your interview experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tammy"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#5746b2] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <Mic className="w-5 h-5" />
              Interview with Tammy
            </Link>
            
            <Link 
              href="/sales"
              className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all hover:scale-[1.02]"
            >
              <Users className="w-5 h-5" />
              Interview with Sales
            </Link>
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
