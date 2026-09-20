import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineBuildingLibrary,
  HiOutlineTrophy,
  HiOutlineShieldCheck,
  HiOutlineLightBulb,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineQuestionMarkCircle,
  HiOutlineBeaker,
  HiOutlineComputerDesktop,
  HiOutlineHeart,
  HiOutlineTruck,
  HiOutlineBuildingOffice2,
  HiOutlineVideoCamera,
  HiOutlinePaperAirplane,
  HiOutlineCheckBadge,
  HiOutlineXMark,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineGlobeAlt,
  HiOutlineArrowsPointingOut,
  HiOutlineSparkles as HiOutlineMagic,
  HiOutlineEnvelope,
  HiOutlineInformationCircle,
  HiOutlinePlay
} from 'react-icons/hi2';
import Button from '../../components/common/Button';
import AnimatedCounter from '../../components/common/AnimatedCounter';

const rotatingHeadlines = [
  'Nurturing Global Innovators.',
  'Pioneering AI & STEM Education.',
  'Fostering Uncompromising Character.',
  'Inspiring Academic Brilliance.',
  'Shaping Visionary Leaders.'
];

const stats = [
  { value: 2500, suffix: '+', label: 'Enrolled Scholars', icon: HiOutlineUserGroup, color: 'text-primary-500', desc: 'Montessori to A-Levels' },
  { value: 99, suffix: '%', label: 'Cambridge & BISE A+ Rate', icon: HiOutlineTrophy, color: 'text-amber-400', desc: 'Top Board Distinctions' },
  { value: 120, suffix: '+', label: 'Distinguished Faculty', icon: HiOutlineAcademicCap, color: 'text-emerald-400', desc: 'Masters & Ph.D. Educators' },
  { value: 35, suffix: '+', label: 'Years of Heritage', icon: HiOutlineBuildingLibrary, color: 'text-indigo-400', desc: 'Since 1989' },
];

const programs = [
  {
    id: 'montessori',
    title: 'Early Years Montessori',
    category: 'early',
    grade: 'Playgroup to Prep (Ages 3 - 5)',
    desc: 'Sensory-rich Montessori exploration developing bilingual phonics, early numeracy, emotional agility, music, and motor coordination.',
    icon: HiOutlineSparkles,
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    border: 'border-pink-500/30',
    tagColor: 'text-pink-400 bg-pink-500/10',
    highlights: ['Bilingual Phonics Suite', 'Practical Life Exercises', 'Sensory Motor Exploration']
  },
  {
    id: 'primary',
    title: 'Primary Wing',
    category: 'primary',
    grade: 'Grade 1 - Grade 5 (Ages 6 - 10)',
    desc: 'Inquiry-based foundational curriculum reinforcing mental mathematics, scientific discovery, creative arts, and introductory computing.',
    icon: HiOutlineBookOpen,
    gradient: 'from-blue-500/20 via-sky-500/10 to-transparent',
    border: 'border-blue-500/30',
    tagColor: 'text-blue-400 bg-blue-500/10',
    highlights: ['Mental Math Clinics', 'Python Junior Coding', 'Creative English & Urdu Writing']
  },
  {
    id: 'middle',
    title: 'Middle Preparatory',
    category: 'middle',
    grade: 'Grade 6 - Grade 8 (Ages 11 - 13)',
    desc: 'Rigorous preparatory bridge introducing analytical physics, chemistry, pre-algebra, robotics competitions, and formal debate leagues.',
    icon: HiOutlineAcademicCap,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'border-emerald-500/30',
    tagColor: 'text-emerald-400 bg-emerald-500/10',
    highlights: ['First Lego League Robotics', 'Experimental Science Labs', 'Model UN & Parliamentary Debates']
  },
  {
    id: 'matric',
    title: 'Matriculation (SSC I & II)',
    category: 'matric',
    grade: 'Grade 9 - Grade 10',
    desc: 'Intensive BISE Federal Board track with past-paper mastery, advanced laboratory clinics, conceptual physics, and numerical problem solving.',
    icon: HiOutlineTrophy,
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    border: 'border-amber-500/30',
    tagColor: 'text-amber-400 bg-amber-500/10',
    highlights: ['FBISE Board Position Mentorship', 'Specialized Practical Labs', 'Targeted Exam Bootcamps']
  },
  {
    id: 'olevels',
    title: 'Cambridge O-Levels & IGCSE',
    category: 'cambridge',
    grade: 'Grade 9 - Grade 11',
    desc: 'Internationally benchmarked CAIE qualification honing higher-order critical thinking, experimental design, literature, and essay writing.',
    icon: HiOutlineBuildingLibrary,
    gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
    border: 'border-indigo-500/30',
    tagColor: 'text-indigo-400 bg-indigo-500/10',
    highlights: ['CAIE Master Trainer Faculty', 'Extended Essay Mentorship', 'Global Distinction Track']
  },
  {
    id: 'alevels',
    title: 'Cambridge A-Levels & FSc',
    category: 'cambridge',
    grade: 'Grade 11 - Grade 12 / College',
    desc: 'Pre-Engineering, Pre-Med, ICS, and A-Level disciplines coupled with SAT, MDCAT, ECAT coaching, and Ivy League mentorship.',
    icon: HiOutlineShieldCheck,
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    border: 'border-violet-500/30',
    tagColor: 'text-violet-400 bg-violet-500/10',
    highlights: ['100% University Placement', 'MDCAT / ECAT / SAT Prep', 'Ivy League & UK Admissions Mentoring']
  }
];

