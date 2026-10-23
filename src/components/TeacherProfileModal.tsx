import React, { useState } from 'react';
import type { TeacherProfile } from '../lib/types';
import { sounds } from '../lib/soundEffects';
import { ClickablePhoneNumber } from './PhoneNumberActionModal';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onSaveProfile: (updated: Partial<TeacherProfile>) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    designation: profile.designation,
    department: profile.department,
    email: profile.email,
    phone: profile.phone,
    emergencyContactName: profile.emergencyContactName,
    emergencyContactPhone: profile.emergencyContactPhone,
    emergencyMedicalNotes: profile.emergencyMedicalNotes,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    sounds.playSuccessChime();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-[#E8DEC8] rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF5EB] text-[#16287A] flex items-center justify-center border border-[#E8DEC8] font-bold text-lg shadow-xs">
              👨‍🏫
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#16287A]">Digital Faculty Dossier</h3>
              <p className="text-xs text-stone-500 font-mono">St. Arnold&apos;s High School, Godhra</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-slate-900 p-1.5 rounded-xl hover:bg-stone-100 transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Profile Card Summary: St. Arnold's Royal Blue & Gold */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#0C1748] to-[#16287A] text-white shadow-md mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center font-bold text-xl text-amber-300 shrink-0 shadow-inner">
              {formData.name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'TR'}
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-white text-base leading-tight">{formData.name}</h4>
              <p className="text-xs text-blue-200 font-medium">{formData.designation}</p>
              <p className="text-xs text-amber-200/90">{formData.department}</p>
              <p className="text-[11px] font-mono text-cyan-300 font-semibold">Staff ID: {profile.staffId}</p>
            </div>
          </div>

          {/* Quick Connect Pill (Call & WhatsApp) */}
          <div className="w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/15">
            <ClickablePhoneNumber
              phone={formData.phone}
              name={formData.name}
              label="Direct Faculty Line"
              className="bg-white/15 text-white hover:bg-white/25 border-white/30 w-full sm:w-auto justify-center"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[11px] font-mono">
              Full Legal & Display Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#16287A] text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[11px] font-mono">
                Designation
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                className="w-full bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#16287A]"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[11px] font-mono">
                Department
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#16287A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[11px] font-mono">
                Institutional Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#16287A]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[11px] font-mono">
                  Direct Phone
                </label>
                <ClickablePhoneNumber
                  phone={formData.phone}
                  name={formData.name}
                  label="Faculty Line"
                  className="py-0 px-1.5 text-[10px]"
                />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#16287A]"
              />
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E8DEC8] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] font-mono uppercase text-[#16287A]">
                Emergency Contact & Medical
              </span>
              <ClickablePhoneNumber
                phone={formData.emergencyContactPhone}
                name={formData.emergencyContactName}
                label="Emergency Contact"
                className="py-0 px-1.5 text-[10px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-mono text-stone-600 mb-0.5">Contact Name & Relation</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full bg-white border border-[#D8C7AA] rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-stone-600 mb-0.5">Contact Phone</label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full bg-white border border-[#D8C7AA] rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-stone-600 mb-0.5">Critical Medical Notes</label>
              <input
                type="text"
                value={formData.emergencyMedicalNotes}
                onChange={e => setFormData({ ...formData, emergencyMedicalNotes: e.target.value })}
                className="w-full bg-white border border-[#D8C7AA] rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
              />
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-center font-bold text-xs">
              ✓ Faculty Dossier Updated & Synchronized!
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#E8DEC8] bg-[#FAF5EB] hover:bg-[#F2ECE0] text-xs font-bold transition cursor-pointer text-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#16287A] hover:bg-[#1E3A8A] text-white text-xs font-bold transition shadow-md cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
