import React, { useEffect, useState } from 'react';
import { SCHOOL_INFO } from '../lib/schoolAssets';
import { sounds } from '../lib/soundEffects';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "Initializing St. Arnold's Digital Educator Portal...",
    "Syncing Godhra Campus Security Gateway & Readers...",
    "Verifying Encrypted 13.56 MHz NFC Smart ID Credentials...",
    "Loading Student Cohort Records & Grade Analytics...",
    "Welcome to St. Arnold's High School, Godhra",
  ];

  useEffect(() => {
    try {
      sounds.playNfcTap();
    } catch {
      // Audio autoplay policy fallback
    }

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          try {
            sounds.playSuccessChime();
          } catch {
            // Ignore
          }
          setTimeout(onFinish, 400);
          return 100;
        }
        const next = prev + 5;
        if (next === 25) setStatusIndex(1);
        if (next === 50) setStatusIndex(2);
        if (next === 75) setStatusIndex(3);
        if (next >= 95) setStatusIndex(4);
        return next;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#FAF5EB] via-[#F4EADC] to-[#EDE0CB] text-slate-900 overflow-hidden font-sans select-none">
      {/* Background Architectural Watermark / Atmosphere */}
      <div
        className="absolute inset-0 opacity-12 bg-cover bg-center mix-blend-multiply pointer-events-none scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${SCHOOL_INFO.campusPhoto})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF5EB]/90 via-[#FAF5EB]/70 to-[#FAF5EB]/95 pointer-events-none" />

      {/* Decorative Golden Rays in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-300/20 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 pt-4 flex items-center gap-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest bg-white/80 border border-[#DFCBB0] text-[#16287A] shadow-xs backdrop-blur-sm">
          GOVERNMENT RECOGNIZED • GUJARAT BOARD
        </span>
      </div>

      {/* Central Emblem & Institutional Branding */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg my-auto space-y-6">
        {/* Glowing Logo Crest */}
        <div className="relative group">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#CFA442] via-[#16287A] to-[#B91C1C] opacity-35 blur-xl animate-pulse" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-[#CFA442] via-[#FAF5EB] to-[#16287A] shadow-2xl shadow-blue-950/20">
            <img
              src={SCHOOL_INFO.logoEmblem}
              alt="St. Arnold's High School Godhra Logo"
              className="w-full h-full object-contain rounded-full bg-white shadow-inner"
            />
          </div>
        </div>

        {/* School Name & Titles */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#16287A] drop-shadow-xs">
            ST. ARNOLD&apos;S HIGH SCHOOL
          </h1>
          <p className="text-sm sm:text-base font-bold text-[#991B1B] uppercase tracking-wider font-mono">
            GODHRA, GUJARAT
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-stone-600 font-medium pt-1">
            <span className="text-[#CFA442] font-serif font-bold italic text-sm">
              &quot;{SCHOOL_INFO.sanskritMotto}&quot;
            </span>
            <span>•</span>
            <span>Light to Enlighten</span>
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Digital Educator Operating System & Smart Campus Portal
          </p>
        </div>

        {/* Loading Progress Bar & Status Text */}
        <div className="w-full max-w-md pt-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#16287A] font-bold truncate max-w-[300px]">
              {statusMessages[statusIndex]}
            </span>
            <span className="text-[#991B1B] font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-white/80 border border-[#D8C7AA] rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#16287A] via-[#2563EB] to-[#CFA442] rounded-full transition-all duration-150 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Info & Skip Button */}
      <div className="relative z-10 w-full max-w-lg flex items-center justify-between text-xs text-stone-500 font-mono pb-2">
        <span>AirNix v2.6 • St. Arnold&apos;s Godhra</span>
        <button
          onClick={onFinish}
          className="px-4 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#16287A] border border-[#DFCBB0] font-semibold transition cursor-pointer shadow-xs backdrop-blur-sm hover:scale-105 active:scale-95"
        >
          Skip to Portal →
        </button>
      </div>
    </div>
  );
};
