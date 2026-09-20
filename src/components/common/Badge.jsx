import { cn, capitalize } from '../../utils/helpers';

const colorStyles = {
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
    dot: 'bg-emerald-500',
  },
  red: {
    bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
    dot: 'bg-rose-500',
  },
  yellow: {
    bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
    dot: 'bg-amber-500',
  },
  blue: {
    bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60',
    dot: 'bg-sky-500',
  },
  primary: {
    bg: 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border-primary-200/80 dark:border-primary-800/60',
    dot: 'bg-primary-500',
  },
  gray: {
    bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
};

export default function Badge({
  text,
  color = 'gray',
  size = 'sm',
  withDot = true,
  className = '',
}) {
  const current = colorStyles[color] || colorStyles.gray;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold border rounded-full select-none capitalize tracking-wide',
        current.bg,
        size === 'xs' && 'px-2 py-0.5 text-[10px]',
        size === 'sm' && 'px-2.5 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-xs',
        className
      )}
    >
      {withDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse', current.dot)} />
      )}
      {capitalize(text)}
    </span>
  );
}
