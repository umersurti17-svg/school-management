import {
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineSpeakerphone,
} from 'react-icons/hi';
import Badge from '../common/Badge';

export default function UpcomingEventsWidget() {
  const events = [
    {
      id: 1,
      title: 'Mid-Term Examinations 2026',
      date: 'Oct 15, 2026',
      type: 'Academic',
      badgeVariant: 'primary',
      icon: HiOutlineAcademicCap,
    },
    {
      id: 2,
      title: 'Parent-Teacher Conference (PTM)',
      date: 'Oct 28, 2026',
      type: 'Meeting',
      badgeVariant: 'warning',
      icon: HiOutlineUserGroup,
    },
    {
      id: 3,
      title: 'Annual Sports Gala & Athletics Meet',
      date: 'Nov 12, 2026',
      type: 'Event',
      badgeVariant: 'success',
      icon: HiOutlineCalendar,
    },
    {
      id: 4,
      title: 'Science Fair & Robotics Exhibition',
      date: 'Nov 24, 2026',
      type: 'Exhibition',
      badgeVariant: 'indigo',
      icon: HiOutlineSpeakerphone,
    },
  ];

  return (
    <div className="bg-white dark:bg-[#131D31] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Upcoming Academic Events
          </h3>
          <p className="text-xs text-slate-400">Institutional Calendar Session 2026</p>
        </div>
        <Badge variant="primary" size="sm">4 Events Scheduled</Badge>
      </div>

      <div className="space-y-3">
        {events.map((evt) => {
          const Icon = evt.icon;
          return (
            <div
              key={evt.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {evt.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    📅 {evt.date}
                  </span>
                </div>
              </div>

              <Badge variant={evt.badgeVariant} size="sm">
                {evt.type}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
