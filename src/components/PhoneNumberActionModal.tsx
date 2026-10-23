import React, { useState } from 'react';
import { sounds } from '../lib/soundEffects';

interface PhoneNumberActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  contactName?: string;
  contextLabel?: string;
}

export const PhoneNumberActionModal: React.FC<PhoneNumberActionModalProps> = ({
  isOpen,
  onClose,
  phoneNumber,
  contactName,
  contextLabel = 'St. Arnold\'s Faculty Contact',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !phoneNumber) return null;

  // Clean phone number for tel: and whatsapp:
  // e.g. "+91 98250 88190" -> "919825088190"
  const digitsOnly = phoneNumber.replace(/[^0-9]/g, '');
  // If number starts without country code (e.g. 9825088190) and is 10 digits, add India 91 prefix
  const whatsappNumber =
    digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;

  const telUrl = `tel:${phoneNumber.replace(/\s+/g, '')}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello ${contactName || ''}, reaching out from St. Arnold's High School Godhra Educator Portal.`
  )}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(phoneNumber);
    sounds.playNfcTap();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCall = () => {
    sounds.playNfcTap();
    window.location.href = telUrl;
  };

  const handleWhatsApp = () => {
    sounds.playSuccessChime();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white border-t sm:border border-[#E8DEC8] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-900 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle on mobile */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF5EB] text-[#16287A] border border-[#E8DEC8] flex items-center justify-center text-lg font-bold shadow-xs">
              📞
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#16287A] leading-tight">
                Connect via Phone
              </h3>
              <p className="text-[11px] text-stone-500 font-mono">{contextLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm cursor-pointer transition"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Contact Info Card */}
        <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#E8DEC8] space-y-1 text-center">
          {contactName && (
            <p className="text-xs font-semibold text-stone-600">{contactName}</p>
          )}
          <div className="flex items-center justify-center gap-2">
            <p className="text-xl sm:text-2xl font-extrabold font-mono text-[#16287A] tracking-tight">
              {phoneNumber}
            </p>
            <button
              onClick={handleCopy}
              className="px-2 py-1 rounded-lg bg-white border border-[#D8C7AA] text-[10px] font-mono font-bold text-stone-600 hover:text-slate-900 hover:bg-stone-50 transition cursor-pointer shadow-2xs"
              title="Copy number"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
          <p className="text-[10px] text-stone-500 font-mono">
            Direct institutional telecommunication line
          </p>
        </div>

        {/* The 2 Primary Options Requested: 1. Call, 2. WhatsApp */}
        <div className="space-y-2.5 pt-1">
          <p className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider text-center">
            Choose Communication Method
          </p>

          {/* Option 1: Direct Phone Call */}
          <button
            onClick={handleCall}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#16287A] to-[#1E3A8A] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white shadow-md hover:shadow-lg transition flex items-center justify-between cursor-pointer group active:scale-98"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                📞
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wide block">
                  Option 1
                </span>
                <span className="font-bold text-sm sm:text-base leading-tight block">
                  Voice Call Direct
                </span>
                <span className="text-[11px] text-blue-200 block">
                  Open phone dialer on your device
                </span>
              </div>
            </div>
            <span className="text-lg text-amber-300 font-bold pr-1">→</span>
          </button>

          {/* Option 2: WhatsApp Chat */}
          <button
            onClick={handleWhatsApp}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:from-[#075E54] hover:to-[#128C7E] text-white shadow-md hover:shadow-lg transition flex items-center justify-between cursor-pointer group active:scale-98"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition">
                💬
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold text-emerald-100 uppercase tracking-wide block">
                  Option 2
                </span>
                <span className="font-bold text-sm sm:text-base leading-tight block">
                  Chat on WhatsApp
                </span>
                <span className="text-[11px] text-emerald-100/90 block">
                  Instant messaging & file sharing
                </span>
              </div>
            </div>
            <span className="text-lg text-emerald-100 font-bold pr-1">→</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF5EB] hover:bg-[#F2ECE0] text-xs font-bold text-stone-600 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/**
 * Reusable inline click-to-contact phone component
 * Renders the phone number with a call/whatsapp badge
 */
interface ClickablePhoneNumberProps {
  phone: string;
  name?: string;
  label?: string;
  className?: string;
}

export const ClickablePhoneNumber: React.FC<ClickablePhoneNumberProps> = ({
  phone,
  name,
  label,
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!phone) return <span className="text-stone-400">—</span>;

  return (
    <>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          sounds.playNfcTap();
          setShowModal(true);
        }}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#FAF5EB] hover:bg-[#F2ECE0] border border-[#E8DEC8] hover:border-[#16287A] text-[#16287A] font-mono font-bold text-xs transition cursor-pointer shadow-2xs group ${className}`}
        title={`Click to Call or WhatsApp ${phone}`}
      >
        <span className="text-[11px]">📞</span>
        <span className="group-hover:underline underline-offset-2">{phone}</span>
        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-200">
          💬 WA
        </span>
      </button>

      <PhoneNumberActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        phoneNumber={phone}
        contactName={name}
        contextLabel={label}
      />
    </>
  );
};
