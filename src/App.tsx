/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser } from './lib/firebase';
import { LanguageProvider } from './lib/i18n';
import type {
  TeacherProfile,
  ClassItem,
  Assignment,
  GradeRecord,
  TeachingResource,
  LeaveRequest,
  AttendanceRecord,
  SecurityAlert,
  SystemNotification,
} from './lib/types';
import { sounds } from './lib/soundEffects';
import { SCHOOL_INFO } from './lib/schoolAssets';

// Components
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { DigitalNfcCard } from './components/DigitalNfcCard';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { SmartAttendanceModal } from './components/SmartAttendanceModal';
import { DigitalStaffVerificationModal } from './components/DigitalStaffVerificationModal';
import { EmergencyModal } from './components/EmergencyModal';
import { LostCardModal } from './components/LostCardModal';
import { ReportsModal } from './components/ReportsModal';
import { ResourceLibraryModal } from './components/ResourceLibraryModal';
import { LeaveManagementModal } from './components/LeaveManagementModal';
import { GeminiCopilotDrawer } from './components/GeminiCopilotDrawer';

// Initial default seed profile for St. Arnold's High School, Godhra
const initialTeacherProfile: TeacherProfile = {
  userId: 'teacher_st_arnolds_1',
  name: 'Dr. Evelyn Reed',
  photoUrl: '',
  staffId: 'SA-8842-SEC',
  designation: 'Senior Faculty Lead & STEM Coordinator',
  department: "St. Arnold's High School, Godhra",
  email: 'evelyn.reed@starnoldsgodhra.edu',
  phone: '+91 (2672) 240-9102',
  role: 'teacher',
  nfcCardId: 'NFC-9F4A-71BC-2026',
  cardStatus: 'active',
  biometricEnrolled: true,
  emergencyContactName: 'Dr. Marcus Vance (Spouse)',
  emergencyContactPhone: '+91 98250 88190',
  emergencyMedicalNotes: 'Penicillin Allergy; Carry Epipen; Blood Type O+',
  updatedAt: new Date().toISOString(),
};

const initialClasses: ClassItem[] = [
  {
    id: 'C1',
    teacherId: 'teacher_st_arnolds_1',
    className: 'Physics & Mechanics (12th Grade)',
    grade: 'Grade 12 Science',
    room: 'Science Lab 2',
    subject: 'Physics',
    schedule: 'Mon, Wed, Fri • 08:30 - 09:45 AM',
    studentCount: 32,
  },
  {
    id: 'C2',
    teacherId: 'teacher_st_arnolds_1',
    className: 'Higher Mathematics & Vectors',
    grade: 'Grade 11 & 12',
    room: 'Room 204',
    subject: 'Mathematics',
    schedule: 'Mon, Wed, Fri • 10:00 - 11:15 AM',
    studentCount: 36,
  },
  {
    id: 'C3',
    teacherId: 'teacher_st_arnolds_1',
    className: 'Modern Physics & Quantum Concepts',
    grade: 'Grade 12 Honors',
    room: 'Auditorium Hall B',
    subject: 'Physics',
    schedule: 'Tue, Thu • 01:00 - 02:30 PM',
    studentCount: 28,
  },
  {
    id: 'C4',
    teacherId: 'teacher_st_arnolds_1',
    className: 'STEM Senior Capstone & Robotics',
    grade: 'Senior Secondary',
    room: 'Innovation Lab 1',
    subject: 'STEM',
    schedule: 'Tue, Thu • 02:45 - 04:00 PM',
    studentCount: 22,
  },
];

const initialAssignments: Assignment[] = [
  {
    id: 'A1',
    teacherId: 'teacher_st_arnolds_1',
    className: 'Physics & Mechanics (12th Grade)',
    title: 'Rotational Dynamics & Angular Momentum Lab Write-Up',
    instructions: 'Submit raw sensor graphs, uncertainty analysis, and formal conclusions.',
    dueDate: '2026-10-24',
    maxScore: 100,
    submissionsCount: 29,
    status: 'active',
    createdAt: '2026-10-18',
  },
  {
    id: 'A2',
    teacherId: 'teacher_st_arnolds_1',
    className: 'Higher Mathematics & Vectors',
    title: 'Lagrange Multipliers & Vectors Problem Set #4',
    instructions: 'Solve constrained optimization problems with step-by-step vector proofs.',
    dueDate: '2026-10-26',
    maxScore: 50,
    submissionsCount: 34,
    status: 'active',
    createdAt: '2026-10-19',
  },
  {
    id: 'A3',
    teacherId: 'teacher_st_arnolds_1',
    className: 'Modern Physics & Quantum Concepts',
    title: 'Wavepacket Dynamics & 1D Potential Barrier',
    instructions: 'Computational analysis notebook modeling quantum tunneling probabilities.',
    dueDate: '2026-10-29',
    maxScore: 100,
    submissionsCount: 24,
    status: 'active',
    createdAt: '2026-10-19',
  },
];

