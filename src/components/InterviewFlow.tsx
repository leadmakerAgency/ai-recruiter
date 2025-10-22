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
    return <InterviewSetup slug={slug} onStartInterview={handleStartInterview} />;
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {interviewResult?.outcome === "pass" ? (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Congratulations! You've completed your interview with Tammy.
            </h2>
            <p className="mb-6 text-gray-700">
              Your responses have been recorded. The next step is to meet with CEO Stephen Jackson.
            </p>
            <h3 className="text-xl font-semibold mb-4">Book Your Meeting with Stephen</h3>
            
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/your-link"
              style={{ minWidth: "320px", height: "630px" }}
            />
            <script
              type="text/javascript"
              src="https://assets.calendly.com/assets/external/widget.js"
              async
            />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank you for completing the interview.
            </h2>
            <p className="text-gray-700">
              We appreciate your time and will review your responses. We'll be in touch soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
