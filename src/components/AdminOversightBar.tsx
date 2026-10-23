import React from 'react';
import type { TeacherProfile } from '../lib/types';
import { sounds } from '../lib/soundEffects';

interface AdminOversightBarProps {
  adminProfile: TeacherProfile;
  teachersList: TeacherProfile[];
  selectedTeacherId: string;
  onSelectTeacher: (teacherId: string) => void;
  onOpenFacultyRosterModal: () => void;
}

export const AdminOversightBar: React.FC<AdminOversightBarProps> = ({
  adminProfile,
  teachersList,
  selectedTeacherId,
  onSelectTeacher,
  onOpenFacultyRosterModal,
}) => {
  const currentInspectedTeacher =
    teachersList.find(t => t.userId === selectedTeacherId) || teachersList[0];
  const isViewingSelf = selectedTeacherId === adminProfile.userId;

  return (
    <div className="bg-gradient-to-r from-[#0C1748] via-[#16287A] to-[#1E3A8A] text-white border-b-2 border-[#CFA442] shadow-md px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Admin Identifier & Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
                Principal Oversight Console
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-blue-100 font-medium">
              Signed in as: <strong className="text-white">{adminProfile.name}</strong> ({adminProfile.staffId})
            </p>
          </div>
        </div>

        {/* Right: Interactive Teacher Dashboard Switcher (Mobile-Friendly) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Label & Dropdown */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 backdrop-blur-md">
            <span className="text-[11px] font-mono text-amber-300 font-bold shrink-0">
              👁️ View Dashboard:
            </span>
            <select
              value={selectedTeacherId}
              onChange={e => {
                sounds.playNfcTap();
                onSelectTeacher(e.target.value);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-4"
            >
              <option value={adminProfile.userId} className="text-slate-900 bg-white">
                👑 Principal Central Overview
              </option>
              {teachersList
                .filter(t => t.userId !== adminProfile.userId)
                .map(t => (
                  <option key={t.userId} value={t.userId} className="text-slate-900 bg-white">
                    👨‍🏫 {t.name} ({t.designation.split('&')[0]})
                  </option>
                ))}
            </select>
          </div>

          {/* Quick Roster Modal Button */}
          <button
            onClick={onOpenFacultyRosterModal}
            className="px-3.5 py-2 rounded-xl bg-[#CFA442] hover:bg-[#E6B95C] text-[#0C1748] font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          >
            <span>📋</span>
            <span>Faculty Roster ({teachersList.length})</span>
          </button>

          {!isViewingSelf && (
            <button
              onClick={() => {
                sounds.playNfcTap();
                onSelectTeacher(adminProfile.userId);
              }}
              className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-1 border border-white/30 shrink-0"
              title="Return to Principal Overview"
            >
              <span>✕ Reset View</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Sub-Banner when inspecting a specific teacher's dashboard */}
      {!isViewingSelf && currentInspectedTeacher && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-amber-200 font-semibold">
              Currently Supervising Live Dashboard of:
            </span>
            <span className="font-extrabold text-white underline decoration-amber-400">
              {currentInspectedTeacher.name}
            </span>
            <span className="text-blue-200 font-mono">
              ({currentInspectedTeacher.staffId} • {currentInspectedTeacher.department})
            </span>
          </div>

          <span className="text-[11px] font-mono text-cyan-200">
            NFC Badge: {currentInspectedTeacher.nfcCardId} ({currentInspectedTeacher.cardStatus.toUpperCase()})
          </span>
        </div>
      )}
    </div>
  );
};
