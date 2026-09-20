import { Link } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 pt-6 pb-8 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Branding & Copy */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <HiOutlineAcademicCap className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            The Educator School
          </span>
          <span>•</span>
          <span>© {currentYear} All rights reserved.</span>
        </div>

        {/* Center / Right: System Badges & Version */}
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <HiOutlineShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>RLS Secured Portal</span>
          </span>

          <span>•</span>

          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <HiOutlineSparkles className="w-3.5 h-3.5 text-primary-500" />
            <span>v2.0 Production</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
