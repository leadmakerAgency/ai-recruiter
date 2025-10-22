// src/components/AudioSetup.tsx
"use client";

import { useState, useEffect } from "react";
import { Mic, Volume2, CheckCircle, AlertCircle, Loader2, ChevronDown, Check } from "lucide-react";

interface AudioSetupProps {
  onComplete: () => void;
}

export default function AudioSetup({ onComplete }: AudioSetupProps) {
  const [audioDevices, setAudioDevices] = useState<{
    microphones: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
  }>({ microphones: [], speakers: [] });
  
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [micDropdownOpen, setMicDropdownOpen] = useState(false);
  const [speakerDropdownOpen, setSpeakerDropdownOpen] = useState(false);

  useEffect(() => {
    requestPermissionsAndLoadDevices();
  }, []);

  const requestPermissionsAndLoadDevices = async () => {
    try {
      setIsLoading(true);
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (typeof window !== 'undefined') {
        (window as any).__microphoneStream = stream;
      }
      
      setPermissionGranted(true);

      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(device => device.kind === 'audioinput');
      const speakers = devices.filter(device => device.kind === 'audiooutput');

      setAudioDevices({ microphones: mics, speakers });

      if (mics.length > 0) setSelectedMic(mics[0].deviceId);
      if (speakers.length > 0) setSelectedSpeaker(speakers[0].deviceId);

      setIsLoading(false);
    } catch (err: any) {
      console.error("Failed to get audio devices:", err);
      setError("Microphone access is required. Please enable it in your browser settings and refresh.");
      setIsLoading(false);
    }
  };

  const handleBegin = () => {
    if (permissionGranted && selectedMic) {
      sessionStorage.setItem('selectedMicrophone', selectedMic);
      sessionStorage.setItem('selectedSpeaker', selectedSpeaker);
      onComplete();
    }
  };

  const getDeviceLabel = (device: MediaDeviceInfo, index: number, type: string) => {
    return device.label || `${type} ${index + 1}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-14 h-14 text-[#5746b2] mx-auto animate-spin mb-5" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Requesting Microphone Access</h2>
          <p className="text-gray-600 text-sm">Please allow microphone permissions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-red-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-5">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Microphone Access Required</h2>
              <p className="text-gray-600 text-sm mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] hover:from-[#4a3a9f] hover:to-[#6b5dc8] text-white px-6 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f2ff] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        {/* FIXED: Removed overflow-hidden to allow dropdowns to extend outside */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
          {/* Header */}
          <div className="px-6 sm:px-8 pt-8 pb-5 border-b border-gray-200/50">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
              Configure Your Audio
            </h1>
            <p className="text-center text-gray-600 text-sm sm:text-base">
              Select your microphone and speaker for the best experience
            </p>
          </div>

          {/* Success Banner */}
          <div className="px-6 sm:px-8 pt-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 text-sm">Microphone Access Granted</h3>
                <p className="text-green-700 text-xs mt-0.5">Your audio devices are ready to use</p>
              </div>
            </div>
          </div>

          {/* Device Selection - FIXED: Added extra padding bottom for dropdowns */}
          <div className="px-6 sm:px-8 py-6 pb-8 space-y-5">
            {/* Microphone Custom Dropdown */}
            <div>
              <label className="flex items-center gap-2.5 text-base font-semibold text-gray-900 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                Microphone
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMicDropdownOpen(!micDropdownOpen)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5746b2] focus:border-transparent transition-all text-sm text-gray-900 font-medium shadow-sm hover:border-[#5746b2]/50 flex items-center justify-between"
                >
                  <span>{getDeviceLabel(audioDevices.microphones.find(d => d.deviceId === selectedMic)!, audioDevices.microphones.findIndex(d => d.deviceId === selectedMic), 'Microphone')}</span>
                  <ChevronDown className={`w-5 h-5 text-[#5746b2] transition-transform ${micDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {micDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setMicDropdownOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">
                      {audioDevices.microphones.map((device, index) => (
                        <button
                          key={device.deviceId}
                          type="button"
                          onClick={() => {
                            setSelectedMic(device.deviceId);
                            setMicDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center justify-between ${
                            selectedMic === device.deviceId
                              ? 'bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] text-white'
                              : 'text-gray-900 hover:bg-[#f3f0ff]'
                          }`}
                        >
                          <span>{getDeviceLabel(device, index, 'Microphone')}</span>
                          {selectedMic === device.deviceId && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Speaker Custom Dropdown */}
            <div>
              <label className="flex items-center gap-2.5 text-base font-semibold text-gray-900 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5746b2] to-[#8b7dd8] flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                Speaker
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSpeakerDropdownOpen(!speakerDropdownOpen)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5746b2] focus:border-transparent transition-all text-sm text-gray-900 font-medium shadow-sm hover:border-[#5746b2]/50 flex items-center justify-between"
                >
                  <span>{getDeviceLabel(audioDevices.speakers.find(d => d.deviceId === selectedSpeaker)!, audioDevices.speakers.findIndex(d => d.deviceId === selectedSpeaker), 'Speaker')}</span>
                  <ChevronDown className={`w-5 h-5 text-[#5746b2] transition-transform ${speakerDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {speakerDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setSpeakerDropdownOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">
                      {audioDevices.speakers.map((device, index) => (
                        <button
                          key={device.deviceId}
                          type="button"
                          onClick={() => {
                            setSelectedSpeaker(device.deviceId);
                            setSpeakerDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center justify-between ${
                            selectedSpeaker === device.deviceId
                              ? 'bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] text-white'
                              : 'text-gray-900 hover:bg-[#f3f0ff]'
                          }`}
                        >
                          <span>{getDeviceLabel(device, index, 'Speaker')}</span>
                          {selectedSpeaker === device.deviceId && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="px-6 sm:px-8 pb-8">
            <button
              onClick={handleBegin}
              disabled={!permissionGranted || !selectedMic}
              className="w-full bg-gradient-to-r from-[#5746b2] to-[#7b6dd8] hover:from-[#4a3a9f] hover:to-[#6b5dc8] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Let's Begin!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
