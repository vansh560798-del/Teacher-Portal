import React, { useState } from 'react';
import { sounds } from '../lib/soundEffects';

interface LostCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardStatus: 'active' | 'suspended' | 'lost' | 'deactivated';
  nfcCardId: string;
  staffId: string;
  teacherName: string;
  onToggleCardStatus: (newStatus: 'active' | 'lost' | 'deactivated') => void;
}

export const LostCardModal: React.FC<LostCardModalProps> = ({
  isOpen,
  onClose,
  cardStatus,
  nfcCardId,
  staffId,
  teacherName,
  onToggleCardStatus,
}) => {
  const [reason, setReason] = useState('Misplaced on campus');
  const [requestReplacement, setRequestReplacement] = useState(true);
  const [actionDone, setActionDone] = useState(false);

  if (!isOpen) return null;

  const isLocked = cardStatus === 'lost' || cardStatus === 'deactivated';

  const handleDeactivate = () => {
    sounds.playWarningBuzz();
    onToggleCardStatus('lost');
    setActionDone(true);
    setTimeout(() => {
      setActionDone(false);
      onClose();
    }, 1500);
  };

  const handleReactivate = () => {
    sounds.playSuccessChime();
    onToggleCardStatus('active');
    setActionDone(true);
    setTimeout(() => {
      setActionDone(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-2xl text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EBE5DB] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              isLocked
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Central Lost-Card Protection</h3>
              <p className="text-xs text-stone-500">Campus Physical Security & Kill-Switch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Current Status Box */}
        <div className={`p-4 rounded-2xl border mb-5 ${
          isLocked
            ? 'bg-rose-50 border-rose-200'
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-stone-600 font-bold">CARD STATUS</p>
              <p className={`text-base font-bold uppercase mt-0.5 ${
                isLocked ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {cardStatus === 'lost' ? 'Reported Lost & Deactivated' : cardStatus === 'deactivated' ? 'Deactivated' : 'Active & Secured'}
              </p>
            </div>
            <div className="text-right font-mono text-xs text-stone-600">
              <p>UID: <span className="text-slate-900 font-semibold">{nfcCardId}</span></p>
              <p>Staff: <span className="text-slate-900 font-semibold">{staffId}</span></p>
            </div>
          </div>
        </div>

        {isLocked ? (
          <div className="space-y-4">
            <p className="text-sm text-stone-600">
              This card is currently revoked. All campus door locks, turnstiles, and classroom terminals will reject attempts with this NFC card and flag an alert.
            </p>
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D5] text-xs space-y-2">
              <p className="font-bold text-slate-900">Recent Security Activity:</p>
              <p className="text-rose-700 font-mono font-semibold">● 08:14 AM - Unauthorized tap at Science Wing rejected.</p>
              <p className="text-stone-600 font-mono">● 07:55 AM - Central Kill-Switch executed by Administrator.</p>
            </div>

            <button
              onClick={handleReactivate}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-md cursor-pointer"
            >
              {actionDone ? 'Reactivating...' : 'Found Card: Reactivate & Restore Access'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-stone-600">
              If your physical AirNix badge was misplaced, stolen, or compromised, trigger the Central Kill-Switch below. This will instantly block the NFC chip across all campus terminals and dispatch a real-time alert to school security.
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Reason for Deactivation</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="Misplaced on campus">Misplaced on campus</option>
                <option value="Stolen or compromised">Stolen or compromised</option>
                <option value="Damaged chip / unreadable">Damaged chip / unreadable</option>
                <option value="Administrative revocation">Administrative revocation</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reqRepl"
                checked={requestReplacement}
                onChange={e => setRequestReplacement(e.target.checked)}
                className="rounded border-[#E2DCD0] text-blue-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="reqRepl" className="text-xs text-stone-700 cursor-pointer">
                Automatically request a new replacement AirNix badge from Admin IT
              </label>
            </div>

            <button
              onClick={handleDeactivate}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-md cursor-pointer"
            >
              {actionDone ? 'Deactivating...' : '⚠️ Central Kill-Switch: Deactivate Lost Card'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
