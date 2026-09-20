import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineSpeakerphone,
  HiOutlineChartBar,
  HiOutlineCog,
} from 'react-icons/hi';

// User roles
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

// Grading scale
export const GRADING_SCALE = [
  { grade: 'A+', min: 90, max: 100, gpa: 4.0 },
  { grade: 'A', min: 80, max: 89, gpa: 3.7 },
  { grade: 'B+', min: 70, max: 79, gpa: 3.3 },
  { grade: 'B', min: 60, max: 69, gpa: 3.0 },
  { grade: 'C+', min: 50, max: 59, gpa: 2.5 },
  { grade: 'C', min: 40, max: 49, gpa: 2.0 },
  { grade: 'D', min: 33, max: 39, gpa: 1.0 },
  { grade: 'F', min: 0, max: 32, gpa: 0.0 },
];

// Fee types
export const FEE_TYPES = [
  { value: 'tuition', label: 'Tuition Fee' },
  { value: 'lab', label: 'Lab Fee' },
  { value: 'library', label: 'Library Fee' },
  { value: 'transport', label: 'Transport Fee' },
  { value: 'sports', label: 'Sports Fee' },
  { value: 'exam', label: 'Exam Fee' },
  { value: 'other', label: 'Other' },
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'online', label: 'Online' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
];

// Attendance statuses
export const ATTENDANCE_STATUS = [
  { value: 'present', label: 'Present', color: 'green' },
  { value: 'absent', label: 'Absent', color: 'red' },
  { value: 'late', label: 'Late', color: 'yellow' },
  { value: 'excused', label: 'Excused', color: 'blue' },
];

// Sidebar navigation per role
export const NAV_ITEMS = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: HiOutlineHome },
    { label: 'Students', path: '/students', icon: HiOutlineUserGroup },
    { label: 'Courses', path: '/courses', icon: HiOutlineAcademicCap },
    { label: 'Attendance', path: '/attendance', icon: HiOutlineClipboardCheck },
    { label: 'Fees', path: '/fees', icon: HiOutlineCurrencyDollar },
    { label: 'Marks', path: '/marks/results', icon: HiOutlineDocumentText },
    { label: 'Announcements', path: '/announcements', icon: HiOutlineSpeakerphone },
    { label: 'Reports', path: '/reports', icon: HiOutlineChartBar },
    { label: 'Profile', path: '/profile', icon: HiOutlineUser },
    { label: 'Settings', path: '/settings', icon: HiOutlineCog },
  ],
  teacher: [
    { label: 'Dashboard', path: '/dashboard', icon: HiOutlineHome },
    { label: 'Students', path: '/students', icon: HiOutlineUserGroup },
    { label: 'My Courses', path: '/courses', icon: HiOutlineAcademicCap },
    { label: 'Attendance', path: '/attendance', icon: HiOutlineClipboardCheck },
    { label: 'Marks Entry', path: '/marks/entry', icon: HiOutlineDocumentText },
    { label: 'Announcements', path: '/announcements', icon: HiOutlineSpeakerphone },
    { label: 'Profile', path: '/profile', icon: HiOutlineUser },
  ],
  student: [
    { label: 'Dashboard', path: '/dashboard', icon: HiOutlineHome },
    { label: 'My Courses', path: '/courses', icon: HiOutlineAcademicCap },
    { label: 'Attendance', path: '/attendance/report', icon: HiOutlineClipboardCheck },
    { label: 'Fees', path: '/fees/statement', icon: HiOutlineCurrencyDollar },
    { label: 'Results', path: '/marks/results', icon: HiOutlineDocumentText },
    { label: 'Announcements', path: '/announcements', icon: HiOutlineSpeakerphone },
    { label: 'Profile', path: '/profile', icon: HiOutlineUser },
  ],
};
