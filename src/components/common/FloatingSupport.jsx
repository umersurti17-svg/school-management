import { useState } from 'react';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineX,
  HiOutlineSparkles,
  HiOutlineBookOpen,
  HiOutlinePhone,
  HiOutlineMail,
} from 'react-icons/hi';

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-20 z-40 p-3 rounded-2xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 border border-slate-200 dark:border-slate-700 shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 group"
        title="Help & Shortcuts Desk"
        aria-label="Open support and shortcuts"
      >
        <HiOutlineQuestionMarkCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden md:inline text-xs font-bold text-slate-700 dark:text-slate-200 pr-1">
          Help Desk
        </span>
      </button>

      {/* Slide-in Help Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-sm flex justify-end animate-fade-in">
          <div
            className="w-full max-w-md bg-white dark:bg-[#131D31] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-slide-left p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6 overflow-y-auto custom-scrollbar pr-1">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                    <HiOutlineSparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      School Support & Help
                    </h3>
                    <p className="text-xs text-slate-400">The Educator System Assistant</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              {/* Keyboard Shortcuts Guide */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Keyboard Shortcuts
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Global Command Search</span>
                    <kbd className="font-mono font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      Ctrl + K
                    </kbd>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Close Modals / Popups</span>
                    <kbd className="font-mono font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      ESC
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Quick FAQs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick Guide & FAQs
                </h4>
                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">How do I record student attendance?</p>
                    <p className="text-slate-500 dark:text-slate-400">Navigate to Attendance, pick the class session and date, tap Present/Absent, and click Save Attendance.</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">How do I print an official report card?</p>
                    <p className="text-slate-500 dark:text-slate-400">Go to Marks $\rightarrow$ Academic Results, choose a student, and click Print Report Card.</p>
                  </div>
                </div>
              </div>

              {/* IT Helpdesk Contacts */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary-200">
                  Campus IT Helpdesk
                </h4>
                <div className="space-y-1 text-xs text-primary-50">
                  <p className="flex items-center gap-2">
                    <HiOutlinePhone className="w-4 h-4" /> +92 (42) 111-222-333 (Ext 104)
                  </p>
                  <p className="flex items-center gap-2">
                    <HiOutlineMail className="w-4 h-4" /> support@educator.edu.pk
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400">
              The Educator School Management Portal • v2.0 Enterprise
            </div>
          </div>
        </div>
      )}
    </>
  );
}
