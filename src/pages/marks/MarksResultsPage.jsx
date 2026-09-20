import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePrinter,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlinePencilAlt,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
} from 'react-icons/hi';
import { marksService } from '../../services/marksService';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { GRADING_SCALE } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function MarksResultsPage() {
  const { user, isStudent, isAdmin, isTeacher } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [academicYear, setAcademicYear] = useState(2026);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Edit Mark Modal State
  const [editMarkItem, setEditMarkItem] = useState(null);
  const [editMarkForm, setEditMarkForm] = useState({
    marksObtained: '',
    totalMarks: 100,
    remarks: '',
  });
  const [editMarkSubmitting, setEditMarkSubmitting] = useState(false);

  // Delete Mark State
  const [deleteMarkId, setDeleteMarkId] = useState(null);
  const [deleteMarkLoading, setDeleteMarkLoading] = useState(false);

  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  // Load students for selector
  const loadStudents = useCallback(async () => {
    try {
      setStudentsLoading(true);
      setStudentsError(null);
      if (isStudent && user?.id) {
        const s = await studentService.getStudentByAuthId(user.id);
        if (s) {
          setSelectedStudentId(s.id);
          setStudents([s]);
          return;
        }
      }

      const list = await studentService.getAllStudentsList();
      setStudents(list || []);
      if (list && list.length > 0) {
        setSelectedStudentId((prev) => (prev && list.some((s) => s.id === prev) ? prev : list[0].id));
      }
    } catch (err) {
      console.error('Error loading students list for results:', err);
      setStudentsError('Failed to load students.');
    } finally {
      setStudentsLoading(false);
    }
  }, [user, isStudent]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Load report card
  const fetchReport = useCallback(async () => {
    if (!selectedStudentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await marksService.getStudentReportCard(selectedStudentId, academicYear);
      setReport(data);
    } catch (err) {
      toast.error('Failed to load academic report card');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedStudentId, academicYear]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleOpenEditMark = (item) => {
    setEditMarkItem(item);
    setEditMarkForm({
      marksObtained: String(item.marksObtained),
      totalMarks: item.totalMarks || 100,
      remarks: item.remarks || '',
    });
  };

  const handleSaveEditMark = async (e) => {
    e.preventDefault();
    if (!editMarkItem) return;
    try {
      setEditMarkSubmitting(true);
      await marksService.updateMark(editMarkItem.id, {
        marksObtained: editMarkForm.marksObtained,
        totalMarks: editMarkForm.totalMarks,
        remarks: editMarkForm.remarks,
      });
      toast.success('Mark score updated successfully');
      setEditMarkItem(null);
      fetchReport();
    } catch (err) {
      toast.error('Failed to update mark');
      console.error(err);
    } finally {
      setEditMarkSubmitting(false);
    }
  };

  const handleDeleteMarkConfirm = async () => {
    if (!deleteMarkId) return;
    try {
      setDeleteMarkLoading(true);
      await marksService.deleteMark(deleteMarkId);
      toast.success('Mark record deleted');
      setDeleteMarkId(null);
      fetchReport();
    } catch (err) {
      toast.error('Failed to delete mark');
      console.error(err);
    } finally {
      setDeleteMarkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Results & Report Cards
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive evaluation transcripts, GPA calculations, and student progress reports.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(isAdmin || isTeacher) && (
            <Button
              variant="primary"
              icon={HiOutlinePlus}
              onClick={() => navigate('/marks/entry')}
            >
              Enter Marks
            </Button>
          )}

          <Button
            variant="secondary"
            icon={HiOutlineRefresh}
            onClick={fetchReport}
          >
            Refresh
          </Button>

          {report && (
            <Button
              variant="outline"
              icon={HiOutlinePrinter}
              onClick={() => setShowPrintModal(true)}
            >
              Print Report Card
            </Button>
          )}
        </div>
      </div>

      {/* Selectors Panel */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Student Profile
              </label>
              {!isStudent && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadStudents}
                    disabled={studentsLoading}
                    className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <HiOutlineRefresh className={`w-3.5 h-3.5 ${studentsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => navigate('/students/add')}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <HiOutlinePlus className="w-3.5 h-3.5" />
                      + Add Student
                    </button>
                  )}
                </div>
              )}
            </div>

            {studentsLoading ? (
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                <Loader size="sm" />
                <span>Loading students...</span>
              </div>
            ) : studentsError ? (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 text-xs text-rose-600 flex items-center justify-between">
                <span>{studentsError}</span>
                <Button size="xs" variant="outline" onClick={loadStudents}>Retry</Button>
              </div>
            ) : students.length === 0 ? (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 text-center space-y-1">
                <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">No students found.</p>
                {isAdmin && (
                  <Button size="xs" variant="primary" icon={HiOutlinePlus} onClick={() => navigate('/students/add')}>
                    Add Student
                  </Button>
                )}
              </div>
            ) : (
              <div className="relative">
                <HiOutlineAcademicCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber}) — {s.class} ({s.section})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Academic Session Year
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium"
            >
              <option value="2026">Academic Year 2026</option>
              <option value="2025">Academic Year 2025</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Report Summary Cards */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent border-primary-100 dark:border-primary-900/30">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cumulative GPA
            </span>
            <h3 className="text-3xl font-black text-primary-600 dark:text-primary-400 mt-1">
              <AnimatedCounter value={report.averageGpa} /> <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Overall Grade: {report.overallGrade}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent border-indigo-100 dark:border-indigo-900/30">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Percentage
            </span>
            <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              <AnimatedCounter value={`${report.overallPercentage}%`} />
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {report.totalObtainedMarks} / {report.totalMaxMarks} Marks
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-100 dark:border-emerald-900/30">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              {report.isPassed ? (
                <Badge variant="success" size="lg">PASSED</Badge>
              ) : (
                <Badge variant="danger" size="lg">NEEDS IMPROVEMENT</Badge>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Term clearance verified</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border-amber-100 dark:border-amber-900/30">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Evaluated Subjects
            </span>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              <AnimatedCounter value={report.subjectsBreakdown.length} />
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Graded curricula</p>
          </Card>
        </div>
      )}

      {/* Breakdown Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Subject Examination Breakdown
          </h2>
          {report?.student && (
            <span className="text-xs font-semibold text-slate-500">
              {report.student.name} • {report.student.class} - {report.student.section}
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-16">
            <Loader size="lg" text="Compiling academic transcripts..." />
          </div>
        ) : !report || report.subjectsBreakdown.length === 0 ? (
          <div className="p-8 sm:p-12">
            <EmptyState
              icon={HiOutlineAcademicCap}
              title="No Evaluation Marks Published"
              description="No exam evaluation marks or term grades have been published for this student in the selected academic year. Subject results entered by faculty will populate here."
              actionLabel={(isAdmin || isTeacher) ? 'Enter Exam Marks' : undefined}
              actionIcon={HiOutlinePencilAlt}
              onAction={(isAdmin || isTeacher) ? () => navigate('/marks/entry') : undefined}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Subject & Code</th>
                  <th className="py-3 px-4">Term</th>
                  <th className="py-3 px-4">Obtained / Max</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">GPA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Remarks</th>
                  {(isAdmin || isTeacher) && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {report.subjectsBreakdown.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{item.subjectName}</span>
                        {(item.remarks?.includes('Demo Data') || item.subjectName?.includes('(Demo)')) && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            Demo Data
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-normal">{item.subjectCode}</span>
                    </td>
                    <td className="py-3 px-4 capitalize text-xs text-slate-600 dark:text-slate-300">
                      {item.examType.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {item.marksObtained} <span className="text-slate-400 text-xs">/ {item.totalMarks}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-primary-600 dark:text-primary-400">
                      {item.percentage}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-black ${
                        item.grade.startsWith('A') ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' :
                        item.grade.startsWith('B') ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300' :
                        item.grade.startsWith('C') ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' :
                        'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      }`}>
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.gpa.toFixed(1)}
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'Passed' ? (
                        <Badge variant="success" size="sm">Passed</Badge>
                      ) : (
                        <Badge variant="danger" size="sm">Failed</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                      {item.remarks || '—'}
                    </td>
                    {(isAdmin || isTeacher) && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={HiOutlinePencil}
                            onClick={() => handleOpenEditMark(item)}
                            title="Edit Mark Score"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            icon={HiOutlineTrash}
                            onClick={() => setDeleteMarkId(item.id)}
                            title="Delete Mark"
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit Mark Modal */}
      <Modal
        isOpen={Boolean(editMarkItem)}
        onClose={() => setEditMarkItem(null)}
        title="Edit Exam Evaluation Mark"
      >
        {editMarkItem && (
          <form onSubmit={handleSaveEditMark} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                {editMarkItem.subjectName} ({editMarkItem.subjectCode})
              </p>
              <p className="text-slate-500 dark:text-slate-400 capitalize">
                Term: {editMarkItem.examType.replace('_', ' ')} • Student: {report?.student?.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Marks Obtained"
                type="number"
                min="0"
                max={editMarkForm.totalMarks || 100}
                value={editMarkForm.marksObtained}
                onChange={(e) =>
                  setEditMarkForm({ ...editMarkForm, marksObtained: e.target.value })
                }
                required
              />
              <Input
                label="Maximum Total Marks"
                type="number"
                min="1"
                value={editMarkForm.totalMarks}
                onChange={(e) =>
                  setEditMarkForm({ ...editMarkForm, totalMarks: Number(e.target.value) })
                }
                required
              />
            </div>

            {/* Live Percentage & Calculated Grade Preview */}
            {editMarkForm.marksObtained !== '' && editMarkForm.totalMarks > 0 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40 text-xs font-semibold">
                <span className="text-primary-700 dark:text-primary-300">
                  Calculated Percentage: {((Number(editMarkForm.marksObtained) / Number(editMarkForm.totalMarks)) * 100).toFixed(1)}%
                </span>
                <span className="text-primary-700 dark:text-primary-300 font-bold">
                  Status: {((Number(editMarkForm.marksObtained) / Number(editMarkForm.totalMarks)) * 100) >= 40 ? 'Passed' : 'Failed'}
                </span>
              </div>
            )}

            <Input
              label="Evaluation Remarks / Notes"
              placeholder="e.g., Good analytical skills, Needs revision in trigonometry"
              value={editMarkForm.remarks}
              onChange={(e) =>
                setEditMarkForm({ ...editMarkForm, remarks: e.target.value })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setEditMarkItem(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={editMarkSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteMarkId)}
        onClose={() => setDeleteMarkId(null)}
        onConfirm={handleDeleteMarkConfirm}
        title="Delete Examination Mark Record"
        message="Are you sure you want to delete this recorded exam mark? This will immediately adjust the student's cumulative percentage and GPA."
        confirmText="Delete Mark"
        confirmVariant="danger"
        loading={deleteMarkLoading}
      />

      {/* Printable Official Report Card Modal */}
      <Modal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        title="Official Student Academic Transcript"
      >
        {report && (
          <div className="space-y-4">
            <div id="printable-report" className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl space-y-4 text-slate-900 dark:text-white">
              {/* Institutional Header */}
              <div className="text-center border-b-2 pb-4 border-slate-900 dark:border-slate-700">
                <h2 className="text-2xl font-black uppercase tracking-tight text-primary-700 dark:text-primary-400">
                  The Educator School
                </h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                  Academic Progress Report Card • Session {report.academicYear}
                </p>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                  <span className="font-bold text-sm">{report.student.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Roll Number</span>
                  <span className="font-bold text-sm font-mono">{report.student.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Class & Section</span>
                  <span className="font-bold text-sm">{report.student.class} - Sec {report.student.section}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Guardian</span>
                  <span className="font-bold text-sm">{report.student.guardianName || '—'}</span>
                </div>
              </div>

              {/* Transcript Subject Matrix */}
              <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5 text-center">Max</th>
                      <th className="p-2.5 text-center">Passing</th>
                      <th className="p-2.5 text-center">Obtained</th>
                      <th className="p-2.5 text-center">Grade</th>
                      <th className="p-2.5 text-center">GPA</th>
                      <th className="p-2.5 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {report.subjectsBreakdown.map((sub) => (
                      <tr key={sub.id}>
                        <td className="p-2.5 font-bold">{sub.subjectName} ({sub.subjectCode})</td>
                        <td className="p-2.5 text-center">{sub.totalMarks}</td>
                        <td className="p-2.5 text-center">{sub.passingMarks}</td>
                        <td className="p-2.5 text-center font-bold">{sub.marksObtained}</td>
                        <td className="p-2.5 text-center font-bold">{sub.grade}</td>
                        <td className="p-2.5 text-center font-mono">{sub.gpa.toFixed(1)}</td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">{sub.status}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                    <tr>
                      <td className="p-2.5 uppercase">Cumulative Total</td>
                      <td className="p-2.5 text-center">{report.totalMaxMarks}</td>
                      <td className="p-2.5 text-center">—</td>
                      <td className="p-2.5 text-center text-primary-600">{report.totalObtainedMarks}</td>
                      <td className="p-2.5 text-center text-primary-600">{report.overallGrade}</td>
                      <td className="p-2.5 text-center font-mono">{report.averageGpa}</td>
                      <td className="p-2.5 text-center font-bold text-emerald-600">
                        {report.isPassed ? 'PASSED' : 'FAILED'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-4 pt-8 text-center text-xs text-slate-500">
                <div className="border-t border-slate-400 dark:border-slate-600 pt-1 font-semibold">
                  Class Teacher Signature
                </div>
                <div className="border-t border-slate-400 dark:border-slate-600 pt-1 font-semibold">
                  Examination Controller
                </div>
                <div className="border-t border-slate-400 dark:border-slate-600 pt-1 font-semibold">
                  Principal / Headmaster
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowPrintModal(false)}>
                Close
              </Button>
              <Button variant="primary" icon={HiOutlinePrinter} onClick={() => window.print()}>
                Print Report Card
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
