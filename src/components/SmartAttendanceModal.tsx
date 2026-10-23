import React, { useState } from 'react';
import { sounds } from '../lib/soundEffects';
import type { AttendanceRecord, ClassItem } from '../lib/types';

interface SmartAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  staffId: string;
  classes: ClassItem[];
  attendanceLogs: AttendanceRecord[];
  onRecordAttendance: (type: 'check-in' | 'check-out', location: string, method: 'nfc' | 'biometric' | 'manual') => void;
}

export const SmartAttendanceModal: React.FC<SmartAttendanceModalProps> = ({
  isOpen,
  onClose,
  teacherName,
  staffId,
  classes,
  attendanceLogs,
  onRecordAttendance,
}) => {
  const [activeTab, setActiveTab] = useState<'clock' | 'students' | 'history'>('clock');
  const [selectedLocation, setSelectedLocation] = useState('Main Campus Entrance Terminal');
  const [selectedMethod, setSelectedMethod] = useState<'nfc' | 'biometric' | 'manual'>('nfc');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [studentRoll, setStudentRoll] = useState([
    { id: 'S1', name: 'Alexander Wright', status: 'present' },
    { id: 'S2', name: 'Sophia Chen', status: 'present' },
    { id: 'S3', name: 'Liam Patel', status: 'late' },
    { id: 'S4', name: 'Emma Davis', status: 'present' },
    { id: 'S5', name: 'Noah Rodriguez', status: 'absent' },
    { id: 'S6', name: 'Olivia Kim', status: 'present' },
    { id: 'S7', name: 'Lucas Martin', status: 'present' },
  ]);
  const [savedRollMessage, setSavedRollMessage] = useState(false);

  if (!isOpen) return null;

  const handleClockAction = (type: 'check-in' | 'check-out') => {
    sounds.playSuccessChime();
    onRecordAttendance(type, selectedLocation, selectedMethod);
  };

  const handleStudentStatusToggle = (id: string, newStatus: 'present' | 'absent' | 'late') => {
    setStudentRoll(prev => prev.map(s => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  const handleSaveStudentRoll = () => {
    sounds.playSuccessChime();
    setSavedRollMessage(true);
    setTimeout(() => setSavedRollMessage(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-2xl text-slate-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#16287A] flex items-center justify-center border border-blue-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#16287A]">Smart Attendance Engine</h3>
              <p className="text-xs text-stone-500">Authorised Reader & Classroom Roll Call</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-2xl bg-[#FAF5EB] p-1 mb-5 border border-[#E8DEC8] shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('clock')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'clock' ? 'bg-[#16287A] text-white shadow-sm font-bold' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            Teacher Clock In / Out
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'students' ? 'bg-[#16287A] text-white shadow-sm font-bold' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            Take Class Attendance
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'history' ? 'bg-[#16287A] text-white shadow-sm font-bold' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            Attendance Logs ({attendanceLogs.length})
          </button>
        </div>

        {/* Tab 1: Teacher Clock-In/Out */}
        {activeTab === 'clock' && (
          <div className="space-y-5 overflow-y-auto pr-1">
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-blue-700 font-mono font-bold">STAFF CREDENTIAL</p>
                <h4 className="font-bold text-lg text-slate-900">{teacherName}</h4>
                <p className="text-xs text-stone-600 font-mono">Staff ID: {staffId}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Reader Authorized
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Authorised Terminal / Reader</label>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Main Campus Entrance Terminal">Main Campus Entrance Terminal</option>
                  <option value="Science Wing Scanner Pod 4">Science Wing Scanner Pod 4</option>
                  <option value="Staff Lounge Kiosk 2">Staff Lounge Kiosk 2</option>
                  <option value="Mobile Phone NFC Reader">Mobile Phone NFC Reader</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Verification Method</label>
                <select
                  value={selectedMethod}
                  onChange={e => setSelectedMethod(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="nfc">AirNix NFC Smart ID Card</option>
                  <option value="biometric">Biometric Sensor (Fingerprint/Face)</option>
                  <option value="manual">Authorized Manual Entry</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-3">
              <button
                onClick={() => handleClockAction('check-in')}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Clock In to Campus
              </button>
              <button
                onClick={() => handleClockAction('check-out')}
                className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Clock Out of Campus
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Take Student Attendance */}
        {activeTab === 'students' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-stone-700 mb-1">Select Assigned Class</label>
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl px-3 py-2 text-sm text-slate-900"
                >
                  {classes.map(c => (
                    <option key={c.id || c.className} value={c.id || c.className}>
                      {c.className} ({c.grade} - Room {c.room})
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-5">
                <button
                  onClick={() =>
                    setStudentRoll(prev => prev.map(s => ({ ...s, status: 'present' })))
                  }
                  className="text-xs bg-[#FAF8F5] hover:bg-[#F2ECE0] text-slate-800 border border-[#E2DCD0] px-3 py-2 rounded-xl font-semibold transition cursor-pointer"
                >
                  Mark All Present
                </button>
              </div>
            </div>

            {/* Student list */}
            <div className="space-y-2">
              {studentRoll.map(student => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D5]"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{student.name}</p>
                    <p className="text-[11px] font-mono text-stone-500">Student ID: {student.id}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStudentStatusToggle(student.id, 'present')}
                      className={`px-3 py-1 text-xs rounded-lg font-bold transition cursor-pointer ${
                        student.status === 'present'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-stone-600 border border-[#E2DCD0] hover:text-slate-900'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleStudentStatusToggle(student.id, 'late')}
                      className={`px-3 py-1 text-xs rounded-lg font-bold transition cursor-pointer ${
                        student.status === 'late'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white text-stone-600 border border-[#E2DCD0] hover:text-slate-900'
                      }`}
                    >
                      Late
                    </button>
                    <button
                      onClick={() => handleStudentStatusToggle(student.id, 'absent')}
                      className={`px-3 py-1 text-xs rounded-lg font-bold transition cursor-pointer ${
                        student.status === 'absent'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-stone-600 border border-[#E2DCD0] hover:text-slate-900'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {savedRollMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-center font-bold">
                ✓ Class Attendance Roll Submitted & Synced!
              </div>
            )}

            <button
              onClick={handleSaveStudentRoll}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md cursor-pointer"
            >
              Submit & Save Class Attendance Roll
            </button>
          </div>
        )}

        {/* Tab 3: History Logs */}
        {activeTab === 'history' && (
          <div className="overflow-y-auto space-y-2 pr-1 flex-1">
            {attendanceLogs.length === 0 ? (
              <p className="text-center text-stone-500 text-sm py-8">No attendance records yet.</p>
            ) : (
              attendanceLogs.map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D5] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        log.type === 'check-in' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <div>
                      <p className="font-bold text-slate-900 uppercase">{log.type}</p>
                      <p className="text-stone-600 text-[11px]">{log.location} ({log.method.toUpperCase()})</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-stone-600 text-[11px]">
                    <p className="text-slate-900 font-semibold">{log.timestamp}</p>
                    <p className="text-emerald-700 font-bold">{log.status.toUpperCase()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
