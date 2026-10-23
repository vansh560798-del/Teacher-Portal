import React, { useState } from 'react';
import type { LeaveRequest } from '../lib/types';
import { sounds } from '../lib/soundEffects';

interface LeaveManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequests: LeaveRequest[];
  onSubmitLeave: (req: Omit<LeaveRequest, 'id'>) => void;
  teacherId: string;
  teacherName: string;
}

export const LeaveManagementModal: React.FC<LeaveManagementModalProps> = ({
  isOpen,
  onClose,
  leaveRequests,
  onSubmitLeave,
  teacherId,
  teacherName,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState<'sick' | 'casual' | 'medical' | 'conference' | 'maternity'>('casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    onSubmitLeave({
      teacherId,
      teacherName,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'pending',
      reviewedBy: 'Academic Dean Office',
      createdAt: new Date().toLocaleDateString(),
    });
    sounds.playSuccessChime();
    setReason('');
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8DEC8] rounded-3xl p-6 shadow-2xl text-slate-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#16287A]">St. Arnold&apos;s Leave Management</h3>
              <p className="text-xs text-stone-500">Official Quotas & Faculty Absence Approvals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Leave Balance Overview Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8]">
            <p className="text-[11px] font-mono text-stone-500 font-bold">CASUAL LEAVE</p>
            <p className="text-xl font-extrabold text-[#16287A] mt-0.5">4 <span className="text-xs text-stone-500 font-normal">/ 12 days</span></p>
          </div>
          <div className="p-3.5 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8]">
            <p className="text-[11px] font-mono text-stone-500 font-bold">MEDICAL LEAVE</p>
            <p className="text-xl font-extrabold text-[#16287A] mt-0.5">8 <span className="text-xs text-stone-500 font-normal">/ 10 days</span></p>
          </div>
          <div className="p-3.5 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8]">
            <p className="text-[11px] font-mono text-stone-500 font-bold">ACADEMIC DUTY</p>
            <p className="text-xl font-extrabold text-[#16287A] mt-0.5">2 <span className="text-xs text-stone-500 font-normal">taken</span></p>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-mono font-bold text-stone-600 uppercase">Filed Leave Requests</h4>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-1.5 bg-[#16287A] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            {showForm ? '✕ Close Form' : '+ Apply for Leave'}
          </button>
        </div>

        {/* Submit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="p-4 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8] mb-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                  className="w-full bg-white border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-slate-900"
                >
                  <option value="casual">Casual Leave (CL)</option>
                  <option value="sick">Sick / Medical Leave (ML)</option>
                  <option value="conference">Conference / Academic Summit</option>
                  <option value="maternity">Maternity / Paternity Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-white border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-white border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Reason / Justification</label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Specify reason for institutional review..."
                className="w-full bg-white border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#16287A] hover:bg-[#1E3A8A] text-white font-bold rounded-xl cursor-pointer shadow-md"
            >
              Submit Application to Principal Office
            </button>
          </form>
        )}

        {/* Requests List */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {leaveRequests.length === 0 ? (
            <p className="text-center text-stone-500 py-8 text-xs">No filed leave applications.</p>
          ) : (
            leaveRequests.map(req => (
              <div
                key={req.id}
                className="p-3.5 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase text-[#16287A]">{req.leaveType} LEAVE</span>
                    <span className="text-stone-400">•</span>
                    <span className="font-mono text-stone-600 font-semibold">{req.startDate} to {req.endDate}</span>
                  </div>
                  <p className="text-slate-800 font-medium">{req.reason}</p>
                  <p className="text-[11px] text-stone-500 font-mono">Reviewed by: {req.reviewedBy}</p>
                </div>
                <div className="shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    req.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : req.status === 'rejected'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    ● {req.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