const facultyMembers = [
  {
    name: 'Dr. Tariq Mahmood',
    role: 'Head of Mathematics & Computational Sciences',
    degrees: 'Ph.D. Applied Mathematics (LUMS), M.Sc. Cambridge',
    experience: '18+ Years Experience',
    specialty: 'Pure Calculus, Algorithms & AI Modeling',
    rating: '4.9/5 Student Rating',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Mrs. Ayesha Siddiqui',
    role: 'Head of Cambridge Science & Chemistry Wing',
    degrees: 'M.Phil. Organic Chemistry (QAU), CAIE Master Fellow',
    experience: '14+ Years Experience',
    specialty: 'Cambridge O/A-Level Chemistry & Lab Research',
    rating: '5.0/5 Student Rating',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Prof. Kamran Farooq',
    role: 'Director of Physics & Robotics Innovation',
    degrees: 'M.S. Robotics & Mechatronics (NUST)',
    experience: '12+ Years Experience',
    specialty: 'Mechanics, Electromagnetism & Microcontrollers',
    rating: '4.9/5 Student Rating',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Ms. Zainab Bilal',
    role: 'Head of English Literature & MUN Debates',
    degrees: 'M.A. English Literature (Oxford Affiliate Program)',
    experience: '10+ Years Experience',
    specialty: 'Classical Literature, Public Speaking & Rhetoric',
    rating: '4.8/5 Student Rating',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80'
  }
];

const facilitiesList = [
  {
    id: 'smart-classrooms',
    name: 'Smart Interactive Classrooms',
    category: 'academic',
    desc: 'Centralized climate-controlled learning suites with 4K UHD interactive panels and Herman Miller ergonomic seating.',
    icon: HiOutlineBuildingOffice2,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'comp-labs',
    name: 'AI & Robotics Maker Studio',
    category: 'stem',
    desc: 'Gigabit fiber network, 3D prototyping printers, autonomous drone testing arena, and Python development labs.',
    icon: HiOutlineComputerDesktop,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'science-labs',
    name: 'Advanced Science Research Labs',
    category: 'stem',
    desc: 'Three dedicated laboratories for Physics, Chemistry, and Biology built to international Cambridge CAIE safety standards.',
    icon: HiOutlineBeaker,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sports',
    name: 'Olympic Sports Arena',
    category: 'sports',
    desc: '25-meter heated Olympic swimming pool, FIFA-grade turf pitch, basketball pavilions, and indoor squash courts.',
    icon: HiOutlineTrophy,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'library',
    name: 'Digital Central Library',
    category: 'academic',
    desc: 'Over 25,000 physical volumes, JSTOR & Oxford digital library access, RFID kiosks, and acoustic research cubicles.',
    icon: HiOutlineBookOpen,
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'transport',
    name: 'GPS-Tracked Safe Transport',
    category: 'services',
    desc: 'Fleet of 30+ air-conditioned buses with live parent GPS tracking, CCTV surveillance, and female attendants.',
    icon: HiOutlineTruck,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'cafeteria',
    name: 'Hygienic Multi-Cuisine Cafeteria',
    category: 'services',
    desc: 'Nutritionist-supervised fresh meals, organic juice bars, and cashless digital RFID card payments.',
    icon: HiOutlineHeart,
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'medical',
    name: 'On-Campus Medical Clinic',
    category: 'services',
    desc: 'Resident physician and nurse, emergency first-aid station, and immediate tertiary hospital tie-up.',
    icon: HiOutlineShieldCheck,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
  }
];