const initialGrades: GradeRecord[] = [
  {
    id: 'G1',
    teacherId: 'teacher_st_arnolds_1',
    studentId: 'S1',
    studentName: 'Alexander Wright',
    score: 96,
    maxScore: 100,
    letterGrade: 'A',
    feedback: 'Outstanding mathematical derivation and error bar analysis.',
    date: '2026-10-19',
  },
  {
    id: 'G2',
    teacherId: 'teacher_st_arnolds_1',
    studentId: 'S2',
    studentName: 'Sophia Chen',
    score: 92,
    maxScore: 100,
    letterGrade: 'A',
    feedback: 'Clear experimental setup and rigorous conclusions.',
    date: '2026-10-19',
  },
  {
    id: 'G3',
    teacherId: 'teacher_st_arnolds_1',
    studentId: 'S3',
    studentName: 'Liam Patel',
    score: 84,
    maxScore: 100,
    letterGrade: 'B',
    feedback: 'Good comprehension; check unit conversions in section 3.',
    date: '2026-10-19',
  },
  {
    id: 'G4',
    teacherId: 'teacher_st_arnolds_1',
    studentId: 'S4',
    studentName: 'Emma Davis',
    score: 95,
    maxScore: 100,
    letterGrade: 'A',
    feedback: 'Brilliant conceptual synthesis.',
    date: '2026-10-19',
  },
];

const initialResources: TeachingResource[] = [
  {
    id: 'R1',
    teacherId: 'teacher_st_arnolds_1',
    title: "St. Arnold's Kinematics Master Slide Deck",
    type: 'presentation',
    subject: 'Physics',
    description: 'Comprehensive 42-slide deck with embedded interactive laboratory exercises.',
    tags: 'Kinematics, Vectors, Mechanics',
    createdAt: '2026-10-15',
  },
  {
    id: 'R2',
    teacherId: 'teacher_st_arnolds_1',
    title: 'Partial Derivatives & Gradient Vectors Summary Notes',
    type: 'note',
    subject: 'Mathematics',
    description: 'Concise 6-page study guide with worked problem examples.',
    tags: 'Calculus, Vectors, Derivatives',
    createdAt: '2026-10-16',
  },
  {
    id: 'R3',
    teacherId: 'teacher_st_arnolds_1',
    title: 'Quantum Tunneling & Alpha Decay 50-Min Lesson Plan',
    type: 'plan',
    subject: 'Modern Physics',
    description: 'Inquiry-based lesson plan following the 5E pedagogical framework.',
    tags: 'Quantum, Lesson Plan, 5E',
    createdAt: '2026-10-17',
  },
];

const initialLeaves: LeaveRequest[] = [
  {
    id: 'L1',
    teacherId: 'teacher_st_arnolds_1',
    teacherName: 'Dr. Evelyn Reed',
    leaveType: 'conference',
    startDate: '2026-11-04',
    endDate: '2026-11-06',
    reason: 'Presenting research paper at National Science Teachers Association (NSTA) Annual Summit.',
    status: 'approved',
    reviewedBy: 'Principal Office, St. Arnold\'s High School',
    createdAt: '2026-10-12',
  },
];

const initialAttendance: AttendanceRecord[] = [
  {
    id: 'ATT1',
    teacherId: 'teacher_st_arnolds_1',
    teacherName: 'Dr. Evelyn Reed',
    staffId: 'SA-8842-SEC',
    timestamp: '2026-10-20 07:48:12 AM',
    type: 'check-in',
    method: 'nfc',
    location: 'St. Arnold\'s Main Gate Terminal',
    status: 'verified',
    createdAt: '2026-10-20',
  },
  {
    id: 'ATT2',
    teacherId: 'teacher_st_arnolds_1',
    teacherName: 'Dr. Evelyn Reed',
    staffId: 'SA-8842-SEC',
    timestamp: '2026-10-19 04:35:20 PM',
    type: 'check-out',
    method: 'nfc',
    location: 'Godhra Campus Science Wing Kiosk 2',
    status: 'verified',
    createdAt: '2026-10-19',
  },
];

