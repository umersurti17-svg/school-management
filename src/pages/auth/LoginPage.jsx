import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
  HiOutlineSparkles,
} from 'react-icons/hi';
import { isValidEmail } from '../../utils/validators';

export default function LoginPage() {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail || '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [signupSuccessBanner, setSignupSuccessBanner] = useState(!!location.state?.signupSuccess);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (authError) setAuthError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setAuthError('');
      const res = await signIn(formData.email, formData.password, formData.rememberMe);
      const userRole = res?.role || 'student';

      // Determine clean redirect path
      let targetPath = from;
      if (
        !targetPath ||
        targetPath === '/login' ||
        targetPath === '/signup' ||
        targetPath === '/unauthorized' ||
        targetPath === '/'
      ) {
        targetPath = '/dashboard';
      }

      // Check role compatibility with previous 'from' target
      if (userRole === 'student') {
        const studentAllowedPrefixes = ['/dashboard', '/courses', '/attendance/report', '/fees/statement', '/marks/results', '/announcements', '/profile'];
        const isAllowed = studentAllowedPrefixes.some((p) => targetPath === p || targetPath.startsWith(p + '/'));
        if (!isAllowed) targetPath = '/dashboard';
      } else if (userRole === 'teacher') {
        const teacherDisallowed = ['/fees', '/settings', '/students/add', '/courses/add'];
        const isDisallowed = teacherDisallowed.some((p) => targetPath === p || targetPath.startsWith(p + '/'));
        if (isDisallowed) targetPath = '/dashboard';
      }

      navigate(targetPath, { replace: true });
    } catch (err) {
      let msg;
      if (err.message?.includes('Invalid login credentials')) {
        msg = 'Invalid email or password. Please verify your credentials.';
      } else if (err.message?.includes('Email not confirmed')) {
        msg = 'Email confirmation pending. Please check your inbox or contact the administration.';
      } else {
        msg = err.message || 'Authentication failed. Please check your credentials.';
      }
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (email, password) => {
    setFormData({
      email,
      password,
      rememberMe: true,
    });
    setErrors({});
    setAuthError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full"
    >
      {/* Mobile Branding Header */}
      <div className="lg:hidden text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-sky-400 p-[1.5px] shadow-lg mb-2">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <HiOutlineAcademicCap className="w-6 h-6 text-primary-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white">The Educator School</h2>
        <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider">Academic Portal</p>
      </div>

      {/* Main Glass Form Card */}
      <div className="relative rounded-3xl p-7 sm:p-9 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Subtle Card Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="mb-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[11px] font-bold text-primary-300 uppercase tracking-wider mb-2">
            <HiOutlineSparkles className="w-3.5 h-3.5 text-primary-400" />
            <span>Secure Portal Sign In</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter your institutional credentials to access your dashboard
          </p>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {signupSuccessBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-3 shadow-lg shadow-emerald-950/20"
            >
              <span className="text-base leading-none">✅</span>
              <div className="flex-1 font-medium">
                Account created successfully! Enter your password below to sign in.
              </div>
            </motion.div>
          )}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 shadow-lg shadow-rose-950/20"
            >
              <span className="text-base leading-none">⚠️</span>
              <div className="flex-1 font-medium">{authError}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-400 transition-colors pointer-events-none">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="e.g. admin@educator.edu.pk"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting || loading}
                autoComplete="email"
                className={`w-full rounded-2xl border bg-slate-950/60 text-white placeholder-slate-500 text-sm py-3 pl-11 pr-4 shadow-inner transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                  errors.email ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 hover:border-white/20 focus:border-primary-500'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-400 transition-colors pointer-events-none">
                <HiOutlineLockClosed className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting || loading}
                autoComplete="current-password"
                className={`w-full rounded-2xl border bg-slate-950/60 text-white placeholder-slate-500 text-sm py-3 pl-11 pr-11 shadow-inner transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                  errors.password ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 hover:border-white/20 focus:border-primary-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                tabIndex={-1}
              >
                {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-primary-500 rounded border-white/20 bg-slate-950/80 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-slate-300 group-hover:text-white transition-colors">
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-600 hover:from-primary-500 hover:to-sky-500 text-white font-bold text-sm shadow-xl shadow-primary-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting || loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Switch to Sign Up */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an institutional account?{' '}
          <Link
            to="/signup"
            className="font-bold text-primary-400 hover:text-primary-300 transition-colors underline underline-offset-4 decoration-primary-500/40"
          >
            Create an Account
          </Link>
        </div>

        {/* Instant Role Preview Switcher */}
        <div className="mt-7 pt-6 border-t border-white/10">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
            Instant Demo Preview
          </p>
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => handleQuickFill('admin@educator.edu.pk', 'Admin@123456')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-primary-500/30 bg-primary-500/10 hover:bg-primary-500/20 text-xs font-semibold text-primary-300 transition-all cursor-pointer shadow-sm"
            >
              <HiOutlineShieldCheck className="w-4 h-4 mb-1 text-primary-400" />
              <span>Admin</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => handleQuickFill('teacher@educator.edu.pk', 'Teacher@123456')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-300 transition-all cursor-pointer shadow-sm"
            >
              <HiOutlineUserGroup className="w-4 h-4 mb-1 text-emerald-400" />
              <span>Teacher</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => handleQuickFill('student@educator.edu.pk', 'Student@123456')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-xs font-semibold text-sky-300 transition-all cursor-pointer shadow-sm"
            >
              <HiOutlineAcademicCap className="w-4 h-4 mb-1 text-sky-400" />
              <span>Student</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
