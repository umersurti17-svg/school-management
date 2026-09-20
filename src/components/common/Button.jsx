import { cn } from '../../utils/helpers';

const variants = {
  primary:
    'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 border border-transparent',
  secondary:
    'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60',
  danger:
    'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 border border-transparent',
  ghost:
    'hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-transparent',
  outline:
    'border border-slate-300 dark:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 shadow-sm',
  success:
    'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 border border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl font-semibold',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
      ) : null}
      {children}
    </button>
  );
}
