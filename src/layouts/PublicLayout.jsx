import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRight,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineSparkles,
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineArrowUp,
  HiOutlineStar,
  HiOutlineGlobeAlt,
  HiOutlineBuildingLibrary,
  HiOutlineHeart
} from 'react-icons/hi2';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const navItems = [
  { name: 'Home', sectionId: 'home', path: '/' },
  { name: 'About', sectionId: 'about', path: '/about' },
  { name: 'Features', sectionId: 'features', path: '/#features' },
  { name: 'Courses', sectionId: 'courses', path: '/academics' },
  { name: 'Teachers', sectionId: 'teachers', path: '/teachers' },
  { name: 'Gallery', sectionId: 'gallery', path: '/gallery' },
  { name: 'Admissions', sectionId: 'admissions', path: '/admissions' },
  { name: 'Testimonials', sectionId: 'testimonials', path: '/#testimonials' },
  { name: 'Contact', sectionId: 'contact', path: '/contact' },
];

export default function PublicLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll listener for sticky header and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setIsScrolled(scrollPos > 30);
      setShowScrollTop(scrollPos > 400);

      // If on home page, determine active section
      if (location.pathname === '/') {
        const sections = navItems.map((item) => item.sectionId);
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 140) {
              setActiveSection(sections[i]);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Handle hash scrolling on initial load or route transition
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [location]);

  const handleNavClick = (e, item) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(item.sectionId);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setActiveSection(item.sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
      }
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 6000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060A13] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-primary-500 selection:text-white antialiased">
      
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-gradient-to-r from-slate-950 via-primary-950 to-slate-950 text-white text-[11px] py-2 px-4 border-b border-white/5 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-[9px] tracking-wider shadow-sm font-display">
              <HiOutlineSparkles className="w-3 h-3" /> Admissions 2026-27
            </span>
            <span className="font-medium text-slate-300 tracking-tight">
              Admissions Open for Montessori, Cambridge O/A-Levels & Matric/FSc. Merit scholarships up to 100% available.
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-[11px] text-slate-400 font-medium">
            <a href="tel:+92518849000" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
              <HiOutlinePhone className="w-3.5 h-3.5 text-amber-400" /> +92 (51) 884-9000
            </a>
            <a href="mailto:admissions@theeducator.edu.pk" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
              <HiOutlineEnvelope className="w-3.5 h-3.5 text-amber-400" /> admissions@theeducator.edu.pk
            </a>
            <span className="flex items-center gap-1.5 text-slate-300">
              <HiOutlineMapPin className="w-3.5 h-3.5 text-emerald-400" /> Sector F-8/3, Islamabad
            </span>
          </div>
        </div>
      </div>

      {/* 2. STICKY GLASSMORPHISM NAVBAR */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 dark:bg-[#070B14]/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-2xl shadow-black/5 py-2.5'
            : 'bg-white/70 dark:bg-[#060A13]/70 backdrop-blur-md border-b border-slate-200/40 dark:border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Animated Brand Crest & Title */}
            <Link to="/" onClick={(e) => handleNavClick(e, { sectionId: 'home' })} className="flex items-center gap-3.5 group cursor-pointer">
              <div className="relative">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 via-amber-400 to-indigo-600 rounded-2xl blur-xs opacity-70 group-hover:opacity-100 transition duration-500 group-hover:rotate-6" />
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-amber-400 p-[1.5px] shadow-lg">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform duration-300">
                    <HiOutlineAcademicCap className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white block leading-tight font-display">
                  The Educator
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary-600 dark:text-primary-400 block">
                    School of Excellence
                  </span>
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                  <span className="text-[9px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider">Est. 1989</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/70 p-1.5 rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-inner">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === '/'
                    ? activeSection === item.sectionId
                    : location.pathname === item.path ||
                      (item.path === '/academics' && location.pathname.startsWith('/academics')) ||
                      (item.path === '/teachers' && location.pathname.startsWith('/teachers')) ||
                      (item.path === '/admissions' && location.pathname.startsWith('/admissions')) ||
                      (item.path === '/gallery' && location.pathname.startsWith('/gallery')) ||
                      (item.path === '/contact' && location.pathname.startsWith('/contact')) ||
                      (item.path === '/about' && location.pathname.startsWith('/about'));

                return (
                  <Link
                    key={item.name}
                    to={location.pathname === '/' ? `/#${item.sectionId}` : item.path}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-primary-600 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-white dark:bg-gradient-to-r dark:from-primary-600 dark:to-indigo-600 rounded-xl shadow-md -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark/Light Mode Switcher */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-amber-400/50 transition-all cursor-pointer shadow-xs"
                aria-label="Toggle Theme"
              >
                {darkMode ? (
                  <HiOutlineSun className="w-5 h-5 text-amber-400 animate-spin-slow" />
                ) : (
                  <HiOutlineMoon className="w-5 h-5 text-slate-700" />
                )}
              </motion.button>

              {/* Portal CTA or Apply Now Button */}
              {user ? (
                <Link to="/dashboard" className="hidden sm:inline-flex">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="sm" className="shadow-lg shadow-primary-600/25 font-bold rounded-2xl">
                      <HiOutlineUserCircle className="w-4 h-4 mr-1.5" />
                      <span>Portal Dashboard</span>
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl">
                      Portal Sign In
                    </Button>
                  </Link>
                  <Link
                    to={location.pathname === '/' ? '/#admissions' : '/admissions'}
                    onClick={(e) => handleNavClick(e, { sectionId: 'admissions' })}
                  >
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                    >
                      <HiOutlineSparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>Apply Online</span>
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-2xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? (
                  <HiOutlineXMark className="w-6 h-6" />
                ) : (
                  <HiOutlineBars3 className="w-6 h-6" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0B1120]/98 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-3 shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={location.pathname === '/' ? `/#${item.sectionId}` : item.path}
                    onClick={(e) => handleNavClick(e, item)}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:text-primary-600 transition-all flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    <HiOutlineArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                {user ? (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full font-bold rounded-xl">
                      Go to Portal Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full text-xs font-bold rounded-xl">
                        Portal Login
                      </Button>
                    </Link>
                    <Link
                      to={location.pathname === '/' ? '/#admissions' : '/admissions'}
                      onClick={(e) => handleNavClick(e, { sectionId: 'admissions' })}
                    >
                      <button className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md">
                        Apply Online
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 4. LUXURY 5-COLUMN FOOTER */}
      <footer className="bg-[#030712] text-slate-300 border-t border-slate-800/80 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Column 1 & 2: School Identity & Accreditations */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-amber-400 p-[1.5px] shadow-lg">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                    <HiOutlineAcademicCap className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white font-display">
                    The Educator School
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                    Registered & Accredited Institution
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Empowering visionary leaders since 1989. Dedicated to Cambridge International CAIE rigor, 
                cutting-edge STEM robotics, ethical character development, and nationwide board excellence.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-xs">
                  <HiOutlineShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cambridge CAIE PK-921</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-xs">
                  <HiOutlineShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>BISE Federal Board</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-xs">
                  <HiOutlineStar className="w-4 h-4 text-amber-400" />
                  <span>British Council Partner</span>
                </div>
              </div>
            </div>

            {/* Column 3: Quick Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li>
                  <Link to="/#about" onClick={(e) => handleNavClick(e, { sectionId: 'about' })} className="hover:text-amber-300 transition-colors">
                    About Our Heritage
                  </Link>
                </li>
                <li>
                  <Link to="/#features" onClick={(e) => handleNavClick(e, { sectionId: 'features' })} className="hover:text-amber-300 transition-colors">
                    The Educator Edge
                  </Link>
                </li>
                <li>
                  <Link to="/#courses" onClick={(e) => handleNavClick(e, { sectionId: 'courses' })} className="hover:text-amber-300 transition-colors">
                    Academic Streams
                  </Link>
                </li>
                <li>
                  <Link to="/#teachers" onClick={(e) => handleNavClick(e, { sectionId: 'teachers' })} className="hover:text-amber-300 transition-colors">
                    Distinguished Faculty
                  </Link>
                </li>
                <li>
                  <Link to="/#gallery" onClick={(e) => handleNavClick(e, { sectionId: 'gallery' })} className="hover:text-amber-300 transition-colors">
                    Campus Life Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Admissions & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Admissions & Portal
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li>
                  <Link to="/#admissions" onClick={(e) => handleNavClick(e, { sectionId: 'admissions' })} className="hover:text-amber-300 transition-colors">
                    Admissions Criteria 2026
                  </Link>
                </li>
                <li>
                  <Link to="/#admissions" onClick={(e) => handleNavClick(e, { sectionId: 'admissions' })} className="hover:text-amber-300 transition-colors">
                    Scholarship Guidelines
                  </Link>
                </li>
                <li>
                  <Link to="/#testimonials" onClick={(e) => handleNavClick(e, { sectionId: 'testimonials' })} className="hover:text-amber-300 transition-colors">
                    Parent Testimonials
                  </Link>
                </li>
                <li>
                  <Link to="/#faq" onClick={(e) => handleNavClick(e, { sectionId: 'faq' })} className="hover:text-amber-300 transition-colors">
                    FAQs & Policies
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-amber-300 transition-colors text-amber-400 font-bold">
                    Management Portal Sign In &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Admissions Newsletter
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Subscribe for circulars, exam schedules, open-day tours, and scholarship updates.
              </p>

              {newsletterSubscribed ? (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <HiOutlineCheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span>Subscribed successfully! Thank you.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter parent email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <Button type="submit" size="sm" className="w-full text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 border-none shadow-md">
                    <HiOutlinePaperAirplane className="w-3.5 h-3.5 mr-1.5" /> Subscribe Updates
                  </Button>
                </form>
              )}
            </div>

          </div>

          {/* Bottom Copyright & Legal */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} The Educator School. All rights reserved. Registered Institution.</p>
            <div className="flex items-center gap-6 font-medium">
              <Link to="/#faq" onClick={(e) => handleNavClick(e, { sectionId: 'faq' })} className="hover:text-slate-300 transition-colors">Privacy & Terms</Link>
              <Link to="/#contact" onClick={(e) => handleNavClick(e, { sectionId: 'contact' })} className="hover:text-slate-300 transition-colors">Campus Desk</Link>
              <Link to="/login" className="hover:text-amber-400 transition-colors">Staff & Student Login</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. FLOATING SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleScrollToTop}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-2xl shadow-primary-600/50 flex items-center justify-center border border-white/20 cursor-pointer"
            aria-label="Scroll to top"
          >
            <HiOutlineArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}

