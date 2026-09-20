import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineHome, HiOutlineArrowLeft, HiOutlineAcademicCap } from 'react-icons/hi';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/10 dark:bg-primary-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="max-w-md w-full text-center relative z-10 bg-white/90 dark:bg-[#131D31]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-xl animate-scale-in">
        {/* School Icon Header */}
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-tr from-primary-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
          <HiOutlineAcademicCap className="w-9 h-9" />
        </div>

        {/* 404 Hero Number */}
        <span className="text-6xl font-black bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-500 bg-clip-text text-transparent tracking-tighter">
          404
        </span>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-2 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          The page or academic record you are looking for does not exist or has been relocated to another section.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={HiOutlineArrowLeft}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>

          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              icon={HiOutlineHome}
              className="w-full"
            >
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-400">
          The Educator School • Management Portal
        </div>
      </div>
    </div>
  );
}
