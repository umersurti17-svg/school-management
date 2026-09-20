import { useState, useEffect } from 'react';
import { HiOutlineAcademicCap } from 'react-icons/hi';

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
    }, 900);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#0B1120] transition-opacity duration-500 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-4 animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-primary-500/30 animate-pulse">
          <HiOutlineAcademicCap className="w-10 h-10 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            The Educator
          </h1>
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mt-0.5">
            School Management System
          </p>
        </div>
      </div>
    </div>
  );
}
