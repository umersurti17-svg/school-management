import { cn } from '../../utils/helpers';
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';
import AnimatedCounter from './AnimatedCounter';

const colorStyles = {
  primary: {
    bg: 'from-primary-500/10 to-indigo-500/10 text-primary-600 dark:text-primary-400',
    ring: 'ring-primary-500/20',
  },
  blue: {
    bg: 'from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-500/20',
  },
  green: {
    bg: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/20',
  },
  red: {
    bg: 'from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500/20',
  },
  yellow: {
    bg: 'from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/20',
  },
  purple: {
    bg: 'from-purple-500/10 to-fuchsia-500/10 text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-500/20',
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend,
  className = '',
}) {
  const currentStyle = colorStyles[color] || colorStyles.primary;

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-[#131D31] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden',
        className
      )}
    >
      {/* Top Header with Title and Icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <AnimatedCounter value={value} />
          </p>
        </div>

        {Icon && (
          <div
            className={cn(
              'w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-sm ring-1 transition-transform duration-300 group-hover:scale-110',
              currentStyle.bg,
              currentStyle.ring
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Optional Trend indicator */}
      {trend != null && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-semibold',
              trend >= 0
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
            )}
          >
            {trend >= 0 ? (
              <HiOutlineTrendingUp className="w-3 h-3" />
            ) : (
              <HiOutlineTrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
