// src/components/VoiceComponent.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Phone, PhoneOff, Calendar, X } from "lucide-react";

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
  const [transcript, setTranscript] = useState("");
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
        setTranscript(text);
      } else if (message.message?.role === "user") {
        const text = message.message.content[0]?.text || "";
        setTranscript(text);
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

  const { status, startSession, endSession } = conversation || {};

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "connected") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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

  // CALENDLY POPUP VIEW - Generic messaging
  if (showCalendly && status === "connected") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl relative">
          {/* Close Button */}
          <button
            onClick={() => setShowCalendly(false)}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Success Message */}
          <div className="bg-gradient-to-r from-[#5746b2] to-[#8b7dd8] rounded-2xl p-8 text-white text-center mb-6 shadow-xl">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-3">
              {candidateName ? `Great job, ${candidateName}!` : 'Congratulations!'} 🎉
            </h2>
            <p className="text-lg text-white/90">
              You've completed your interview successfully. Schedule your next interview below to continue the process.
            </p>
          </div>

          {/* Calendly Widget */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div
              className="calendly-inline-widget"
              data-url={calendlyUrl}
              style={{ minWidth: "320px", height: "700px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // MAIN INTERVIEW VIEW - Original Design
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isAgentSpeaking
                  ? "bg-green-400 animate-pulse"
                  : status === "connected"
                  ? "bg-[#5746b2]"
                  : "bg-gray-300"
              }`}
            >
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Interview</h3>
              <p className="text-sm text-gray-500">
                {status === "connected"
                  ? "Connected"
                  : status === "connecting"
                  ? "Connecting..."
                  : "Disconnected"}
              </p>
            </div>
          </div>
          {status === "connected" && (
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(callDuration)}
              </p>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
          )}
        </div>

        {/* Transcript Box */}
        {status === "connected" && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 min-h-[100px] max-h-[200px] overflow-y-auto">
            <h4 className="text-xs font-semibold text-blue-900 mb-2">Transcript</h4>
            <p className="text-sm text-gray-700">{transcript || "Listening..."}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* Status Messages */}
        {status !== "connected" && !hasEnded && (
          <div className="text-center py-6 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">Connecting you to your interviewer</p>
          </div>
        )}

        {hasEnded && (
          <div className="text-center py-6 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <PhoneOff className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-600">Interview ended</p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="space-y-3">
          {status !== "connected" && !hasEnded && (
            <button
              onClick={handleStartCall}
              disabled={status === "connecting"}
              className="w-full bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] hover:from-[#4a3a9f] hover:to-[#6b5dc8] text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              {status === "connecting" ? "Connecting..." : "Start Interview"}
            </button>
          )}

          {status === "connected" && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleMicToggle}
                className={`px-6 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
                  isMuted
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isMuted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={handleEndCall}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <PhoneOff className="w-5 h-5" />
                End Interview
              </button>
            </div>
          )}

          {hasEnded && (
            <button
              onClick={() => {
                setHasEnded(false);
                setCallDuration(0);
                setTranscript("");
                handleStartCall();
              }}
              className="w-full bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] hover:from-[#4a3a9f] hover:to-[#6b5dc8] text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Start New Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
