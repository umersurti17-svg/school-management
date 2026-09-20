import Modal from '../common/Modal';
import Badge from '../common/Badge';
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
} from 'react-icons/hi';

export default function NotificationsModal({ isOpen, onClose }) {
  const notifications = [
    {
      id: 1,
      title: 'Fee Payment Received',
      message: 'Ayesha Bilal paid PKR 12,500 for Tuition via Bank Transfer.',
      time: '15 mins ago',
      type: 'fee',
      icon: HiOutlineCurrencyDollar,
      color: 'green',
      unread: true,
    },
    {
      id: 2,
      title: 'Today’s Attendance Submitted',
      message: 'Sir Tariq submitted attendance for Grade 10 - Mathematics.',
      time: '1 hour ago',
      type: 'attendance',
      icon: HiOutlineCheckCircle,
      color: 'blue',
      unread: true,
    },
    {
      id: 3,
      title: 'New Student Admission',
      message: 'Sara Khan has been enrolled in Grade 9 - Section A.',
      time: '3 hours ago',
      type: 'student',
      icon: HiOutlineAcademicCap,
      color: 'primary',
      unread: false,
    },
    {
      id: 4,
      title: 'Upcoming Examination Scheduled',
      message: 'Mid-term examinations will commence on October 15, 2026.',
      time: '1 day ago',
      type: 'academic',
      icon: HiOutlineCalendar,
      color: 'yellow',
      unread: false,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="School Notifications" size="md">
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50 -mx-6 -my-4">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={`p-4 flex items-start gap-3 hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition-colors ${
                n.unread ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  n.color === 'green'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                    : n.color === 'blue'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                    : n.color === 'yellow'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                    : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {n.title}
                  </h4>
                  {n.unread && <Badge text="New" color="primary" />}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {n.message}
                </p>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {n.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
