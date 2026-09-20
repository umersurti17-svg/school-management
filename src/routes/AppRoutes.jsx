import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import PublicLayout from '../layouts/PublicLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import AdmissionsPage from '../pages/public/AdmissionsPage';
import PublicCoursesPage from '../pages/public/PublicCoursesPage';
import FacultyPage from '../pages/public/FacultyPage';
import FacilitiesPage from '../pages/public/FacilitiesPage';
import GalleryPage from '../pages/public/GalleryPage';
import EventsPage from '../pages/public/EventsPage';
import NewsPage from '../pages/public/NewsPage';
import FAQPage from '../pages/public/FAQPage';
import ContactPage from '../pages/public/ContactPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Dashboard
import AdminDashboard from '../pages/dashboard/AdminDashboard';

// Student Management
import StudentsPage from '../pages/students/StudentsPage';
import AddStudentPage from '../pages/students/AddStudentPage';
import EditStudentPage from '../pages/students/EditStudentPage';
import StudentDetailPage from '../pages/students/StudentDetailPage';

// Course Management
import CoursesPage from '../pages/courses/CoursesPage';
import AddCoursePage from '../pages/courses/AddCoursePage';
import EditCoursePage from '../pages/courses/EditCoursePage';
import CourseDetailPage from '../pages/courses/CourseDetailPage';

// Attendance Management
import AttendancePage from '../pages/attendance/AttendancePage';
import AttendanceReportPage from '../pages/attendance/AttendanceReportPage';

// Fee Management
import FeesPage from '../pages/fees/FeesPage';
import FeeStatementPage from '../pages/fees/FeeStatementPage';

// Marks / Results Management
import MarksEntryPage from '../pages/marks/MarksEntryPage';
import MarksResultsPage from '../pages/marks/MarksResultsPage';

// Announcements, Reports, Profile, Settings
import AnnouncementsPage from '../pages/announcements/AnnouncementsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';

// Common Error Pages
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';
import { ROLES } from '../utils/constants';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public School Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
        <Route path="/academics" element={<PublicCoursesPage />} />
        <Route path="/academic-programs" element={<PublicCoursesPage />} />
        <Route path="/teachers" element={<FacultyPage />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* 2. Public Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* 3. Access Denied Route */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* 4. Protected Dashboard & Management Portal Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/dashboard" element={<AdminDashboard />} />

        {/* Student Management */}
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/add"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AddStudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
              <StudentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <EditStudentPage />
            </ProtectedRoute>
          }
        />

        {/* Course Management */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/add"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AddCoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <EditCoursePage />
            </ProtectedRoute>
          }
        />

        {/* Attendance Management */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/report"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
              <AttendanceReportPage />
            </ProtectedRoute>
          }
        />

        {/* Fee Management */}
        <Route
          path="/fees"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <FeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fees/statement"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STUDENT]}>
              <FeeStatementPage />
            </ProtectedRoute>
          }
        />

        {/* Marks / Results */}
        <Route
          path="/marks/entry"
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.ADMIN]}>
              <MarksEntryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marks/results"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
              <MarksResultsPage />
            </ProtectedRoute>
          }
        />

        {/* Announcements */}
        <Route
          path="/announcements"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
              <AnnouncementsPage />
            </ProtectedRoute>
          }
        />

        {/* Analytics & Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* User Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 5. 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
