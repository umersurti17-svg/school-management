import { cn } from '../../utils/helpers';

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = '',
  noPadding = false,
  glass = false,
  hoverable = false,
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft transition-all duration-300',
        glass
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'
          : 'bg-white dark:bg-[#131D31]',
        hoverable && 'hover:-translate-y-1 hover:shadow-soft-xl hover:border-primary-200 dark:hover:border-primary-800/60',
        className
      )}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/70">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  );
}
