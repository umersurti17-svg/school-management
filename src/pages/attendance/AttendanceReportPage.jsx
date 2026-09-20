import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineDocumentReport,
  HiOutlineCalendar,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
} from 'react-icons/hi';
import { attendanceService } from '../../services/attendanceService';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import toast from 'react-hot-toast';

export default function AttendanceReportPage() {
  const navigate = useNavigate();
  const { isAdmin, isTeacher } = useAuth();

  const [courses, setCourses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // View mode: 'list' | 'calendar' | 'heatmap'
  const [viewMode, setViewMode] = useState('list');

  // Calendar month state
  const [calDate, setCalDate] = useState(new Date());

  // Edit modal state
  const [editItem, setEditItem] = useState(null);
  const [editStatus, setEditStatus] = useState('present');
  const [editRemarks, setEditRemarks] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const list = await courseService.getCourses();
        setCourses(list);
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    }
    loadCourses();
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAttendanceLogs({
        courseId: selectedCourse,
        status: selectedStatus,
        startDate,
        endDate,
        limit: 200,
      });
      setLogs(data);
    } catch (err) {
      toast.error('Failed to load attendance logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, selectedStatus, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Filter logs by search query
  const filteredLogs = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        l.studentName?.toLowerCase().includes(q) ||
        l.rollNumber?.toLowerCase().includes(q) ||
        l.courseName?.toLowerCase().includes(q) ||
        l.className?.toLowerCase().includes(q)
    );
  }, [logs, search]);

  // Metrics
  const total = filteredLogs.length;
  const present = filteredLogs.filter((l) => l.status === 'present').length;
  const absent = filteredLogs.filter((l) => l.status === 'absent').length;
  const lateOrExcused = filteredLogs.filter((l) => l.status === 'late' || l.status === 'excused').length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Present</Badge>;
      case 'absent':
        return <Badge variant="danger">Absent</Badge>;
      case 'late':
        return <Badge variant="warning">Late</Badge>;
      case 'excused':
        return <Badge variant="primary">Excused</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Handle Edit Attendance Record
  const handleOpenEdit = (log) => {
    setEditItem(log);
    setEditStatus(log.status);
    setEditRemarks(log.remarks || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editItem) return;
    try {
      setEditLoading(true);
      await attendanceService.updateAttendance(editItem.id, {
        status: editStatus,
        remarks: editRemarks,
      });
      toast.success('Attendance record updated successfully');
      setEditItem(null);
      fetchLogs();
    } catch (err) {
      toast.error('Failed to update attendance');
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete Attendance Record
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await attendanceService.deleteAttendance(deleteId);
      toast.success('Attendance entry removed');
      setDeleteId(null);
      fetchLogs();
    } catch (err) {
      toast.error('Failed to delete attendance record');
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Calendar calculations
  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const monthName = calDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0 = Sunday

  // Group logs by date for calendar
  const dateLogsMap = useMemo(() => {
    const map = {};
    logs.forEach((log) => {
      if (!map[log.date]) map[log.date] = [];
      map[log.date].push(log);
    });
    return map;
  }, [logs]);

  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            icon={HiOutlineArrowLeft}
            onClick={() => navigate('/attendance')}
            className="p-2"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Attendance History & Calendar
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Historical logs, monthly interactive calendar, and student presence management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'heatmap'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Heatmap
            </button>
          </div>

          <Button
            variant="primary"
            icon={HiOutlinePlus}
            onClick={() => navigate('/attendance')}
          >
            Mark Attendance
          </Button>

          <Button
            variant="secondary"
            icon={HiOutlineRefresh}
            onClick={fetchLogs}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Present Rate
            </span>
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            <AnimatedCounter value={`${attendanceRate}%`} />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{present} sessions recorded present</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Absences
            </span>
            <HiOutlineXCircle className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            <AnimatedCounter value={absent} />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Recorded unexcused leaves</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Late / Excused
            </span>
            <HiOutlineClock className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            <AnimatedCounter value={lateOrExcused} />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Late arrivals or permitted leaves</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent border-primary-100 dark:border-primary-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Logs
            </span>
            <HiOutlineDocumentReport className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            <AnimatedCounter value={total} />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Filtered entries</p>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Search Student / Roll
            </label>
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Course / Class
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Courses & Classes</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.class} ({c.section}) - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Card>

      {/* View 1: Calendar View */}
      {viewMode === 'calendar' ? (
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {monthName}
                </h2>
                <p className="text-xs text-slate-400">Select any day to inspect and manage logs</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={HiOutlineChevronLeft}
                  onClick={() => setCalDate(new Date(calYear, calMonth - 1, 1))}
                >
                  Prev Month
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCalDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={HiOutlineChevronRight}
                  onClick={() => setCalDate(new Date(calYear, calMonth + 1, 1))}
                >
                  Next Month
                </Button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center font-bold text-xs text-slate-400 uppercase py-2">
                  {d}
                </div>
              ))}

              {/* Empty leading days */}
              {[...Array(firstDayIndex)].map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[90px] rounded-xl bg-slate-50/40 dark:bg-slate-800/20 border border-transparent" />
              ))}

              {/* Month Days */}
              {[...Array(daysInMonth)].map((_, i) => {
                const dayNum = i + 1;
                const dStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayLogs = dateLogsMap[dStr] || [];
                const dayPresent = dayLogs.filter((l) => l.status === 'present').length;
                const dayAbsent = dayLogs.filter((l) => l.status === 'absent').length;
                const dayLate = dayLogs.filter((l) => l.status === 'late' || l.status === 'excused').length;
                const isSelected = selectedCalendarDate === dStr;

                return (
                  <div
                    key={dStr}
                    onClick={() => setSelectedCalendarDate(isSelected ? null : dStr)}
                    className={`min-h-[90px] p-2 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/40 dark:bg-primary-950/40 ring-2 ring-primary-500/20'
                        : dayLogs.length > 0
                        ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300'
                        : 'border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{dayNum}</span>
                      {dayLogs.length > 0 && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          {dayLogs.length} logs
                        </span>
                      )}
                    </div>

                    {dayLogs.length > 0 ? (
                      <div className="space-y-1 my-1">
                        {dayPresent > 0 && (
                          <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.5 rounded truncate">
                            ✓ {dayPresent} Present
                          </div>
                        )}
                        {dayAbsent > 0 && (
                          <div className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1 py-0.5 rounded truncate">
                            ✕ {dayAbsent} Absent
                          </div>
                        )}
                        {dayLate > 0 && (
                          <div className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded truncate">
                            ◷ {dayLate} Late/Exc
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No logs</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Selected Calendar Day Detail Table */}
          {selectedCalendarDate && (
            <Card className="p-5 space-y-4 border-primary-200 dark:border-primary-900/50">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Attendance Entries for {selectedCalendarDate}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {(dateLogsMap[selectedCalendarDate] || []).length} students logged on this date
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCalendarDate(null)}
                >
                  Close
                </Button>
              </div>

              {(dateLogsMap[selectedCalendarDate] || []).length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No attendance logged on this date.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-bold">
                      <tr>
                        <th className="p-2.5">Roll #</th>
                        <th className="p-2.5">Student</th>
                        <th className="p-2.5">Class / Course</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Remarks</th>
                        <th className="p-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {dateLogsMap[selectedCalendarDate].map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-2.5 font-mono font-bold">{log.rollNumber}</td>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{log.studentName}</td>
                          <td className="p-2.5">{log.className} • {log.courseName}</td>
                          <td className="p-2.5">{getStatusBadge(log.status)}</td>
                          <td className="p-2.5 text-slate-400">{log.remarks || '—'}</td>
                          <td className="p-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEdit(log)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                                title="Edit Record"
                              >
                                <HiOutlinePencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(log.id)}
                                className="p-1 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title="Delete Entry"
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </div>
      ) : viewMode === 'heatmap' ? (
        /* View 2: Heatmap */
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Attendance Activity Heatmap
              </h3>
              <p className="text-xs text-slate-400">Visual distribution of present, absent, and late session logs</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Present</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Absent</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Late</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {filteredLogs.slice(0, 28).map((log, idx) => (
              <div
                key={log.id || idx}
                className={`p-3 rounded-xl border text-center transition-transform hover:scale-105 ${
                  log.status === 'present'
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                    : log.status === 'absent'
                    ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300'
                    : 'border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300'
                }`}
              >
                <span className="text-[10px] uppercase font-bold block text-slate-400">{log.date}</span>
                <span className="text-xs font-black block mt-1 truncate">{log.studentName}</span>
                <Badge variant={log.status === 'present' ? 'success' : log.status === 'absent' ? 'danger' : 'warning'} size="sm" className="mt-1.5 uppercase text-[9px]">
                  {log.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* View 3: Historical Logs Table */
        <Card className="overflow-hidden">
          {loading ? (
            <div className="py-16">
              <Loader size="lg" text="Loading historical attendance logs..." />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 sm:p-12">
              <EmptyState
                icon={HiOutlineDocumentReport}
                title={
                  search || selectedCourse || selectedStatus || startDate || endDate
                    ? 'No Matching Attendance Records'
                    : 'No Attendance History Available'
                }
                description={
                  search || selectedCourse || selectedStatus || startDate || endDate
                    ? 'No attendance records matched your search or filter criteria. Try adjusting the date range or filters.'
                    : 'No classroom attendance entries have been submitted yet. Take daily class attendance to view attendance reports and analytics.'
                }
                actionLabel={
                  search || selectedCourse || selectedStatus || startDate || endDate
                    ? 'Reset Filters'
                    : 'Take Attendance'
                }
                actionIcon={
                  search || selectedCourse || selectedStatus || startDate || endDate
                    ? HiOutlineRefresh
                    : HiOutlineCheckCircle
                }
                onAction={
                  search || selectedCourse || selectedStatus || startDate || endDate
                    ? () => {
                        setSearch('');
                        setSelectedCourse('');
                        setSelectedStatus('');
                        setStartDate('');
                        setEndDate('');
                      }
                    : () => navigate('/attendance')
                }
                secondaryActionLabel={
                  (search || selectedCourse || selectedStatus || startDate || endDate)
                    ? 'Take Attendance'
                    : undefined
                }
                onSecondaryAction={
                  (search || selectedCourse || selectedStatus || startDate || endDate)
                    ? () => navigate('/attendance')
                    : undefined
                }
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Roll #</th>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Class / Course</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Remarks</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {log.date}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs font-bold text-primary-600 dark:text-primary-400">
                          {log.rollNumber || '—'}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{log.studentName}</span>
                            {(log.studentName?.includes('(Demo)') || log.remarks?.includes('Demo Data')) && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                Demo
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{log.className}</span>
                          <span className="block text-[11px] text-slate-400">{log.courseName}</span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(log.status)}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                          {log.remarks || '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(log)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit Attendance"
                            >
                              <HiOutlinePencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(log.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete Entry"
                            >
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredLogs.length > pageSize && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(filteredLogs.length / pageSize)}
                    onPageChange={setPage}
                    totalCount={filteredLogs.length}
                    pageSize={pageSize}
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Edit Attendance Record Modal */}
      <Modal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit Attendance Record"
      >
        {editItem && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {editItem.studentName} ({editItem.rollNumber})
              </div>
              <div className="text-slate-500">
                {editItem.courseName} • Date: {editItem.date}
              </div>
            </div>

            <Select
              label="Attendance Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              options={[
                { value: 'present', label: 'Present' },
                { value: 'absent', label: 'Absent' },
                { value: 'late', label: 'Late' },
                { value: 'excused', label: 'Excused Leave' },
              ]}
              required
            />

            <Input
              label="Remarks / Note"
              value={editRemarks}
              onChange={(e) => setEditRemarks(e.target.value)}
              placeholder="e.g. Arrived 15m late with slip"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setEditItem(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={editLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Attendance Entry"
        message="Are you sure you want to delete this individual attendance record? This will permanently remove it from attendance reports."
        confirmText="Yes, Delete Record"
        variant="danger"
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
