import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import { seedService } from '../../services/seedService';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCardsGrid from '../../components/dashboard/StatCardsGrid';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import FeeCollectionChart from '../../components/dashboard/FeeCollectionChart';
import RecentStudentsTable from '../../components/dashboard/RecentStudentsTable';
import RecentPaymentsTable from '../../components/dashboard/RecentPaymentsTable';
import RecentAttendanceWidget from '../../components/dashboard/RecentAttendanceWidget';
import QuickActionsModal from '../../components/dashboard/QuickActionsModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { HiOutlineRefresh, HiOutlineExclamation } from 'react-icons/hi';
import toast from 'react-hot-toast';

import LiveClockQuoteWidget from '../../components/dashboard/LiveClockQuoteWidget';
import UpcomingEventsWidget from '../../components/dashboard/UpcomingEventsWidget';

export default function AdminDashboard() {
  const { profile, user, role } = useAuth();
  const navigate = useNavigate();

  // Dashboard Data States
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [attendanceChartData, setAttendanceChartData] = useState([]);
  const [feeChartData, setFeeChartData] = useState([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Dialogs
  const [quickActionModal, setQuickActionModal] = useState({
    isOpen: false,
    type: null,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Fetch all dashboard data from Supabase
  const loadDashboardData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setError(null);

      // Auto seed demo dataset if brand new database
      await seedService.checkAndAutoSeed();

      const [
        statsRes,
        studentsRes,
        paymentsRes,
        attendanceRes,
        attChartRes,
        feeChartRes,
      ] = await Promise.all([
        dashboardService.getAdminDashboardStats(),
        dashboardService.getRecentStudents(5),
        dashboardService.getRecentPayments(5),
        dashboardService.getRecentAttendance(6),
        dashboardService.getAttendanceChartData(),
        dashboardService.getFeeCollectionChartData(),
      ]);

      setStats(statsRes);
      setRecentStudents(studentsRes);
      setRecentPayments(paymentsRes);
      setRecentAttendance(attendanceRes);
      setAttendanceChartData(attChartRes);
      setFeeChartData(feeChartRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Unable to load dashboard data from Supabase.');
      toast.error('Failed to update dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData(true);
    toast.success('Dashboard metrics updated!');
  };

  // Open quick action modal
  const handleQuickAction = (actionType) => {
    setQuickActionModal({
      isOpen: true,
      type: actionType,
    });
  };

  // Filter tables by search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return recentStudents;
    const q = searchQuery.toLowerCase();
    return recentStudents.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.rollNumber?.toLowerCase().includes(q) ||
        s.class?.toLowerCase().includes(q)
    );
  }, [recentStudents, searchQuery]);

  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) return recentPayments;
    const q = searchQuery.toLowerCase();
    return recentPayments.filter(
      (p) =>
        p.studentName?.toLowerCase().includes(q) ||
        p.receiptNumber?.toLowerCase().includes(q) ||
        p.feeType?.toLowerCase().includes(q)
    );
  }, [recentPayments, searchQuery]);

  const filteredAttendance = useMemo(() => {
    if (!searchQuery.trim()) return recentAttendance;
    const q = searchQuery.toLowerCase();
    return recentAttendance.filter(
      (a) =>
        a.studentName?.toLowerCase().includes(q) ||
        a.courseName?.toLowerCase().includes(q) ||
        a.status?.toLowerCase().includes(q)
    );
  }, [recentAttendance, searchQuery]);

  // Error State with Retry
  if (error && !stats) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-4">
          <HiOutlineExclamation className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Unable to Load Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
          {error}
        </p>
        <Button
          variant="primary"
          icon={HiOutlineRefresh}
          onClick={() => loadDashboardData()}
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Search & Quick Action Triggers */}
      <DashboardHeader
        userName={displayName}
        role={role}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickAction={handleQuickAction}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* 1.1 Live Clock & Motivational Quote Widget */}
      <LiveClockQuoteWidget />

      {/* 2. Top Stats Overview (6 Cards) */}
      <StatCardsGrid stats={stats} loading={loading} />

      {/* 3. Analytics Charts (Attendance & Fee Collections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart data={attendanceChartData} loading={loading} />
        <FeeCollectionChart data={feeChartData} loading={loading} />
      </div>

      {/* 4. Recent Tables (Students & Payments) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentStudentsTable students={filteredStudents} loading={loading} />
        <RecentPaymentsTable payments={filteredPayments} loading={loading} />
      </div>

      {/* 5. Recent Attendance Log & Upcoming Events & Quick Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentAttendanceWidget
            attendance={filteredAttendance}
            loading={loading}
          />
          <UpcomingEventsWidget />
        </div>

        {/* Quick Actions Card */}
        <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-primary-200">
              {role === 'admin' ? 'Administrative Tools' : role === 'teacher' ? 'Faculty Shortcuts' : 'Student Shortcuts'}
            </span>
            <h3 className="text-xl font-bold mt-1 mb-2">School Quick Hub</h3>
            <p className="text-sm text-primary-100 mb-6">
              {role === 'admin'
                ? 'Quickly perform standard daily administrative operations without leaving the dashboard.'
                : role === 'teacher'
                ? 'Quickly record attendance, submit term marks, and communicate with students.'
                : 'Access your enrolled courses, review attendance records, and track fee statements.'}
            </p>
          </div>

          <div className="space-y-2.5">
            {role === 'admin' && (
              <>
                <button
                  onClick={() => handleQuickAction('add_student')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>+ Enroll New Student</span>
                  <span className="text-xs text-primary-200">Fast Admit</span>
                </button>

                <button
                  onClick={() => handleQuickAction('collect_fee')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>💳 Record Fee Payment</span>
                  <span className="text-xs text-primary-200">Instant Receipt</span>
                </button>

                <button
                  onClick={() => handleQuickAction('post_notice')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>📢 Broadcast Notice</span>
                  <span className="text-xs text-primary-200">All Roles</span>
                </button>
              </>
            )}

            {role === 'teacher' && (
              <>
                <button
                  onClick={() => navigate('/attendance')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>📋 Class Attendance</span>
                  <span className="text-xs text-primary-200">Daily Log</span>
                </button>

                <button
                  onClick={() => navigate('/marks/entry')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>📝 Enter Exam Marks</span>
                  <span className="text-xs text-primary-200">Term Grades</span>
                </button>

                <button
                  onClick={() => handleQuickAction('post_notice')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>📢 Broadcast Notice</span>
                  <span className="text-xs text-primary-200">Announce</span>
                </button>
              </>
            )}

            {role === 'student' && (
              <>
                <button
                  onClick={() => navigate('/courses')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>📚 My Courses</span>
                  <span className="text-xs text-primary-200">Syllabus</span>
                </button>

                <button
                  onClick={() => navigate('/attendance/report')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>📊 Attendance Report</span>
                  <span className="text-xs text-primary-200">Summary</span>
                </button>

                <button
                  onClick={() => navigate('/fees/statement')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>🧾 Fee Invoices</span>
                  <span className="text-xs text-primary-200">Statements</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Modal */}
      <QuickActionsModal
        isOpen={quickActionModal.isOpen}
        onClose={() => setQuickActionModal({ isOpen: false, type: null })}
        actionType={quickActionModal.type}
        onSuccess={() => loadDashboardData(true)}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
      />
    </div>
  );
}
