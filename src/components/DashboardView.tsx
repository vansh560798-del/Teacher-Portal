import React, { useState } from 'react';
import { useLanguage } from '../lib/i18n';
import type {
  TeacherProfile,
  ClassItem,
  Assignment,
  GradeRecord,
  AttendanceRecord,
  SecurityAlert,
} from '../lib/types';
import { sounds } from '../lib/soundEffects';
import { SCHOOL_INFO } from '../lib/schoolAssets';
import { StudentProgressView } from './StudentProgressView';
import { ClickablePhoneNumber, PhoneNumberActionModal } from './PhoneNumberActionModal';

interface DashboardViewProps {
  profile: TeacherProfile;
  classes: ClassItem[];
  assignments: Assignment[];
  grades: GradeRecord[];
  attendanceLogs: AttendanceRecord[];
  securityAlerts: SecurityAlert[];
  onOpenNfcCard: () => void;
  onOpenAttendance: () => void;
  onOpenQR: () => void;
  onOpenEmergency: () => void;
  onOpenLostCard: () => void;
  onOpenReports: () => void;
  onOpenReportForStudent?: (studentName: string) => void;
  onOpenResources: () => void;
  onOpenLeaves: () => void;
  onOpenCopilot: () => void;
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onUpdateGrade: (gradeId: string, newScore: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  classes,
  assignments,
  grades,
  attendanceLogs,
  securityAlerts,
  onOpenNfcCard,
  onOpenAttendance,
  onOpenQR,
  onOpenEmergency,
  onOpenLostCard,
  onOpenReports,
  onOpenReportForStudent,
  onOpenResources,
  onOpenLeaves,
  onOpenCopilot,
  onAddAssignment,
  onUpdateGrade,
}) => {
  const { t } = useLanguage();
  const [portalTab, setPortalTab] = useState<'overview' | 'student_progress'>('overview');
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState(classes[0]?.className || 'AP Physics');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMaxScore, setNewMaxScore] = useState(100);

  // Door unlock notification banner (replaces window.alert)
  const [unlockedRoomMessage, setUnlockedRoomMessage] = useState<string>('');
  const [showHelplineModal, setShowHelplineModal] = useState<boolean>(false);

  // Today's clock in status
  const lastAttendance = attendanceLogs[0];
  const isClockedIn = lastAttendance?.type === 'check-in';

  // Compute stats
  const totalStudents = classes.reduce((acc, c) => acc + (c.studentCount || 0), 0);
  const activeAssignments = assignments.filter(a => a.status === 'active');
  const avgClassScore =
    grades.length > 0
      ? Math.round(grades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / grades.length)
      : 92;

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    onAddAssignment({
      teacherId: profile.userId,
      className: newClass,
      title: newTitle,
      dueDate: newDueDate || 'In 7 days',
      maxScore: Number(newMaxScore) || 100,
      submissionsCount: 0,
      status: 'active',
      createdAt: new Date().toLocaleDateString(),
    });
    sounds.playSuccessChime();
    setNewTitle('');
    setShowNewAssignmentModal(false);
  };

  const handleUnlockRoom = (room: string) => {
    sounds.playSuccessChime();
    setUnlockedRoomMessage(`✓ Classroom door access granted for ${room}! Token valid for 10 minutes.`);
    setTimeout(() => setUnlockedRoomMessage(''), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-8 space-y-4 sm:space-y-8 w-full max-w-full overflow-hidden">
      {/* 1. Hero Teacher Dossier Banner: St. Arnold's Royal Blue & Gold Theme */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0C1748] via-[#16287A] to-[#1E3A8A] border border-[#CFA442]/40 p-3.5 sm:p-6 lg:p-8 shadow-xl text-white">
        {/* Subtle decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#CFA442]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-[#991B1B]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-row items-center sm:items-start gap-3 sm:gap-5 w-full lg:w-auto">
            {/* School Emblem / Avatar badge */}
            <div className="relative group cursor-pointer shrink-0" onClick={onOpenNfcCard}>
              <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#CFA442] to-white p-0.5 shadow-lg shadow-blue-950/40">
                <img
                  src={SCHOOL_INFO.logoEmblem}
                  alt="Emblem"
                  className="w-full h-full object-contain rounded-[14px] bg-white p-1"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] sm:text-[10px] text-white" title="NFC Authenticated">
                ✓
              </div>
            </div>

            {/* Teacher Details */}
            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight truncate">
                  {profile.name}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-mono font-bold ${
                  profile.cardStatus === 'active'
                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/30'
                    : 'bg-rose-500/30 text-rose-200 border border-rose-400/30'
                }`}>
                  ● {profile.cardStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium truncate">
                {profile.designation} — <span className="text-amber-200">{profile.department}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[9px] sm:text-xs font-mono text-blue-200 pt-0.5">
                <span>Staff ID: <span className="text-white font-semibold">{profile.staffId}</span></span>
                <span className="hidden sm:inline">•</span>
                <span className="truncate max-w-[140px] sm:max-w-none">NFC: <span className="text-amber-300 font-bold">{profile.nfcCardId}</span></span>
              </div>
            </div>
          </div>

          {/* Action Hub Buttons (Touch friendly & mobile responsive) */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={onOpenNfcCard}
              className="flex-1 lg:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            >
              <span>⚡</span>
              <span>Tap Badge</span>
            </button>

            <button
              onClick={onOpenAttendance}
              className={`flex-1 lg:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-95 ${
                isClockedIn
                  ? 'bg-emerald-500/30 border border-emerald-300 text-emerald-100'
                  : 'bg-white hover:bg-[#FAF5EB] text-[#16287A] font-bold'
              }`}
            >
              <span>⏱️</span>
              <span className="truncate">{isClockedIn ? 'Clocked In' : 'Check-In'}</span>
            </button>

            <button
              onClick={onOpenCopilot}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#CFA442] hover:bg-[#E6B95C] text-[#0C1748] font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-95 shrink-0"
            >
              <span>✨</span>
              <span className="hidden sm:inline">AI Partner</span>
            </button>
          </div>
        </div>
      </section>

      {/* Door Unlock Banner Notification */}
      {unlockedRoomMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold font-mono animate-in fade-in duration-200 flex items-center justify-between">
          <span>{unlockedRoomMessage}</span>
          <button onClick={() => setUnlockedRoomMessage('')} className="text-emerald-700 hover:text-emerald-950 font-bold ml-2">✕</button>
        </div>
      )}

      {/* 2. Key Metrics Row: 2-column on mobile, 4-column on desktop */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-5 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase text-stone-600">Classes</span>
            <span className="p-1 rounded-lg bg-blue-50 text-[#16287A] text-xs sm:text-base">📚</span>
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-[#16287A]">{classes.length}</p>
          <p className="text-[9px] sm:text-[11px] text-stone-500 mt-0.5 truncate">{totalStudents} active students</p>
        </div>

        <div className="p-3 sm:p-5 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase text-stone-600">Assignments</span>
            <span className="p-1 rounded-lg bg-amber-50 text-amber-800 text-xs sm:text-base">📝</span>
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-slate-900">{activeAssignments.length}</p>
          <p className="text-[9px] sm:text-[11px] text-amber-800 font-semibold mt-0.5 truncate">2 due this week</p>
        </div>

        <div className="p-3 sm:p-5 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase text-stone-600">Cohort Score</span>
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs sm:text-base">📈</span>
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-[#16287A]">{avgClassScore}%</p>
          <p className="text-[9px] sm:text-[11px] text-emerald-700 font-semibold mt-0.5 truncate">+3.2% vs last term</p>
        </div>

        <div className="p-3 sm:p-5 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase text-stone-600">NFC Gate</span>
            <span className="p-1 rounded-lg bg-blue-50 text-[#16287A] text-xs sm:text-base">🛡️</span>
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-[#16287A]">Secured</p>
          <p className="text-[9px] sm:text-[11px] text-stone-500 mt-0.5 truncate">Active 13.56MHz</p>
        </div>
      </section>

      {/* 3. Fast Actions Command Grid: 2 columns on phone, 3 on tablet, 6 on desktop */}
      <section className="space-y-2">
        <h3 className="text-[10px] sm:text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider">
          {t.quickActions}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          <button
            onClick={onOpenNfcCard}
            className="p-3 rounded-2xl bg-white border border-[#E8DEC8] hover:border-[#16287A] hover:bg-[#FAF5EB] transition text-left space-y-1 group cursor-pointer shadow-2xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#16287A] flex items-center justify-center text-sm shadow-2xs">
              💳
            </div>
            <div>
              <p className="font-bold text-xs text-[#16287A]">St. Arnold&apos;s NFC</p>
              <p className="text-[10px] text-stone-500">Tap Credential</p>
            </div>
          </button>

          <button
            onClick={onOpenQR}
            className="p-3 rounded-2xl bg-white border border-[#E8DEC8] hover:border-[#16287A] hover:bg-[#FAF5EB] transition text-left space-y-1 group cursor-pointer shadow-2xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#16287A] flex items-center justify-center text-sm shadow-2xs">
              📱
            </div>
            <div>
              <p className="font-bold text-xs text-[#16287A]">Staff QR Pass</p>
              <p className="text-[10px] text-stone-500">Checkpoint Code</p>
            </div>
          </button>

          {/* Campus Helpline button (Call & WhatsApp) - Replaced Biometric */}
          <button
            onClick={() => setShowHelplineModal(true)}
            className="p-3 rounded-2xl bg-white border border-[#E8DEC8] hover:border-emerald-600 hover:bg-emerald-50/40 transition text-left space-y-1 group cursor-pointer shadow-2xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm shadow-2xs">
              📞
            </div>
            <div>
              <p className="font-bold text-xs text-emerald-800">Helpline / WA</p>
              <p className="text-[10px] text-stone-500">Call & WhatsApp</p>
            </div>
          </button>

          <button
            onClick={onOpenReports}
            className="p-3 rounded-2xl bg-white border border-[#E8DEC8] hover:border-[#16287A] hover:bg-[#FAF5EB] transition text-left space-y-1 group cursor-pointer shadow-2xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm shadow-2xs">
              📊
            </div>
            <div>
              <p className="font-bold text-xs text-[#16287A]">Growth Analytics</p>
              <p className="text-[10px] text-stone-500">Term Trajectory</p>
            </div>
          </button>

          <button
            onClick={onOpenResources}
            className="p-3 rounded-2xl bg-white border border-[#E8DEC8] hover:border-[#16287A] hover:bg-[#FAF5EB] transition text-left space-y-1 group cursor-pointer shadow-2xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm shadow-2xs">
              📂
            </div>
            <div>
              <p className="font-bold text-xs text-[#16287A]">Resource Vault</p>
              <p className="text-[10px] text-stone-500">Lesson Plans</p>
            </div>
          </button>

          <button
            onClick={onOpenLostCard}
            className="p-3 rounded-2xl bg-white border border-[#E8DEC8] hover:border-rose-400 hover:bg-rose-50/30 transition text-left space-y-1 group cursor-pointer shadow-2xs active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm shadow-2xs">
              🔒
            </div>
            <div>
              <p className="font-bold text-xs text-[#16287A]">Lost-Card Lock</p>
              <p className="text-[10px] text-stone-500">Central Kill-Switch</p>
            </div>
          </button>
        </div>
      </section>

      {/* 4. Portal View Mode Switcher: Daily Operations vs Student Growth Cards */}
      <div className="flex flex-col sm:flex-row rounded-2xl bg-[#EFE3CF] p-1 border border-[#DECBB3] shadow-xs gap-1 sm:gap-0">
        <button
          onClick={() => {
            setPortalTab('overview');
            sounds.playNfcTap();
          }}
          className={`flex-1 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
            portalTab === 'overview'
              ? 'bg-[#16287A] text-white shadow-md'
              : 'text-stone-700 hover:text-slate-900'
          }`}
        >
          <span>📅</span>
          <span>Classroom Schedule & Curriculum</span>
        </button>
        <button
          onClick={() => {
            setPortalTab('student_progress');
            sounds.playNfcTap();
          }}
          className={`flex-1 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
            portalTab === 'student_progress'
              ? 'bg-[#16287A] text-white shadow-md'
              : 'text-stone-700 hover:text-slate-900'
          }`}
        >
          <span>👨‍🎓</span>
          <span>Student Progress & Growth Cards</span>
        </button>
      </div>

      {/* Conditional Content based on selected View Mode */}
      {portalTab === 'student_progress' ? (
        <StudentProgressView onOpenReportForStudent={onOpenReportForStudent || onOpenReports} />
      ) : (
        /* 5. Two-Column Core: Timetable & Classes vs Assignments & Notices */
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Left Column: Today's Timetable & Classroom Door Access */}
          <section className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="bg-white border border-[#E8DEC8] rounded-3xl p-3.5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 sm:mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#16287A] flex items-center justify-center font-bold text-base">
                    🏫
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#16287A]">Today&apos;s Class Schedule</h3>
                    <p className="text-[11px] text-stone-500">Curriculum timetable & door access</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF5EB] text-stone-700 border border-[#E8DEC8] self-start sm:self-auto">
                  {classes.length} Scheduled Sessions
                </span>
              </div>

              {/* Class Schedule Cards */}
              <div className="space-y-2.5">
                {classes.map(cls => (
                  <div
                    key={cls.id || cls.className}
                    className="p-3 sm:p-4 rounded-2xl bg-[#FAF5EB] border border-[#E8DEC8] hover:border-[#16287A] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#D8C7AA] flex flex-col items-center justify-center font-mono text-[#16287A] shrink-0 shadow-2xs">
                        <span className="text-[9px] uppercase font-bold text-stone-400">Rm</span>
                        <span className="font-extrabold text-xs">{cls.room.replace('Lab ', 'L').replace('Room ', 'R')}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{cls.className}</h4>
                        <p className="text-[11px] sm:text-xs text-stone-600">
                          {cls.subject} • {cls.grade} • <span className="text-[#16287A] font-bold">{cls.room}</span>
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-mono text-stone-500 mt-0.5">{cls.schedule}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8DEC8]">
                      <span className="text-xs font-mono text-stone-500 font-medium">{cls.studentCount} students</span>
                      <button
                        onClick={() => handleUnlockRoom(cls.room)}
                        className="text-xs px-3 py-1.5 rounded-xl bg-[#16287A] hover:bg-[#1E3A8A] text-white font-semibold transition cursor-pointer shadow-xs active:scale-95"
                      >
                        🔑 Unlock Door
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Performance Mastery Distribution Section */}
            <div className="bg-white border border-[#E8DEC8] rounded-3xl p-3.5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#16287A] flex items-center justify-center font-bold text-base">
                    📈
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#16287A]">Student Mastery Distribution</h3>
                    <p className="text-[11px] text-stone-500">St. Arnold&apos;s academic semester benchmarking</p>
                  </div>
                </div>
                <button
                  onClick={onOpenReports}
                  className="text-xs text-[#16287A] hover:underline font-bold cursor-pointer"
                >
                  Analytics →
                </button>
              </div>

              {/* Visual Grade Distribution Bar Chart */}
              <div className="bg-[#FAF5EB] p-3.5 sm:p-5 rounded-2xl border border-[#E8DEC8] space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-stone-600">
                  <span className="truncate">Cohort: Advanced Sciences</span>
                  <span className="text-[#16287A] font-bold">92% Average Mastery</span>
                </div>

                {/* Progress bars in School Colors */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-xs">
                  {[
                    { label: 'Grade A', pct: 45, count: '14 std', color: 'bg-[#16287A]' },
                    { label: 'Grade B', pct: 35, count: '11 std', color: 'bg-[#2563EB]' },
                    { label: 'Grade C', pct: 15, count: '5 std', color: 'bg-[#CFA442]' },
                    { label: 'Grade D', pct: 4, count: '1 std', color: 'bg-stone-400' },
                    { label: 'Grade F', pct: 1, count: '0 std', color: 'bg-[#991B1B]' },
                  ].map((tier, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="h-20 sm:h-28 bg-[#F0E6D5] rounded-xl flex items-end p-1 justify-center">
                        <div
                          className={`w-full rounded-lg ${tier.color} transition-all duration-500 shadow-2xs`}
                          style={{ height: `${tier.pct}%` }}
                        />
                      </div>
                      <p className="font-bold text-[10px] sm:text-xs text-slate-800 leading-tight">{tier.label}</p>
                      <p className="text-[9px] text-stone-500 font-semibold">{tier.pct}%</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setPortalTab('student_progress');
                    sounds.playNfcTap();
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-[#E8DEC8] text-xs font-bold text-[#16287A] transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>👨‍🎓 Open Individual Student Progress Cards & Growth Trends →</span>
                </button>
              </div>
            </div>
          </section>

          {/* Right Column: Assignments Management & School Announcements */}
          <section className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-white border border-[#E8DEC8] rounded-3xl p-3.5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                    📝
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#16287A]">Assignment Tracker</h3>
                    <p className="text-[11px] text-stone-500">Curriculum submissions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewAssignmentModal(true)}
                  className="text-xs bg-[#16287A] hover:bg-[#1E3A8A] text-white px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shadow-xs active:scale-95"
                >
                  + Create
                </button>
              </div>

              {/* Assignments List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {assignments.map(a => (
                  <div
                    key={a.id || a.title}
                    className="p-3 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8] hover:border-[#16287A] transition space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#16287A] font-bold truncate max-w-[150px]">{a.className}</span>
                      <span className="font-mono text-stone-500 text-[10px]">Due: {a.dueDate}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{a.title}</h4>
                    <div className="flex items-center justify-between text-stone-600 pt-1 border-t border-[#E8DEC8]">
                      <span>Max: <strong className="text-slate-900">{a.maxScore} pts</strong></span>
                      <span className="text-emerald-700 font-semibold">
                        {a.submissionsCount || 28} Submitted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* St. Arnold's School Announcements Card */}
            <div className="bg-white border border-[#E8DEC8] rounded-3xl p-3.5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base text-[#16287A] flex items-center gap-2">
                  <span>📢</span> St. Arnold&apos;s Notices
                </h3>
                <button
                  onClick={onOpenLeaves}
                  className="text-xs text-[#16287A] hover:underline font-bold cursor-pointer"
                >
                  Leaves →
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#E8DEC8]">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-[#991B1B] border border-rose-200 uppercase">
                    Godhra Campus Notice
                  </span>
                  <p className="font-bold text-slate-900 mt-1">Gujarat Board Mid-Term Examination Evaluation</p>
                  <p className="text-stone-600 text-[11px] mt-0.5">Faculty meeting in Auditorium 1 at 03:30 PM. All class progress sheets to be synchronized.</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#E8DEC8]">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    Smart Turnstiles
                  </span>
                  <p className="font-bold text-slate-900 mt-1">St. Arnold&apos;s NFC Reader Station Active</p>
                  <p className="text-stone-600 text-[11px] mt-0.5">Main gate readers now feature instantaneous offline token validation for all faculty.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* New Assignment Modal */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md bg-white border border-[#E8DEC8] rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="font-bold text-base text-[#16287A]">Create Class Assignment</h3>
              <button
                onClick={() => setShowNewAssignmentModal(false)}
                className="text-stone-400 hover:text-slate-900 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Electromagnetic Induction Lab Report"
                  className="w-full px-3 py-2 bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl text-slate-900 focus:outline-none focus:border-[#16287A] text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Target Class</label>
                <select
                  value={newClass}
                  onChange={e => setNewClass(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl text-slate-900 focus:outline-none focus:border-[#16287A]"
                >
                  {classes.map(c => (
                    <option key={c.id || c.className} value={c.className}>
                      {c.className} ({c.room})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    placeholder="e.g. Next Tuesday"
                    className="w-full px-3 py-2 bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl text-slate-900 focus:outline-none focus:border-[#16287A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={newMaxScore}
                    onChange={e => setNewMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl text-slate-900 focus:outline-none focus:border-[#16287A]"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAssignmentModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF5EB] text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#16287A] hover:bg-[#1E3A8A] text-white font-bold"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campus Helpline Modal (Call & WhatsApp Options) */}
      <PhoneNumberActionModal
        isOpen={showHelplineModal}
        onClose={() => setShowHelplineModal(false)}
        phoneNumber="+91 (2672) 240-9102"
        contactName="St. Arnold's Campus Administration"
        contextLabel="Godhra Administration Hotline"
      />
    </main>
  );
};
