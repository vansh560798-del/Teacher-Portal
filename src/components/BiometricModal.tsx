import React, { useState } from 'react';
import { sounds } from '../lib/soundEffects';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacherName: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  teacherName,
}) => {
  const [authMode, setAuthMode] = useState<'fingerprint' | 'face'>('fingerprint');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartScan = () => {
    setScanState('scanning');
    setProgress(0);
    sounds.playBiometricScan();

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanState('success');
          sounds.playSuccessChime();
          setTimeout(() => {
            onSuccess();
            onClose();
            setScanState('idle');
          }, 1200);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-2xl text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EBE5DB] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#16287A] flex items-center justify-center border border-blue-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m0 0a8.003 8.003 0 0115.357-2m1.522 5.568A14.004 14.004 0 0112 21" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#16287A]">Biometric Authentication</h3>
              <p className="text-xs text-stone-500">St. Arnold&apos;s Multi-Factor Sensor Bridge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-2xl bg-[#FAF5EB] p-1 mb-6 border border-[#E8DEC8] text-xs font-semibold">
          <button
            onClick={() => {
              setAuthMode('fingerprint');
              setScanState('idle');
            }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              authMode === 'fingerprint' ? 'bg-[#16287A] text-white shadow-sm font-bold' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            Fingerprint Sensor
          </button>
          <button
            onClick={() => {
              setAuthMode('face');
              setScanState('idle');
            }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              authMode === 'face' ? 'bg-[#16287A] text-white shadow-sm font-bold' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            Face ID 3D Mesh
          </button>
        </div>

        {/* Interactive Scanner Graphic */}
        <div className="flex flex-col items-center justify-center p-8 bg-[#FAF8F5] border border-[#E8E2D5] rounded-2xl relative overflow-hidden mb-6 shadow-inner">
          {/* Laser scanning beam */}
          {scanState === 'scanning' && (
            <div
              className="absolute inset-x-0 h-1 bg-blue-500 shadow-[0_0_12px_#3b82f6] animate-pulse transition-all duration-75"
              style={{ top: `${progress}%` }}
            />
          )}

          {authMode === 'fingerprint' ? (
            <div
              onClick={handleStartScan}
              className={`w-28 h-28 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                scanState === 'scanning'
                  ? 'border-blue-500 bg-blue-50 shadow-[0_0_24px_rgba(37,99,235,0.25)] scale-105'
                  : scanState === 'success'
                  ? 'border-emerald-500 bg-emerald-50 shadow-[0_0_24px_rgba(16,185,129,0.25)]'
                  : 'border-stone-300 bg-white hover:border-blue-500 hover:bg-blue-50/50 shadow-xs'
              }`}
            >
              <svg
                className={`w-16 h-16 transition-colors ${
                  scanState === 'scanning'
                    ? 'text-blue-600'
                    : scanState === 'success'
                    ? 'text-emerald-600'
                    : 'text-stone-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m0 0a8.003 8.003 0 0115.357-2m1.522 5.568A14.004 14.004 0 0112 21" />
              </svg>
            </div>
          ) : (
            <div
              onClick={handleStartScan}
              className={`w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative ${
                scanState === 'scanning'
                  ? 'border-blue-500 bg-blue-50 shadow-[0_0_24px_rgba(37,99,235,0.25)]'
                  : scanState === 'success'
                  ? 'border-emerald-500 bg-emerald-50 shadow-[0_0_24px_rgba(16,185,129,0.25)]'
                  : 'border-stone-300 bg-white hover:border-blue-500 hover:bg-blue-50/50 shadow-xs'
              }`}
            >
              {/* Corner target reticles */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-blue-600" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-blue-600" />
              <div className="absolute bottom-2 left-2 w-3 h-2 border-b-2 border-l-2 border-blue-600" />
              <div className="absolute bottom-2 right-2 w-3 h-2 border-b-2 border-r-2 border-blue-600" />

              <svg
                className={`w-14 h-14 ${
                  scanState === 'scanning'
                    ? 'text-blue-600'
                    : scanState === 'success'
                    ? 'text-emerald-600'
                    : 'text-stone-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          {/* Status Label */}
          <div className="mt-4 text-center">
            <p className="text-sm font-bold text-slate-900">
              {scanState === 'idle' && (authMode === 'fingerprint' ? 'Touch Sensor to Authenticate' : 'Look at Camera to Scan Face')}
              {scanState === 'scanning' && `Scanning ${authMode === 'fingerprint' ? 'Dermal Ridge Pattern' : 'Facial Contour Geometry'}... (${progress}%)`}
              {scanState === 'success' && '✓ Biometric Match Confirmed! (99.8%)'}
            </p>
            <p className="text-xs text-stone-500 mt-1 font-mono">
              Teacher: {teacherName}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#E2DCD0] bg-[#FAF8F5] hover:bg-[#F2ECE0] text-stone-700 text-sm font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStartScan}
            disabled={scanState === 'scanning'}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-md cursor-pointer disabled:opacity-50"
          >
            {scanState === 'scanning' ? 'Scanning...' : 'Simulate Scan'}
          </button>
        </div>
      </div>
    </div>
  );
};
