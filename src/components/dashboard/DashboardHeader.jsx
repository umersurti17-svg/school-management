import {
  HiOutlineUserAdd,
  HiOutlineCurrencyDollar,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

export default function DashboardHeader({
  userName,
  role = 'admin',
  searchQuery,
  onSearchChange,
  onQuickAction,
  onRefresh,
  refreshing = false,
}) {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const roleLabel = role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Faculty Member' : 'Student';

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white/90 dark:bg-[#131D31]/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft animate-fade-in">
      {/* Title & Welcome */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {userName || roleLabel}! 👋
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
          <span>📅 {currentDate}</span>
          <span>•</span>
          <span className="text-primary-600 dark:text-primary-400 font-medium">The Educator SMS Portal</span>
          <span>•</span>
          <span className="capitalize px-2 py-0.5 text-xs rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-semibold border border-primary-200/50 dark:border-primary-800/50">
            {role}
          </span>
        </p>
      </div>

      {/* Actions & Search */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Live Search */}
        <div className="relative flex-1 sm:w-64 group">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search students, courses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
          />
        </div>

        {/* Refresh Button */}
        <Button
          variant="secondary"
          size="sm"
          icon={HiOutlineRefresh}
          onClick={onRefresh}
          loading={refreshing}
          title="Refresh Data"
        >
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        {/* Quick Action Buttons per Role */}
        {role === 'admin' && (
          <>
            <Button
              variant="primary"
              size="sm"
              icon={HiOutlineUserAdd}
              onClick={() => onQuickAction('add_student')}
            >
              <span>New Student</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={HiOutlineCurrencyDollar}
              onClick={() => onQuickAction('collect_fee')}
              className="hidden md:inline-flex"
            >
              <span>Collect Fee</span>
            </Button>
          </>
        )}

        {role === 'teacher' && (
          <>
            <Button
              variant="primary"
              size="sm"
              icon={HiOutlineClipboardCheck}
              onClick={() => navigate('/attendance')}
            >
              <span>Mark Attendance</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={HiOutlineAcademicCap}
              onClick={() => navigate('/marks/entry')}
              className="hidden md:inline-flex"
            >
              <span>Enter Marks</span>
            </Button>
          </>
        )}

        {role === 'student' && (
          <>
            <Button
              variant="primary"
              size="sm"
              icon={HiOutlineBookOpen}
              onClick={() => navigate('/courses')}
            >
              <span>My Courses</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={HiOutlineDocumentText}
              onClick={() => navigate('/fees/statement')}
              className="hidden md:inline-flex"
            >
              <span>Fee Statement</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
