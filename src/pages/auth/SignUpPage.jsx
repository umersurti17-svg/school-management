import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineCheck,
} from 'react-icons/hi';
import { isValidEmail } from '../../utils/validators';

export default function SignUpPage() {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'student',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 4) return { score: 3, label: 'Good', color: 'bg-indigo-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(formData.password);

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
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

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

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must agree to the Institutional Terms';
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
      const res = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        phone: formData.phone,
      });

      if (res?.success) {
        if (res.autoLogin) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login', {
            replace: true,
            state: {
              registeredEmail: formData.email,
              signupSuccess: true,
            },
          });
        }
      }
    } catch (err) {
      if (err.message?.includes('already registered')) {
        setAuthError('__ALREADY_REGISTERED__');
      } else {
        setAuthError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { id: 'student', label: 'Student', icon: HiOutlineAcademicCap, desc: 'Courses, exams & attendance' },
    { id: 'teacher', label: 'Teacher', icon: HiOutlineUserGroup, desc: 'Classroom & marks management' },
  ];

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
        <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider">Account Registration</p>
      </div>

      {/* Main Glass Card */}
      <div className="relative rounded-3xl p-7 sm:p-9 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-2">
            <HiOutlineSparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>New User Enrollment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Join The Educator School academic community in seconds
          </p>
        </div>

        {/* Error Notification Alert */}
        <AnimatePresence>
          {authError === '__ALREADY_REGISTERED__' ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm space-y-2 shadow-lg shadow-amber-950/20"
            >
              <div className="flex items-center gap-2 font-bold text-amber-200">
                <span>⚠️</span>
                <span>Account Already Exists</span>
              </div>
              <p className="text-slate-300">
                An account with this email is already registered. Please sign in with your password.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <span>Go to Login</span>
                  <HiOutlineArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-2"
                >
                  Forgot Password?
                </Link>
              </div>
            </motion.div>
          ) : authError ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 shadow-lg shadow-rose-950/20"
            >
              <span className="text-base leading-none">⚠️</span>
              <div className="flex-1 font-medium">{authError}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {roleOptions.map((r) => {
                const Icon = r.icon;
                const isSelected = formData.role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: r.id }))}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/15 text-white shadow-lg shadow-primary-500/10 ring-2 ring-primary-500/30'
                        : 'border-white/10 bg-slate-950/50 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-400' : 'text-slate-400'}`} />
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center text-white text-[10px]">
                          <HiOutlineCheck className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{r.label}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-400 transition-colors pointer-events-none">
                <HiOutlineUser className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Muhammad Ali"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isSubmitting || loading}
                autoComplete="name"
                className={`w-full rounded-2xl border bg-slate-950/60 text-white placeholder-slate-500 text-sm py-3 pl-11 pr-4 shadow-inner transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                  errors.fullName ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 hover:border-white/20 focus:border-primary-500'
                }`}
              />
            </div>
            {errors.fullName && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.fullName}</p>}
          </div>

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
                placeholder="e.g. ali@educator.edu.pk"
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

          {/* Phone (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Phone Number <span className="text-slate-500 font-normal normal-case">(Optional)</span>
            </label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-400 transition-colors pointer-events-none">
                <HiOutlinePhone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="+92 300 1234567"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting || loading}
                autoComplete="tel"
                className="w-full rounded-2xl border border-white/10 hover:border-white/20 focus:border-primary-500 bg-slate-950/60 text-white placeholder-slate-500 text-sm py-3 pl-11 pr-4 shadow-inner transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
              />
            </div>
          </div>

          {/* Password with Strength Meter */}
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
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting || loading}
                autoComplete="new-password"
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-slate-400">Strength:</span>
                  <span className={`${strength.score >= 3 ? 'text-emerald-400' : strength.score === 2 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full rounded-full transition-all duration-300 ${
                        step <= strength.score ? strength.color : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            {errors.password && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-400 transition-colors pointer-events-none">
                <HiOutlineLockClosed className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting || loading}
                autoComplete="new-password"
                className={`w-full rounded-2xl border bg-slate-950/60 text-white placeholder-slate-500 text-sm py-3 pl-11 pr-11 shadow-inner transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                  errors.confirmPassword ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 hover:border-white/20 focus:border-primary-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                tabIndex={-1}
              >
                {showConfirmPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 text-primary-500 rounded border-white/20 bg-slate-950/80 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                I agree to the <span className="text-primary-400 font-semibold">Institutional Terms & Policies</span> of The Educator School.
              </span>
            </label>
            {errors.agreeTerms && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.agreeTerms}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-600 hover:from-primary-500 hover:to-sky-500 text-white font-bold text-sm shadow-xl shadow-primary-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
          >
            {isSubmitting || loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-primary-400 hover:text-primary-300 transition-colors underline underline-offset-4 decoration-primary-500/40"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
