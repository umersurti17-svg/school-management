import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineAcademicCap,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import toast from 'react-hot-toast';

export default function CoursesPage() {
  const { isAdmin, isTeacher } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Delete modal state
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses({
        classFilter,
        search,
      });
      setCourses(data);
    } catch (err) {
      toast.error('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [classFilter, search]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async () => {
    if (!deleteCourseId) return;
    try {
      setDeleteLoading(true);
      await courseService.deleteCourse(deleteCourseId);
      toast.success('Course deleted successfully');
      setDeleteCourseId(null);
      fetchCourses();
    } catch (err) {
      toast.error(err.message || 'Failed to delete course');
    } finally {
      setDeleteLoading(false);
    }
  };

  const classes = [
    'Playgroup', 'Nursery', 'Prep',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12'
  ];

  // Stats calculation
  const totalCourses = courses.length;
  const uniqueSubjects = new Set(courses.map((c) => c.subjectName)).size;
  const uniqueTeachers = new Set(courses.map((c) => c.teacherName).filter((n) => n !== 'Unassigned')).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Courses & Curriculum
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage institutional courses, syllabus subjects, teacher allocations, and schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={HiOutlineRefresh}
            onClick={fetchCourses}
            title="Refresh list"
          >
            Refresh
          </Button>

          {isAdmin && (
            <Button
              variant="primary"
              icon={HiOutlinePlus}
              onClick={() => navigate('/courses/add')}
            >
              Add Course
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent border-primary-100 dark:border-primary-900/30">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-xl">
            <HiOutlineAcademicCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Courses
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              <AnimatedCounter value={totalCourses} />
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent border-indigo-100 dark:border-indigo-900/30">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <HiOutlineBookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Curriculum Subjects
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              <AnimatedCounter value={uniqueSubjects} />
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-100 dark:border-emerald-900/30">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <HiOutlineUserGroup className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Assigned Faculty
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              <AnimatedCounter value={uniqueTeachers} />
            </h3>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search course name, subject, code, or teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Course List / Cards */}
      {loading ? (
        <div className="py-16">
          <Loader size="lg" text="Loading course catalog..." />
        </div>
      ) : courses.length === 0 ? (
        <Card className="p-8 sm:p-12">
          <EmptyState
            icon={HiOutlineAcademicCap}
            title={search || classFilter ? 'No Matching Courses Found' : 'No Academic Courses Created'}
            description={
              search || classFilter
                ? 'No courses matched your current keyword or class filters. Try resetting the filters.'
                : 'Get started by creating your first course with subject syllabi, class sections, and teacher allocations.'
            }
            actionLabel={
              search || classFilter
                ? 'Reset Filters'
                : isAdmin
                ? 'Create New Course'
                : null
            }
            actionIcon={search || classFilter ? HiOutlineRefresh : HiOutlinePlus}
            onAction={
              search || classFilter
                ? () => {
                    setSearch('');
                    setClassFilter('');
                  }
                : isAdmin
                ? () => navigate('/courses/add')
                : null
            }
            secondaryActionLabel={
              (search || classFilter) && isAdmin ? 'Add New Course' : null
            }
            onSecondaryAction={
              (search || classFilter) && isAdmin ? () => navigate('/courses/add') : null
            }
          />
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice((page - 1) * pageSize, page * pageSize).map((course) => (
              <Card
                key={course.id}
                className="p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-slate-200/80 dark:border-slate-800 group"
              >
                <div>
                  {/* Class & Section Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="primary" size="sm">
                        {course.class} - Sec {course.section}
                      </Badge>
                      {course.name?.includes('(Demo)') && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          Demo Data
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Session {course.academicYear}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {course.name}
                  </h3>

                  {/* Subject & Code */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <HiOutlineBookOpen className="w-4 h-4 text-slate-400" />
                    <span>{course.subjectName}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="font-mono uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                      {course.subjectCode}
                    </span>
                  </div>

                  {/* Schedule & Teacher Info */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <HiOutlineCalendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="truncate">{course.schedule}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <HiOutlineUserGroup className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span className="font-semibold">{course.teacherName}</span>
                      <span className="text-slate-400 text-[11px]">({course.department})</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    <HiOutlineEye className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => navigate(`/courses/${course.id}/edit`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Course"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteCourseId(course.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Course"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {courses.length > pageSize && (
            <div className="pt-2">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(courses.length / pageSize)}
                onPageChange={(p) => setPage(p)}
                totalCount={courses.length}
                pageSize={pageSize}
              />
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteCourseId}
        title="Delete Course"
        message="Are you sure you want to delete this course? All associated timetable information will also be removed."
        confirmText="Yes, Delete Course"
        confirmVariant="danger"
        isLoading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteCourseId(null)}
      />
    </div>
  );
}
