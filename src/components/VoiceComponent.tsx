"use client";

import React, { useEffect, useState, useRef } from "react";
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Phone, RotateCcw, Calendar } from "lucide-react";

interface VoiceProps {
  agentId: string;
  slug: string; // pass the route slug so we can pick the right Calendly link
  onInterviewComplete?: (outcome: string, data: any) => void;
}

// Per‑agent Calendly links via env vars
const calendlyUrls: { [key: string]: string } = {
  tammy: process.env.NEXT_PUBLIC_TAMMY_CALENDLY_URL || "",
  sales: process.env.NEXT_PUBLIC_SALES_CALENDLY_URL || "",
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

  const calendlyUrl = calendlyUrls[slug] || "";

  const conversation = useConversation({
    agentId,
    clientTools: {
      // Must be a function — no extra keys
      showCalendly: async (args: any) => {
        setCandidateName(args?.candidateName || "");
        setShowCalendly(true);
        // returning void is fine; no need to return a value
      },
    },

    onConnect: () => {
      setHasEnded(false);
      if (typeof window !== "undefined" && (window as any).__microphoneStream) {
        audioStreamRef.current = (window as any).__microphoneStream;
      }
    },

    onDisconnect: () => {
      setHasEnded(true);
      if (typeof window !== "undefined" && (window as any).__microphoneStream) {
        const stream = (window as any).__microphoneStream as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        delete (window as any).__microphoneStream;
      }
      audioStreamRef.current = null;
    },

    onMessage: (message: any) => {
      // Keep your transcript/voice animation behavior
      if (message?.type === "agent_response" || message?.source === "ai") {
        const text = message.message || message.text || message.content || "";
        if (text) {
          setTranscript(text);
          setIsAgentSpeaking(true);
        }
      } else if (message?.type === "user_transcript" || message?.source === "user") {
        const text = message.message || message.text || message.content || "";
        if (text) {
          setTranscript(`You: ${text}`);
          setIsAgentSpeaking(false);
        }
      } else if (!message?.type && !message?.source) {
        const text = message?.message || message?.text || message?.content || "";
        if (text) setTranscript(text);
      }
      // No need to manually handle "tool_call" here now that clientTools is defined
    },

    onError: (error: string | Error) => {
      const msg = typeof error === "string" ? error : error.message;
      setErrorMessage(msg);
    },
  });

  const { status, isSpeaking, startSession, endSession } = conversation as any;

  useEffect(() => {
    const startConversation = async () => {
      try {
        await new Promise((r) => setTimeout(r, 800));
        setErrorMessage("");
        setHasEnded(false);
        await startSession?.();
      } catch (e) {
        setErrorMessage("Failed to connect. Please refresh and try again.");
      }
    };
    startConversation();
  }, [startSession]);

  useEffect(() => {
    if (isSpeaking) {
      setIsAgentSpeaking(true);
    } else {
      const t = setTimeout(() => setIsAgentSpeaking(false), 1000);
      return () => clearTimeout(t);
    }
  }, [isSpeaking]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (status === "connected") {
      interval = setInterval(() => setCallDuration((p) => p + 1), 1000);
    }
    return () => interval && clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (showCalendly && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        try {
          document.body.removeChild(script);
        } catch {}
      };
    }
  }, [showCalendly]);

  useEffect(() => {
    const applyMute = () => {
      if (typeof window !== "undefined" && (window as any).__microphoneStream) {
        const stream = (window as any).__microphoneStream as MediaStream;
        stream.getAudioTracks().forEach((t) => (t.enabled = !isMuted));
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !isMuted));
      }
    };
    if (status === "connected") applyMute();
  }, [isMuted, status]);

  const formatDuration = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleEndConversation = async () => {
    try {
      await endSession?.();
      setHasEnded(true);
    } catch (e) {
      // no-op
    }
  };

  const toggleMute = () => setIsMuted((v) => !v);

  const handleTalkAgain = async () => {
    try {
      setHasEnded(false);
      setCallDuration(0);
      setTranscript("");
      setShowCalendly(false);
      setCandidateName("");
      setErrorMessage("");
      setIsMuted(false);
      await startSession?.();
    } catch {
      setErrorMessage("Failed to restart");
    }
  };

  // Calendly popup (generic copy + dynamic URL)
  if (showCalendly && status === "connected") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Congratulations! 🎉</h2>
                    <p className="text-white/90 text-sm">You’ve completed your interview successfully</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCalendly(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              <div
                className="calendly-inline-widget rounded-xl overflow-hidden"
                data-url={calendlyUrl}
                style={{ minWidth: "320px", height: "700px" }}
              />
            </div>
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Schedule your next interview below to continue the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // The rest of your original UI (unchanged) …

  if (hasEnded && status === "disconnected") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-5">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Ended</h2>
              <p className="text-gray-600 text-base mb-6">Duration: {formatDuration(callDuration)}</p>
              <button
                onClick={handleTalkAgain}
                className="w-full bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] hover:from-[#4a3a9f] hover:to-[#6b5dc8] text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base"
              >
                <RotateCcw className="w-5 h-5" />
                Talk Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-red-200 p-8">
            <div className="text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
              <p className="text-gray-600 text-sm mb-6">{errorMessage}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] hover:from-[#4a3a9f] hover:to-[#6b5dc8] text-white px-6 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "disconnected" && !hasEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] shadow-xl flex items-center justify-center animate-pulse mb-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting...</h2>
          <p className="text-gray-600 text-sm">Connecting you to your interviewer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex flex-col px-4 py-6">
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
              </div>
              <span className="text-sm font-semibold text-gray-700">Live Interview</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5746b2]/10 to-[#8b7dd8]/10 rounded-full">
              <svg className="w-4 h-4 text-[#5746b2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-bold text-gray-900">
                {String(Math.floor(callDuration / 60)).padStart(2, "0")}:
                {String(callDuration % 60).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 ${
              isSpeaking ? "bg-gradient-to-r from-[#5746b2] to-[#8b7dd8] opacity-20 scale-150 blur-2xl" : "opacity-0 scale-100"
            }`}
          ></div>
          {isSpeaking && (
            <>
              <div
                className="absolute -inset-8 rounded-full border-2 border-[#5746b2]/30 animate-ping"
                style={{ animationDuration: "2s" }}
              ></div>
              <div
                className="absolute -inset-10 rounded-full border-2 border-[#5746b2]/20 animate-ping"
                style={{ animationDuration: "2.5s", animationDelay: "0.3s" }}
              ></div>
            </>
          )}
          <div
            className={`relative w-52 h-52 rounded-full bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] shadow-2xl transition-all duration-500 ${
              isSpeaking ? "scale-105" : "scale-100"
            }`}
          >
            <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"></div>
            <div className="absolute inset-0 flex items-center justify-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full bg-white transition-all duration-300 ${isSpeaking ? "animate-pulse" : ""}`}
                  style={{
                    height: isSpeaking ? `${30 + Math.random() * 40}px` : "20px",
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "0.6s",
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto mb-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl px-6 py-5 shadow-xl border border-white/60 min-h-[80px] flex items-center justify-center">
          <p className="text-gray-800 text-center text-base leading-relaxed font-medium">
            {transcript || "Listening..."}
          </p>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto flex items-center justify-center gap-3">
        <button
          onClick={() => setIsMuted((v) => !v)}
          className={`px-8 py-4 rounded-xl flex items-center gap-3 font-medium text-sm transition-all ${
            isMuted ? "bg-gray-400 hover:bg-gray-500 text-white" : "bg-[#e8e4f3] hover:bg-[#ddd6ec] text-gray-700"
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button
          onClick={handleEndConversation}
          className="px-8 py-4 rounded-xl bg-[#f8e8e8] hover:bg-[#f5d9d9] text-gray-700 flex items-center gap-3 font-medium text-sm transition-all"
        >
          <div className="w-4 h-4 bg-[#e85656] rounded-sm"></div>
          End call
        </button>
      </div>
    </div>
  );
}
