import type { TeacherProfile, ClassItem, Assignment, GradeRecord, AttendanceRecord, LeaveRequest } from './types';

export interface TeacherDossier {
  profile: TeacherProfile;
  classes: ClassItem[];
  assignments: Assignment[];
  grades: GradeRecord[];
  attendanceLogs: AttendanceRecord[];
  leaves: LeaveRequest[];
}

export const INITIAL_FACULTY_ROSTER: TeacherDossier[] = [
  // 1. School Administrator / Principal
  {
    profile: {
      userId: 'st_arnolds_admin_1',
      name: 'Fr. George Thomas (Principal)',
      photoUrl: '',
      staffId: 'SA-ADMIN-01',
      designation: 'Principal & Campus Executive Director',
      department: 'Central Administration & Academic Governance',
      email: 'admin@starnoldsgodhra.edu',
      phone: '+91 (2672) 240-001',
      role: 'admin',
      nfcCardId: 'NFC-ADM-1001-2026',
      cardStatus: 'active',
      biometricEnrolled: true,
      emergencyContactName: 'Fr. Superior Mathew (Vice Principal)',
      emergencyContactPhone: '+91 98250 11001',
      emergencyMedicalNotes: 'Nil allergies; Blood Type A+',
      updatedAt: new Date().toISOString(),
    },
    classes: [
      {
        id: 'ADMIN_C1',
        teacherId: 'st_arnolds_admin_1',
        className: 'Moral Science & Leadership (12th Grade)',
        grade: 'Grade 12 All Streams',
        room: 'Assembly Hall',
        subject: 'Value Education',
        schedule: 'Monday • 08:30 - 09:30 AM',
        studentCount: 120,
      },
      {
        id: 'ADMIN_C2',
        teacherId: 'st_arnolds_admin_1',
        className: 'Faculty Pedagogical Seminar',
        grade: 'Staff Development',
        room: 'Conference Room 1',
        subject: 'Curriculum & Governance',
        schedule: 'Saturday • 10:00 - 11:30 AM',
        studentCount: 42,
      },
    ],
    assignments: [
      {
        id: 'ADMIN_A1',
        teacherId: 'st_arnolds_admin_1',
        className: 'Moral Science & Leadership (12th Grade)',
        title: 'Community Ethics & Civic Service Essay',
        instructions: 'Reflective personal account on institutional service and empathy.',
        dueDate: '2026-10-30',
        maxScore: 50,
        submissionsCount: 114,
        status: 'active',
        createdAt: '2026-10-18',
      },
    ],
    grades: [
      {
        id: 'ADMIN_G1',
        teacherId: 'st_arnolds_admin_1',
        studentId: 'S1',
        studentName: 'Alexander Wright',
        score: 48,
        maxScore: 50,
        letterGrade: 'A',
        feedback: 'Deep moral reflection and clear community vision.',
        date: '2026-10-19',
      },
      {
        id: 'ADMIN_G2',
        teacherId: 'st_arnolds_admin_1',
        studentId: 'S2',
        studentName: 'Sophia Chen',
        score: 50,
        maxScore: 50,
        letterGrade: 'A',
        feedback: 'Exemplary leadership portfolio.',
        date: '2026-10-19',
      },
    ],
    attendanceLogs: [
      {
        id: 'ATT_ADM_1',
        teacherId: 'st_arnolds_admin_1',
        teacherName: 'Fr. George Thomas (Principal)',
        staffId: 'SA-ADMIN-01',
        timestamp: '2026-10-20 07:15:00 AM',
        type: 'check-in',
        method: 'nfc',
        location: 'Principal Office Executive Kiosk',
        status: 'verified',
        createdAt: '2026-10-20',
      },
    ],
    leaves: [],
  },

  // 2. Teacher: Dr. Evelyn Reed (Physics Lead)
  {
    profile: {
      userId: 'st_arnolds_teacher_1',
      name: 'Dr. Evelyn Reed',
      photoUrl: '',
      staffId: 'SA-8842-SEC',
      designation: 'Senior Faculty Lead & STEM Coordinator',
      department: 'Department of Pure & Applied Physics',
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
    },
    classes: [
      {
        id: 'ER_C1',
        teacherId: 'st_arnolds_teacher_1',
        className: 'Physics & Mechanics (12th Grade)',
        grade: 'Grade 12 Science',
        room: 'Science Lab 2',
        subject: 'Physics',
        schedule: 'Mon, Wed, Fri • 08:30 - 09:45 AM',
        studentCount: 32,
      },
      {
        id: 'ER_C2',
        teacherId: 'st_arnolds_teacher_1',
        className: 'Higher Mathematics & Vectors',
        grade: 'Grade 11 & 12',
        room: 'Room 204',
        subject: 'Mathematics',
        schedule: 'Mon, Wed, Fri • 10:00 - 11:15 AM',
        studentCount: 36,
      },
      {
        id: 'ER_C3',
        teacherId: 'st_arnolds_teacher_1',
        className: 'Modern Physics & Quantum Concepts',
        grade: 'Grade 12 Honors',
        room: 'Auditorium Hall B',
        subject: 'Physics',
        schedule: 'Tue, Thu • 01:00 - 02:30 PM',
        studentCount: 28,
      },
    ],
    assignments: [
      {
        id: 'ER_A1',
        teacherId: 'st_arnolds_teacher_1',
        className: 'Physics & Mechanics (12th Grade)',
        title: 'Rotational Dynamics & Angular Momentum Lab',
        instructions: 'Submit raw sensor graphs, uncertainty analysis, and formal write-up.',
        dueDate: '2026-10-24',
        maxScore: 100,
        submissionsCount: 29,
        status: 'active',
        createdAt: '2026-10-18',
      },
      {
        id: 'ER_A2',
        teacherId: 'st_arnolds_teacher_1',
        className: 'Higher Mathematics & Vectors',
        title: 'Lagrange Multipliers Problem Set #4',
        instructions: 'Solve constrained optimization problems with step-by-step vector proofs.',
        dueDate: '2026-10-26',
        maxScore: 50,
        submissionsCount: 34,
        status: 'active',
        createdAt: '2026-10-19',
      },
    ],
    grades: [
      {
        id: 'ER_G1',
        teacherId: 'st_arnolds_teacher_1',
        studentId: 'S1',
        studentName: 'Alexander Wright',
        score: 96,
        maxScore: 100,
        letterGrade: 'A',
        feedback: 'Outstanding mathematical derivation and error bar analysis.',
        date: '2026-10-19',
      },
      {
        id: 'ER_G2',
        teacherId: 'st_arnolds_teacher_1',
        studentId: 'S2',
        studentName: 'Sophia Chen',
        score: 92,
        maxScore: 100,
        letterGrade: 'A',
        feedback: 'Clear experimental setup and rigorous conclusions.',
        date: '2026-10-19',
      },
      {
        id: 'ER_G3',
        teacherId: 'st_arnolds_teacher_1',
        studentId: 'S3',
        studentName: 'Liam Patel',
        score: 84,
        maxScore: 100,
        letterGrade: 'B',
        feedback: 'Good comprehension; check unit conversions in section 3.',
        date: '2026-10-19',
      },
    ],
    attendanceLogs: [
      {
        id: 'ATT_ER_1',
        teacherId: 'st_arnolds_teacher_1',
        teacherName: 'Dr. Evelyn Reed',
        staffId: 'SA-8842-SEC',
        timestamp: '2026-10-20 07:48:12 AM',
        type: 'check-in',
        method: 'nfc',
        location: "St. Arnold's Main Gate Terminal",
        status: 'verified',
        createdAt: '2026-10-20',
      },
    ],
    leaves: [
      {
        id: 'ER_L1',
        teacherId: 'st_arnolds_teacher_1',
        teacherName: 'Dr. Evelyn Reed',
        leaveType: 'conference',
        startDate: '2026-11-04',
        endDate: '2026-11-06',
        reason: 'Presenting research paper at National Science Teachers Association (NSTA) Annual Summit.',
        status: 'approved',
        reviewedBy: 'Principal Fr. George Thomas',
        createdAt: '2026-10-12',
      },
    ],
  },

  // 3. Teacher: Prof. Rajesh Sharma (Mathematics Lead)
  {
    profile: {
      userId: 'st_arnolds_teacher_2',
      name: 'Prof. Rajesh Sharma',
      photoUrl: '',
      staffId: 'SA-1042-SEC',
      designation: 'Mathematics Faculty Lead & Olympiad Coach',
      department: 'Department of Higher Mathematics',
      email: 'rajesh.sharma@starnoldsgodhra.edu',
      phone: '+91 (2672) 240-5512',
      role: 'teacher',
      nfcCardId: 'NFC-MTH-2042-2026',
      cardStatus: 'active',
      biometricEnrolled: true,
      emergencyContactName: 'Mrs. Sunita Sharma (Wife)',
      emergencyContactPhone: '+91 98251 77200',
      emergencyMedicalNotes: 'Mild asthma; Blood Type B+',
      updatedAt: new Date().toISOString(),
    },
    classes: [
      {
        id: 'RS_C1',
        teacherId: 'st_arnolds_teacher_2',
        className: 'Integral Calculus & Differential Equations',
        grade: 'Grade 12 Science & Commerce',
        room: 'Room 102',
        subject: 'Mathematics',
        schedule: 'Mon, Wed, Fri • 09:00 - 10:15 AM',
        studentCount: 38,
      },
      {
        id: 'RS_C2',
        teacherId: 'st_arnolds_teacher_2',
        className: 'Discrete Mathematics & Combinatorics',
        grade: 'Grade 11 Honors',
        room: 'Room 105',
        subject: 'Mathematics',
        schedule: 'Tue, Thu • 11:30 - 01:00 PM',
        studentCount: 30,
      },
      {
        id: 'RS_C3',
        teacherId: 'st_arnolds_teacher_2',
        className: 'Math Olympiad Special Mentorship',
        grade: 'Grades 9-12 Elite',
        room: 'Math Lab 1',
        subject: 'Competitive Math',
        schedule: 'Tue, Thu • 03:00 - 04:15 PM',
        studentCount: 15,
      },
    ],
    assignments: [
      {
        id: 'RS_A1',
        teacherId: 'st_arnolds_teacher_2',
        className: 'Integral Calculus & Differential Equations',
        title: 'Area Under Curves & Volumes of Revolution',
        instructions: 'Graph and compute disk and washer integration models with step proofs.',
        dueDate: '2026-10-25',
        maxScore: 50,
        submissionsCount: 35,
        status: 'active',
        createdAt: '2026-10-18',
      },
      {
        id: 'RS_A2',
        teacherId: 'st_arnolds_teacher_2',
        className: 'Discrete Mathematics & Combinatorics',
        title: 'Pigeonhole Principle & Graph Theory Proofs',
        instructions: 'Complete 10 formal proof problems using induction and contradiction.',
        dueDate: '2026-10-28',
        maxScore: 100,
        submissionsCount: 28,
        status: 'active',
        createdAt: '2026-10-19',
      },
    ],
    grades: [
      {
        id: 'RS_G1',
        teacherId: 'st_arnolds_teacher_2',
        studentId: 'S5',
        studentName: 'Noah Rodriguez',
        score: 46,
        maxScore: 50,
        letterGrade: 'A',
        feedback: 'Precise integration steps and neat graph sketches.',
        date: '2026-10-19',
      },
      {
        id: 'RS_G2',
        teacherId: 'st_arnolds_teacher_2',
        studentId: 'S6',
        studentName: 'Olivia Kim',
        score: 42,
        maxScore: 50,
        letterGrade: 'B',
        feedback: 'Good work; revise bounds of integration in question 4.',
        date: '2026-10-19',
      },
    ],
    attendanceLogs: [
      {
        id: 'ATT_RS_1',
        teacherId: 'st_arnolds_teacher_2',
        teacherName: 'Prof. Rajesh Sharma',
        staffId: 'SA-1042-SEC',
        timestamp: '2026-10-20 07:52:10 AM',
        type: 'check-in',
        method: 'nfc',
        location: "St. Arnold's Main Gate Terminal",
        status: 'verified',
        createdAt: '2026-10-20',
      },
    ],
    leaves: [
      {
        id: 'RS_L1',
        teacherId: 'st_arnolds_teacher_2',
        teacherName: 'Prof. Rajesh Sharma',
        leaveType: 'casual',
        startDate: '2026-10-28',
        endDate: '2026-10-29',
        reason: 'Family religious function and ceremony.',
        status: 'pending',
        reviewedBy: 'Principal Office',
        createdAt: '2026-10-19',
      },
    ],
  },

  // 4. Teacher: Mrs. Anita Patel (Life Sciences Lead)
  {
    profile: {
      userId: 'st_arnolds_teacher_3',
      name: 'Mrs. Anita Patel',
      photoUrl: '',
      staffId: 'SA-2081-SEC',
      designation: 'Biology & Environmental Science Mentor',
      department: 'Department of Life Sciences',
      email: 'anita.patel@starnoldsgodhra.edu',
      phone: '+91 (2672) 240-3391',
      role: 'teacher',
      nfcCardId: 'NFC-BIO-3081-2026',
      cardStatus: 'active',
      biometricEnrolled: true,
      emergencyContactName: 'Mr. Hitesh Patel (Husband)',
      emergencyContactPhone: '+91 98254 33910',
      emergencyMedicalNotes: 'No known allergies; Blood Type AB+',
      updatedAt: new Date().toISOString(),
    },
    classes: [
      {
        id: 'AP_C1',
        teacherId: 'st_arnolds_teacher_3',
        className: 'Cell Biology, Genetics & Evolution',
        grade: 'Grade 12 Science',
        room: 'Bio Lab 1',
        subject: 'Biology',
        schedule: 'Mon, Wed, Fri • 11:00 - 12:15 PM',
        studentCount: 34,
      },
      {
        id: 'AP_C2',
        teacherId: 'st_arnolds_teacher_3',
        className: 'Ecology, Biodiversity & Environment',
        grade: 'Grade 11 Science',
        room: 'Room 208',
        subject: 'Environmental Science',
        schedule: 'Tue, Thu • 08:30 - 10:00 AM',
        studentCount: 31,
      },
    ],
    assignments: [
      {
        id: 'AP_A1',
        teacherId: 'st_arnolds_teacher_3',
        className: 'Cell Biology, Genetics & Evolution',
        title: 'Mendelian Dihybrid Cross & Chi-Square Analysis',
        instructions: 'Complete phenotypic ratio calculations with statistical chi-square tests.',
        dueDate: '2026-10-27',
        maxScore: 50,
        submissionsCount: 30,
        status: 'active',
        createdAt: '2026-10-19',
      },
    ],
    grades: [
      {
        id: 'AP_G1',
        teacherId: 'st_arnolds_teacher_3',
        studentId: 'S7',
        studentName: 'Lucas Martin',
        score: 47,
        maxScore: 50,
        letterGrade: 'A',
        feedback: 'Spotless genetic calculations and probability reasoning.',
        date: '2026-10-19',
      },
    ],
    attendanceLogs: [
      {
        id: 'ATT_AP_1',
        teacherId: 'st_arnolds_teacher_3',
        teacherName: 'Mrs. Anita Patel',
        staffId: 'SA-2081-SEC',
        timestamp: '2026-10-20 07:44:30 AM',
        type: 'check-in',
        method: 'nfc',
        location: "St. Arnold's Main Gate Terminal",
        status: 'verified',
        createdAt: '2026-10-20',
      },
    ],
    leaves: [],
  },
];

