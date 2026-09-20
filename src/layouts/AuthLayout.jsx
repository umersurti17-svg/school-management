import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineBookOpen,
  HiOutlineLightBulb,
} from 'react-icons/hi';

export default function AuthLayout() {
  const floatingIcons = [
    { Icon: HiOutlineAcademicCap, delay: 0, x: -20, y: -30, size: 'w-6 h-6' },
    { Icon: HiOutlineBookOpen, delay: 1.5, x: 30, y: -40, size: 'w-5 h-5' },
    { Icon: HiOutlineSparkles, delay: 0.8, x: -40, y: 20, size: 'w-5 h-5' },
    { Icon: HiOutlineLightBulb, delay: 2.2, x: 25, y: 35, size: 'w-6 h-6' },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100 selection:bg-primary-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Animated Gradient Mesh & Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-primary-600/25 via-indigo-600/20 to-purple-600/10 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -right-32 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tl from-sky-600/20 via-primary-700/20 to-emerald-600/15 blur-[120px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf80f_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Left Brand / Illustration Hero Column (Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="hidden lg:flex lg:col-span-5 xl:col-span-5 relative z-10 p-12 xl:p-14 flex-col justify-between border-r border-white/10 bg-gradient-to-br from-slate-900/90 via-primary-950/80 to-slate-950/90 backdrop-blur-2xl"
      >
        {/* Top Logo & School Identity */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.08 }}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-primary-600 via-indigo-500 to-sky-400 p-[1.5px] shadow-xl shadow-primary-500/20"
            >
              <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
                <HiOutlineAcademicCap className="w-7 h-7 text-primary-400 group-hover:text-primary-300 transition-colors" />
              </div>
            </motion.div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                The Educator School
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                  v2.0
                </span>
              </h2>
              <p className="text-xs font-semibold text-primary-400/90 tracking-wide uppercase mt-0.5">
                Next-Gen Academic Management
              </p>
            </div>
          </Link>
        </div>

        {/* Center Showcase Hero Box */}
        <div className="my-auto space-y-7 max-w-md relative">
          {/* Floating School Icons in Hero Box */}
          {floatingIcons.map(({ Icon, delay, x, y, size }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                y: [y - 8, y + 8, y - 8],
                x: [x - 5, x + 5, x - 5],
              }}
              transition={{
                duration: 6,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute pointer-events-none text-primary-400/30"
              style={{ top: `${20 + i * 22}%`, right: `${-10 + (i % 2) * 20}%` }}
            >
              <Icon className={size} />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-300 backdrop-blur-xl shadow-inner"
          >
            <HiOutlineSparkles className="w-4 h-4 text-primary-400 animate-pulse" />
            <span>Complete Institution Operating System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl xl:text-4xl font-black tracking-tight leading-[1.2] text-white"
          >
            Precision management for modern school excellence.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-slate-300/90 leading-relaxed"
          >
            Seamless real-time attendance, smart fee invoice generation, automated exam report cards, and role-secured access for Administrators, Teachers, and Students.
          </motion.p>

          {/* Interactive Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-3.5 pt-1"
          >
            <div className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 backdrop-blur-xl transition-all hover:scale-[1.02] space-y-1.5 shadow-lg shadow-black/20">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <HiOutlineShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Tri-Role Access</h4>
              <p className="text-[11px] text-slate-400">Admin, Faculty & Student portals</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 backdrop-blur-xl transition-all hover:scale-[1.02] space-y-1.5 shadow-lg shadow-black/20">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <HiOutlineChartBar className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Live Analytics</h4>
              <p className="text-[11px] text-slate-400">GPA calculation & fee billing</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Assurance */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2 font-medium text-slate-300">
            <HiOutlineCheckCircle className="w-4 h-4 text-emerald-400" />
            Zero-Trust Row Level Security
          </span>
          <span className="font-semibold text-primary-400">Session 2026</span>
        </div>
      </motion.div>

      {/* Right Form Column */}
      <div className="lg:col-span-7 xl:col-span-7 relative z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto min-h-screen">
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <Outlet />
        </div>

        {/* Global Footer */}
        <div className="text-center text-xs text-slate-500 pt-6 border-t border-white/5">
          <p>© 2026 The Educator School • All rights reserved • Enterprise Portal</p>
        </div>
      </div>
    </div>
  );
}
