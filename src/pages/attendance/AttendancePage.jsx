import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineClipboardCheck,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiOutlineSave,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineDocumentReport,
  HiOutlineUserAdd,
  HiOutlinePlus,
  HiOutlineTrash,
} from 'react-icons/hi';
import { attendanceService } from '../../services/attendanceService';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [sheet, setSheet] = useState([]);
  const [courseInfo, setCourseInfo] = useState(null);
  const [isRecorded, setIsRecorded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBatch, setDeletingBatch] = useState(false);

  // Load all available courses
  useEffect(() => {
    async function loadCourses() {
      try {
        const list = await courseService.getCourses();
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourseId(list[0].id);
        }
      } catch (err) {
        toast.error('Failed to load courses');
        console.error(err);
      }
    }
    loadCourses();
  }, []);

  // Fetch attendance sheet whenever course or date changes
  const fetchSheet = useCallback(async () => {
    if (!selectedCourseId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await attendanceService.getCourseAttendanceSheet(selectedCourseId, date);
      setCourseInfo(data.course);
      setSheet(data.sheet);
      setIsRecorded(data.isRecorded);
    } catch (err) {
      toast.error('Failed to load attendance checklist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId, date]);

  useEffect(() => {
    fetchSheet();
  }, [fetchSheet]);

  const handleStatusChange = (studentId, status) => {
    setSheet((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setSheet((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, remarks } : item
      )
    );
  };

  const handleMarkAll = (status) => {
    setSheet((prev) =>
      prev.map((item) => ({ ...item, status }))
    );
    toast.success(`All marked as ${status}`);
  };

  const handleSave = async () => {
    if (!selectedCourseId || sheet.length === 0) return;

    try {
      setSaving(true);
      await attendanceService.saveBatchAttendance({
        courseId: selectedCourseId,
        date,
        records: sheet,
        markedById: user?.id,
      });
      setIsRecorded(true);
      toast.success('Attendance saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBatch = async () => {
    if (!selectedCourseId || !date) return;
    try {
      setDeletingBatch(true);
      await attendanceService.deleteAttendanceBatch({
        courseId: selectedCourseId,
        date,
      });
      toast.success('Attendance records deleted for this session');
      setShowDeleteConfirm(false);
      fetchSheet();
    } catch (err) {
      toast.error('Failed to delete attendance records');
      console.error(err);
    } finally {
      setDeletingBatch(false);
    }
  };

  // Status stats
  const presentCount = sheet.filter((s) => s.status === 'present').length;
  const absentCount = sheet.filter((s) => s.status === 'absent').length;
  const lateCount = sheet.filter((s) => s.status === 'late').length;
  const excusedCount = sheet.filter((s) => s.status === 'excused').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Take Attendance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Record daily student presence, absences, and attendance remarks per class session.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/attendance/report">
            <Button variant="secondary" icon={HiOutlineDocumentReport}>
              Attendance Reports & Calendar
            </Button>
          </Link>

          {isRecorded && (
            <Button
              variant="danger"
              icon={HiOutlineTrash}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Clear Session
            </Button>
          )}

          <Button
            variant="primary"
            icon={HiOutlineSave}
            onClick={handleSave}
            loading={saving}
            disabled={saving || sheet.length === 0}
          >
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Control Panel / Selectors or Empty Course Warning */}
      {courses.length === 0 && !loading ? (
        <Card className="p-8 sm:p-12">
          <EmptyState
            icon={HiOutlineAcademicCap}
            title="No Academic Courses Configured"
            description="To begin marking student attendance, you must first create courses and assign class sections."
            actionLabel={isAdmin ? 'Create Academic Course' : null}
            actionIcon={HiOutlinePlus}
            onAction={isAdmin ? () => navigate('/courses/add') : null}
          />
        </Card>
      ) : (
        <Card className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Select Course & Class Session
              </label>
              <div className="relative">
                <HiOutlineAcademicCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.class} ({c.section}) — {c.name} ({c.subjectName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Attendance Date
              </label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Summary & Batch Actions */}
      {sheet.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Present</span>
            </div>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              <AnimatedCounter value={presentCount} />
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineXCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200">Absent</span>
            </div>
            <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
              <AnimatedCounter value={absentCount} />
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineClock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Late</span>
            </div>
            <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
              <AnimatedCounter value={lateCount} />
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineExclamationCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-xs font-bold text-sky-900 dark:text-sky-200">Excused</span>
            </div>
            <span className="text-lg font-extrabold text-sky-600 dark:text-sky-400">
              <AnimatedCounter value={excusedCount} />
            </span>
          </div>
        </div>
      )}

      {/* Attendance Checklist Table */}
      {courses.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Student Attendance Checklist
              </h2>
              {isRecorded && (
                <Badge variant="success" size="sm">
                  Recorded for {date}
                </Badge>
              )}
            </div>

            {sheet.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Quick Set:</span>
                <button
                  onClick={() => handleMarkAll('present')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold hover:opacity-80 transition-opacity"
                >
                  All Present
                </button>
                <button
                  onClick={() => handleMarkAll('absent')}
                  className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold hover:opacity-80 transition-opacity"
                >
                  All Absent
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-16">
              <Loader size="lg" text="Loading student checklist..." />
            </div>
          ) : sheet.length === 0 ? (
            <div className="p-8 sm:p-12">
              <EmptyState
                icon={HiOutlineClipboardCheck}
                title="No Students Enrolled in this Class"
                description="There are currently no active students assigned to this course's grade and section. Enroll students into this class to mark their daily attendance."
                actionLabel={isAdmin ? 'Enroll Student' : undefined}
                actionIcon={HiOutlineUserAdd}
                onAction={isAdmin ? () => navigate('/students/add') : undefined}
              />
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-20">Roll #</th>
                  <th className="py-3 px-4 min-w-[200px]">Student</th>
                  <th className="py-3 px-4 min-w-[280px]">Status</th>
                  <th className="py-3 px-4 min-w-[200px]">Remarks / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {sheet.map((item) => (
                  <tr key={item.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-primary-600 dark:text-primary-400">
                      {item.rollNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={item.avatarUrl}
                          name={item.studentName}
                          size="sm"
                        />
                        <span className="text-slate-900 dark:text-slate-100 font-bold">
                          {item.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {[
                          { id: 'present', label: 'P', title: 'Present', activeColor: 'bg-emerald-600 text-white border-emerald-600' },
                          { id: 'absent', label: 'A', title: 'Absent', activeColor: 'bg-rose-600 text-white border-rose-600' },
                          { id: 'late', label: 'L', title: 'Late', activeColor: 'bg-amber-500 text-white border-amber-500' },
                          { id: 'excused', label: 'E', title: 'Excused', activeColor: 'bg-sky-600 text-white border-sky-600' },
                        ].map((btn) => {
                          const isSelected = item.status === btn.id;
                          return (
                            <button
                              key={btn.id}
                              type="button"
                              onClick={() => handleStatusChange(item.studentId, btn.id)}
                              className={`w-9 h-8 sm:w-16 sm:h-8 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                                isSelected
                                  ? `${btn.activeColor} shadow-sm scale-105`
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-slate-400'
                              }`}
                              title={btn.title}
                            >
                              <span className="hidden sm:inline">{btn.title}</span>
                              <span className="sm:hidden">{btn.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        value={item.remarks}
                        onChange={(e) => handleRemarksChange(item.studentId, e.target.value)}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer save banner */}
        {sheet.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total {sheet.length} Students in Roster
            </span>
            <Button
              variant="primary"
              icon={HiOutlineSave}
              onClick={handleSave}
              loading={saving}
              disabled={saving}
            >
              Save Attendance
            </Button>
          </div>
        )}
      </Card>
      )}

      {/* Delete Batch Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Attendance Session Records?"
        message={`Are you sure you want to delete all attendance records for ${courseInfo?.name || 'this course'} on ${date}?`}
        confirmText="Yes, Delete Session Records"
        variant="danger"
        isLoading={deletingBatch}
        onConfirm={handleDeleteBatch}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
