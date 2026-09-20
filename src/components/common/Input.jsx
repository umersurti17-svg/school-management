import { cn } from '../../utils/helpers';

export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={cn(
            'w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm py-2.5 shadow-sm transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-400/10',
            Icon ? 'pl-10 pr-4' : 'px-4',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
              : 'hover:border-slate-300 dark:hover:border-slate-600',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