const initialSecurityAlerts: SecurityAlert[] = [
  {
    id: 'SEC1',
    teacherId: 'teacher_st_arnolds_1',
    cardId: 'NFC-9F4A-71BC-2026',
    type: 'unauthorized_scan',
    severity: 'low',
    details: 'After-hours badge query at Science Vault reader safely logged.',
    resolved: true,
    timestamp: '2026-10-19 09:22 PM',
  },
];

const initialNotifications: SystemNotification[] = [
  {
    id: 'N1',
    title: 'St. Arnold\'s Attendance Clock-In',
    message: 'Clock-in confirmed at Main Campus Entrance Terminal via NFC token.',
    type: 'success',
    timestamp: '07:48 AM',
    read: false,
  },
  {
    id: 'N2',
    title: 'Conference Leave Approved',
    message: 'NSTA Summit travel leave for Nov 4-6 approved by Principal Office.',
    type: 'info',
    timestamp: 'Yesterday',
    read: false,
  },
  {
    id: 'N3',
    title: 'Campus Central Security Check',
    message: 'NFC credentials cryptographically re-keyed with 256-bit AES protocol.',
    type: 'alert',
    timestamp: 'Oct 18',
    read: true,
  },
];

import { getStoredFacultyRoster, saveFacultyRoster, registerNewTeacherDossier, type TeacherDossier } from './lib/mockFaculty';

