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
    return <InterviewSetup onStartInterview={handleStartInterview} />;
  }

  // Step 2: Audio Configuration Page
  if (currentStep === "audio") {
    return <AudioSetup onComplete={handleAudioComplete} />;
  }

  // Step 3: Voice Interview Page
  if (currentStep === "interview") {
    return (
      <VoiceComponent
        agentId={agentId}
        slug={slug}
        onInterviewComplete={handleInterviewComplete}
      />
    );
  }

  // Step 4: Completion Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Interview Complete!
        </h1>
        <p className="text-gray-600">Thank you for completing the interview.</p>
      </div>
    </div>
  );
}
