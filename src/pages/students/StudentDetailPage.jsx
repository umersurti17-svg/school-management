import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { marksService } from '../../services/marksService';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import {
  HiOutlineArrowLeft,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineCurrencyDollar,
  HiOutlinePrinter,
  HiOutlineCamera,
  HiOutlineDocumentText,
  HiOutlineTrendingUp,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [student, setStudent] = useState(null);
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, timeline, attendance, fees, results, courses
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, loading: false });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  const loadStudent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudentById(id);
      setStudent(data);

      // Load results if student exists
      if (data) {
        try {
          const report = await marksService.getStudentReportCard(id, 2026);
          setReportCard(report);
        } catch (e) {
          console.error('Error fetching marks:', e);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load student details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `student-${id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('school-avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('school-avatars')
        .getPublicUrl(filePath);

      // Update student profile avatar
      if (student.school_user_id) {
        // Update profile
        await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', student.school_users?.profile_id || student.profileId || student.school_user_id);
      }

      setStudent((prev) => ({ ...prev, avatarUrl: publicUrl }));
      toast.success('Student avatar updated successfully!');
      loadStudent();
    } catch (err) {
      toast.error(err.message || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteStudent = async () => {
    try {
      setDeleteDialog({ isOpen: true, loading: true });
      await studentService.deleteStudent(id);
      toast.success('Student record deleted successfully');
      navigate('/students');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete student');
      setDeleteDialog({ isOpen: true, loading: false });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'graduated':
        return 'primary';
      case 'transferred':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <Loader size="lg" text="Loading student record..." />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Student Not Found
        </h2>
        <p className="text-sm text-slate-500 mt-2 mb-4">
          This student does not exist or has been deleted.
        </p>
        <Link to="/students">
          <Button variant="primary">Back to Directory</Button>
        </Link>
      </div>
    );
  }

  // Attendance summary metrics
  const totalAttendanceDays = student.attendance?.length || 0;
  const presentDays = student.attendance?.filter((a) => a.status === 'present').length || 0;
  const absentDays = student.attendance?.filter((a) => a.status === 'absent').length || 0;
  const attendanceRate = totalAttendanceDays > 0 ? Math.round((presentDays / totalAttendanceDays) * 100) : 100;

  // Fee summary metrics
  let totalFees = 0;
  let paidFees = 0;
  student.fees?.forEach((f) => {
    totalFees += Number(f.amount || 0);
    paidFees += Number(f.paid_amount || 0);
  });
  const pendingFees = Math.max(0, totalFees - paidFees);

  return (
    <div className="space-y-6">
      {/* 1. Header with Back Button and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/students"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Back to Students List"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {student.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Roll No: <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{student.rollNumber}</span> • {student.class} - {student.section}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={HiOutlinePrinter}
            onClick={() => window.print()}
          >
            Print Profile
          </Button>

          {isAdmin && (
            <>
              <Link to={`/students/${student.id}/edit`}>
                <Button variant="primary" icon={HiOutlinePencilAlt}>
                  Edit Profile
                </Button>
              </Link>

              <Button
                variant="danger"
                icon={HiOutlineTrash}
                onClick={() => setDeleteDialog({ isOpen: true, loading: false })}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 2. Top Profile Hero Card with Photo Upload */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with live upload button */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-primary-500/20 shadow-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Avatar name={student.name} size="2xl" />
              )}
            </div>
            {isAdmin && (
              <label className="absolute bottom-1 right-1 p-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white cursor-pointer shadow-md transition-transform hover:scale-110">
                <HiOutlineCamera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {student.name}
              </h2>
              <Badge variant={getStatusColor(student.status)}>
                {student.status.toUpperCase()}
              </Badge>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-bold border border-primary-200 dark:border-primary-800">
                {student.class} - Section {student.section}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Guardian: <strong className="text-slate-900 dark:text-white">{student.guardianName || '—'}</strong>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
              {student.email && (
                <span className="flex items-center gap-1.5">
                  <HiOutlineMail className="w-4 h-4 text-slate-400" />
                  {student.email}
                </span>
              )}
              {(student.phone || student.guardianPhone) && (
                <span className="flex items-center gap-1.5">
                  <HiOutlinePhone className="w-4 h-4 text-slate-400" />
                  {student.phone || student.guardianPhone}
                </span>
              )}
              {student.admissionDate && (
                <span className="flex items-center gap-1.5">
                  <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                  Enrolled: {formatDate(student.admissionDate)}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3 w-full md:w-52 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Attendance Rate
              </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter value={`${attendanceRate}%`} />
              </span>
            </div>

            <div className="bg-primary-50 dark:bg-primary-950/20 p-3 rounded-xl border border-primary-200 dark:border-primary-900/40 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Cumulative GPA
              </span>
              <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
                <AnimatedCounter value={reportCard?.averageGpa || 4.0} /> / 4.0
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Student Bio & Profile', icon: HiOutlineUser },
          { id: 'timeline', label: 'Academic Timeline', icon: HiOutlineClock },
          { id: 'attendance', label: `Attendance History (${student.attendance?.length || 0})`, icon: HiOutlineClipboardCheck },
          { id: 'fees', label: `Fee Ledger (${student.fees?.length || 0})`, icon: HiOutlineCurrencyDollar },
          { id: 'results', label: `Examination Results (${reportCard?.subjectsBreakdown?.length || 0})`, icon: HiOutlineDocumentText },
          { id: 'courses', label: `Enrolled Classes (${student.courses?.length || 0})`, icon: HiOutlineAcademicCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap -mb-px ${
                isActive
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content */}
      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <HiOutlineUser className="w-5 h-5 text-primary-600" />
              Personal & Guardian Details
            </h3>
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Full Name</dt>
                <dd className="font-bold text-slate-900 dark:text-white">{student.name}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Father / Guardian</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{student.guardianName || '—'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Gender</dt>
                <dd className="capitalize font-semibold text-slate-900 dark:text-white">{student.gender || '—'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Date of Birth</dt>
                <dd className="text-slate-900 dark:text-white">{student.dateOfBirth ? formatDate(student.dateOfBirth) : '—'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Blood Group</dt>
                <dd className="font-bold text-rose-600 dark:text-rose-400">{student.bloodGroup || '—'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Guardian Phone</dt>
                <dd className="text-slate-900 dark:text-white font-mono">{student.guardianPhone || '—'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Residential Address</dt>
                <dd className="text-slate-900 dark:text-white text-right max-w-xs">{student.address || '—'}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <HiOutlineAcademicCap className="w-5 h-5 text-primary-600" />
              Academic Enrollment Profile
            </h3>
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Roll Number</dt>
                <dd className="font-mono font-bold text-primary-600 dark:text-primary-400">{student.rollNumber}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Assigned Grade</dt>
                <dd className="font-bold text-slate-900 dark:text-white">{student.class}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Section</dt>
                <dd className="font-bold text-slate-900 dark:text-white">Section {student.section}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Date of Admission</dt>
                <dd className="text-slate-900 dark:text-white">{formatDate(student.admissionDate)}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Account Status</dt>
                <dd><Badge variant={getStatusColor(student.status)}>{student.status.toUpperCase()}</Badge></dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Student Portal Email</dt>
                <dd className="text-slate-900 dark:text-white font-mono text-xs">{student.email || '—'}</dd>
              </div>
            </dl>
          </Card>
        </div>
      )}

      {/* TAB 2: TIMELINE */}
      {activeTab === 'timeline' && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <HiOutlineClock className="w-5 h-5 text-primary-600" />
            Student Academic Journey & Milestones
          </h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
            <div className="relative">
              <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 mb-1">
                  <span>Current Academic Session 2026</span>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Enrolled in {student.class} - Section {student.section}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Full syllabus active across science and humanities subjects.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white dark:ring-slate-900" />
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-primary-600 mb-1">
                  <span>Admitted on {formatDate(student.admissionDate || '2026-01-10')}</span>
                  <Badge variant="primary" size="sm">Verified</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Official School Enrollment Completed
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Assigned permanent student roll number: <strong>{student.rollNumber}</strong>.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daily Attendance History Log
            </h3>
            <Badge variant="success">
              {attendanceRate}% Presence Rate
            </Badge>
          </div>

          {!student.attendance || student.attendance.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={HiOutlineClipboardCheck}
                title="No Attendance Logs Found"
                description="No classroom attendance entries have been recorded for this student yet."
                compact
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Course / Subject</th>
                    <th className="px-5 py-3.5">Remarks</th>
                    <th className="px-5 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {student.attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white text-xs">
                        {formatDate(att.date)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 text-xs">
                        {att.courses?.name || 'Class Session'}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {att.remarks || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Badge
                          variant={
                            att.status === 'present'
                              ? 'success'
                              : att.status === 'absent'
                              ? 'danger'
                              : att.status === 'late'
                              ? 'warning'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {att.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 4: FEES */}
      {activeTab === 'fees' && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Fee Ledger & Invoices
            </h3>
            <span className="text-xs font-bold text-rose-600">
              Outstanding: {formatCurrency(pendingFees)}
            </span>
          </div>

          {!student.fees || student.fees.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={HiOutlineCurrencyDollar}
                title="No Fee Records Found"
                description="No fee invoices or payments have been recorded for this student."
                compact
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Fee Category</th>
                    <th className="px-5 py-3.5">Invoiced Amount</th>
                    <th className="px-5 py-3.5">Paid Amount</th>
                    <th className="px-5 py-3.5">Receipt #</th>
                    <th className="px-5 py-3.5">Payment Date</th>
                    <th className="px-5 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {student.fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white capitalize text-xs">
                        {fee.fee_type} Fee
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white text-xs">
                        {formatCurrency(fee.amount)}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {formatCurrency(fee.paid_amount)}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                        {fee.receipt_number || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {fee.payment_date ? formatDate(fee.payment_date) : 'Pending'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Badge
                          variant={
                            fee.status === 'paid'
                              ? 'success'
                              : fee.status === 'partial'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {fee.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 5: RESULTS */}
      {activeTab === 'results' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Academic Results & GPA Transcript
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Session 2026 Examination Performance
              </p>
            </div>
            {reportCard && (
              <Button
                variant="primary"
                icon={HiOutlinePrinter}
                onClick={() => setShowReportCardModal(true)}
              >
                Print Official Report Card
              </Button>
            )}
          </div>

          {!reportCard || reportCard.subjectsBreakdown.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={HiOutlineAcademicCap}
                title="No Examination Marks Published"
                description="No academic evaluation results or term grades have been published for this student in session 2026."
                compact
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* GPA & Percentage stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall GPA</span>
                  <span className="text-2xl font-black text-primary-600">{reportCard.averageGpa} / 4.0</span>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Percentage</span>
                  <span className="text-2xl font-black text-indigo-600">{reportCard.overallPercentage}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Letter Grade</span>
                  <span className="text-2xl font-black text-emerald-600">{reportCard.overallGrade}</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Exam Term</th>
                      <th className="p-3 text-center">Obtained / Max</th>
                      <th className="p-3 text-center">Grade</th>
                      <th className="p-3 text-center">GPA</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {reportCard.subjectsBreakdown.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {row.subjectName}
                          <span className="block text-[10px] font-mono text-slate-400">{row.subjectCode}</span>
                        </td>
                        <td className="p-3 capitalize text-slate-600 dark:text-slate-300">
                          {row.examType.replace('_', ' ')}
                        </td>
                        <td className="p-3 text-center font-bold text-slate-900 dark:text-white">
                          {row.marksObtained} <span className="text-slate-400 font-normal">/ {row.totalMarks}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded font-black text-primary-600 bg-primary-50 dark:bg-primary-950/60">
                            {row.grade}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">
                          {row.gpa}
                        </td>
                        <td className="p-3 text-right">
                          <Badge variant={row.isPassed ? 'success' : 'danger'} size="sm">
                            {row.isPassed ? 'PASSED' : 'FAILED'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TAB 6: COURSES */}
      {activeTab === 'courses' && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <HiOutlineAcademicCap className="w-5 h-5 text-primary-600" />
            Enrolled Subjects in {student.class}
          </h3>
          {!student.courses || student.courses.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={HiOutlineAcademicCap}
                title="No Courses Scheduled"
                description={`No active academic courses or timetable slots have been scheduled for ${student.class}.`}
                compact
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {student.courses.map((course) => (
                <div key={course.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs font-mono">
                      {course.subjects?.code || 'CRS'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {course.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {course.schedule || 'Standard Schedule'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                    {course.subjects?.total_marks || 100} Marks
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Report Card Print Modal */}
      <Modal
        isOpen={showReportCardModal}
        onClose={() => setShowReportCardModal(false)}
        title="Official Student Progress Report"
      >
        {reportCard && (
          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl space-y-4 text-slate-900 dark:text-white text-xs">
              <div className="text-center border-b-2 pb-3 border-slate-900 dark:border-slate-700">
                <h3 className="text-xl font-black uppercase tracking-tight text-primary-700 dark:text-primary-400">
                  The Educator School
                </h3>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                  Official Academic Transcript • Session 2026
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block font-bold">Student:</span>
                  <span className="font-bold text-sm">{student.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Roll Number:</span>
                  <span className="font-bold text-sm font-mono">{student.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Class & Section:</span>
                  <span className="font-bold">{student.class} - Sec {student.section}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Cumulative GPA:</span>
                  <span className="font-black text-sm text-primary-600">{reportCard.averageGpa} / 4.0</span>
                </div>
              </div>

              <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2">Subject</th>
                      <th className="p-2 text-center">Total</th>
                      <th className="p-2 text-center">Obtained</th>
                      <th className="p-2 text-center">Grade</th>
                      <th className="p-2 text-center">GPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {reportCard.subjectsBreakdown.map((s) => (
                      <tr key={s.id}>
                        <td className="p-2 font-bold">{s.subjectName}</td>
                        <td className="p-2 text-center">{s.totalMarks}</td>
                        <td className="p-2 text-center font-bold">{s.marksObtained}</td>
                        <td className="p-2 text-center font-bold">{s.grade}</td>
                        <td className="p-2 text-center font-mono">{s.gpa.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 text-center text-[11px] text-slate-400">
                <div className="border-t border-slate-400 dark:border-slate-600 pt-1 font-semibold">
                  Class Teacher Signature
                </div>
                <div className="border-t border-slate-400 dark:border-slate-600 pt-1 font-semibold">
                  Principal & Seal
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowReportCardModal(false)}>
                Close
              </Button>
              <Button variant="primary" icon={HiOutlinePrinter} onClick={() => window.print()}>
                Print Report Card
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onCancel={() => setDeleteDialog({ isOpen: false, loading: false })}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete ${student.name}? This will remove all their profile, attendance, and fee data.`}
        confirmText="Yes, Delete Student"
        confirmVariant="danger"
        isLoading={deleteDialog.loading}
        onConfirm={handleDeleteStudent}
      />
    </div>
  );
}
