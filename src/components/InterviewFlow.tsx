// src/components/InterviewFlow.tsx
"use client";

import { useState } from "react";
import InterviewSetup from "@/components/InterviewSetup";
import AudioSetup from "@/components/AudioSetup";
import VoiceComponent from "@/components/VoiceComponent";

interface InterviewFlowProps {
  slug: string;
  agentId: string;
}

type FlowStep = "setup" | "audio" | "interview" | "complete";

export default function InterviewFlow({ slug, agentId }: InterviewFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("setup");
  const [interviewResult, setInterviewResult] = useState<any>(null);

  const handleStartInterview = () => {
    setCurrentStep("audio");
  };

  const handleAudioComplete = () => {
    setCurrentStep("interview");
  };

  const handleInterviewComplete = (outcome: string, data: any) => {
    setInterviewResult({ outcome, ...data });
    setCurrentStep("complete");
  };

  // Step 1: Interview Setup Page
  if (currentStep === "setup") {
    return <InterviewSetup />;
  }

  // Step 2: Audio Configuration Page
  if (currentStep === "audio") {
    return <AudioSetup onComplete={handleAudioComplete} />;
  }

  // Step 3: Voice Interview Page
  if (currentStep === "interview") {
    return <VoiceComponent agentId={agentId} onInterviewComplete={handleInterviewComplete} />;
  }


  // Step 4: Complete/Results Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 text-center">
        {interviewResult?.outcome === "pass" ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Congratulations! You've completed your interview with Tammy.
            </h1>
            <p className="text-gray-600 mb-6">
              Your responses have been recorded. The next step is to meet with CEO Stephen Jackson.
            </p>
            <a
              href="https://calendly.com/stephen-jackson"
              className="inline-block bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] hover:from-[#4a3a9f] hover:to-[#6b5dc8] text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Book Your Meeting with Stephen
            </a>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank you for completing the interview.
            </h1>
            <p className="text-gray-600">
              We appreciate your time and will review your responses. We'll be in touch soon!
            </p>
          </>
        )}
      </div>
    </div>
  );
}
