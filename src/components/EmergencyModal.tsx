import React, { useState } from 'react';
import { sounds } from '../lib/soundEffects';
import { ClickablePhoneNumber } from './PhoneNumberActionModal';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  staffId: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyMedicalNotes: string;
  onUpdateEmergencyInfo: (contact: string, phone: string, notes: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  teacherName,
  staffId,
  emergencyContactName,
  emergencyContactPhone,
  emergencyMedicalNotes,
  onUpdateEmergencyInfo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contactName, setContactName] = useState(emergencyContactName || 'Dr. Marcus Vance (Spouse)');
  const [contactPhone, setContactPhone] = useState(emergencyContactPhone || '+91 98250 88190');
  const [medicalNotes, setMedicalNotes] = useState(emergencyMedicalNotes || 'Penicillin Allergy; Carry Epipen; Blood Type O+');
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateEmergencyInfo(contactName, contactPhone, medicalNotes);
    setIsEditing(false);
    sounds.playSuccessChime();
  };

  const handleTriggerBroadcast = (protocol: string) => {
    sounds.playWarningBuzz();
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-[#E8DEC8] rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200 text-lg">
              🚨
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Campus Emergency & Safety</h3>
              <p className="text-xs text-stone-500 font-mono">Authorised Personnel Crisis Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-slate-900 p-1.5 rounded-xl hover:bg-stone-100 transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Emergency Broadcast Notification */}
        {broadcastSent && (
          <div className="p-4 mb-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-mono font-bold animate-bounce">
            ⚠️ CAMPUS EMERGENCY ALERT BROADCAST DISPATCHED TO ALL CLASSROOM TERMINALS & SECURITY HUB!
          </div>
        )}

        {/* Teacher Primary Health & Contact Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EB] border border-[#E8DEC8] space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-rose-700 font-mono font-bold">STAFF EMERGENCY FILE</p>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">{teacherName} (ID: {staffId})</h4>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#D8C7AA] text-xs text-[#16287A] hover:bg-stone-50 font-bold cursor-pointer transition shadow-2xs"
            >
              {isEditing ? 'Cancel' : 'Edit Info'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Emergency Contact Name & Relation</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full bg-white border border-[#D8C7AA] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#16287A]"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">Emergency Phone Number</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full bg-white border border-[#D8C7AA] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#16287A]"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">Critical Medical Notes & Allergies</label>
                <textarea
                  rows={2}
                  value={medicalNotes}
                  onChange={e => setMedicalNotes(e.target.value)}
                  className="w-full bg-white border border-[#D8C7AA] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#16287A]"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full py-2.5 bg-[#16287A] hover:bg-[#1E3A8A] text-white rounded-xl font-bold cursor-pointer shadow-md transition"
              >
                Save Emergency Profile
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 text-xs divide-y divide-[#E8DEC8]">
              <div className="pt-1 flex items-center justify-between">
                <span className="text-stone-600">Emergency Contact:</span>
                <span className="font-bold text-slate-900">{contactName}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-stone-600">Direct Contact Phone:</span>
                {/* 2 Options: Call or WhatsApp */}
                <ClickablePhoneNumber
                  phone={contactPhone}
                  name={contactName}
                  label="Emergency Contact"
                />
              </div>
              <div className="pt-2">
                <span className="text-stone-600 block mb-1">Medical & Allergy Notes:</span>
                <p className="bg-white p-2.5 rounded-xl border border-[#D8C7AA] text-rose-700 font-mono text-[11px] font-semibold">
                  {medicalNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* School Hotlines (Direct Call / WhatsApp) */}
        <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E8DEC8] space-y-2 mb-5">
          <p className="text-[11px] font-mono font-bold text-stone-600 uppercase">
            St. Arnold&apos;s Dedicated Crisis Numbers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-[#FAF5EB] rounded-xl border border-[#E8DEC8] flex items-center justify-between">
              <span className="text-stone-700 font-semibold">Campus Gate:</span>
              <ClickablePhoneNumber
                phone="+91 98250 88190"
                name="Security Dispatch"
                label="Campus Gate"
              />
            </div>
            <div className="p-2 bg-[#FAF5EB] rounded-xl border border-[#E8DEC8] flex items-center justify-between">
              <span className="text-stone-700 font-semibold">School Infirmary:</span>
              <ClickablePhoneNumber
                phone="+91 98250 00108"
                name="Campus Infirmary"
                label="First Aid"
              />
            </div>
          </div>
        </div>

        {/* Campus Emergency Protocols */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold text-stone-600 uppercase tracking-wider">
            Campus Emergency Protocols
          </h4>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <button
              onClick={() => handleTriggerBroadcast('LOCKDOWN')}
              className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-left transition cursor-pointer"
            >
              <p className="font-bold text-rose-700">🔒 Code Red Lockdown</p>
              <p className="text-[11px] text-stone-600 mt-0.5">Seal classroom doors instantly</p>
            </button>
            <button
              onClick={() => handleTriggerBroadcast('EVACUATION')}
              className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition cursor-pointer"
            >
              <p className="font-bold text-amber-800">🚨 Fire / Evacuation</p>
              <p className="text-[11px] text-stone-600 mt-0.5">Route to Football Field Point B</p>
            </button>
            <button
              onClick={() => handleTriggerBroadcast('MEDICAL')}
              className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition cursor-pointer"
            >
              <p className="font-bold text-blue-800">🩺 Medical Urgent Response</p>
              <p className="text-[11px] text-stone-600 mt-0.5">Dispatch Nurse & Defibrillator</p>
            </button>
            <button
              onClick={() => handleTriggerBroadcast('WEATHER')}
              className="p-3 bg-[#FAF5EB] hover:bg-[#F2ECE0] border border-[#E8DEC8] rounded-xl text-left transition cursor-pointer"
            >
              <p className="font-bold text-slate-800">🌪️ Severe Weather Shelter</p>
              <p className="text-[11px] text-stone-600 mt-0.5">Descend to Ground Floor Quad</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
