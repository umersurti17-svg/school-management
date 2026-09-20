import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineMenuAlt2,
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineLogout,
  HiOutlineGlobeAlt,
} from 'react-icons/hi';
import { SidebarContext } from '../../contexts/SidebarContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import NotificationsModal from '../dashboard/NotificationsModal';
import { capitalize } from '../../utils/helpers';

export default function Topbar({ onOpenCommandPalette }) {
  const { toggleMobileSidebar } = useContext(SidebarContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { profile, role, signOut, user } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayRole = role || 'guest';

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-[#131D31]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between shadow-soft">
        {/* Left: Mobile menu + Brand title & Search Trigger */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle Navigation"
          >
            <HiOutlineMenuAlt2 className="w-6 h-6" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              The Educator School
            </h1>
          </div>

          {/* Quick Search Shortcut Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-400 hover:border-primary-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer shadow-sm"
          >
            <span>Search anything...</span>
            <kbd className="font-mono text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
              Ctrl + K
            </kbd>
          </button>

          {/* Quick Link to Public Website */}
          <Link
            to="/"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Go to Public School Website"
          >
            <HiOutlineGlobeAlt className="w-4 h-4 text-primary-500" />
            <span>Public Website</span>
          </Link>
        </div>

        {/* Right: Theme Toggle + Notifications + User Avatar + Sign Out */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-200 hover:rotate-12 cursor-pointer"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <HiOutlineSun className="w-5 h-5 text-amber-400" />
            ) : (
              <HiOutlineMoon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Notifications Modal Trigger */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative transition-colors cursor-pointer"
            title="View Notifications"
          >
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
          </button>

          {/* User Info & Role Badge */}
          <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {displayName}
              </p>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/40 uppercase tracking-wider">
                {capitalize(displayRole)}
              </span>
            </div>
            <Avatar
              name={displayName}
              src={profile?.avatar_url}
              size="sm"
            />

            {/* Secure Sign Out Button */}
            <button
              onClick={signOut}
              className="p-2 ml-1 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <HiOutlineLogout className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </>
  );
}
