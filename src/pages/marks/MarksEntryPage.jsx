import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineSave,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineUserAdd,
  HiOutlineUserGroup,
  HiOutlineTrash,
  HiOutlineSearch,
} from 'react-icons/hi';
import { marksService } from '../../services/marksService';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { calculateGrade } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function MarksEntryPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [className, setClassName] = useState('Grade 10');
  const [section, setSection] = useState('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [examType, setExamType] = useState('mid_term');
  const [academicYear, setAcademicYear] = useState(2026);
  const [searchTerm, setSearchTerm] = useState('');

  const [sheet, setSheet] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Load Subjects catalog
  useEffect(() => {
    async function loadSubjects() {
      try {
        const list = await courseService.getSubjects();
        setSubjects(list);
        if (list.length > 0) {
          setSelectedSubjectId(list[0].id);
        }
      } catch (err) {
        console.error('Error loading subjects:', err);
      }
    }
    loadSubjects();
  }, []);

  const fetchSheet = useCallback(async () => {
    if (!selectedSubjectId) return;

    try {
      setLoading(true);
      const data = await marksService.getMarksSheet({
        className,
        section,
        subjectId: selectedSubjectId,
        examType,
        academicYear,
      });
      setSubjectInfo(data.subject);
      setSheet(data.sheet);
    } catch (err) {
      toast.error('Failed to load marks sheet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [className, section, selectedSubjectId, examType, academicYear]);

  useEffect(() => {
    fetchSheet();
  }, [fetchSheet]);

  const handleMarksChange = (studentId, value) => {
    const totalMax = subjectInfo?.total_marks || 100;
    const numVal = value === '' ? '' : Math.max(0, Math.min(totalMax, Number(value)));

    setSheet((prev) =>
      prev.map((item) => {
        if (item.studentId === studentId) {
          const percentage = numVal !== '' ? (numVal / totalMax) * 100 : 0;
          const gradeInfo = numVal !== '' ? calculateGrade(percentage) : { grade: '—' };
          return {
            ...item,
            marksObtained: numVal,
            grade: gradeInfo.grade,
          };
        }
        return item;
      })
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setSheet((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, remarks } : item
      )
    );
  };

  const handleSave = async () => {
    if (!selectedSubjectId || sheet.length === 0) return;

    try {
      setSaving(true);
      await marksService.saveBatchMarks({
        subjectId: selectedSubjectId,
        examType,
        academicYear,
        totalMarks: subjectInfo?.total_marks || 100,
        enteredById: user?.id,
        records: sheet,
      });
      toast.success('Exam marks saved and published successfully!');
      fetchSheet();
    } catch (err) {
      toast.error(err.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const handleClearBatchConfirm = async () => {
    if (!selectedSubjectId) return;
    try {
      setClearing(true);
      await marksService.deleteMarksBatch({
        subjectId: selectedSubjectId,
        examType,
        academicYear,
      });
      toast.success('Assessment marks cleared for this subject cohort');
      setShowClearConfirm(false);
      fetchSheet();
    } catch (err) {
      toast.error('Failed to clear marks batch');
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  const filteredSheet = useMemo(() => {
    if (!searchTerm.trim()) return sheet;
    const q = searchTerm.toLowerCase();
    return sheet.filter(
      (item) =>
        item.studentName?.toLowerCase().includes(q) ||
        item.rollNumber?.toLowerCase().includes(q)
    );
  }, [sheet, searchTerm]);

  const classes = [
    'Playgroup', 'Nursery', 'Prep',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12'
  ];

  const examTypes = [
    { value: 'quiz', label: 'Quiz / Test (20 Marks)' },
    { value: 'assignment', label: 'Monthly Assessment' },
    { value: 'mid_term', label: 'Mid-Term Examination' },
    { value: 'final_exam', label: 'Final Annual Examination' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Marks Entry Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Input subject scores, calculate letter grades, and record academic evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            icon={HiOutlineRefresh}
            onClick={fetchSheet}
          >
            Refresh
          </Button>
          {isAdmin && sheet.some((s) => s.marksObtained !== '') && (
            <Button
              variant="danger"
              icon={HiOutlineTrash}
              onClick={() => setShowClearConfirm(true)}
            >
              Clear Assessment Batch
            </Button>
          )}
          <Button
            variant="primary"
            icon={HiOutlineSave}
            onClick={handleSave}
            loading={saving}
            disabled={saving || sheet.length === 0}
          >
            Save & Publish Marks
          </Button>
        </div>
      </div>

      {/* Control Panel Selectors */}
      <Card className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Class
            </label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium"
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Section
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium"
            >
              {['A', 'B', 'C', 'D'].map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Subject Syllabus
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          {/* Exam Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Exam / Term
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium"
            >
              {examTypes.map((et) => (
                <option key={et.value} value={et.value}>{et.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Marks Sheet Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Marks Register — {subjectInfo?.name || 'Subject'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Total Marks: {subjectInfo?.total_marks || 100} • Passing Marks: {subjectInfo?.passing_marks || 33}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-56">
              <Input
                placeholder="Search student or roll #..."
                icon={HiOutlineSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Badge variant="primary" size="sm">
              {className} - Sec {section}
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="py-16">
            <Loader size="lg" text="Loading student list and previous marks..." />
          </div>
        ) : sheet.length === 0 ? (
          <div className="p-8 sm:p-12">
            <EmptyState
              icon={HiOutlineUserGroup}
              title="No Students in this Class"
              description={`There are currently no active students assigned to ${className} - Section ${section}. Enroll students into this cohort to record their subject evaluations.`}
              actionLabel={isAdmin ? 'Enroll Student' : undefined}
              actionIcon={HiOutlineUserAdd}
              onAction={isAdmin ? () => navigate('/students/add') : undefined}
            />
          </div>
        ) : filteredSheet.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No students found matching "{searchTerm}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-20">Roll #</th>
                  <th className="py-3 px-4 min-w-[200px]">Student Name</th>
                  <th className="py-3 px-4 min-w-[150px]">Marks Obtained (/{subjectInfo?.total_marks || 100})</th>
                  <th className="py-3 px-4 w-24">Grade</th>
                  <th className="py-3 px-4 min-w-[200px]">Teacher Comments / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredSheet.map((item) => (
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
                      <input
                        type="number"
                        min="0"
                        max={subjectInfo?.total_marks || 100}
                        placeholder="0"
                        value={item.marksObtained}
                        onChange={(e) => handleMarksChange(item.studentId, e.target.value)}
                        className="w-28 text-sm font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        item.grade === 'A+' || item.grade === 'A'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                          : item.grade === 'B+' || item.grade === 'B'
                          ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
                          : item.grade === 'C+' || item.grade === 'C'
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                          : item.grade === 'F'
                          ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Excellent progress, needs revision..."
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
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {sheet.length} Students in Grade Sheet ({filteredSheet.length} displayed)
            </span>
            <Button
              variant="primary"
              icon={HiOutlineSave}
              onClick={handleSave}
              loading={saving}
              disabled={saving}
            >
              Save & Publish Marks
            </Button>
          </div>
        )}
      </Card>

      {/* Delete Batch Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearBatchConfirm}
        title="Clear Assessment Batch Marks"
        message={`Are you sure you want to permanently clear all entered marks for ${subjectInfo?.name || 'this subject'} (${examType.replace('_', ' ')}) in ${className} - Section ${section}?`}
        confirmText="Clear Batch Marks"
        confirmVariant="danger"
        loading={clearing}
      />
    </div>
  );
}
