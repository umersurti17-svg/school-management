import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineClipboardCheck,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
} from 'react-icons/hi';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isTeacher } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(id);
        if (!data) {
          toast.error('Course not found');
          navigate('/courses');
          return;
        }
        setCourse(data);
      } catch (err) {
        toast.error('Failed to load course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="py-20">
        <Loader size="lg" text="Loading course syllabus and roster..." />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            icon={HiOutlineArrowLeft}
            onClick={() => navigate('/courses')}
            className="p-2"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm">
                {course.class} - Section {course.section}
              </Badge>
              <span className="text-xs font-semibold text-slate-400">
                Academic Session {course.academicYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {course.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(isAdmin || isTeacher) && (
            <Link to="/attendance">
              <Button variant="secondary" icon={HiOutlineClipboardCheck}>
                Take Attendance
              </Button>
            </Link>
          )}

          {isAdmin && (
            <Button
              variant="primary"
              icon={HiOutlinePencil}
              onClick={() => navigate(`/courses/${course.id}/edit`)}
            >
              Edit Course
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Subject & Marks Card */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm">
            <HiOutlineBookOpen className="w-5 h-5" />
            <span>Subject Curriculum</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {course.subject?.name || 'Subject'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Code: {course.subject?.code || 'N/A'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Total Marks</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {course.subject?.total_marks || 100}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Passing Marks</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {course.subject?.passing_marks || 33}
              </span>
            </div>
          </div>
        </Card>

        {/* Faculty Details Card */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <HiOutlineUserGroup className="w-5 h-5" />
            <span>Assigned Faculty</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {course.teacher?.name || 'Unassigned'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Department of {course.teacher?.department || 'Academics'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            {course.teacher?.email && (
              <div className="flex items-center gap-2">
                <HiOutlineMail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{course.teacher.email}</span>
              </div>
            )}
            {course.teacher?.employeeId && (
              <div className="flex items-center gap-2">
                <HiOutlineUser className="w-4 h-4 text-slate-400" />
                <span>Emp ID: {course.teacher.employeeId}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Timetable Schedule Card */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <HiOutlineCalendar className="w-5 h-5" />
            <span>Timetable & Schedule</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Weekly Routine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {course.schedule || 'Standard school hours (Schedule not assigned yet)'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Enrolled Cohort</span>
              <Badge variant="success" size="sm">
                {course.students?.length || 0} Students Active
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Enrolled Students Roster */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Enrolled Students Roster
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              All students enrolled in {course.class} - Section {course.section}
            </p>
          </div>
          <Badge variant="primary">
            {course.students?.length || 0} Total
          </Badge>
        </div>

        {course.students?.length === 0 ? (
          <div className="p-8 sm:p-10">
            <EmptyState
              icon={HiOutlineUserGroup}
              title="No Enrolled Students"
              description={`There are currently no active students assigned to ${course.class} - Section ${course.section}. Enroll students to view the classroom roster.`}
              actionLabel={isAdmin ? 'Enroll Student' : undefined}
              onAction={isAdmin ? () => navigate('/students/add') : undefined}
              compact
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Roll #</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Gender</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {course.students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-primary-600 dark:text-primary-400">
                      {student.rollNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={student.avatarUrl}
                          name={student.name}
                          size="sm"
                        />
                        <span className="text-slate-900 dark:text-slate-100 font-bold">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {student.email || '—'}
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-300 text-xs">
                      {student.gender || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/students/${student.id}`}
                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
