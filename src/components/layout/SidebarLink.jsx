import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';

export default function SidebarLink({
  to,
  icon: Icon,
  label,
  badge,
  isCollapsed = false,
  isActive = false,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none',
        isActive
          ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-500/20 font-semibold'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100',
        isCollapsed && 'justify-center px-2'
      )}
      title={isCollapsed ? label : undefined}
    >
      {/* Icon */}
      {Icon && (
        <Icon
          className={cn(
            'w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
            isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
          )}
        />
      )}

      {/* Label */}
      {!isCollapsed && <span className="truncate flex-1">{label}</span>}

      {/* Optional Badge */}
      {!isCollapsed && badge && (
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-semibold rounded-full',
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400'
          )}
        >
          {badge}
        </span>
      )}

      {/* Active Indicator bar when collapsed */}
      {isCollapsed && isActive && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-l-full" />
      )}
    </Link>
  );
}
