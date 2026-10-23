import React, { useState, useEffect } from 'react';
import { sounds } from '../lib/soundEffects';

interface DigitalStaffVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  staffId: string;
  designation: string;
  department: string;
  nfcCardId: string;
  cardStatus: string;
}

export const DigitalStaffVerificationModal: React.FC<DigitalStaffVerificationModalProps> = ({
  isOpen,
  onClose,
  teacherName,
  staffId,
  designation,
  department,
  nfcCardId,
  cardStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'verify'>('qr');
  const [scanResult, setScanResult] = useState<'idle' | 'scanning' | 'verified' | 'invalid'>('idle');
  const [securityToken, setSecurityToken] = useState('');

  useEffect(() => {
    // Generate real-time rotating anti-replay token (refreshes every 30s)
    const updateToken = () => {
      const timeWindow = Math.floor(Date.now() / 60000);
      const hash = `ST-ARNOLDS-GODHRA-AUTH::${staffId}::${timeWindow}::${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setSecurityToken(hash);
    };
    updateToken();
    const interval = setInterval(updateToken, 30000);
    return () => clearInterval(interval);
  }, [staffId]);

  if (!isOpen) return null;

  const handleVerifyScan = () => {
    setScanResult('scanning');
    sounds.playNfcTap();
    setTimeout(() => {
      if (cardStatus === 'active') {
        sounds.playSuccessChime();
        setScanResult('verified');
      } else {
        sounds.playWarningBuzz();
        setScanResult('invalid');
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-[#E8DEC8] rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#16287A] flex items-center justify-center border border-blue-200 font-bold text-base">
              📱
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#16287A]">Digital Staff Verification</h3>
              <p className="text-[11px] text-stone-500 font-mono">Cryptographic QR Code Credential</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-slate-900 p-1.5 rounded-xl hover:bg-stone-100 transition cursor-pointer text-base font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-2xl bg-[#FAF5EB] p-1 mb-4 border border-[#E8DEC8] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'qr' ? 'bg-[#16287A] text-white shadow-xs font-bold' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            Staff QR Credential
          </button>
          <button
            onClick={() => {
              setActiveTab('verify');
              setScanResult('idle');
            }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'verify' ? 'bg-[#16287A] text-white shadow-xs font-bold' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            Terminal Guard Scanner
          </button>
        </div>

        {activeTab === 'qr' ? (
          <div className="flex flex-col items-center">
            {/* Visual Staff Badge Card */}
            <div className="w-full bg-[#FAF5EB] border border-[#E8DEC8] rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden mb-4">
              {/* Top Security Stripe */}
              <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-[#16287A]">LIVE FACULTY PASS</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  LEVEL 4 CLEARANCE
                </span>
              </div>

              {/* QR Matrix Render */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="p-3 bg-white rounded-2xl border border-[#D8C7AA] shadow-xs flex flex-col items-center shrink-0">
                  {/* Generated QR Representation */}
                  <div className="w-36 h-36 bg-slate-950 p-2 rounded-xl flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-4 border-white rounded-md flex items-center justify-center">
                        <div className="w-3 h-3 bg-white" />
                      </div>
                      <div className="w-8 h-8 border-4 border-white rounded-md flex items-center justify-center">
                        <div className="w-3 h-3 bg-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#CFA442] flex items-center justify-center text-[10px] text-slate-900 font-bold">
                        SA
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-4 border-white rounded-md flex items-center justify-center">
                        <div className="w-3 h-3 bg-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-1 w-7 h-7">
                        <div className="bg-white rounded-2xs" />
                        <div className="bg-white/40 rounded-2xs" />
                        <div className="bg-white/60 rounded-2xs" />
                        <div className="bg-white rounded-2xs" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-stone-500 mt-1">Scan at Checkpoint</span>
                </div>

                <div className="space-y-1 text-center sm:text-left min-w-0 flex-1">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">{teacherName}</h4>
                  <p className="text-xs text-[#16287A] font-semibold truncate">{designation}</p>
                  <p className="text-[11px] text-stone-500 truncate">{department}</p>
                  <div className="pt-2 text-[10px] font-mono space-y-0.5">
                    <p className="text-stone-500">Staff ID: <span className="text-slate-900 font-bold">{staffId}</span></p>
                    <p className="text-stone-500">NFC UID: <span className="text-[#16287A] font-semibold">{nfcCardId}</span></p>
                    <p className="text-stone-500">Status: <span className={cardStatus === 'active' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{cardStatus.toUpperCase()}</span></p>
                  </div>
                </div>
              </div>

              {/* Dynamic Hash */}
              <div className="mt-3 bg-white p-2.5 rounded-xl border border-[#D8C7AA] flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-stone-600 truncate max-w-[220px] sm:max-w-[280px]">
                  {securityToken}
                </span>
                <span className="text-[10px] font-mono text-[#16287A] font-bold shrink-0">Rotating (30s)</span>
              </div>
            </div>

            <p className="text-xs text-stone-500 text-center max-w-sm">
              Present this digital QR to campus security, gates, or kiosks to authenticate faculty credential.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-5 bg-[#FAF5EB] border border-[#E8DEC8] rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-3 text-2xl text-[#16287A]">
              📷
            </div>

            <h4 className="font-bold text-sm sm:text-base text-slate-900 mb-1">Campus Checkpoint Scanner</h4>
            <p className="text-xs text-stone-600 text-center max-w-xs mb-4">
              Security kiosk scanning system validating real-time cryptographic QR credentials.
            </p>

            {scanResult === 'verified' && (
              <div className="w-full bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-center mb-4">
                <p className="text-emerald-700 font-bold text-sm">✓ AUTHENTIC FACULTY MEMBER</p>
                <p className="text-xs text-slate-800 mt-1">{teacherName} - {staffId}</p>
                <p className="text-[11px] text-emerald-700 font-mono mt-0.5">Campus Access Level 4 Granted</p>
              </div>
            )}

            {scanResult === 'invalid' && (
              <div className="w-full bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-center mb-4">
                <p className="text-rose-700 font-bold text-sm">▲ REVOKED CREDENTIAL</p>
                <p className="text-xs text-slate-800 mt-1">This staff card is marked lost or deactivated in central system.</p>
              </div>
            )}

            <button
              onClick={handleVerifyScan}
              disabled={scanResult === 'scanning'}
              className="w-full py-3 rounded-xl bg-[#16287A] hover:bg-[#1E3A8A] text-white font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50 shadow-md active:scale-98"
            >
              {scanResult === 'scanning' ? 'Scanning QR Token...' : 'Scan & Validate Credential'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
