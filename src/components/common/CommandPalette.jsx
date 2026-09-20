import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineSpeakerphone,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineUser,
  HiOutlinePlus,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineLogout,
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { role, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    // Navigation
    { id: 'nav-dash', title: 'Go to Dashboard', category: 'Navigation', icon: HiOutlineHome, path: '/dashboard' },
    { id: 'nav-students', title: 'Go to Students Directory', category: 'Navigation', icon: HiOutlineUserGroup, path: '/students' },
    { id: 'nav-courses', title: 'Go to Courses & Timetable', category: 'Navigation', icon: HiOutlineAcademicCap, path: '/courses' },
    { id: 'nav-attendance', title: 'Take Daily Attendance', category: 'Navigation', icon: HiOutlineClipboardCheck, path: '/attendance' },
    { id: 'nav-att-rep', title: 'Attendance History & Logs', category: 'Navigation', icon: HiOutlineClipboardCheck, path: '/attendance/report' },
    { id: 'nav-fees', title: 'Fee Management & Invoices', category: 'Navigation', icon: HiOutlineCurrencyDollar, path: '/fees' },
    { id: 'nav-fee-stmt', title: 'Student Fee Statement & Dues', category: 'Navigation', icon: HiOutlineCurrencyDollar, path: '/fees/statement' },
    { id: 'nav-marks-entry', title: 'Exam Marks Entry Portal', category: 'Navigation', icon: HiOutlineDocumentText, path: '/marks/entry' },
    { id: 'nav-results', title: 'Academic Results & Report Cards', category: 'Navigation', icon: HiOutlineDocumentText, path: '/marks/results' },
    { id: 'nav-notices', title: 'School Notices & Circulars', category: 'Navigation', icon: HiOutlineSpeakerphone, path: '/announcements' },
    { id: 'nav-reports', title: 'Institutional Analytics & Reports', category: 'Navigation', icon: HiOutlineChartBar, path: '/reports' },
    { id: 'nav-profile', title: 'My User Profile & Security', category: 'Navigation', icon: HiOutlineUser, path: '/profile' },
    { id: 'nav-settings', title: 'Institutional Settings & Grading Policy', category: 'Navigation', icon: HiOutlineCog, path: '/settings' },

    // Quick Actions
    { id: 'act-add-student', title: 'Add New Student Enrollment', category: 'Quick Action', icon: HiOutlinePlus, path: '/students/add', role: 'admin' },
    { id: 'act-add-course', title: 'Create New Academic Course', category: 'Quick Action', icon: HiOutlinePlus, path: '/courses/add', role: 'admin' },
    { id: 'act-theme', title: `Switch to ${isDark ? 'Light' : 'Dark'} Mode`, category: 'Preferences', icon: isDark ? HiOutlineSun : HiOutlineMoon, action: toggleTheme },
    { id: 'act-logout', title: 'Sign Out of Portal', category: 'Account', icon: HiOutlineLogout, action: signOut, color: 'text-rose-500' },
  ];

  const filteredActions = actions.filter((item) => {
    if (item.role && item.role !== role) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  const handleSelect = useCallback(
    (item) => {
      onClose();
      if (item.action) {
        item.action();
      } else if (item.path) {
        navigate(item.path);
      }
      setQuery('');
    },
    [navigate, onClose]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          handleSelect(filteredActions[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredActions, selectedIndex, handleSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-slate-950/60 backdrop-blur-md flex items-start justify-center animate-fade-in">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#131D31] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
          <HiOutlineSearch className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type a command, page, or search query (e.g. 'Students', 'Theme')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 pl-3 pr-4 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar space-y-1">
          {filteredActions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching commands or pages found.
            </div>
          ) : (
            filteredActions.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{item.title}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{item.category}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <kbd className="text-[10px] font-mono text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 px-1.5 py-0.5 rounded">
                      ↵ Enter
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">↑</kbd> <kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">↵</kbd> Select</span>
          </div>
          <span>The Educator Global Search</span>
        </div>
      </div>
    </div>
  );
}
