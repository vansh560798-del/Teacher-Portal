# Security Specification for AirNix Teacher Portal

## 1. Data Invariants
1. Teacher profiles can only be created and updated by the authenticated owner (`request.auth.uid == teacherId` or matching `userId`).
2. Card status can only be modified by the authorized teacher or system administrator (`yt.vgaming560798@gmail.com`).
3. Attendance records must record the authentic creator `teacherId` matching `request.auth.uid` or admin.
4. Assignments, grades, and teaching resources cannot be modified across tenant boundaries; only the owner can mutate their records.
5. Deactivated/Lost NFC cards can immediately trigger `security_alerts` and lock down door/portal access.
6. Timestamp and string lengths must conform to strict boundaries to prevent Denial-of-Wallet attacks.

## 2. The Dirty Dozen Payloads
1. **Payload 1: Spoofed Teacher ID** - Attempting to write a teacher profile where `userId` does not match `request.auth.uid`.
2. **Payload 2: Shadow Field Injection** - Adding unauthorized admin flags like `{ isAdmin: true, bypassNfc: true }` to `/teachers/{id}`.
3. **Payload 3: Unauthenticated Attendance Injection** - Calling create on `/attendance/` without valid `request.auth`.
4. **Payload 4: Attendance Timestamp Spoofing** - Overwriting existing historical attendance timestamps.
5. **Payload 5: Cross-Teacher Grade Tampering** - Updating a student's grade record owned by teacher B from teacher A's account.
6. **Payload 6: Resource Library Hijack** - Deleting another teacher's uploaded lesson plan or note.
7. **Payload 7: Self-Approval of Leave** - Submitting a leave request with `status: "approved"` right away by non-admin.
8. **Payload 8: Giant Payload / Memory Exhaustion** - Inserting a 500KB string in `instructions` or `emergencyMedicalNotes`.
9. **Payload 9: Path Traversal / Poisoned Document ID** - Attempting document ID with special characters like `../../admin`.
10. **Payload 10: Anonymous Read Scraping** - Scraping `/teachers/` or `/security_alerts/` without authentication.
11. **Payload 11: Security Alert Suppression** - Non-admin deleting or silently resolving a critical lost card alert.
12. **Payload 12: Fake Biometric Enrollment** - Bypassing verification state without valid authentication.

## 3. Test Runner Definition
All payloads above must return `PERMISSION_DENIED` under the hardened rules.
