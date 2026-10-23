import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  INITIAL_STUDENTS_PROGRESS,
  type StudentProgressItem,
} from '../lib/studentData';
import { sounds } from '../lib/soundEffects';

interface StudentProgressViewProps {
  onOpenReportForStudent?: (studentName: string) => void;
  classNameFilter?: string;
}

export const StudentProgressView: React.FC<StudentProgressViewProps> = ({
  onOpenReportForStudent,
  classNameFilter,
}) => {
  const [students, setStudents] = useState<StudentProgressItem[]>(INITIAL_STUDENTS_PROGRESS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'honors' | 'growth' | 'support'>('all');
  const [selectedClass, setSelectedClass] = useState<string>(classNameFilter || 'all');
  const [quickNoteStudent, setQuickNoteStudent] = useState<StudentProgressItem | null>(null);
  const [noteText, setNoteText] = useState('');

  // Extract distinct class names
  const classNames = useMemo(() => {
    const set = new Set(students.map(s => s.className));
    return Array.from(set);
  }, [students]);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search match
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.subject.toLowerCase().includes(searchQuery.toLowerCase());

      // Class match
      const matchesClass = selectedClass === 'all' || student.className === selectedClass;

      // Tab match
      let matchesTab = true;
      if (filterTab === 'honors') {
        matchesTab = student.latestGrade >= 95;
      } else if (filterTab === 'growth') {
        matchesTab = student.growthValue >= 12;
      } else if (filterTab === 'support') {
        matchesTab = student.latestGrade < 80 || student.attendancePct < 90;
      }

      return matchesSearch && matchesClass && matchesTab;
    });
  }, [students, searchQuery, selectedClass, filterTab]);

  // Handle adding quick note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteStudent || !noteText.trim()) return;

    setStudents(prev =>
      prev.map(s => (s.id === quickNoteStudent.id ? { ...s, teacherNotes: noteText.trim() } : s))
    );
    sounds.playSuccessChime();
    setQuickNoteStudent(null);
    setNoteText('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header & Controls Card */}
      <div className="bg-white border border-[#E8DEC8] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16287A] to-[#2563EB] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              📈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-[#16287A] tracking-tight">
                  Student Growth & Longitudinal Trajectory
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {filteredStudents.length} Students
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Individual grade trends, attendance compliance, and longitudinal term analytics
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-[#FAF5EB] border border-[#E8DEC8] text-stone-700">
              Avg Mastery: <strong className="text-[#16287A]">91.2%</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#FAF5EB] border border-[#E8DEC8] text-stone-700">
              Attendance: <strong className="text-emerald-700">95.3%</strong>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, or subject..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl text-base sm:text-xs text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#16287A] shadow-2xs"
            />
          </div>

          {/* Class Filter Dropdown */}
          <select
            value={selectedClass}
            onChange={e => {
              setSelectedClass(e.target.value);
              sounds.playNfcTap();
            }}
            className="px-3 py-2 bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#16287A] cursor-pointer shadow-2xs"
          >
            <option value="all">All Classes & Sections</option>
            {classNames.map(cls => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium scrollbar-none">
          <button
            onClick={() => {
              setFilterTab('all');
              sounds.playNfcTap();
            }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 ${
              filterTab === 'all'
                ? 'bg-[#16287A] text-white font-bold shadow-xs'
                : 'bg-[#FAF5EB] text-stone-700 hover:bg-[#F2ECE0] border border-[#E8DEC8]'
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => {
              setFilterTab('honors');
              sounds.playNfcTap();
            }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 ${
              filterTab === 'honors'
                ? 'bg-[#16287A] text-white font-bold shadow-xs'
                : 'bg-[#FAF5EB] text-stone-700 hover:bg-[#F2ECE0] border border-[#E8DEC8]'
            }`}
          >
            🌟 Top Performers (95%+)
          </button>
          <button
            onClick={() => {
              setFilterTab('growth');
              sounds.playNfcTap();
            }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 ${
              filterTab === 'growth'
                ? 'bg-[#16287A] text-white font-bold shadow-xs'
                : 'bg-[#FAF5EB] text-stone-700 hover:bg-[#F2ECE0] border border-[#E8DEC8]'
            }`}
          >
            🚀 High Growth (+12%+)
          </button>
          <button
            onClick={() => {
              setFilterTab('support');
              sounds.playNfcTap();
            }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 ${
              filterTab === 'support'
                ? 'bg-[#16287A] text-white font-bold shadow-xs'
                : 'bg-[#FAF5EB] text-stone-700 hover:bg-[#F2ECE0] border border-[#E8DEC8]'
            }`}
          >
            ⚠️ Needs Attention (&lt;80%)
          </button>
        </div>
      </div>

      {/* Grid of Individual Student Cards */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white border border-[#E8DEC8] rounded-3xl p-8 text-center text-stone-500 space-y-2">
          <p className="text-3xl">👨‍🎓</p>
          <h4 className="font-bold text-base text-slate-800">No students matched your search</h4>
          <p className="text-xs text-stone-500">Try adjusting your filters or search keywords.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedClass('all');
              setFilterTab('all');
            }}
            className="mt-2 px-4 py-2 bg-[#16287A] text-white font-bold text-xs rounded-xl hover:bg-[#1E3A8A] transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map(student => {
            const isHighGrade = student.latestGrade >= 90;
            const isGoodAttendance = student.attendancePct >= 95;

            return (
              <div
                key={student.id}
                className="bg-white border border-[#E8DEC8] hover:border-[#16287A] rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group relative"
              >
                {/* Top Row: Student Identity */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl ${student.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        {student.name
                          .split(' ')
                          .map(p => p[0])
                          .join('')
                          .substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-[#16287A] transition">
                          {student.name}
                        </h4>
                        <p className="text-[10px] font-mono text-stone-500 truncate">
                          {student.rollNo} • {student.grade}
                        </p>
                      </div>
                    </div>

                    {/* Letter Grade Pill */}
                    <span
                      className={`px-2 py-0.5 rounded-lg text-xs font-mono font-extrabold shrink-0 shadow-2xs ${
                        student.latestGrade >= 95
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : student.latestGrade >= 90
                          ? 'bg-blue-100 text-[#16287A] border border-blue-200'
                          : student.latestGrade >= 80
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {student.letterGrade} ({student.latestGrade}%)
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 line-clamp-1">
                    📚 {student.className}
                  </p>
                </div>

                {/* Key Metrics: Latest Grade, Attendance, and Term Growth */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  {/* Latest Grade Card */}
                  <div className="p-2.5 rounded-2xl bg-[#FAF5EB] border border-[#E8DEC8]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 uppercase">
                      <span>Score</span>
                      <span className="font-bold text-[#16287A]">
                        {student.latestGrade >= student.previousGrade ? '▲' : '▼'}{' '}
                        {Math.abs(student.latestGrade - student.previousGrade)}%
                      </span>
                    </div>
                    <p className="text-lg font-extrabold text-[#16287A] mt-0.5">
                      {student.latestGrade}%
                    </p>
                    <p className="text-[9px] text-stone-500 truncate">Diagnostic: {student.previousGrade}%</p>
                  </div>

                  {/* Attendance Card */}
                  <div className="p-2.5 rounded-2xl bg-[#FAF5EB] border border-[#E8DEC8]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 uppercase">
                      <span>Attendance</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isGoodAttendance ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                    </div>
                    <p
                      className={`text-lg font-extrabold mt-0.5 ${
                        isGoodAttendance ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {student.attendancePct}%
                    </p>
                    <p className="text-[9px] text-stone-500 truncate">
                      {student.daysPresent}/{student.totalDays} Days
                    </p>
                  </div>
                </div>

                {/* Recharts Sparkline Trend Line: Growth Over Term */}
                <div className="bg-[#FFFDF9] rounded-2xl p-2.5 border border-[#E8DEC8] space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-stone-500 font-semibold uppercase">Term Trajectory</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      {student.growthRate}
                    </span>
                  </div>

                  {/* Recharts Container */}
                  <div className="w-full h-24 pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={student.trend}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id={`grad_${student.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16287A" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#16287A" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="2 2" stroke="#EFE8DA" />
                        <XAxis dataKey="week" stroke="#94A3B8" tick={{ fontSize: 9 }} />
                        <YAxis domain={[60, 100]} stroke="#94A3B8" tick={{ fontSize: 9 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #E8DEC8',
                            borderRadius: '10px',
                            fontSize: '11px',
                            color: '#0F172A',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          }}
                          formatter={(value: any, name: any) => [
                            `${value}%`,
                            name === 'score' ? student.name : 'Class Benchmark',
                          ]}
                          labelFormatter={(label: any) => `Assessment: ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#16287A"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill={`url(#grad_${student.id})`}
                        />
                        <Line
                          type="monotone"
                          dataKey="classAvg"
                          stroke="#94A3B8"
                          strokeWidth={1.5}
                          strokeDasharray="3 3"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Topics & Teacher Note Snippet */}
                <div className="space-y-1 text-[11px] pt-1 border-t border-[#E8DEC8]">
                  <p className="text-stone-700 line-clamp-1">
                    <strong className="text-emerald-700">Strength:</strong> {student.topTopic}
                  </p>
                  {student.teacherNotes && (
                    <p className="text-stone-500 italic line-clamp-1 text-[10px]">
                      &quot;{student.teacherNotes}&quot;
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      sounds.playNfcTap();
                      if (onOpenReportForStudent) {
                        onOpenReportForStudent(student.name);
                      }
                    }}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-[#16287A] hover:bg-[#1E3A8A] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95"
                    title="Open Detailed Longitudinal Recharts Report"
                  >
                    <span>📊 Growth Dossier</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playNfcTap();
                      setQuickNoteStudent(student);
                      setNoteText(student.teacherNotes || '');
                    }}
                    className="p-2 rounded-xl bg-[#FAF5EB] hover:bg-[#F2ECE0] border border-[#E8DEC8] text-stone-700 transition cursor-pointer"
                    title="Add Teacher Note"
                  >
                    📝
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Teacher Note Modal */}
      {quickNoteStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white border border-[#E8DEC8] rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-900">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8DEC8] mb-3">
              <div>
                <h4 className="font-bold text-base text-[#16287A]">Teacher Pedagogical Note</h4>
                <p className="text-xs text-stone-500">Student: {quickNoteStudent.name} ({quickNoteStudent.rollNo})</p>
              </div>
              <button
                onClick={() => setQuickNoteStudent(null)}
                className="text-stone-400 hover:text-slate-900 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Observation / Guidance</label>
                <textarea
                  required
                  rows={3}
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="e.g. Excellent progress in calculus vector models. Recommend after-school honors physics circle."
                  className="w-full p-3 bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuickNoteStudent(null)}
                  className="flex-1 py-2 rounded-xl border border-[#E8DEC8] text-stone-700 font-bold text-xs hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#16287A] hover:bg-[#1E3A8A] text-white font-bold text-xs transition cursor-pointer shadow-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
