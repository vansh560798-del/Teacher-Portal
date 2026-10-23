import React, { useState } from 'react';
import { sounds } from '../lib/soundEffects';
import { SCHOOL_INFO } from '../lib/schoolAssets';
import { ClickablePhoneNumber } from './PhoneNumberActionModal';

interface DigitalNfcCardProps {
  teacherName: string;
  staffId: string;
  department: string;
  cardStatus: 'active' | 'suspended' | 'lost' | 'deactivated';
  nfcCardId: string;
  onNfcScanned?: () => void;
  onOpenLostCard?: () => void;
}

export const DigitalNfcCard: React.FC<DigitalNfcCardProps> = ({
  teacherName,
  staffId,
  department,
  cardStatus,
  nfcCardId,
  onNfcScanned,
  onOpenLostCard,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tapStatus, setTapStatus] = useState<'idle' | 'tapping' | 'success' | 'blocked'>('idle');

  const isActive = cardStatus === 'active';

  const handleTapToScan = () => {
    if (tapStatus === 'tapping') return;

    sounds.playNfcTap();
    setTapStatus('tapping');

    setTimeout(() => {
      if (isActive) {
        sounds.playSuccessChime();
        setTapStatus('success');
        if (onNfcScanned) onNfcScanned();
      } else {
        sounds.playWarningBuzz();
        setTapStatus('blocked');
      }

      setTimeout(() => {
        setTapStatus('idle');
      }, 3000);
    }, 700);
  };

  return (
    <div className="w-full bg-white border border-[#E8DEC8] rounded-3xl p-3.5 sm:p-6 shadow-md space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Top Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DEC8] pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#CFA442] to-[#16287A] shrink-0 shadow-sm">
            <img
              src={SCHOOL_INFO.logoEmblem}
              alt="Logo"
              className="w-full h-full object-contain rounded-full bg-white"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#16287A] tracking-tight leading-tight">
              St. Arnold&apos;s Digital NFC Smart ID
            </h3>
            <p className="text-[10px] sm:text-xs text-stone-500 font-mono">
              Godhra Campus Active Faculty Credential
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => {
              sounds.playNfcTap();
              setIsFlipped(!isFlipped);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#FAF5EB] hover:bg-[#F2ECE0] text-stone-700 border border-[#E8DEC8] text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>🔄</span>
            <span>{isFlipped ? 'Front' : 'Flip'}</span>
          </button>

          {onOpenLostCard && (
            <button
              onClick={onOpenLostCard}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs ${
                isActive
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}
            >
              <span>{isActive ? '🔒 Lock Card' : '🔓 Unlock'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Responsive Digital Card Surface */}
      <div className="relative mx-auto w-full max-w-xl perspective-1000">
        <div
          className={`relative w-full aspect-[1.62/1] min-h-[205px] sm:min-h-[250px] rounded-2xl sm:rounded-3xl transition-transform duration-500 transform-style-preserve-3d shadow-xl border ${
            isActive ? 'border-[#CFA442]/50 shadow-blue-950/20' : 'border-rose-400 shadow-rose-900/20'
          } ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* FRONT SIDE: Royal Blue, Gold Rim, St. Arnold's Godhra Emblem */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 flex flex-col justify-between backface-hidden overflow-hidden ${
              isActive
                ? 'bg-gradient-to-br from-[#0C1748] via-[#16287A] to-[#1E3A8A] text-white'
                : 'bg-gradient-to-br from-[#3b0d18] via-[#881337] to-[#9f1239] text-white'
            }`}
          >
            {/* Guilloche / Micro-security Pattern Background Overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#cfa442_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Gold Holographic Security Shimmer Strip */}
            <div className="absolute top-0 right-12 sm:right-16 w-10 sm:w-14 h-full opacity-30 pointer-events-none bg-gradient-to-b from-[#CFA442] via-amber-200 to-rose-300 mix-blend-color-dodge blur-[1px]" />

            {/* Card Header */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#CFA442] to-white shrink-0 shadow-md">
                  <img
                    src={SCHOOL_INFO.logoEmblem}
                    alt="Logo"
                    className="w-full h-full object-contain rounded-full bg-white"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-[11px] sm:text-sm tracking-wider text-amber-200 uppercase leading-tight">
                    ST. ARNOLD&apos;S HIGH SCHOOL
                  </h4>
                  <p className="text-[9px] sm:text-[10px] font-mono text-blue-200">GODHRA • FACULTY CREDENTIAL</p>
                </div>
              </div>

              {/* NFC Wireless Wave Icon */}
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 18c0-3.314-2.686-6-6-6M12 14c0-1.105-.895-2-2-2M12 22c0-5.523-4.477-10-10-10" />
                </svg>
                <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold ${
                  isActive ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40' : 'bg-rose-500/30 text-rose-200 border border-rose-400/50'
                }`}>
                  {isActive ? 'ACTIVE' : 'LOCKED'}
                </span>
              </div>
            </div>

            {/* Middle Section: EMV Microchip & Teacher Info */}
            <div className="relative z-10 flex items-center gap-3 sm:gap-5 my-1 sm:my-2">
              {/* EMV Microchip Graphic */}
              <div className="w-10 h-8 sm:w-13 sm:h-10 rounded-md sm:rounded-lg bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 p-0.5 sm:p-1 shadow-md border border-amber-100 flex flex-col justify-between shrink-0">
                <div className="h-1.5 sm:h-2 border-b border-amber-800/60 flex justify-between">
                  <div className="w-2 sm:w-2.5 h-full border-r border-amber-800/60" />
                  <div className="w-2 sm:w-2.5 h-full border-l border-amber-800/60" />
                </div>
                <div className="h-1.5 sm:h-2 border-y border-amber-800/60" />
                <div className="h-1.5 sm:h-2 border-t border-amber-800/60 flex justify-between">
                  <div className="w-2 sm:w-2.5 h-full border-r border-amber-800/60" />
                  <div className="w-2 sm:w-2.5 h-full border-l border-amber-800/60" />
                </div>
              </div>

              {/* Faculty Info */}
              <div className="space-y-0.5 min-w-0 flex-1">
                <h5 className="font-extrabold text-sm sm:text-lg text-white truncate">
                  {teacherName}
                </h5>
                <p className="text-[11px] sm:text-xs text-blue-100 font-medium truncate">
                  {department.replace("St. Arnold's High School, Godhra", 'General').replace('Department of ', '')}
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono text-amber-200 font-semibold truncate">
                  ID: {staffId} • LEVEL 4 CLEARANCE
                </p>
              </div>
            </div>

            {/* Card Footer: NFC Cryptographic UID & Barcode */}
            <div className="relative z-10 flex items-end justify-between pt-1.5 border-t border-white/20 text-[9px] sm:text-[10px] font-mono text-blue-200">
              <div>
                <p className="text-[8px] sm:text-[9px] text-amber-300/90 font-bold">ENCRYPTED NFC TOKEN</p>
                <p className="text-white font-bold truncate max-w-[150px] sm:max-w-none">{nfcCardId}</p>
              </div>
              <div className="text-right">
                <div className="flex gap-0.5 justify-end mb-0.5 opacity-90">
                  <span className="w-0.5 h-3 sm:h-4 bg-white" />
                  <span className="w-1.5 h-3 sm:h-4 bg-white" />
                  <span className="w-0.5 h-3 sm:h-4 bg-white" />
                  <span className="w-1 h-3 sm:h-4 bg-white" />
                  <span className="w-1.5 h-3 sm:h-4 bg-white" />
                </div>
                <p className="text-[8px] sm:text-[9px] text-blue-300">ISO/IEC 14443-A</p>
              </div>
            </div>
          </div>

          {/* BACK SIDE: Warm Beige & Navy Track */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 flex flex-col justify-between backface-hidden rotate-y-180 bg-[#FAF5EB] text-slate-800 border border-[#E8DEC8] overflow-hidden"
          >
            {/* Magnetic Stripe (Dark Navy) */}
            <div className="-mx-3.5 sm:-mx-6 -mt-1 h-9 sm:h-11 bg-[#0C1748] border-y border-slate-800 flex items-center px-4 sm:px-6">
              <span className="text-[9px] sm:text-[10px] font-mono text-amber-300 tracking-wider uppercase truncate">
                ST. ARNOLD&apos;S GODHRA • SECURE TRACK
              </span>
            </div>

            {/* Signature Panel */}
            <div className="my-1.5 sm:my-2 bg-[#F1ECE1] rounded-lg p-2 sm:p-2.5 flex items-center justify-between text-slate-800 border border-[#DFD8CB]">
              <span className="font-serif italic text-xs sm:text-sm font-bold text-[#16287A] truncate">{teacherName}</span>
              <span className="font-mono text-[10px] sm:text-xs font-bold text-stone-500 shrink-0">PIN: 8842</span>
            </div>

            {/* Terms and Clickable Hotline (Call & WhatsApp) */}
            <div className="space-y-1 text-[9px] sm:text-[10px] text-stone-600">
              <p className="line-clamp-1">Official faculty identification card. St. Arnold&apos;s High School property.</p>
              <div className="flex flex-wrap items-center gap-1">
                <span>Security Dispatch:</span>
                <ClickablePhoneNumber
                  phone="+91 98250 88190"
                  name="Campus Security"
                  label="Gate Hotline"
                  className="py-0 px-1 text-[9px]"
                />
              </div>
            </div>

            {/* Hologram Foil Seal */}
            <div className="flex items-center justify-between pt-1.5 border-t border-[#E8DEC8] text-[9px] sm:text-[10px] font-mono">
              <span className="text-stone-500 font-semibold truncate">FACULTY: {staffId}</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-semibold text-[9px]">
                <span>🛡️</span>
                <span>GODHRA VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Station Terminal / Tap-to-Scan Dock */}
      <div className="bg-[#FAF5EB] border border-[#E8DEC8] rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Indicator Icon */}
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 transition-all ${
              tapStatus === 'success'
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-xs'
                : tapStatus === 'blocked'
                ? 'bg-rose-100 text-rose-700 border border-rose-300 shadow-xs'
                : tapStatus === 'tapping'
                ? 'bg-amber-100 text-amber-700 border border-amber-300 animate-pulse'
                : 'bg-blue-100 text-[#16287A] border border-blue-200 shadow-xs'
            }`}
          >
            {tapStatus === 'success' ? '✓' : tapStatus === 'blocked' ? '✕' : tapStatus === 'tapping' ? '⚡' : '📱'}
          </div>

          <div className="min-w-0">
            <p className="font-bold text-xs sm:text-sm text-[#16287A] truncate">
              {tapStatus === 'success'
                ? 'Access Granted • St. Arnold\'s Terminal'
                : tapStatus === 'blocked'
                ? 'Access Denied • Badge Revoked'
                : tapStatus === 'tapping'
                ? 'Reading St. Arnold\'s NFC Token...'
                : 'Godhra Classroom Kiosk Ready'}
            </p>
            <p className="text-[10px] sm:text-xs text-stone-600 font-mono truncate">
              {tapStatus === 'success'
                ? 'Attendance clock-in verified across campus server'
                : tapStatus === 'blocked'
                ? 'Security alert dispatched to Central Admin Hub'
                : 'Hold badge near NFC reader station or tap to clock in'}
            </p>
          </div>
        </div>

        {/* Primary Interactive Tap Trigger Button */}
        <button
          onClick={handleTapToScan}
          disabled={tapStatus === 'tapping'}
          className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 shrink-0 ${
            tapStatus === 'success'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : tapStatus === 'blocked'
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-[#16287A] hover:bg-[#1E3A8A] text-white'
          }`}
        >
          <span>⚡</span>
          <span>{tapStatus === 'tapping' ? 'Scanning...' : 'Tap Card to Reader'}</span>
        </button>
      </div>
    </div>
  );
};