const ROSTER_STORAGE_KEY = 'st_arnolds_faculty_roster';

export function getStoredFacultyRoster(): TeacherDossier[] {
  try {
    const saved = localStorage.getItem(ROSTER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading faculty roster from storage', e);
  }
  return INITIAL_FACULTY_ROSTER;
}

export function saveFacultyRoster(roster: TeacherDossier[]): void {
  try {
    localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(roster));
  } catch (e) {
    console.error('Error saving faculty roster to storage', e);
  }
}

export function registerNewTeacherDossier(newProfile: TeacherProfile): TeacherDossier {
  const currentRoster = getStoredFacultyRoster();
  
  // Default mock classes for newly registered teacher
  const defaultClasses: ClassItem[] = [
    {
      id: `C_${Date.now()}_1`,
      teacherId: newProfile.userId,
      className: `${newProfile.department.replace('Department of ', '')} (Grade 10)`,
      grade: 'Grade 10 Secondary',
      room: 'Academic Block Room 108',
      subject: newProfile.designation.replace('Lead', '').replace('Teacher', '').trim() || 'Core Subject',
      schedule: 'Mon, Wed, Fri • 09:30 - 10:45 AM',
      studentCount: 30,
    },
    {
      id: `C_${Date.now()}_2`,
      teacherId: newProfile.userId,
      className: `${newProfile.department.replace('Department of ', '')} Practical & Lab`,
      grade: 'Grade 11 Senior',
      room: 'Main Subject Lab',
      subject: newProfile.designation.replace('Lead', '').replace('Teacher', '').trim() || 'Core Subject',
      schedule: 'Tue, Thu • 01:15 - 02:45 PM',
      studentCount: 26,
    },
  ];

  const defaultAssignments: Assignment[] = [
    {
      id: `A_${Date.now()}_1`,
      teacherId: newProfile.userId,
      className: defaultClasses[0].className,
      title: 'First Term Assessment & Conceptual Overview',
      instructions: 'Review chapter readings and prepare handwritten summary notes.',
      dueDate: '2026-10-31',
      maxScore: 50,
      submissionsCount: 22,
      status: 'active',
      createdAt: new Date().toLocaleDateString(),
    },
  ];

  const defaultGrades: GradeRecord[] = [
    {
      id: `G_${Date.now()}_1`,
      teacherId: newProfile.userId,
      studentId: 'S101',
      studentName: 'Alexander Wright',
      score: 46,
      maxScore: 50,
      letterGrade: 'A',
      feedback: 'Excellent introductory coursework submissions.',
      date: new Date().toLocaleDateString(),
    },
    {
      id: `G_${Date.now()}_2`,
      teacherId: newProfile.userId,
      studentId: 'S102',
      studentName: 'Sophia Chen',
      score: 48,
      maxScore: 50,
      letterGrade: 'A',
      feedback: 'Very thorough analysis and neat diagrams.',
      date: new Date().toLocaleDateString(),
    },
  ];

  const defaultAttendance: AttendanceRecord[] = [
    {
      id: `ATT_${Date.now()}_1`,
      teacherId: newProfile.userId,
      teacherName: newProfile.name,
      staffId: newProfile.staffId,
      timestamp: `${new Date().toLocaleDateString()} 07:45:00 AM`,
      type: 'check-in',
      method: 'nfc',
      location: "St. Arnold's Main Gate Terminal",
      status: 'verified',
      createdAt: new Date().toISOString(),
    },
  ];

  const newDossier: TeacherDossier = {
    profile: newProfile,
    classes: defaultClasses,
    assignments: defaultAssignments,
    grades: defaultGrades,
    attendanceLogs: defaultAttendance,
    leaves: [],
  };

  const updatedRoster = [...currentRoster, newDossier];
  saveFacultyRoster(updatedRoster);
  return newDossier;
}

