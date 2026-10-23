import React, { useState } from 'react';
import type { TeacherProfile, AttendanceRecord } from '../lib/types';
import { sounds } from '../lib/soundEffects';

interface FacultyRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: TeacherProfile[];
  attendanceLogs: AttendanceRecord[];
  onSelectTeacherForDashboard: (teacherId: string) => void;
  onToggleCardStatus: (teacherId: string, newStatus: 'active' | 'lost' | 'deactivated') => void;
}

export const FacultyRosterModal: React.FC<FacultyRosterModalProps> = ({
  isOpen,
  onClose,
  teachers,
  attendanceLogs,
  onSelectTeacherForDashboard,
  onToggleCardStatus,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredTeachers = teachers.filter(
    t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase()) ||
      t.staffId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white border border-[#E8DEC8] rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DEC8] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-300 font-bold text-lg">
              👑
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#16287A]">
                St. Arnold&apos;s Faculty Roster & Central Campus Roster
              </h3>
              <p className="text-xs text-stone-500">
                Principal Oversight Console • {teachers.length} Registered Educators
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer text-lg font-bold self-end sm:self-auto"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search faculty by name, department, or staff ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#16287A] shadow-xs"
          />
        </div>

        {/* Faculty List (Mobile Cards on phones, Table on desktop) */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {filteredTeachers.map(teacher => {
            const hasCheckedInToday = attendanceLogs.some(
              a => a.teacherId === teacher.userId && a.type === 'check-in'
            );
            const isAdmin = teacher.role === 'admin';

            return (
              <div
                key={teacher.userId}
                className="p-4 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8] hover:border-[#16287A] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
              >
                {/* Teacher Info */}
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#16287A] text-amber-300 font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {teacher.name.split(' ').map(n => n[0]).join('') || 'TR'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{teacher.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-50 text-[#16287A] border border-blue-200'
                      }`}>
                        {teacher.role}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium">
                      {teacher.designation} • <span className="text-[#16287A]">{teacher.department}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-stone-500 mt-0.5">
                      <span>ID: <strong className="text-slate-800">{teacher.staffId}</strong></span>
                      <span>NFC: <strong className="text-blue-700">{teacher.nfcCardId}</strong></span>
                      <span className={hasCheckedInToday ? 'text-emerald-700 font-bold' : 'text-stone-400'}>
                        {hasCheckedInToday ? '● Checked In Today' : '○ Not clocked in'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supervisory Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      sounds.playSuccessChime();
                      onSelectTeacherForDashboard(teacher.userId);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#16287A] hover:bg-[#1E3A8A] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    Inspect Dashboard →
                  </button>

                  {!isAdmin && (
                    <button
                      onClick={() => {
                        const newStatus = teacher.cardStatus === 'active' ? 'lost' : 'active';
                        onToggleCardStatus(teacher.userId, newStatus);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        teacher.cardStatus === 'active'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title={teacher.cardStatus === 'active' ? 'Deactivate NFC badge' : 'Reactivate NFC badge'}
                    >
                      {teacher.cardStatus === 'active' ? '🔒 Lock Card' : '🔓 Unlock'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
