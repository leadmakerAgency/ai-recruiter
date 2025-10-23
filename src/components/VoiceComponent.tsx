// src/components/VoiceComponent.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Phone, RotateCcw, Calendar } from "lucide-react";

interface VoiceProps {
  agentId: string;
  slug: string;
  onInterviewComplete?: (outcome: string, data: any) => void;
}

// Calendly URL mapping for each agent
const calendlyUrls: { [key: string]: string } = {
  tammy: process.env.NEXT_PUBLIC_TAMMY_CALENDLY_URL || '',
  sales: process.env.NEXT_PUBLIC_SALES_CALENDLY_URL || '',
};

export default function VoiceComponent({ agentId, slug, onInterviewComplete }: VoiceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string }>>([]);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [candidateName, setCandidateName] = useState("");

  const audioStreamRef = useRef<MediaStream | null>(null);

  // Get Calendly URL for this agent
  const calendlyUrl = calendlyUrls[slug] || calendlyUrls.tammy;

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to agent");
      setHasEnded(false);
      
      if (typeof window !== "undefined") {
        (window as any).microphoneStream = audioStreamRef.current;
      }
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
      setHasEnded(true);
    },
    onMessage: (message: any) => {
      console.log("Message received:", message);

      if (message.message?.role === "assistant") {
        const text = message.message.content[0]?.text || "";
        setTranscript((prev) => [...prev, { speaker: "AI", text }]);
      } else if (message.message?.role === "user") {
        const text = message.message.content[0]?.text || "";
        setTranscript((prev) => [...prev, { speaker: "You", text }]);
      }

      if (message.type === "agent_response") {
        setIsAgentSpeaking(true);
      } else if (message.type === "agent_response_done") {
        setIsAgentSpeaking(false);
      }

      if (message.type === "tool_call") {
        const { tool_name: functionName, parameters: args } = message;

        if (functionName === "showCalendly") {
          setCandidateName(args.candidateName || "");
          setShowCalendly(true);
        }
      }
    },
    onError: (error: any) => {
      console.error("Conversation error:", error);
      setErrorMessage(error.message || "An error occurred");
      setHasEnded(true);
    },
  });

  const { status, startSession, endSession, setVolume } = conversation || {};

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "connected") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const handleMicToggle = () => {
    if (audioStreamRef.current) {
      const audioTracks = audioStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleEndCall = async () => {
    if (endSession) {
      await endSession();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setHasEnded(true);
  };

  const handleStartCall = async () => {
    try {
      setErrorMessage("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      if (startSession) {
        await startSession({ agentId });
      }
    } catch (err: any) {
      console.error("Error starting call:", err);
      setErrorMessage(err.message || "Failed to start call");
    }
  };

  const handleRestart = () => {
    setHasEnded(false);
    setCallDuration(0);
    setTranscript([]);
    setShowCalendly(false);
    setCandidateName("");
    handleStartCall();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // CALENDLY POPUP VIEW
  if (showCalendly && status === "connected") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Success Message */}
          <div className="bg-gradient-to-r from-[#5746b2] to-[#8b7dd8] rounded-2xl p-8 text-white text-center mb-6 shadow-xl">
            <h2 className="text-3xl font-bold mb-3">
              {candidateName ? `Great job, ${candidateName}!` : 'Great job!'} 🎉
            </h2>
            <p className="text-lg text-white/90 mb-4">
              Congratulations on completing your interview!
            </p>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Calendar className="w-5 h-5" />
              <p className="text-base">
                Schedule your next interview below to continue the process.
              </p>
            </div>
          </div>

          {/* Calendly Widget */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div
              className="calendly-inline-widget"
              data-url={calendlyUrl}
              style={{ minWidth: "320px", height: "700px" }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowCalendly(false)}
            className="mt-6 mx-auto block px-6 py-3 bg-white text-[#5746b2] rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // MAIN INTERVIEW VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5746b2] to-[#8b7dd8] px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAgentSpeaking ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`}>
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">AI Interview</h2>
                  <p className="text-sm text-white/80">
                    {status === "connected" ? "Connected" : status === "connecting" ? "Connecting..." : "Disconnected"}
                  </p>
                </div>
              </div>
              {status === "connected" && (
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatTime(callDuration)}</p>
                  <p className="text-xs text-white/80">Duration</p>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                {errorMessage}
              </div>
            )}

            {status === "connected" && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl max-h-60 overflow-y-auto">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Transcript</h3>
                <div className="space-y-2">
                  {transcript.map((item, index) => (
                    <div key={index} className={`text-sm ${item.speaker === "You" ? "text-blue-700" : "text-gray-700"}`}>
                      <span className="font-semibold">{item.speaker}:</span> {item.text}
                    </div>
                  ))}
                  {transcript.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Listening...</p>
                  )}
                </div>
              </div>
            )}

            {status !== "connected" && !hasEnded && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to begin?</h3>
                <p className="text-gray-600 mb-6">Click the button below to start your interview.</p>
              </div>
            )}

            {hasEnded && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Ended</h3>
                <p className="text-gray-600 mb-6">The interview has been completed.</p>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-3">
              {status !== "connected" && !hasEnded && (
                <button
                  onClick={handleStartCall}
                  className="flex-1 bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] text-white px-6 py-4 rounded-xl font-semibold hover:from-[#4a3a9f] hover:to-[#6b5dc8] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Start Interview
                </button>
              )}

              {status === "connected" && (
                <>
                  <button
                    onClick={handleMicToggle}
                    className={`flex-1 ${isMuted ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-200 hover:bg-gray-300'} text-gray-900 px-6 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {isMuted ? 'Unmute' : 'Mute'}
                  </button>
                  
                  <button
                    onClick={handleEndCall}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    End Interview
                  </button>
                </>
              )}

              {hasEnded && (
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] text-white px-6 py-4 rounded-xl font-semibold hover:from-[#4a3a9f] hover:to-[#6b5dc8] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Start New Interview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
