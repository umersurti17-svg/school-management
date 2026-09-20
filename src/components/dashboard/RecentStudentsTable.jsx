import { Link, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { HiOutlineUserGroup, HiOutlineArrowNarrowRight, HiOutlineUserAdd } from 'react-icons/hi';
import { formatDate } from '../../utils/helpers';

export default function RecentStudentsTable({ students = [], loading = false }) {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'gray';
      case 'graduated':
        return 'blue';
      case 'transferred':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Card
      title="Recent Students"
      subtitle="Newly enrolled students in the school"
      actions={
        <Link
          to="/students"
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 inline-flex items-center gap-1"
        >
          View All <HiOutlineArrowNarrowRight className="w-3.5 h-3.5" />
        </Link>
      }
      noPadding
    >
      {loading ? (
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={HiOutlineUserGroup}
          title="No recent students"
          message="No student enrollments found in the database. Add your first student to get started."
          actionLabel="Enroll Student"
          actionIcon={HiOutlineUserAdd}
          onAction={() => navigate('/students/add')}
          compact
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 uppercase font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Enrolled</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={student.name}
                        src={student.avatarUrl}
                        size="sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                            {student.name}
                          </p>
                          {(student.rollNumber?.startsWith('DEMO-') || student.name?.includes('(Demo)')) && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                              Demo Data
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-700 dark:text-gray-300">
                    {student.rollNumber}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-700 dark:text-gray-300">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 font-medium">
                      {student.class} - {student.section}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(student.admissionDate)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Badge
                      text={student.status}
                      color={getStatusColor(student.status)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