const successStories = [
  {
    name: 'Ayesha Siddiqui',
    cohort: 'Class of 2024',
    dest: 'Stanford University (Full Scholarship)',
    major: 'B.S. Artificial Intelligence & Neurobiology',
    quote: 'The AI & Robotics lab at The Educator School gave me the confidence to compete globally. My teachers were truly world-class mentors who believed in my potential.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    achievement: '100% Scholarship Award'
  },
  {
    name: 'Hamza Farooq',
    cohort: 'Class of 2023',
    dest: 'University of Cambridge (Kings College)',
    major: 'Master of Engineering (Computer Science)',
    quote: 'Securing straight A*s in Cambridge CAIE was direct proof of the rigorous analytical training and critical problem-solving we practiced every single day.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    achievement: 'Straight 5 A* in A-Levels'
  },
  {
    name: 'Dr. Zainab Bilal',
    cohort: 'Class of 2022',
    dest: 'Aga Khan University Medical College',
    major: 'Bachelor of Medicine & Surgery (MBBS)',
    quote: 'The organic chemistry laboratories, scientific debates, and pre-medical symposiums set the highest benchmark for my medical career.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    achievement: 'AKU Merit Position 1'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Dr. Tariq Mehmood',
    role: 'Parent of Grade 9 & Grade 11 Students',
    text: 'The Educator School has completely transformed how my children approach education. The focus on analytical thinking rather than rote learning made all the difference in their Cambridge exams.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    highlight: 'Parent for 6 Years'
  },
  {
    id: 2,
    name: 'Mrs. Saira Hashmi',
    role: 'Parent of Grade 3 Student',
    text: 'The Montessori and Primary teachers are exceptionally warm and attentive. The student portal lets me monitor weekly progress, fee slips, and attendance effortlessly from my phone.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    highlight: 'Montessori Parent'
  },
  {
    id: 3,
    name: 'Kamran Farooq',
    role: 'Software Architect & Parent',
    text: 'A school that genuinely prepares children for the AI era. My son is already building working robotics models in Grade 7. Outstanding leadership, values, and campus infrastructure.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    highlight: 'STEM Innovation Advocate'
  }
];

const timelineSteps = [
  {
    step: '01',
    title: 'Online Application & Registration',
    desc: 'Submit the simple inquiry form online or visit the registrar admissions desk to obtain the official prospectus.'
  },
  {
    step: '02',
    title: 'Diagnostic Student Assessment',
    desc: 'Age-appropriate evaluation assessing analytical problem solving, bilingual reading comprehension, and mathematics.'
  },
  {
    step: '03',
    title: 'Parent & Principal Interaction',
    desc: 'An inspiring interactive discussion aligning educational goals, student interests, and school welfare values.'
  },
  {
    step: '04',
    title: 'Enrollment & Welcome Kit',
    desc: 'Submit attested documents, complete fee settlement via digital voucher, and receive the official academic starter kit.'
  }
];

