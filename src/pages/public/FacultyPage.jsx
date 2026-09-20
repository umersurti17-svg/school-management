import React, { useState } from 'react';
import {
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineEnvelope,
  HiOutlineBriefcase,
  HiOutlineStar,
  HiOutlineMagnifyingGlass
} from 'react-icons/hi2';

const facultyMembers = [
  {
    name: 'Mrs. Farzana Hameed',
    role: 'Head of Senior School & Principal',
    department: 'Administration & Sciences',
    qualification: 'M.Sc. Physics (QAU), Cambridge Master Trainer',
    experience: '22+ Years Experience',
    bio: 'Pioneered Cambridge physics laboratory practical guidelines; recipient of National Best Educator Citation.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    tags: ['Physics', 'Leadership', 'Curriculum']
  },
  {
    name: 'Dr. Tariq Jamil Abbasi',
    role: 'Lead Senior Faculty - Chemistry & Biology',
    department: 'Sciences & Labs',
    qualification: 'Ph.D. Organic Chemistry (Manchester Univ.)',
    experience: '18+ Years Experience',
    bio: 'Published author of 14 peer-reviewed science education journals and mentor to top national biology Olympiad winners.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    tags: ['Chemistry', 'Olympiad', 'Pre-Med']
  },
  {
    name: 'Engr. Bilal Hashmi',
    role: 'Director of STEM & Computer Sciences',
    department: 'Mathematics & Computing',
    qualification: 'MS Computer Systems (Stanford), BS EE',
    experience: '14+ Years Experience',
    bio: 'Lead coach for First Lego League Robotics Champions 2024; specializes in Python, C++, and AI literacy.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    tags: ['AI & Robotics', 'Python', 'Algorithms']
  },
  {
    name: 'Mrs. Saima Rehman',
    role: 'Chairperson - Department of English & Literature',
    department: 'Humanities & Languages',
    qualification: 'M.A. English Literature (Kinnaird), CELTA Certified',
    experience: '16+ Years Experience',
    bio: 'Chief Parliamentary Debate Adjudicator and supervisor for Cambridge IGCSE English Language distinction holders.',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80',
    tags: ['Literature', 'Debates', 'Creative Writing']
  },
  {
    name: 'Mr. Zulfiqar Haider',
    role: 'Senior Master - Pure Mathematics',
    department: 'Mathematics & Computing',
    qualification: 'M.Phil Mathematics (LUMS), B.Ed',
    experience: '15+ Years Experience',
    bio: 'Renowned for simplifying advanced calculus and algebraic modeling; multiple world distinction producing tutor.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    tags: ['Calculus', 'Algebra', 'Mechanics']
  },
  {
    name: 'Ms. Aiman Zahra',
    role: 'Head of Early Years Foundation & Montessori',
    department: 'Early Childhood',
    qualification: 'M.Ed. Early Childhood Development (UCL), AMI Diploma',
    experience: '11+ Years Experience',
    bio: 'Expert in sensory integration, linguistic phonics progression, and positive behavioral reinforcement for toddlers.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    tags: ['Montessori', 'Phonics', 'Child Psychology']
  },
  {
    name: 'Captain (R) Nadeem Afzal',
    role: 'Director of Athletics & Sports Academy',
    department: 'Sports & Physical Training',
    qualification: 'Master of Physical Education, Ex-Army Sports Corps',
    experience: '20+ Years Experience',
    bio: 'State-certified coach leading school football and cricket squads to 8 inter-collegiate championship cups.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    tags: ['Athletics', 'Football', 'Discipline']
  },
  {
    name: 'Dr. Samina Rizvi',
    role: 'Chief Student Counselor & Psychologist',
    department: 'Student Welfare & Support',
    qualification: 'Ph.D. Clinical Psychology, Certified Youth Counselor',
    experience: '13+ Years Experience',
    bio: 'Dedicated to student mental resilience, stress management, university career alignment, and parental guidance.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    tags: ['Counseling', 'Wellbeing', 'Advisory']
  }
];

export default function FacultyPage() {
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = ['All', 'Sciences & Labs', 'Mathematics & Computing', 'Humanities & Languages', 'Early Childhood', 'Sports & Physical Training'];

  const filteredFaculty = facultyMembers.filter((fac) => {
    const matchDept = selectedDept === 'All' || fac.department === selectedDept;
    const matchSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fac.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fac.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            Our Mentors & Educators
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Distinguished Faculty & Academic Leaders
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Our teachers are world-class subject masters, authors, researchers, and compassionate mentors 
            dedicated to unlocking every student's finest potential.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDept === dept
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-[#131D31] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-primary-500'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </section>

      {/* Faculty Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFaculty.map((fac, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#131D31] rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-soft hover:shadow-soft-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover object-top transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {fac.experience}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{fac.name}</h3>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">{fac.role}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{fac.qualification}</p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {fac.bio}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {fac.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-semibold text-primary-600 dark:text-primary-400">
                Department of {fac.department}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