export default function App() {
  // Splash and Login Screen state
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('st_arnolds_logged_in') === 'true';
  });

  // Multi-Faculty Roster State (stored and synced)
  const [roster, setRoster] = useState<TeacherDossier[]>(() => getStoredFacultyRoster());

  // Logged-in authenticated account profile
  const [loggedInProfile, setLoggedInProfile] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem('airnix_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const initialRoster = getStoredFacultyRoster();
    return initialRoster[0].profile; // Default to Principal Fr. George Thomas
  });

  // Admin Supervisor Feature: when Admin is logged in, they can view any teacher's dashboard
  const [viewingTeacherId, setViewingTeacherId] = useState<string | null>(null);

  // Active Dossier:
  // If the logged-in user is 'admin' and has selected a teacher, view that teacher's dossier.
  // Otherwise, view the logged-in user's own dossier.
  const activeDossier: TeacherDossier = React.useMemo(() => {
    if (loggedInProfile.role === 'admin' && viewingTeacherId) {
      const found = roster.find(d => d.profile.userId === viewingTeacherId);
      if (found) return found;
    }
    const self = roster.find(d => d.profile.userId === loggedInProfile.userId);
    return self || roster[0];
  }, [roster, loggedInProfile, viewingTeacherId]);

  const profile = activeDossier.profile;
  const classes = activeDossier.classes;
  const assignments = activeDossier.assignments;
  const grades = activeDossier.grades;
  const attendanceLogs = activeDossier.attendanceLogs;
  const leaves = activeDossier.leaves;

  const [resources, setResources] = useState<TeachingResource[]>(initialResources);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(initialSecurityAlerts);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);

  // Connectivity & Sync state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Active Modals & Views
  const [showNfcCardModal, setShowNfcCardModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showLostCardModal, setShowLostCardModal] = useState<boolean>(false);
  const [showReportsModal, setShowReportsModal] = useState<boolean>(false);
  const [showResourcesModal, setShowResourcesModal] = useState<boolean>(false);
  const [showLeavesModal, setShowLeavesModal] = useState<boolean>(false);
  const [showCopilotDrawer, setShowCopilotDrawer] = useState<boolean>(false);
  const [reportStudentName, setReportStudentName] = useState<string>('Alexander Wright');

  // Helper to update active teacher's dossier in roster and persist
  const updateActiveDossier = (updater: (prev: TeacherDossier) => TeacherDossier) => {
    setRoster(prevRoster => {
      const updated = prevRoster.map(dossier => {
        if (dossier.profile.userId === activeDossier.profile.userId) {
          return updater(dossier);
        }
        return dossier;
      });
      saveFacultyRoster(updated);
      return updated;
    });
  };

  // Network state listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      performSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('st_arnolds_logged_in', 'true');
        const updated = {
          ...loggedInProfile,
          userId: user.uid,
          name: user.displayName || loggedInProfile.name,
          email: user.email || loggedInProfile.email,
          photoUrl: user.photoURL || loggedInProfile.photoUrl,
        };
        setLoggedInProfile(updated);
        localStorage.setItem('airnix_profile', JSON.stringify(updated));
      }
    });
    return () => unsubscribe();
  }, [loggedInProfile]);

  // Cloud Sync Handler
  const performSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      if (auth.currentUser) {
        const teacherRef = doc(db, 'teachers', auth.currentUser.uid);
        await setDoc(
          teacherRef,
          {
            userId: auth.currentUser.uid,
            name: profile.name,
            photoUrl: profile.photoUrl || '',
            staffId: profile.staffId,
            designation: profile.designation,
            department: profile.department,
            email: profile.email,
            phone: profile.phone,
            nfcCardId: profile.nfcCardId,
            cardStatus: profile.cardStatus,
            biometricEnrolled: profile.biometricEnrolled,
            emergencyContactName: profile.emergencyContactName,
            emergencyContactPhone: profile.emergencyContactPhone,
            emergencyMedicalNotes: profile.emergencyMedicalNotes,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Sync notice: Working with cached offline storage.', err);
    } finally {
      setIsSyncing(false);
    }
  }, [profile]);

  // Login handler
  const handleLoginSuccess = (userProfile: TeacherProfile) => {
    setIsAuthenticated(true);
    localStorage.setItem('st_arnolds_logged_in', 'true');
    localStorage.setItem('airnix_profile', JSON.stringify(userProfile));
    setLoggedInProfile(userProfile);
    setViewingTeacherId(null);
    setRoster(getStoredFacultyRoster());
    sounds.playSuccessChime();
  };

  // Sign Up handler (New Teacher Registration)
  const handleSignUpSuccess = (newTeacherProfile: TeacherProfile) => {
    const currentRoster = getStoredFacultyRoster();
    setRoster(currentRoster);
    handleLoginSuccess(newTeacherProfile);
  };

  // Logout handler
  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    localStorage.removeItem('st_arnolds_logged_in');
    setViewingTeacherId(null);
    sounds.playNfcTap();
  };

  // Save profile updates
  const handleUpdateProfile = (updated: Partial<TeacherProfile>) => {
    updateActiveDossier(current => {
      const nextProfile = { ...current.profile, ...updated, updatedAt: new Date().toISOString() };
      if (current.profile.userId === loggedInProfile.userId) {
        setLoggedInProfile(nextProfile);
        localStorage.setItem('airnix_profile', JSON.stringify(nextProfile));
      }
      return { ...current, profile: nextProfile };
    });
    performSync();
  };

  // Record Attendance
  const handleRecordAttendance = (
    type: 'check-in' | 'check-out',
    location: string,
    method: 'nfc' | 'biometric' | 'manual'
  ) => {
    const newRecord: AttendanceRecord = {
      id: `ATT_${Date.now()}`,
      teacherId: profile.userId,
      teacherName: profile.name,
      staffId: profile.staffId,
      timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      type,
      method,
      location,
      status: 'verified',
      createdAt: new Date().toISOString(),
    };

    updateActiveDossier(current => ({
      ...current,
      attendanceLogs: [newRecord, ...current.attendanceLogs],
    }));

    const newNotif: SystemNotification = {
      id: `N_${Date.now()}`,
      title: `${type === 'check-in' ? 'Clocked In' : 'Clocked Out'} Successfully`,
      message: `Verified via ${method.toUpperCase()} at ${location}.`,
      type: 'success',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    performSync();
  };

  // Toggle Card Lost/Deactivated Status
  const handleToggleCardStatus = (newStatus: 'active' | 'lost' | 'deactivated') => {
    handleUpdateProfile({ cardStatus: newStatus });

    if (newStatus === 'lost' || newStatus === 'deactivated') {
      const alert: SecurityAlert = {
        id: `SEC_${Date.now()}`,
        teacherId: profile.userId,
        cardId: profile.nfcCardId,
        type: 'lost_card',
        severity: 'high',
        details: `NFC Smart Card ${profile.nfcCardId} revoked via St. Arnold's Central Kill-Switch.`,
        resolved: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setSecurityAlerts(prev => [alert, ...prev]);

      const notif: SystemNotification = {
        id: `N_${Date.now()}`,
        title: 'Central Kill-Switch Activated',
        message: `Badge ${profile.nfcCardId} locked across all Godhra campus readers.`,
        type: 'alert',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setNotifications(prev => [notif, ...prev]);
    } else {
      const notif: SystemNotification = {
        id: `N_${Date.now()}`,
        title: 'Badge Reactivated',
        message: `Badge ${profile.nfcCardId} reactivated and campus access permissions restored.`,
        type: 'info',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Add Assignment
  const handleAddAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const created: Assignment = {
      ...newAssignment,
      id: `A_${Date.now()}`,
    };
    updateActiveDossier(current => ({
      ...current,
      assignments: [created, ...current.assignments],
    }));
    performSync();
  };

  // Add Teaching Resource
  const handleAddResource = (newRes: Omit<TeachingResource, 'id'>) => {
    const created: TeachingResource = {
      ...newRes,
      id: `R_${Date.now()}`,
    };
    setResources(prev => [created, ...prev]);
    performSync();
  };

  // Submit Leave
  const handleSubmitLeave = (newLeave: Omit<LeaveRequest, 'id'>) => {
    const created: LeaveRequest = {
      ...newLeave,
      id: `L_${Date.now()}`,
    };
    updateActiveDossier(current => ({
      ...current,
      leaves: [created, ...current.leaves],
    }));
    setNotifications(prev => [
      {
        id: `N_${Date.now()}`,
        title: 'Leave Application Filed',
        message: `${created.leaveType.toUpperCase()} leave request submitted to St. Arnold's Principal Office.`,
        type: 'info',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      },
      ...prev,
    ]);
    performSync();
  };

  return (
    <LanguageProvider>
      {/* 1. Splash & Loading Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 2. Login Screen (if not authenticated) */}
      {!showSplash && !isAuthenticated && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onSignUpSuccess={handleSignUpSuccess}
          onGoogleSignIn={async () => {
            try {
              await loginWithGoogle();
              setIsAuthenticated(true);
            } catch (err: any) {
              console.warn('Google Sign-In notice:', err?.message || 'Please use credential login.');
            }
          }}
        />
      )}

      {/* 3. Main Authenticated Educator Portal */}
      {!showSplash && isAuthenticated && (
        <div className="min-h-screen bg-[#FAF5EB] text-slate-900 flex flex-col font-sans selection:bg-[#16287A] selection:text-white max-w-full overflow-x-hidden">
          {/* Navigation Header */}
          <Navigation
            profile={loggedInProfile}
            isOnline={isOnline}
            isSyncing={isSyncing}
            onManualSync={performSync}
            lastSyncTime={lastSyncTime}
            notifications={notifications}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenCopilot={() => setShowCopilotDrawer(true)}
            onOpenNfcCard={() => setShowNfcCardModal(true)}
            onOpenEmergency={() => setShowEmergencyModal(true)}
            onOpenLostCard={() => setShowLostCardModal(true)}
            onSignInWithGoogle={loginWithGoogle}
            onSignOut={handleSignOut}
            isUserSignedIn={true}
          />

          {/* ADMIN SUPERVISOR BAR: Visible only when logged in as Admin */}
          {loggedInProfile.role === 'admin' && (
            <div className="bg-[#FFF8E7] border-b border-[#E8DEC8] px-3 sm:px-6 py-2 shadow-xs sticky top-[53px] z-30">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full font-mono font-bold bg-[#CFA442] text-[#0C1748] text-[10px] uppercase shadow-2xs">
                    👑 Campus Principal Console
                  </span>
                  <span className="text-xs font-bold text-[#16287A]">
                    {viewingTeacherId
                      ? `Inspecting Faculty Dashboard: ${profile.name}`
                      : 'My Principal Executive Workspace'}
                  </span>
                  {viewingTeacherId && (
                    <span className="text-[10px] text-stone-500 font-mono hidden md:inline">
                      ({profile.department.replace("St. Arnold's High School, Godhra", 'General').replace('Department of ', '')})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <label className="text-[11px] font-mono text-stone-600 shrink-0 font-bold hidden xs:inline">
                    Switch View:
                  </label>
                  <select
                    value={viewingTeacherId || ''}
                    onChange={e => {
                      sounds.playNfcTap();
                      setViewingTeacherId(e.target.value || null);
                    }}
                    className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl bg-white border border-[#D8C7AA] font-bold text-xs text-slate-900 shadow-2xs focus:outline-none focus:border-[#16287A] cursor-pointer"
                  >
                    <option value="">👑 My Executive View (Principal)</option>
                    <optgroup label="St. Arnold's Faculty Members">
                      {roster
                        .filter(d => d.profile.role !== 'admin')
                        .map(d => (
                          <option key={d.profile.userId} value={d.profile.userId}>
                            👨‍🏫 {d.profile.name} — {d.profile.department.replace("St. Arnold's High School, Godhra", 'General').replace('Department of ', '')}
                          </option>
                        ))}
                    </optgroup>
                  </select>

                  {viewingTeacherId && (
                    <button
                      onClick={() => {
                        sounds.playNfcTap();
                        setViewingTeacherId(null);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#D8C7AA] text-[11px] font-bold text-[#16287A] shrink-0 cursor-pointer transition shadow-2xs"
                      title="Return to Principal Executive Dashboard"
                    >
                      ✕ Admin View
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* St. Arnold's Digital NFC Smart Card Banner */}
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 w-full">
            <DigitalNfcCard
              teacherName={profile.name}
              staffId={profile.staffId}
              department={profile.department}
              cardStatus={profile.cardStatus}
              nfcCardId={profile.nfcCardId}
              onNfcScanned={() => {
                handleRecordAttendance('check-in', "St. Arnold's Main Gate Terminal", 'nfc');
              }}
              onOpenLostCard={() => setShowLostCardModal(true)}
            />
          </div>

          {/* Main Dashboard Workspace */}
          <DashboardView
            profile={profile}
            classes={classes}
            assignments={assignments}
            grades={grades}
            attendanceLogs={attendanceLogs}
            securityAlerts={securityAlerts}
            onOpenNfcCard={() => setShowNfcCardModal(true)}
            onOpenAttendance={() => setShowAttendanceModal(true)}
            onOpenQR={() => setShowQRModal(true)}
            onOpenEmergency={() => setShowEmergencyModal(true)}
            onOpenLostCard={() => setShowLostCardModal(true)}
            onOpenReports={() => setShowReportsModal(true)}
            onOpenReportForStudent={(studentName: string) => {
              setReportStudentName(studentName);
              setShowReportsModal(true);
            }}
            onOpenResources={() => setShowResourcesModal(true)}
            onOpenLeaves={() => setShowLeavesModal(true)}
            onOpenCopilot={() => setShowCopilotDrawer(true)}
            onAddAssignment={handleAddAssignment}
            onUpdateGrade={(gradeId, newScore) => {
              updateActiveDossier(current => ({
                ...current,
                grades: current.grades.map(g => (g.id === gradeId ? { ...g, score: newScore } : g)),
              }));
            }}
          />

          {/* Institutional Footer */}
          <footer className="mt-auto border-t border-[#E8DEC8] bg-[#F4EADC] py-6 text-center text-xs text-stone-600 font-mono">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <img
                  src={SCHOOL_INFO.logoEmblem}
                  alt="St. Arnold's"
                  className="w-5 h-5 rounded-full object-contain"
                />
                <p className="font-bold text-[#16287A]">
                  St. Arnold&apos;s High School, Godhra • Gujarat
                </p>
              </div>
              <p className="text-stone-500">
                &quot;{SCHOOL_INFO.sanskritMotto}&quot; • Recharts Analytics • Encrypted NFC Smart ID
              </p>
            </div>
          </footer>

          {/* --- ALL FEATURE MODALS --- */}

          {/* 1. Universal Digital NFC Card Modal */}
          {showNfcCardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="relative w-full max-w-2xl bg-white border border-[#E8DEC8] rounded-3xl p-6 shadow-2xl flex flex-col max-h-[95vh] overflow-y-auto text-slate-900">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={SCHOOL_INFO.logoEmblem}
                      alt="Logo"
                      className="w-8 h-8 rounded-full object-contain"
                    />
                    <div>
                      <h3 className="font-bold text-base text-[#16287A]">St. Arnold&apos;s Digital NFC Smart ID</h3>
                      <p className="text-xs text-stone-500">Universal card interface compatible with smartphones, tablets & desktop</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNfcCardModal(false)}
                    className="text-stone-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <DigitalNfcCard
                  teacherName={profile.name}
                  staffId={profile.staffId}
                  department={profile.department}
                  cardStatus={profile.cardStatus}
                  nfcCardId={profile.nfcCardId}
                  onNfcScanned={() => {
                    handleRecordAttendance('check-in', "St. Arnold's Main Gate Terminal", 'nfc');
                  }}
                  onOpenLostCard={() => {
                    setShowNfcCardModal(false);
                    setShowLostCardModal(true);
                  }}
                />
              </div>
            </div>
          )}

          {/* 2. Digital Teacher Profile Modal */}
          <TeacherProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            profile={profile}
            onSaveProfile={handleUpdateProfile}
          />

          {/* 3. Smart Attendance Modal */}
          <SmartAttendanceModal
            isOpen={showAttendanceModal}
            onClose={() => setShowAttendanceModal(false)}
            teacherName={profile.name}
            staffId={profile.staffId}
            classes={classes}
            attendanceLogs={attendanceLogs}
            onRecordAttendance={handleRecordAttendance}
          />

          {/* 4. Biometric Hub Modal */}
          <BiometricModal
            isOpen={showBiometricModal}
            onClose={() => setShowBiometricModal(false)}
            teacherName={profile.name}
            onSuccess={() => {
              handleRecordAttendance('check-in', 'Biometric Dermal Sensor Gate', 'biometric');
            }}
          />

          {/* 5. Digital Staff Verification QR Modal */}
          <DigitalStaffVerificationModal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            teacherName={profile.name}
            staffId={profile.staffId}
            designation={profile.designation}
            department={profile.department}
            nfcCardId={profile.nfcCardId}
            cardStatus={profile.cardStatus}
          />

          {/* 6. Emergency Protocols & Medical Modal */}
          <EmergencyModal
            isOpen={showEmergencyModal}
            onClose={() => setShowEmergencyModal(false)}
            teacherName={profile.name}
            staffId={profile.staffId}
            emergencyContactName={profile.emergencyContactName}
            emergencyContactPhone={profile.emergencyContactPhone}
            emergencyMedicalNotes={profile.emergencyMedicalNotes}
            onUpdateEmergencyInfo={(contact, phone, notes) => {
              handleUpdateProfile({
                emergencyContactName: contact,
                emergencyContactPhone: phone,
                emergencyMedicalNotes: notes,
              });
            }}
          />

          {/* 7. Central Lost-Card Protection Modal */}
          <LostCardModal
            isOpen={showLostCardModal}
            onClose={() => setShowLostCardModal(false)}
            cardStatus={profile.cardStatus}
            nfcCardId={profile.nfcCardId}
            staffId={profile.staffId}
            teacherName={profile.name}
            onToggleCardStatus={handleToggleCardStatus}
          />

          {/* 8. Custom Reporting & Growth Analytics Modal (Recharts Student Growth Tracker) */}
          <ReportsModal
            isOpen={showReportsModal}
            onClose={() => setShowReportsModal(false)}
            attendanceLogs={attendanceLogs}
            securityAlerts={securityAlerts}
            grades={grades}
            teacherName={profile.name}
            initialStudent={reportStudentName}
          />

          {/* 9. Teaching Resource Library Modal */}
          <ResourceLibraryModal
            isOpen={showResourcesModal}
            onClose={() => setShowResourcesModal(false)}
            resources={resources}
            onAddResource={handleAddResource}
            teacherId={profile.userId}
          />

          {/* 10. Leave Management Modal */}
          <LeaveManagementModal
            isOpen={showLeavesModal}
            onClose={() => setShowLeavesModal(false)}
            leaveRequests={leaves}
            onSubmitLeave={handleSubmitLeave}
            teacherId={profile.userId}
            teacherName={profile.name}
          />

          {/* 11. Multi-Turn Gemini AI Co-Pilot Drawer */}
          <GeminiCopilotDrawer
            isOpen={showCopilotDrawer}
            onClose={() => setShowCopilotDrawer(false)}
            teacherName={profile.name}
          />
        </div>
      )}
    </LanguageProvider>
  );
}
