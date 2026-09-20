import React, { useState } from 'react';
import {
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineArrowDownTray
} from 'react-icons/hi2';
import Button from '../../components/common/Button';

const events = [
  {
    id: 1,
    title: 'Cambridge O & A-Level Mid-Term Diagnostic Examinations',
    category: 'Academic & Exams',
    day: '15',
    month: 'OCT',
    year: '2026',
    time: '08:30 AM - 01:30 PM',
    venue: 'Senior Academic Examination Halls (Block A & B)',
    audience: 'Grade 9 to Grade 12 Students',
    desc: 'Comprehensive mid-session evaluations assessing CAIE syllabus milestones before final mock trials.',
    status: 'Upcoming'
  },
  {
    id: 2,
    title: 'Annual Inter-House STEM Robotics & AI Hackathon',
    category: 'Workshops & Seminars',
    day: '28',
    month: 'OCT',
    year: '2026',
    time: '09:00 AM - 04:00 PM',
    venue: 'Main Innovation Center & Arena',
    audience: 'Open to Grades 6 to 12 & Parents',
    desc: 'Teams will design, wire, and program autonomous rovers solving live disaster response maze simulations.',
    status: 'Upcoming'
  },
  {
    id: 3,
    title: 'Grand Parent-Teacher Conference (Term 1 Review)',
    category: 'Academic & Exams',
    day: '07',
    month: 'NOV',
    year: '2026',
    time: '09:00 AM - 02:00 PM',
    venue: 'Respective Classrooms & Multipurpose Auditorium',
    audience: 'All Parents & Guardians',
    desc: 'One-on-one parent feedback sessions with class subject masters, review of student portfolios, and progress targets.',
    status: 'Upcoming'
  },
  {
    id: 4,
    title: 'All-Pakistan Inter-Collegiate Cricket & Football Gala',
    category: 'Sports & Galas',
    day: '19',
    month: 'NOV',
    year: '2026',
    time: '08:00 AM - 05:00 PM',
    venue: 'School Olympic Sports Complex & Main Grounds',
    audience: 'School Teams, Alumni, & Sports Enthusiasts',
    desc: 'Annual 3-day tournament featuring 16 top school teams competing for the prestigious Educator Championship Shield.',
    status: 'Upcoming'
  },
  {
    id: 5,
    title: 'Annual Theatrical Gala & Cultural Arts Showcase',
    category: 'Cultural & Festivals',
    day: '05',
    month: 'DEC',
    year: '2026',
    time: '05:30 PM - 08:30 PM',
    venue: 'Central Air-Conditioned Auditorium',
    audience: 'All Students, Families & Faculty',
    desc: 'An enchanting evening of bilingual dramatic performances, choral symphonies, and student visual art displays.',
    status: 'Upcoming'
  },
  {
    id: 6,
    title: 'International University Admissions & Career Fair',
    category: 'Workshops & Seminars',
    day: '18',
    month: 'DEC',
    year: '2026',
    time: '10:00 AM - 03:00 PM',
    venue: 'Convention Hall & Library Plaza',
    audience: 'Senior Students (Grades 10-12) & Parents',
    desc: 'Representatives from UK, USA, Canadian, and premier Pakistani universities providing on-the-spot scholarship guidance.',
    status: 'Upcoming'
  }
];

export default function EventsPage() {
  const [filter, setFilter] = useState('All');
  const [reminders, setReminders] = useState({});

  const categories = ['All', 'Academic & Exams', 'Workshops & Seminars', 'Sports & Galas', 'Cultural & Festivals'];

  const filtered = filter === 'All'
    ? events
    : events.filter(e => e.category === filter);

  const toggleReminder = (id) => {
    setReminders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            Calendar & Happenings
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Upcoming Events & Academic Schedule
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stay synchronized with important examination dates, parent conferences, 
            sports tourneys, and science exhibitions.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#131D31] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-primary-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {filtered.map((evt) => (
          <div
            key={evt.id}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131D31] border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-xl transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
          >
            {/* Left: Date Badge & Details */}
            <div className="flex items-start sm:items-center gap-5">
              {/* Date Box */}
              <div className="w-18 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider">{evt.month}</span>
                <span className="text-2xl font-extrabold leading-none my-0.5">{evt.day}</span>
                <span className="text-[10px] text-primary-200">{evt.year}</span>
              </div>

              {/* Event Content */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200/50">
                    {evt.category}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {evt.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {evt.desc}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <HiOutlineClock className="w-3.5 h-3.5 text-primary-500" /> {evt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineMapPin className="w-3.5 h-3.5 text-emerald-500" /> {evt.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineUserGroup className="w-3.5 h-3.5 text-indigo-500" /> {evt.audience}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action: Reminder Button */}
            <div className="shrink-0 w-full md:w-auto text-right">
              <Button
                variant={reminders[evt.id] ? 'primary' : 'outline'}
                size="sm"
                className="w-full md:w-auto text-xs"
                onClick={() => toggleReminder(evt.id)}
              >
                {reminders[evt.id] ? (
                  <>
                    <HiOutlineCheckCircle className="w-4 h-4 mr-1.5 text-emerald-300" />
                    Reminder Set
                  </>
                ) : (
                  <>
                    <HiOutlineBell className="w-4 h-4 mr-1.5" />
                    Remind Me
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </section>

      {/* Download Master Calendar CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4">
          <HiOutlineCalendarDays className="w-10 h-10 text-primary-400 mx-auto" />
          <h3 className="text-2xl font-bold">Academic Session 2026 – 2027 Calendar</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Download the official term breakdown, gazetted public holidays, midterm schedule, and sports week dates in PDF format.
          </p>
          <div className="pt-2">
            <Button
              size="md"
              className="bg-primary-600 hover:bg-primary-700"
              onClick={() => alert('Official Academic Calendar 2026-2027 PDF download initiated.')}
            >
              <HiOutlineArrowDownTray className="w-4 h-4 mr-2" /> Download Calendar (PDF)
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
