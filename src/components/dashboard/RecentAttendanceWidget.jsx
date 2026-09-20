import { Link, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { HiOutlineClipboardCheck, HiOutlineArrowNarrowRight, HiOutlineCheck } from 'react-icons/hi';
import { formatDate } from '../../utils/helpers';

export default function RecentAttendanceWidget({ attendance = [], loading = false }) {
  const navigate = useNavigate();
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'present':
        return 'green';
      case 'absent':
        return 'red';
      case 'late':
        return 'yellow';
      case 'excused':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Card
      title="Recent Attendance Log"
      subtitle="Latest attendance checks recorded by teachers"
      actions={
        <Link
          to="/attendance/report"
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 inline-flex items-center gap-1"
        >
          Full Log <HiOutlineArrowNarrowRight className="w-3.5 h-3.5" />
        </Link>
      }
      noPadding
    >
      {loading ? (
        <div className="p-5 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center animate-pulse">
              <div className="space-y-1.5 w-1/2">
                <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-14" />
            </div>
          ))}
        </div>
      ) : attendance.length === 0 ? (
        <EmptyState
          icon={HiOutlineClipboardCheck}
          title="No recent attendance"
          message="No attendance has been submitted today. Mark class attendance to track presence."
          actionLabel="Take Attendance"
          actionIcon={HiOutlineCheck}
          onAction={() => navigate('/attendance')}
          compact
        />
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {attendance.map((record) => (
            <div
              key={record.id}
              className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    record.status === 'present'
                      ? 'bg-green-500'
                      : record.status === 'absent'
                      ? 'bg-red-500'
                      : record.status === 'late'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                      {record.studentName}
                    </p>
                    {(record.studentName?.includes('(Demo)') || record.remarks?.includes('Demo Data')) && (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        Demo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {record.className} • {record.courseName}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <Badge
                  text={record.status}
                  color={getStatusBadgeColor(record.status)}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {formatDate(record.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
