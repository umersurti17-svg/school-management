import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineAcademicCap,
  HiOutlineChevronLeft,
  HiOutlineLogout,
} from 'react-icons/hi';
import { SidebarContext } from '../../contexts/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
import SidebarLink from './SidebarLink';
import { NAV_ITEMS, ROLES } from '../../utils/constants';

export default function Sidebar() {
  const { isOpen, isMobileOpen, toggleSidebar, closeMobileSidebar } =
    useContext(SidebarContext);
  const { role, signOut } = useAuth();
  const location = useLocation();

  const activeRole = role || ROLES.STUDENT;
  const navItems = NAV_ITEMS[activeRole] || NAV_ITEMS[ROLES.STUDENT];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white/95 dark:bg-[#131D31]/95 backdrop-blur-lg border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 custom-scrollbar flex flex-col justify-between shadow-soft ${
        isOpen ? 'w-64' : 'w-20'
      } ${
        isMobileOpen
          ? 'translate-x-0'
          : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div>
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800/70">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 overflow-hidden group"
            onClick={closeMobileSidebar}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <HiOutlineAcademicCap className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div className="overflow-hidden whitespace-nowrap">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                  The Educator
                </h2>
                <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                  School Management
                </p>
              </div>
            )}
          </Link>

          {/* Desktop collapse button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Toggle Sidebar width"
          >
            <HiOutlineChevronLeft
              className={`w-5 h-5 transition-transform duration-300 ${
                !isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarLink
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isCollapsed={!isOpen}
              isActive={
                location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
              }
              onClick={closeMobileSidebar}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Sign Out Link */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/70">
        <button
          onClick={signOut}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer ${
            !isOpen ? 'justify-center px-2' : ''
          }`}
          title={!isOpen ? 'Sign Out' : undefined}
        >
          <HiOutlineLogout className="flex-shrink-0 w-5 h-5" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
