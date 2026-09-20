import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
  HiOutlineHeart,
  HiOutlineGlobeAlt,
  HiOutlineTrophy,
  HiOutlineCheckBadge,
  HiOutlineArrowRight,
  HiOutlineSparkles
} from 'react-icons/hi2';
import Button from '../../components/common/Button';

const values = [
  {
    icon: HiOutlineAcademicCap,
    title: 'Academic Distinction',
    desc: 'Uncompromising pedagogical standards blending theoretical rigor with practical mastery across arts and sciences.',
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Unwavering Integrity',
    desc: 'Instilling ethical courage, honesty, and accountability in every student, preparing upright future citizens.',
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50'
  },
  {
    icon: HiOutlineLightBulb,
    title: 'Innovation & Curiosity',
    desc: 'Fostering deep inquiry, algorithmic creativity, and a spirit of continuous experimentation from the earliest years.',
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
  },
  {
    icon: HiOutlineHeart,
    title: 'Empathy & Inclusivity',
    desc: 'Cultivating compassion, community service, emotional intelligence, and respect for diverse cultural backgrounds.',
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50'
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Global Citizenship',
    desc: 'Empowering students with international perspectives, multilingual capability, and awareness of global challenges.',
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50'
  },
  {
    icon: HiOutlineTrophy,
    title: 'Competitive Spirit',
    desc: 'Encouraging healthy sportsmanship, resilience in defeat, and tireless dedication to personal bests in all arenas.',
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50'
  }
];

const milestones = [
  { year: '1990', title: 'Foundation & Genesis', desc: 'The Educator School was established with 45 students and a bold vision for progressive education.' },
  { year: '2002', title: 'Cambridge Accreditation', desc: 'Officially recognized by Cambridge Assessment International Education for O-Level & IGCSE.' },
  { year: '2012', title: 'Smart Campus Expansion', desc: 'Inaugurated our flagship 12-acre campus featuring state-of-the-art sports arenas and digital science wings.' },
  { year: '2020', title: 'AI & Robotics Innovation Center', desc: 'Pioneered dedicated STEM incubators with robotics championships across regional and national tiers.' },
  { year: '2026', title: 'Enterprise Digital Modernization', desc: 'Deployment of seamless digital student portals, analytics-driven academic intervention, and global alumni networks.' }
];

const leaders = [
  {
    name: 'Prof. Dr. Mansoor Ali Khan',
    role: 'Executive Director & Chairman',
    degree: 'Ph.D. Education (Oxford Univ.), M.Ed. (Harvard)',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Mrs. Farzana Hameed',
    role: 'Principal - Senior School & Cambridge Wing',
    degree: 'M.Sc. Physics (QAU), Cambridge Certified Master Trainer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Engr. Bilal Hashmi',
    role: 'Head of STEM & Digital Innovation',
    degree: 'MS Computer Systems (Stanford), IEEE Senior Member',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Dr. Samina Rizvi',
    role: 'Head of Student Welfare & Counseling',
    degree: 'Ph.D. Child Psychology (UCL), Certified Behavioral Specialist',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80'
  }
];

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            Our Heritage & Purpose
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Nurturing Visionary Thinkers for Over 35 Years
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            At The Educator School, education is not merely a curriculum; it is a life-transforming journey 
            of intellectual curiosity, moral grounding, and limitless potential.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white shadow-soft-xl space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <HiOutlineLightBulb className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold">Our Noble Mission</h2>
            <p className="text-sm text-primary-100 leading-relaxed">
              To cultivate an inclusive, high-achievement learning ecosystem that challenges students 
              to attain their utmost academic potential, instills moral integrity, and equips them with the 
              critical problem-solving skills needed to lead in a complex global society.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#131D31] border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white shadow-soft-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <HiOutlineSparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold">Our Global Vision</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To be nationally recognized and internationally celebrated as a beacon of pedagogical innovation, 
              where every graduate steps into world-renowned universities with intellectual rigor, compassionate empathy, 
              and the confidence to pioneer positive global change.
            </p>
          </div>

        </div>
      </section>

      {/* Principal's Address */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#131D31] border border-slate-200/80 dark:border-slate-800 shadow-soft-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-4 text-center lg:text-left space-y-4">
              <div className="relative mx-auto lg:mx-0 w-48 h-56 sm:w-60 sm:h-72 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
                  alt="Principal Mrs. Farzana Hameed"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mrs. Farzana Hameed</h3>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">Principal & Head of Academics</p>
                <p className="text-[11px] text-slate-400">M.Sc., Cambridge Certified Master Trainer</p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase">
                <HiOutlineCheckBadge className="w-4 h-4 text-primary-500" />
                Principal's Message
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                "We don't simply teach subjects; we inspire young minds to question, discover, and lead."
              </h2>
              <p>
                Dear Parents, Students, and Friends of The Educator School,
              </p>
              <p>
                Since our inception, we have held steadfast to the belief that every young child possesses boundless curiosity. 
                Our mission as educators is not to pour knowledge into passive listeners, but to ignite a lifelong fire for learning. 
                Whether in our cutting-edge AI labs, on the cricket pitch, or in our debating arenas, we challenge each student to aim higher.
              </p>
              <p>
                We look forward to welcoming you into our warm, vibrant, and forward-looking academic family.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            Our Guiding Pillars
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Core Values That Define Our Culture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-soft-xl ${v.color} space-y-3`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-xs flex items-center justify-center">
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Historical Milestones */}
      <section className="bg-slate-50 dark:bg-[#0B1120]/60 border-y border-slate-200/80 dark:border-slate-800 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Legacy of Growth
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Key Milestones in Our Journey</h2>
          </div>

          <div className="relative border-l-2 border-primary-500/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-primary-500 group-hover:scale-125 transition-transform" />
                <div className="p-5 rounded-2xl bg-white dark:bg-[#131D31] border border-slate-200/70 dark:border-slate-800 shadow-soft">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300">
                    {m.year}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">{m.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Advisory Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            School Governance
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Senior Leadership & Board</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((lead, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-[#131D31] border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-xl transition-all space-y-3 text-center"
            >
              <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-primary-500/20">
                <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lead.name}</h4>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{lead.role}</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">{lead.degree}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-4">
          <h3 className="text-2xl font-bold">Discover More About Life at The Educator School</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Explore our state-of-the-art sports facilities, specialized science labs, or book a consultation with our counselors.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/facilities">
              <Button size="md" className="bg-primary-600 hover:bg-primary-700">Explore Campus Facilities</Button>
            </Link>
            <Link to="/admissions">
              <Button size="md" variant="outline" className="border-white/30 text-white">Enrollment Criteria</Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
