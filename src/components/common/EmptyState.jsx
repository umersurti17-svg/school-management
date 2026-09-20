import {
  HiOutlineDocumentSearch,
  HiOutlinePlusCircle,
  HiOutlineRefresh,
} from 'react-icons/hi';
import Button from './Button';

export default function EmptyState({
  icon: Icon = HiOutlineDocumentSearch,
  title = 'No records found',
  message,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = HiOutlinePlusCircle,
  secondaryActionLabel,
  onSecondaryAction,
  compact = false,
  badgeText = '0 Records',
  className = '',
}) {
  const displayMessage = description || message || 'There are currently no records matching this section or query.';

  return (
    <div
      className={`flex flex-col items-center justify-center text-center animate-fade-in ${
        compact ? 'py-8 px-4' : 'py-14 sm:py-16 px-6'
      } ${className}`}
    >
      {/* Decorative Icon Container with Ambient Aura */}
      <div className="relative mb-5 group">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 rounded-3xl blur-xl transition-all duration-500 group-hover:scale-110" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-slate-100 via-primary-50 to-indigo-50 dark:from-slate-800 dark:via-[#162238] dark:to-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-lg border border-slate-200/80 dark:border-slate-700/80">
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 transform transition-transform duration-300 group-hover:scale-110" />
        </div>
        {badgeText && (
          <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-extrabold shadow-md border-2 border-white dark:border-slate-900">
            {badgeText}
          </span>
        )}
      </div>

      {/* Title & Explanatory Subtitle */}
      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1.5 mb-6 leading-relaxed">
        {displayMessage}
      </p>

      {/* Interactive Action Buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              size={compact ? 'sm' : 'md'}
              variant="primary"
              icon={ActionIcon}
              className="shadow-md hover:shadow-lg transition-all"
            >
              <span>{actionLabel}</span>
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button
              onClick={onSecondaryAction}
              size={compact ? 'sm' : 'md'}
              variant="outline"
              icon={HiOutlineRefresh}
            >
              <span>{secondaryActionLabel}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

