import { getInitials, cn } from '../../utils/helpers';

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
};

export default function Avatar({ name, src, size = 'md', className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover ring-2 ring-white dark:ring-gray-800',
          sizeMap[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold flex items-center justify-center ring-2 ring-white dark:ring-gray-800',
        sizeMap[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
