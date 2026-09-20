import { cn } from '../../utils/helpers';

const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

export default function Loader({
  size = 'md',
  text,
  fullPage = false,
  className = '',
}) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative">
        {/* Outer glowing pulse ring */}
        <div
          className={cn(
            'rounded-full border-primary-500/20 animate-ping absolute inset-0',
            sizes[size]
          )}
        />
        {/* Main spinning ring */}
        <div
          className={cn(
            'rounded-full border-slate-200 dark:border-slate-700 border-t-primary-600 dark:border-t-primary-400 animate-spin',
            sizes[size]
          )}
        />
      </div>

      {text && (
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-[#0B1120]/80 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return spinner;
}
