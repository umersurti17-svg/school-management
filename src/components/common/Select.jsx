import { cn } from '../../utils/helpers';
import { HiOutlineChevronDown } from 'react-icons/hi';

export default function Select({
  label,
  error,
  options = [],
  placeholder,
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
      <div className="relative">
        <select
          className={cn(
            'w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-sm py-2.5 pl-4 pr-10 shadow-sm transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-400/10 appearance-none cursor-pointer',
            error
              ? 'border-red-500 focus:border-red-500'
              : 'hover:border-slate-300 dark:hover:border-slate-600',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <HiOutlineChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
