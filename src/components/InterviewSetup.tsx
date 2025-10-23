// src/components/InterviewSetup.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Mic, Clock, CheckCircle } from "lucide-react";

export default function InterviewSetup() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Extract slug from URL: /tammy, /edson, /griffin
  const slug = pathname.split('/').filter(Boolean)[0];

  const handleStartInterview = () => {
    // Navigate to the interview page for this agent
    router.push(`/${slug}/interview`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 pt-8 pb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
              Ready to Begin Your Interview?
            </h1>
            <p className="text-center text-gray-600 text-sm sm:text-base">
              Complete your voice interview with our AI recruiter
            </p>
          </div>

          {/* Voice Interview Card */}
          <div className="px-6 sm:px-8 pb-5">
            <div className="bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] rounded-xl p-6 text-white shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Voice Interview</h3>
                      <p className="text-white/80 text-sm">AI-Powered</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">10-15 min</span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <h4 className="font-semibold text-base">What to Expect</h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    You'll have a natural conversation with our AI recruitment assistant. They'll ask about 
                    your background, career goals, and what motivates you. Just be yourself and speak naturally.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90 text-sm">Find a quiet space with minimal background noise</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90 text-sm">Ensure your microphone is working properly</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90 text-sm">Have a stable internet connection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Button */}
          <div className="px-6 sm:px-8 pb-8">
            <p className="text-xs sm:text-sm text-center text-gray-600 mb-5 leading-relaxed">
              By clicking "Start Interview", I agree to the{" "}
              <a href="/terms" target="_blank" className="text-[#5746b2] hover:text-[#4a3a9f] font-medium underline">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="text-[#5746b2] hover:text-[#4a3a9f] font-medium underline">
                Privacy Policy
              </a>
            </p>

            <button
              onClick={handleStartInterview}
              className="w-full bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] hover:from-[#4a3a9f] hover:to-[#6b5dc8] text-white px-6 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