const galleryPreview = [
  { title: 'STEM Robotics Championship 2025', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', cat: 'Innovation' },
  { title: 'Olympic Swimming Tournament', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80', cat: 'Sports' },
  { title: 'Cambridge Convocation & Honors', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80', cat: 'Graduation' },
  { title: 'Advanced Science Research Lab', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80', cat: 'Academics' },
  { title: 'Model United Nations Assembly', image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80', cat: 'Debates' },
  { title: 'Central Library Discussion Pods', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80', cat: 'Campus' }
];

export default function HomePage() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  const [activeProgramFilter, setActiveProgramFilter] = useState('all');
  const [activeFacilityCategory, setActiveFacilityCategory] = useState('all');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [tourBooked, setTourBooked] = useState(false);
  const [tourForm, setTourForm] = useState({ name: '', phone: '', grade: 'Grade 1 - 5', date: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [openFaq, setOpenFaq] = useState(0);

  // Rotating Headline
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % rotatingHeadlines.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide Testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleTourSubmit = (e) => {
    e.preventDefault();
    if (!tourForm.name || !tourForm.phone) return;
    setTourBooked(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setContactSubmitted(false), 6000);
  };

  const filteredPrograms =
    activeProgramFilter === 'all'
      ? programs
      : programs.filter((p) => p.category === activeProgramFilter);

  const filteredFacilities =
    activeFacilityCategory === 'all'
      ? facilitiesList
      : facilitiesList.filter((f) => f.category === activeFacilityCategory);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH ANIMATED GRADIENTS & 3D FLOATING SHOWCASE */}
      {/* ========================================================================= */}
      <section id="home" className="relative min-h-[92vh] flex items-center justify-center pt-8 sm:pt-12 pb-16 overflow-hidden">
        
        {/* Ambient Gradient Glows & Floating Particles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[950px] h-[550px] bg-gradient-to-tr from-primary-600/20 via-indigo-600/15 to-amber-500/15 blur-[140px] -z-10 rounded-full pointer-events-none" />
        <div className="absolute -top-32 right-10 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Animated Headlines & High-Conversion CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-7 text-center lg:text-left"
            >
              {/* Institutional Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-extrabold text-primary-600 dark:text-amber-400">Session 2026–2027</span>
                <span className="text-slate-400">|</span>
                <span>Admissions Now Open</span>
              </div>

              {/* Main Headline with Dynamic Gradient Switcher */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] font-display">
                  Educating Leaders.{' '}
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-indigo-500 to-amber-500 dark:from-primary-400 dark:via-indigo-300 dark:to-amber-300 transition-all duration-700">
                    {rotatingHeadlines[headlineIndex]}
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Welcome to <strong className="text-slate-900 dark:text-white font-bold">The Educator School</strong>, a world-class academic ecosystem 
                merging Cambridge International standards, STEM robotics innovation, and moral character from Montessori to A-Levels.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/#admissions" onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <button className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all">
                      <HiOutlineSparkles className="w-4 h-4 text-slate-950" />
                      <span>Apply for Admission</span>
                      <HiOutlineArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </motion.div>
                </Link>

                <Link to="/#courses" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="outline" size="lg" className="rounded-2xl backdrop-blur-md font-bold text-sm border-slate-300 dark:border-white/20">
                      <HiOutlineBookOpen className="w-4 h-4 mr-2 text-primary-500" />
                      <span>Explore Programs</span>
                    </Button>
                  </motion.div>
                </Link>

                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="ghost" size="lg" className="text-slate-600 dark:text-slate-300 font-bold text-sm">
                      <HiOutlineUserGroup className="w-4 h-4 mr-1 text-amber-500" />
                      <span>Portal Sign In &rarr;</span>
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <HiOutlineCheckBadge className="w-4 h-4 text-primary-500" /> Cambridge CAIE PK-921
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineCheckBadge className="w-4 h-4 text-emerald-500" /> Federal BISE Affiliated
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineCheckBadge className="w-4 h-4 text-amber-500" /> Up to 100% Scholarships
                </span>
              </div>
            </motion.div>

            {/* Right Column: 3D Layered Glass Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Campus Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0E172A]/90 backdrop-blur-2xl p-3.5 shadow-black/20">
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] relative bg-slate-900 group">
                    <img 
                      src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80" 
                      alt="The Educator School Flagship Campus" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                        Flagship 12-Acre Campus
                      </span>
                      <h4 className="text-base font-bold mt-1.5 text-white drop-shadow-sm">
                        Smart Lecture Theatres & Olympic Sports Pavilion
                      </h4>
                    </div>
                  </div>

                  {/* Micro Metrics Grid */}
                  <div className="p-4 grid grid-cols-2 gap-3 mt-1 text-left">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Teacher Ratio</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">15 : 1</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Individual Attention</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">AI & STEM Labs</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">6 High-Tech</p>
                      <span className="text-[10px] text-amber-500 dark:text-amber-400 font-semibold">Python & Robotics</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge Top Left */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-5 -left-5 sm:-left-7 p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-slate-700 shadow-2xl flex items-center gap-3 backdrop-blur-xl"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black">
                    <HiOutlineTrophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Ranked #1</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white">Academic Excellence</p>
                  </div>
                </motion.div>

                {/* Floating Badge Bottom Right */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -bottom-6 -right-5 sm:-right-7 p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-slate-700 shadow-2xl flex items-center gap-3 backdrop-blur-xl"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black">
                    <HiOutlineShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">100% Safe Campus</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white">RFID & Biometrics</p>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUSTED BY PARENTS & ALUMNI SEALS */}
      {/* ========================================================================= */}
      <section id="trust" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
              Trusted by 10,000+ Alumni & Families
            </span>
            <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Graduates accepted at Stanford, Cambridge, LUMS, NUST, AKU & Oxford
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              Cambridge International CAIE
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              Federal Board BISE Islamabad
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              British Council Partner
            </span>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIVE ANIMATED STATS COUNTER BANNER */}
      {/* ========================================================================= */}
      <section id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-950 via-primary-950 to-slate-950 text-white shadow-2xl border border-primary-800/40 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {stats.map((item, idx) => (
              <div key={idx} className={`text-center flex flex-col items-center ${idx > 0 ? 'pt-6 lg:pt-0' : ''}`}>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight flex items-center text-white font-display">
                  <AnimatedCounter end={item.value} />
                  <span>{item.suffix}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-bold">{item.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT THE EDUCATOR & PRINCIPAL'S WELCOME */}
      {/* ========================================================================= */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-4 text-center lg:text-left space-y-4">
              <div className="relative mx-auto lg:mx-0 w-48 h-56 sm:w-60 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
                  alt="Principal Mrs. Farzana Hameed"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Mrs. Farzana Hameed</h3>
                <p className="text-xs text-primary-600 dark:text-amber-400 font-bold">Principal & Head of Academics</p>
                <p className="text-[11px] text-slate-400">M.Sc., Cambridge Certified Master Trainer</p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-amber-300">
                Principal's Welcome Address
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                "We don't merely educate students; we inspire them to think independently, lead with moral conviction, and solve real-world challenges."
              </h2>
              <p>
                At The Educator School, every scholar is nurtured as an individual thinker endowed with curiosity and limitless potential. 
                Our curriculum bridges world-renowned Cambridge International and National standards with practical robotics engineering, 
                debating prowess, and timeless character values.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Visionary Mindset</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Critical inquiry and computational problem-solving.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Ethical Character</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Empathy, honesty, leadership, and public service.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Global Readiness</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Seamless pathways to Ivy League & top universities.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY CHOOSE THE EDUCATOR (APPLE BENTO-GRID) */}
      {/* ========================================================================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            The Educator Edge
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Discerning Families Choose Us
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            A balanced academic paradigm combining computational logic, dual-track mastery, ethical leadership, and world-class sports facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1 (Large 2-Col) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 p-8 sm:p-9 rounded-3xl bg-gradient-to-br from-primary-950 via-indigo-950 to-slate-950 text-white shadow-2xl border border-primary-800/30 relative overflow-hidden flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3 max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pioneering AI & STEM Education
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight font-display">
                Robotics, Python Coding & AI Literacy from Grade 3
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rather than treating technology as an afterthought, computational logic and algorithmic experimentation 
                are woven directly into everyday sciences, mathematics, and design thinking.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10 text-xs text-amber-300 font-bold">
              <span>&bull; First Lego League Champions</span>
              <span>&bull; 3D Prototyping Studios</span>
              <span>&bull; Autonomous Drone Arena</span>
            </div>
          </motion.div>

          {/* Bento Card 2: Dual Track */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                <HiOutlineTrophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Dual Track Mastery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Customized pathways supporting both Cambridge International (IGCSE & A-Levels) and Federal BISE Matriculation/FSc streams.
              </p>
            </div>
            <Link to="/#courses" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-bold text-primary-600 dark:text-amber-400 hover:underline flex items-center gap-1">
              Explore Academic Tracks &rarr;
            </Link>
          </motion.div>

          {/* Bento Card 3: Ethics */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                <HiOutlineHeart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Character & Ethics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Emphasis on empathy, moral grounding, public service volunteering, and personal integrity through daily faculty mentorship.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100+ Hours Annual Community Service</span>
          </motion.div>

          {/* Bento Card 4 (Large 2-Col): Scholarships */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 dark:text-amber-300">
                Merit & Need Aid
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Up to 100% Tuition Fee Scholarships</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We ensure brilliance is never held back by economic barriers. Top board position holders and Cambridge straight-A* scholars automatically qualify for full academic tuition waivers.
              </p>
            </div>
            <Link to="/#admissions" onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline">
              Review Scholarship Eligibility Guidelines &rarr;
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COURSES & ACADEMIC PROGRAMS */}
      {/* ========================================================================= */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              Academic Wings
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Curriculum & Programs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              From early sensory exploration to university-preparatory Cambridge A-Levels and Board Examinations.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            {[
              { id: 'all', label: 'All Streams' },
              { id: 'early', label: 'Montessori' },
              { id: 'primary', label: 'Primary' },
              { id: 'middle', label: 'Middle' },
              { id: 'cambridge', label: 'Cambridge' },
              { id: 'matric', label: 'Matric' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveProgramFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeProgramFilter === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => {
            const Icon = prog.icon;
            return (
              <motion.div
                key={prog.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                className={`p-7 rounded-3xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5 flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${prog.gradient} ${prog.border} border flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-slate-800 dark:text-white" />
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${prog.tagColor}`}>
                      {prog.grade}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                      {prog.desc}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {prog.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-primary-600 dark:text-amber-400">
                  <Link
                    to="/#admissions"
                    onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:underline flex items-center gap-1.5"
                  >
                    <span>Apply for Enrollment</span>
                    <HiOutlineArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. DISTINGUISHED TEACHERS & FACULTY PROFILE CARDS */}
      {/* ========================================================================= */}
      <section id="teachers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            Academic Mentors
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Distinguished Faculty & Educators
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Master educators holding international credentials dedicated to inspiring academic rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyMembers.map((fac, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="rounded-3xl overflow-hidden bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-black">
                    {fac.rating}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {fac.name}
                  </h3>
                  <p className="text-xs font-bold text-primary-600 dark:text-amber-400">
                    {fac.role}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">
                    {fac.degrees}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Specialty:</span> {fac.specialty}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  {fac.experience}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. WORLD-CLASS CAMPUS FACILITIES */}
      {/* ========================================================================= */}
      <section id="facilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Campus Facilities & Labs
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            {[
              { id: 'all', label: 'All Facilities' },
              { id: 'academic', label: 'Academic' },
              { id: 'stem', label: 'STEM Labs' },
              { id: 'sports', label: 'Sports' },
              { id: 'services', label: 'Student Care' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFacilityCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeFacilityCategory === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFacilities.map((fac) => {
            const Icon = fac.icon;
            return (
              <motion.div
                key={fac.id}
                layout
                whileHover={{ y: -6 }}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-900">
                    <img
                      src={fac.image}
                      alt={fac.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white p-2.5 rounded-2xl">
                      <Icon className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-amber-400 transition-colors">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {fac.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. STUDENT SUCCESS STORIES & ALUMNI HALL OF FAME */}
      {/* ========================================================================= */}
      <section id="success" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            Alumni Hall of Fame
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Student Success Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Meet alumni who began their journey to global universities right here at The Educator School.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="p-7 rounded-3xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/40 shadow-md"
                  />
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">{story.name}</h4>
                    <p className="text-[11px] font-bold text-amber-500 dark:text-amber-400">{story.cohort}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">{story.dest}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed font-medium">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>{story.major}</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px]">{story.achievement}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. PARENT TESTIMONIALS CAROUSEL */}
      {/* ========================================================================= */}
      <section id="testimonials" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
            Voices of Trust
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            What Parents Say About Us
          </h2>
        </div>

        <div className="relative p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 text-center sm:text-left"
            >
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                  <HiOutlineStar key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>

              <blockquote className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 italic leading-relaxed">
                "{testimonials[testimonialIdx].text}"
              </blockquote>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <img
                    src={testimonials[testimonialIdx].avatar}
                    alt={testimonials[testimonialIdx].name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400/40"
                  />
                  <div className="text-left">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{testimonials[testimonialIdx].name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{testimonials[testimonialIdx].role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-slate-950 transition-colors cursor-pointer"
                    aria-label="Previous Testimonial"
                  >
                    <HiOutlineChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setTestimonialIdx((prev) => (prev + 1) % testimonials.length)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-slate-950 transition-colors cursor-pointer"
                    aria-label="Next Testimonial"
                  >
                    <HiOutlineChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. CAMPUS GALLERY WITH LIGHTBOX */}
      {/* ========================================================================= */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Campus Moments
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Visual Highlights & Campus Life
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryPreview.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedGalleryImg(item)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-slate-200/80 dark:border-white/10"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <div className="w-11 h-11 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center">
                  <HiOutlineArrowsPointingOut className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">
                {item.title}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedGalleryImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
            <div className="bg-white dark:bg-[#0E172A] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="relative aspect-[16/10] w-full bg-slate-900">
                <img src={selectedGalleryImg.image} alt={selectedGalleryImg.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedGalleryImg(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedGalleryImg.title}</h3>
                  <span className="text-xs text-amber-500 font-bold">{selectedGalleryImg.cat}</span>
                </div>
                <Button size="sm" onClick={() => setSelectedGalleryImg(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 12. ADMISSION ROADMAP TIMELINE & GUIDED TOUR FORM */}
      {/* ========================================================================= */}
      <section id="admissions" className="bg-slate-100/70 dark:bg-[#040810] border-y border-slate-200/80 dark:border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-amber-300">
              Enrollment Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Simple 4-Step Admission Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Transparent, smooth, and welcoming for prospective scholars and parents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {timelineSteps.map((st, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-white/10 shadow-xl relative overflow-hidden group"
              >
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800 group-hover:text-amber-400/30 transition-colors font-display">
                  {st.step}
                </span>
                <h4 className="text-base font-black text-slate-900 dark:text-white mt-3">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                  {st.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Guided Tour Interactive Booking Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary-950 via-slate-950 to-slate-900 text-white shadow-2xl border border-primary-800/40 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300">
                  Experience Campus Life
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
                  Book a Guided Campus Tour
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-medium">
                  Walk through our modern STEM labs, auditorium, Olympic swimming pavilion, smart lecture halls, 
                  and meet our department heads in person.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <HiOutlineClock className="w-5 h-5 text-amber-400 mb-1" />
                    <p className="font-bold">Mon - Fri: 8am - 3pm</p>
                    <p className="text-[10px] text-slate-400">Scheduled slots</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <HiOutlineMapPin className="w-5 h-5 text-emerald-400 mb-1" />
                    <p className="font-bold">Main Campus</p>
                    <p className="text-[10px] text-slate-400">Sector F-8, Islamabad</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                    <HiOutlinePhone className="w-5 h-5 text-primary-400 mb-1" />
                    <p className="font-bold">+92 (51) 884-9000</p>
                    <p className="text-[10px] text-slate-400">Helpdesk Support</p>
                  </div>
                </div>
              </div>

              {/* Booking Form Box */}
              <div className="lg:col-span-5 bg-white dark:bg-[#0E172A] text-slate-900 dark:text-white p-7 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
                {tourBooked ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                      <HiOutlineCheckCircle className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-bold">Tour Appointment Requested!</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                      Our admissions advisor will contact you within 24 hours to confirm your scheduled slot.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setTourBooked(false)}>
                      Schedule Another Visit
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleTourSubmit} className="space-y-3.5">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">Schedule Campus Visit</h4>
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Parent / Guardian Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Salman Khan"
                        value={tourForm.name}
                        onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                        className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="+92 300 1234567"
                          value={tourForm.phone}
                          onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                          className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Grade Level</label>
                        <select
                          value={tourForm.grade}
                          onChange={(e) => setTourForm({ ...tourForm, grade: e.target.value })}
                          className="mt-1 w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900 dark:text-white"
                        >
                          <option>Montessori / Early</option>
                          <option>Grade 1 - 5 (Primary)</option>
                          <option>Grade 6 - 8 (Middle)</option>
                          <option>Matric / O-Levels</option>
                          <option>FSc / A-Levels</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={tourForm.date}
                        onChange={(e) => setTourForm({ ...tourForm, date: e.target.value })}
                        className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer mt-1"
                    >
                      Confirm Visit Slot
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            { q: 'What is the admission procedure for the 2026-2027 academic session?', a: 'Admissions open online and at campus. Parents submit an inquiry form, download the official syllabus guidelines, and schedule an interactive student diagnostic assessment and parental interview.' },
            { q: 'Does the school offer GPS-tracked transport with female attendants?', a: 'Yes, we operate a fleet of 30+ modern air-conditioned buses equipped with real-time GPS tracking on the parent portal, CCTV cameras, and dedicated female attendants across all major city routes.' },
            { q: 'How does The Educator School support dual-track CAIE and BISE streams?', a: 'Students in Grade 8 receive comprehensive academic diagnostic counseling to choose between the Cambridge CAIE (O/A-Levels) or the Federal Board (Matric/FSc) streams, both equipped with specialized laboratories and faculty.' },
            { q: 'What merit scholarships are available for high achievers?', a: 'We offer up to 100% tuition fee waivers for students securing top board positions, straight A*s in Cambridge exams, or demonstrating national-level distinction in STEM or Athletics.' }
          ].map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200/80 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0E172A] overflow-hidden transition-all shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-4 text-left font-black text-sm text-slate-900 dark:text-white flex items-center justify-between hover:text-primary-600 dark:hover:text-amber-400 cursor-pointer"
              >
                <span>{faq.q}</span>
                <HiOutlineQuestionMarkCircle className={`w-5 h-5 transition-transform text-slate-400 ${openFaq === i ? 'rotate-180 text-amber-400' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-3 leading-relaxed font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. CONTACT US & CAMPUS MAP SECTION */}
      {/* ========================================================================= */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-[#0E172A] p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Visit Campus Desk
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Connect With Admissions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Our registrar and admissions counselors are on campus 6 days a week to guide prospective families.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2 font-bold">
                <HiOutlineMapPin className="w-4 h-4 text-emerald-500 shrink-0" /> Sector F-8/3, Educational Avenue, Islamabad, Pakistan
              </p>
              <p className="flex items-center gap-2 font-bold">
                <HiOutlinePhone className="w-4 h-4 text-primary-500 shrink-0" /> +92 (51) 884-9000 / +92 (51) 884-9001
              </p>
              <p className="flex items-center gap-2 font-bold">
                <HiOutlineEnvelope className="w-4 h-4 text-amber-500 shrink-0" /> admissions@theeducator.edu.pk
              </p>
              <p className="flex items-center gap-2 font-bold">
                <HiOutlineClock className="w-4 h-4 text-indigo-500 shrink-0" /> Monday to Saturday: 8:00 AM – 4:00 PM
              </p>
            </div>

            {/* Quick Online Inquiry Form */}
            {contactSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 mt-4">
                <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Message received! An admissions officer will respond shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-2.5 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <textarea
                  rows="2"
                  placeholder="Questions about admissions or campus..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-6 rounded-2xl overflow-hidden h-80 border border-slate-200 dark:border-slate-800 shadow-inner">
            <iframe
              title="Campus Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13274.654854728562!2d73.0362947!3d33.7144883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbf9df159491b%3A0x6a2c20689cf6bbcd!2sSector%20F-8%2C%20Islamabad!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15. FINAL CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-amber-600 text-white text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-black max-w-3xl mx-auto leading-tight font-display">
            Ready to Give Your Child an Exceptional Future?
          </h2>
          <p className="text-xs sm:text-base text-primary-100 max-w-xl mx-auto font-medium">
            Join thousands of successful alumni who began their journey to world-class universities right here at The Educator School.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/#admissions" onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}>
              <button className="px-7 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 shadow-2xl font-black text-sm transition-all cursor-pointer">
                Apply for Admission Now
              </button>
            </Link>
            <Link to="/#contact" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              <button className="px-7 py-3.5 rounded-2xl border border-white/40 text-white hover:bg-white/10 font-bold text-sm transition-all cursor-pointer">
                Contact Admissions Office
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

