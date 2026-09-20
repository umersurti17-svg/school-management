import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineBookOpen,
  HiOutlineBeaker,
  HiOutlineCodeBracket,
  HiOutlineCalculator,
  HiOutlineGlobeAmericas,
  HiOutlineLanguage,
  HiOutlineTrophy,
  HiOutlineArrowDownTray,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import Button from '../../components/common/Button';

const tracks = [
  {
    id: 'early',
    category: 'Early Years',
    title: 'Montessori & Foundation (Ages 3 - 5)',
    desc: 'Focus on phonics, sensory exploration, spatial awareness, numerical play, social emotional learning, and expressive arts.',
    subjects: ['Early Phonics & English Literacy', 'Numeracy & Shapes Exploration', 'Urdu Storytelling & Poetry', 'Sensory Arts & Craft', 'Physical Movement & Rhythm', 'Islamic Studies & Moral Values'],
    keyHighlights: ['Maria Montessori certified apparatus', 'Dedicated indoor play arena', '1:10 Teacher-to-student ratio'],
    badge: 'Montessori Certified'
  },
  {
    id: 'primary',
    category: 'Primary Wing',
    title: 'Junior School (Grade 1 - 5)',
    desc: 'Building rock-solid foundations in bilingual literacy, scientific inquiry, mental arithmetic, computational thinking, and social studies.',
    subjects: ['English Language & Literature', 'Mathematics & Mental Math', 'General Science & Environment', 'Urdu Language & Insha', 'Computer Science & Scratch Coding', 'Islamiat & Civics', 'Visual Arts & Physical Ed.'],
    keyHighlights: ['Activity-based science mini-experiments', 'Weekly library reading journals', 'Smart interactive display lessons'],
    badge: 'Core Foundation'
  },
  {
    id: 'middle',
    category: 'Middle School',
    title: 'Preparatory Wing (Grade 6 - 8)',
    desc: 'Rigorous transition toward formal sciences, algebra, world history, analytical writing, introductory robotics, and public speaking.',
    subjects: ['Advanced English Composition', 'Pre-Algebra & Geometry', 'Integrated Physics, Chem, Bio', 'Urdu Adab & Grammar', 'Python & Robotics Fundamentals', 'Geography & History', 'Arabic & Islamic Studies'],
    keyHighlights: ['Hands-on physics and chemistry labs', 'Annual Middle School Science Fair', 'Model United Nations prep'],
    badge: 'Bridge to Senior'
  },
  {
    id: 'matric',
    category: 'Secondary / SSC',
    title: 'National Matriculation (Grade 9 - 10)',
    desc: 'Federal & BISE board syllabus with intensive test preparation, numerical mastery, lab practicals, and past-paper analytical clinics.',
    subjects: ['Physics (Theory & Practical)', 'Chemistry (Theory & Practical)', 'Biology / Computer Science', 'Mathematics (Algebra & Geometry)', 'English Compulsory', 'Urdu Compulsory', 'Islamiat & Pakistan Studies'],
    keyHighlights: ['99.4% Board A+ Grade track record', 'Daily past paper workshops', 'Bi-monthly subjective mock tests'],
    badge: 'BISE Recognized'
  },
  {
    id: 'olevel',
    category: 'Cambridge IGCSE / O-Level',
    title: 'Cambridge International (Grade 9 - 11)',
    desc: 'Internationally benchmarked qualification sharpening higher-order thinking, experimental design, essay analysis, and global issues.',
    subjects: ['Cambridge English (1123)', 'Mathematics Syllabus D (4024)', 'Physics (5054)', 'Chemistry (5070)', 'Biology (5090)', 'Computer Science (2210)', 'Pakistan Studies (2059)', 'Islamiat (2058)'],
    keyHighlights: ['Official Cambridge registered exam centre', 'British Council trained educators', 'Comprehensive practical lab evaluations'],
    badge: 'Cambridge CAIE'
  },
  {
    id: 'alevel',
    category: 'Senior Secondary / A-Levels & FSc',
    title: 'College Wing (Grade 11 - 12 / A2)',
    desc: 'Specialized tracks in Pre-Engineering, Pre-Medical, ICS, Business & Cambridge A-Levels tailored for Ivy League, LUMS, AKU, NUST entrance.',
    subjects: ['A-Level Physics / Chemistry / Biology', 'A-Level Pure Mathematics & Mechanics', 'A-Level Computer Science', 'A-Level Economics & Accounting', 'FSc Pre-Medical & Pre-Engineering', 'SAT / ECAT / MDCAT Prep'],
    keyHighlights: ['Dedicated university admissions counselor', 'Research internship mentorship', 'Top tier merit scholarships'],
    badge: 'Pre-University'
  }
];

const societies = [
  { name: 'Robotics & AI Innovation Lab', icon: HiOutlineCodeBracket, desc: 'Building autonomous bots, drone programming, and Arduino micro-controllers.' },
  { name: 'Literary & Debating Society', icon: HiOutlineLanguage, desc: 'Bilingual Parliamentary debates, Declamation contests, and Creative Writing.' },
  { name: 'Mathematics & Science Olympiad', icon: HiOutlineCalculator, desc: 'Training for Kangaroo Math, National Science Bowl, and Chemistry Olympiad.' },
  { name: 'Model United Nations (MUN)', icon: HiOutlineGlobeAmericas, desc: 'Global diplomacy, geopolitics, resolution drafting, and delegate training.' },
  { name: 'Sports & Athletic Guild', icon: HiOutlineTrophy, desc: 'Competitive Football, Cricket, Badminton, Swimming, and Table Tennis tournaments.' }
];

export default function PublicCoursesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTracks = activeTab === 'all' 
    ? tracks 
    : tracks.filter(t => t.id === activeTab);

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            Curriculum & Academics
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            World-Class Academic Programs
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From playful Montessori discovery to demanding Cambridge A-Levels and National Boards, 
            our curriculum is engineered to ignite lifelong intellect and character.
          </p>
        </div>
      </section>

      {/* Tabs Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
          {[
            { id: 'all', label: 'All Programs' },
            { id: 'early', label: 'Early Years' },
            { id: 'primary', label: 'Primary (1-5)' },
            { id: 'middle', label: 'Middle (6-8)' },
            { id: 'matric', label: 'Matriculation (SSC)' },
            { id: 'olevel', label: 'Cambridge O-Levels' },
            { id: 'alevel', label: 'A-Levels & College' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#131D31] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-primary-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Program Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTracks.map((trk) => (
            <div
              key={trk.id}
              className="bg-white dark:bg-[#131D31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-soft hover:shadow-soft-xl transition-all space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/40">
                    {trk.category}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-md">
                    {trk.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{trk.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{trk.desc}</p>

                {/* Key Highlights */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Features</p>
                  {trk.keyHighlights.map((kh, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <HiOutlineSparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{kh}</span>
                    </div>
                  ))}
                </div>

                {/* Subject List */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Subject Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trk.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <Link to="/admissions">
                  <Button size="sm" className="text-xs">
                    Apply for This Grade <HiOutlineArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                    Inquire Syllabus
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Co-Curricular & Student Societies */}
      <section className="bg-slate-50 dark:bg-[#0B1120]/60 border-y border-slate-200/80 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              Beyond the Classroom
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Student Societies & Co-Curricular Guilds
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Leadership and passion are forged through experiential co-curricular clubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {societies.map((soc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#131D31] border border-slate-200/70 dark:border-slate-800 shadow-soft hover:shadow-soft-xl transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                  <soc.icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{soc.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{soc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
