import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HiOutlineAcademicCap,
  HiOutlineArrowLeft,
  HiOutlineCalendar,
} from 'react-icons/hi';
import { courseService } from '../../services/courseService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    subjectId: '',
    teacherId: '',
    class: 'Grade 10',
    section: 'A',
    academicYear: '2026',
    schedule: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [course, subList, teacherList] = await Promise.all([
          courseService.getCourseById(id),
          courseService.getSubjects(),
          courseService.getTeachers(),
        ]);

        if (!course) {
          toast.error('Course not found');
          navigate('/courses');
          return;
        }

        setSubjects(subList);
        setTeachers(teacherList);
        setFormData({
          name: course.name,
          subjectId: course.subject?.id || '',
          teacherId: course.teacher?.id || '',
          class: course.class,
          section: course.section,
          academicYear: String(course.academicYear || 2026),
          schedule: course.schedule || '',
        });
      } catch (err) {
        toast.error('Failed to load course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Course name is required';
    if (!formData.subjectId) errs.subjectId = 'Please select a subject';
    if (!formData.class) errs.class = 'Class is required';
    if (!formData.section) errs.section = 'Section is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await courseService.updateCourse(id, formData);
      toast.success('Course updated successfully!');
      navigate(`/courses/${id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update course');
    } finally {
      setSubmitting(false);
    }
  };

  const classes = [
    'Playgroup', 'Nursery', 'Prep',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12'
  ];

  if (loading) {
    return (
      <div className="py-20">
        <Loader size="lg" text="Loading course details..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          icon={HiOutlineArrowLeft}
          onClick={() => navigate('/courses')}
          className="p-2"
        />
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Edit Course
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Modify course syllabus, assigned faculty, and scheduling.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <HiOutlineAcademicCap className="w-5 h-5 text-primary-600" />
            Edit Course Details
          </h2>

          <Input
            label="Course Title"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Subject Syllabus <span className="text-rose-500">*</span>
            </label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className={`w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 ${
                errors.subjectId ? 'border-rose-500' : ''
              }`}
            >
              <option value="">Select a Subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code}) — {sub.total_marks} Marks
                </option>
              ))}
            </select>
            {errors.subjectId && <p className="text-xs text-rose-500">{errors.subjectId}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Assigned Teacher
            </label>
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            >
              <option value="">Unassigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.department} ({t.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Class <span className="text-rose-500">*</span>
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Section <span className="text-rose-500">*</span>
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
              >
                {['A', 'B', 'C', 'D', 'E'].map((sec) => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Year
              </label>
              <input
                type="number"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                min="2020"
                max="2035"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
              />
            </div>
          </div>

          <Input
            label="Weekly Class Schedule / Timetable"
            name="schedule"
            placeholder="e.g. Mon, Wed, Fri - 09:00 AM - 10:00 AM (Room 204)"
            icon={HiOutlineCalendar}
            value={formData.schedule}
            onChange={handleChange}
          />
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/courses')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={submitting}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
