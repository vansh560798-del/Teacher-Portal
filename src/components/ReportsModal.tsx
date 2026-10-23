import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { AttendanceRecord, GradeRecord, SecurityAlert } from '../lib/types';
import { sounds } from '../lib/soundEffects';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceLogs: AttendanceRecord[];
  securityAlerts: SecurityAlert[];
  grades: GradeRecord[];
  teacherName: string;
  initialStudent?: string;
}

// Semester weekly datasets per student
const semesterStudentData: Record<
  string,
  {
    trend: Array<{ week: string; label: string; studentScore: number; classAverage: number; target: number }>;
    topics: Array<{ topic: string; score: number; classAvg: number }>;
    growthRate: string;
    attendance: number;
    gpa: string;
    interventionNote: string;
  }
> = {
  'Alexander Wright': {
    trend: [
      { week: 'W2', label: 'Diagnostic Exam', studentScore: 82, classAverage: 78, target: 85 },
      { week: 'W4', label: 'Kinematics Lab', studentScore: 88, classAverage: 81, target: 85 },
      { week: 'W7', label: 'Dynamics Quiz', studentScore: 91, classAverage: 82, target: 85 },
      { week: 'W9', label: 'Midterm Exam', studentScore: 94, classAverage: 84, target: 85 },
      { week: 'W11', label: 'Work & Energy', studentScore: 92, classAverage: 83, target: 85 },
      { week: 'W13', label: 'Rotational Lab', studentScore: 96, classAverage: 86, target: 85 },
      { week: 'W15', label: 'Optics Project', studentScore: 95, classAverage: 85, target: 85 },
      { week: 'W16', label: 'Final Benchmark', studentScore: 98, classAverage: 87, target: 85 },
    ],
    topics: [
      { topic: 'Kinematics', score: 94, classAvg: 84 },
      { topic: 'Dynamics', score: 92, classAvg: 82 },
      { topic: 'Work/Energy', score: 95, classAvg: 85 },
      { topic: 'Rotation', score: 98, classAvg: 81 },
      { topic: 'Lab Design', score: 96, classAvg: 87 },
    ],
    growthRate: '+16.0% semester gain',
    attendance: 98.5,
    gpa: '3.94 / 4.0',
    interventionNote: 'Excelling in calculus-based derivations. Recommend AP Physics C C-Level Olympiad prep.',
  },
  'Sophia Chen': {
    trend: [
      { week: 'W2', label: 'Diagnostic Exam', studentScore: 86, classAverage: 78, target: 85 },
      { week: 'W4', label: 'Kinematics Lab', studentScore: 89, classAverage: 81, target: 85 },
      { week: 'W7', label: 'Dynamics Quiz', studentScore: 90, classAverage: 82, target: 85 },
      { week: 'W9', label: 'Midterm Exam', studentScore: 93, classAverage: 84, target: 85 },
      { week: 'W11', label: 'Work & Energy', studentScore: 94, classAverage: 83, target: 85 },
      { week: 'W13', label: 'Rotational Lab', studentScore: 92, classAverage: 86, target: 85 },
      { week: 'W15', label: 'Optics Project', studentScore: 97, classAverage: 85, target: 85 },
      { week: 'W16', label: 'Final Benchmark', studentScore: 96, classAverage: 87, target: 85 },
    ],
    topics: [
      { topic: 'Kinematics', score: 91, classAvg: 84 },
      { topic: 'Dynamics', score: 93, classAvg: 82 },
      { topic: 'Work/Energy', score: 94, classAvg: 85 },
      { topic: 'Rotation', score: 90, classAvg: 81 },
      { topic: 'Lab Design', score: 98, classAvg: 87 },
    ],
    growthRate: '+10.0% semester gain',
    attendance: 100,
    gpa: '3.92 / 4.0',
    interventionNote: 'Outstanding experimental protocol rigor. Strong candidate for student peer tutor.',
  },
  'Liam Patel': {
    trend: [
      { week: 'W2', label: 'Diagnostic Exam', studentScore: 72, classAverage: 78, target: 85 },
      { week: 'W4', label: 'Kinematics Lab', studentScore: 76, classAverage: 81, target: 85 },
      { week: 'W7', label: 'Dynamics Quiz', studentScore: 79, classAverage: 82, target: 85 },
      { week: 'W9', label: 'Midterm Exam', studentScore: 84, classAverage: 84, target: 85 },
      { week: 'W11', label: 'Work & Energy', studentScore: 82, classAverage: 83, target: 85 },
      { week: 'W13', label: 'Rotational Lab', studentScore: 86, classAverage: 86, target: 85 },
      { week: 'W15', label: 'Optics Project', studentScore: 88, classAverage: 85, target: 85 },
      { week: 'W16', label: 'Final Benchmark', studentScore: 89, classAverage: 87, target: 85 },
    ],
    topics: [
      { topic: 'Kinematics', score: 82, classAvg: 84 },
      { topic: 'Dynamics', score: 85, classAvg: 82 },
      { topic: 'Work/Energy', score: 84, classAvg: 85 },
      { topic: 'Rotation', score: 86, classAvg: 81 },
      { topic: 'Lab Design', score: 89, classAvg: 87 },
    ],
    growthRate: '+17.0% semester gain',
    attendance: 94.2,
    gpa: '3.45 / 4.0',
    interventionNote: 'Rapid upward inflection following mid-semester vector workshop. Keep reinforcing unit conversions.',
  },
  'Emma Davis': {
    trend: [
      { week: 'W2', label: 'Diagnostic Exam', studentScore: 85, classAverage: 78, target: 85 },
      { week: 'W4', label: 'Kinematics Lab', studentScore: 89, classAverage: 81, target: 85 },
      { week: 'W7', label: 'Dynamics Quiz', studentScore: 92, classAverage: 82, target: 85 },
      { week: 'W9', label: 'Midterm Exam', studentScore: 95, classAverage: 84, target: 85 },
      { week: 'W11', label: 'Work & Energy', studentScore: 94, classAverage: 83, target: 85 },
      { week: 'W13', label: 'Rotational Lab', studentScore: 96, classAverage: 86, target: 85 },
      { week: 'W15', label: 'Optics Project', studentScore: 95, classAverage: 85, target: 85 },
      { week: 'W16', label: 'Final Benchmark', studentScore: 97, classAverage: 87, target: 85 },
    ],
    topics: [
      { topic: 'Kinematics', score: 94, classAvg: 84 },
      { topic: 'Dynamics', score: 95, classAvg: 82 },
      { topic: 'Work/Energy', score: 96, classAvg: 85 },
      { topic: 'Rotation', score: 93, classAvg: 81 },
      { topic: 'Lab Design', score: 97, classAvg: 87 },
    ],
    growthRate: '+12.0% semester gain',
    attendance: 97.8,
    gpa: '3.95 / 4.0',
    interventionNote: 'Consistent mastery throughout semester. Ready for honors level independent research project.',
  },
};

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  attendanceLogs,
  securityAlerts,
  grades,
  teacherName,
  initialStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'ai_narrative' | 'logs'>('tracker');
  const [selectedStudent, setSelectedStudent] = useState<string>(initialStudent || 'Alexander Wright');
  const [aiReportText, setAiReportText] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  React.useEffect(() => {
    if (initialStudent && semesterStudentData[initialStudent]) {
      setSelectedStudent(initialStudent);
    }
  }, [initialStudent]);

  const studentList = useMemo(() => {
    return Object.keys(semesterStudentData);
  }, []);

  const currentData = semesterStudentData[selectedStudent] || semesterStudentData['Alexander Wright'];

  if (!isOpen) return null;

  const handleGenerateAiReport = async () => {
    setIsGeneratingAi(true);
    setAiReportText('');
    sounds.playNfcTap();
    try {
      const res = await fetch('/api/gemini/student-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent,
          subject: 'AP Physics & Advanced STEM',
          attendanceRate: currentData.attendance,
          gradeTrend: currentData.trend,
          assignmentStats: { completed: 8, onTime: 8, gpa: currentData.gpa },
        }),
      });
      const data = await res.json();
      if (data.report) {
        setAiReportText(data.report);
        sounds.playSuccessChime();
      } else {
        setAiReportText('Unable to generate AI report at this time. Please check your network.');
      }
    } catch (e: any) {
      setAiReportText(`Error generating report: ${e?.message || 'Server error'}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white border border-[#E8E2D5] rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE5DB] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 font-bold">
              📈
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Semester Student Growth Tracker</h3>
              <p className="text-xs text-stone-500">Recharts Grade Trajectories & Automated Longitudinal Reporting</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handlePrint}
              className="text-xs bg-[#FAF8F5] hover:bg-[#F2ECE0] text-slate-800 px-3.5 py-1.5 rounded-xl border border-[#E2DCD0] font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>🖨️</span>
              <span>Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-2xl bg-[#F6F2E9] p-1 mb-5 border border-[#E2DCD0] shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'tracker' ? 'bg-blue-600 text-white shadow-sm' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            <span>📊</span>
            <span>Student Growth Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('ai_narrative')}
            className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'ai_narrative' ? 'bg-blue-600 text-white shadow-sm' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            <span>✨</span>
            <span>AI Narrative Synthesis</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'logs' ? 'bg-blue-600 text-white shadow-sm' : 'text-stone-700 hover:text-slate-900'
            }`}
          >
            <span>🛡️</span>
            <span>Security & Attendance Logs</span>
          </button>
        </div>

        {/* TAB 1: Student Growth Tracker with Recharts */}
        {activeTab === 'tracker' && (
          <div className="overflow-y-auto space-y-5 pr-1 flex-1">
            {/* Student Picker & Semester Top Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E2D5] flex flex-col justify-center">
                <label className="block text-[11px] font-mono text-stone-600 mb-1.5 uppercase font-bold">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={e => {
                    setSelectedStudent(e.target.value);
                    sounds.playNfcTap();
                  }}
                  className="w-full bg-white border border-[#E2DDD3] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  {studentList.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono text-stone-500">SEMESTER GROWTH</p>
                  <p className="text-xl font-extrabold text-blue-700 mt-0.5">{currentData.growthRate}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  ▲
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono text-stone-500">ESTIMATED GPA</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">{currentData.gpa}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  🎓
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono text-stone-500">ATTENDANCE</p>
                  <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{currentData.attendance}%</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ⏱️
                </div>
              </div>
            </div>

            {/* Recharts Area Chart: Semester Weekly Grade Progression */}
            <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>📈</span> Semester Grade Progression vs Class Benchmark
                  </h4>
                  <p className="text-xs text-stone-600">
                    Weekly performance trajectory tracking assessments, midterms, and lab milestones
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono font-medium">
                  <span className="flex items-center gap-1.5 text-blue-700">
                    <span className="w-3 h-3 rounded-full bg-blue-600" /> {selectedStudent}
                  </span>
                  <span className="flex items-center gap-1.5 text-stone-600">
                    <span className="w-3 h-3 rounded-full bg-stone-400" /> Class Cohort Avg
                  </span>
                </div>
              </div>

              {/* Responsive Container Chart */}
              <div className="w-full h-72 sm:h-80 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={currentData.trend}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorStudentLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorClassLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" />
                    <XAxis dataKey="label" stroke="#64748B" tick={{ fontSize: 11 }} />
                    <YAxis domain={[60, 100]} stroke="#64748B" tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#E2DDD0',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#0F172A',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                      formatter={(value: any, name: any) => [
                        `${value}%`,
                        name === 'studentScore' ? selectedStudent : 'Class Average',
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="studentScore"
                      name="Student Score"
                      stroke="#2563EB"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorStudentLight)"
                    />
                    <Area
                      type="monotone"
                      dataKey="classAverage"
                      name="Class Cohort Average"
                      stroke="#64748B"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorClassLight)"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Mastery Goal (85%)"
                      stroke="#059669"
                      strokeWidth={1.5}
                      strokeDasharray="2 2"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recharts Bar Chart: Topic Competency Breakdown */}
            <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>📊</span> STEM Topic & Skill Competency Mastery Breakdown
              </h4>
              <p className="text-xs text-stone-600">
                Direct comparison of student mastery across five curricular pillars against class standard
              </p>

              <div className="w-full h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentData.topics}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" />
                    <XAxis dataKey="topic" stroke="#64748B" tick={{ fontSize: 11 }} />
                    <YAxis domain={[50, 100]} stroke="#64748B" tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#E2DDD0',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#0F172A',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                      formatter={(val: any, name: any) => [
                        `${val}%`,
                        name === 'score' ? selectedStudent : 'Class Average',
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="score" name={selectedStudent} fill="#2563EB" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="classAvg" name="Class Average" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Faculty Pedagogical Observation Note */}
            <div className="bg-[#F6F2E9] p-4 rounded-2xl border border-[#E2DCD0] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] text-blue-700 font-bold uppercase">
                  RECOMMENDED INTERVENTION / NEXT MILESTONE
                </span>
                <p className="text-slate-900 font-medium mt-0.5">{currentData.interventionNote}</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('ai_narrative');
                  handleGenerateAiReport();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer shrink-0 shadow-md"
              >
                Generate Full AI Dossier →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AI Narrative Progress Report Generator */}
        {activeTab === 'ai_narrative' && (
          <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D5] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>✨</span> Automated Gemini AI Progress Dossier
                  </h4>
                  <p className="text-xs text-stone-600">
                    Produces a formal growth evaluation, strength diagnostics, and parent conference talking points.
                  </p>
                </div>
                <button
                  onClick={handleGenerateAiReport}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isGeneratingAi ? 'Analyzing Semester Trends...' : 'Run Gemini AI Analysis'}
                </button>
              </div>

              {aiReportText ? (
                <div className="mt-3 p-4 bg-white rounded-xl border border-[#E8E2D5] text-xs text-slate-900 whitespace-pre-line leading-relaxed font-sans max-h-96 overflow-y-auto shadow-inner">
                  {aiReportText}
                </div>
              ) : (
                <div className="p-8 text-center text-stone-500 border border-dashed border-[#DED6C7] rounded-xl bg-white">
                  Click &quot;Run Gemini AI Analysis&quot; to synthesize semester performance for {selectedStudent}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Security & Attendance Audit Logs */}
        {activeTab === 'logs' && (
          <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 mb-2 font-mono uppercase text-xs">Security & Access Logs</h4>
              <div className="space-y-2">
                {securityAlerts.length === 0 ? (
                  <p className="text-stone-500 py-3">No active security alerts.</p>
                ) : (
                  securityAlerts.map(alert => (
                    <div
                      key={alert.id || alert.cardId}
                      className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D5] flex items-center justify-between"
                    >
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          alert.severity === 'high' || alert.severity === 'critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {alert.type.replace('_', ' ')}
                        </span>
                        <p className="text-slate-900 mt-1 font-semibold">{alert.details}</p>
                      </div>
                      <div className="text-right font-mono text-stone-500 text-[11px]">
                        <p>{alert.timestamp}</p>
                        <p className={alert.resolved ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {alert.resolved ? 'RESOLVED' : 'UNRESOLVED'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-slate-900 mb-2 font-mono uppercase text-xs">Campus Entry/Exit Logs</h4>
              <div className="space-y-1.5">
                {attendanceLogs.map((log, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E8E2D5] flex justify-between">
                    <div>
                      <span className="font-bold text-slate-900 uppercase">{log.type}</span> - {log.location}
                      <span className="text-stone-500 ml-2">({log.method.toUpperCase()})</span>
                    </div>
                    <span className="font-mono text-stone-600 font-semibold">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
