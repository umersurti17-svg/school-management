import {
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamation,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi';
import StatCard from '../common/StatCard';
import { formatCurrency } from '../../utils/helpers';

export default function StatCardsGrid({ stats, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 animate-pulse h-28"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Total Students',
      value: stats?.totalStudents ?? 0,
      icon: HiOutlineUserGroup,
      color: 'primary',
      trend: 12,
    },
    {
      title: 'Total Courses',
      value: stats?.totalCourses ?? 0,
      icon: HiOutlineAcademicCap,
      color: 'blue',
      trend: 5,
    },
    {
      title: 'Present Today',
      value: stats?.presentStudents ?? 0,
      icon: HiOutlineCheckCircle,
      color: 'green',
      trend: 94,
    },
    {
      title: 'Absent Today',
      value: stats?.absentStudents ?? 0,
      icon: HiOutlineXCircle,
      color: 'red',
      trend: -3,
    },
    {
      title: 'Pending Fees',
      value: formatCurrency(stats?.pendingFees ?? 0),
      icon: HiOutlineExclamation,
      color: 'yellow',
    },
    {
      title: 'Collected Fees',
      value: formatCurrency(stats?.totalCollectedFees ?? 0),
      icon: HiOutlineCurrencyDollar,
      color: 'green',
      trend: 18,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {items.map((item, idx) => (
        <StatCard
          key={idx}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
          trend={item.trend}
          className="hover:shadow-md transition-shadow duration-200"
        />
      ))}
    </div>
  );
}
