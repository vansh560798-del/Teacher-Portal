export type UserRole = 'admin' | 'teacher';

export interface TeacherProfile {
  id?: string;
  userId: string;
  name: string;
  photoUrl: string;
  staffId: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  role: UserRole;
  nfcCardId: string;
  cardStatus: 'active' | 'suspended' | 'lost' | 'deactivated';
  biometricEnrolled: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyMedicalNotes: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id?: string;
  teacherId: string;
  teacherName: string;
  staffId: string;
  timestamp: string;
  type: 'check-in' | 'check-out';
  method: 'nfc' | 'biometric' | 'manual' | 'qr';
  location: string;
  status: 'verified' | 'flagged';
  createdAt?: string;
}

export interface ClassItem {
  id?: string;
  teacherId: string;
  className: string;
  grade: string;
  room: string;
  subject: string;
  schedule: string;
  studentCount: number;
}

export interface Assignment {
  id?: string;
  teacherId: string;
  classId?: string;
  className: string;
  title: string;
  instructions?: string;
  dueDate: string;
  maxScore: number;
  submissionsCount?: number;
  status: 'active' | 'graded' | 'draft';
  createdAt?: string;
}

export interface GradeRecord {
  id?: string;
  teacherId: string;
  classId?: string;
  assignmentId?: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  letterGrade: string;
  feedback?: string;
  date: string;
}

export interface TeachingResource {
  id?: string;
  teacherId: string;
  title: string;
  type: 'note' | 'pdf' | 'plan' | 'presentation';
  subject: string;
  description?: string;
  fileUrl?: string;
  tags?: string;
  createdAt?: string;
}

export interface LeaveRequest {
  id?: string;
  teacherId: string;
  teacherName: string;
  leaveType: 'sick' | 'casual' | 'medical' | 'conference' | 'maternity';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  createdAt?: string;
}

export interface SecurityAlert {
  id?: string;
  teacherId?: string;
  cardId: string;
  type: 'lost_card' | 'unauthorized_scan' | 'access_denied';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  resolved: boolean;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
}
