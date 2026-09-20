import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronDown,
  HiOutlineMagnifyingGlass,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineSparkles
} from 'react-icons/hi2';
import Button from '../../components/common/Button';

const faqCategories = [
  { id: 'all', label: 'All Questions' },
  { id: 'admissions', label: 'Admissions & Enrollment' },
  { id: 'academic', label: 'Curriculum & Cambridge CAIE' },
  { id: 'fee', label: 'Fees & Scholarships' },
  { id: 'facilities', label: 'Transport & Safety' },
  { id: 'cocurricular', label: 'Sports & Societies' }
];

const faqs = [
  {
    cat: 'admissions',
    q: 'When do admissions open for the upcoming academic session?',
    a: 'Admissions for the upcoming session open in January for Early Years & Primary, and in August for Cambridge O/A-Levels and Matriculation. Early registration is recommended due to strictly capped class limits.'
  },
  {
    cat: 'admissions',
    q: 'What is the format of the student admission assessment?',
    a: 'For Early Years, assessment is conducted as a relaxed sensory interaction. For Grades 1 through 8, a written evaluation covers English language proficiency, Mathematics fundamentals, and Urdu. For Cambridge and Matriculation, diagnostic papers evaluate analytical problem-solving in sciences and mathematics.'
  },
  {
    cat: 'admissions',
    q: 'Can a student transfer mid-term from another school system?',
    a: 'Yes, subject to seat vacancy in the requested class and verification of official School Leaving / Transfer Certificates with progressive academic report cards.'
  },
  {
    cat: 'academic',
    q: 'How does The Educator School prepare students for Cambridge O & A Levels?',
    a: 'We are an officially accredited Cambridge CAIE institution. Our faculty undergoes continuous British Council subject enrichment. Students complete topical past papers from Grade 9 onwards, followed by intensive mock exam simulations.'
  },
  {
    cat: 'academic',
    q: 'What STEM and Robotics education is included in the curriculum?',
    a: 'Beginning from Grade 3, every student receives weekly scheduled sessions in our dedicated STEM & Robotics Innovation Lab covering Scratch programming, Python, Arduino micro-controllers, and AI logic.'
  },
  {
    cat: 'academic',
    q: 'What is the student-to-teacher ratio in classrooms?',
    a: 'Our school maintains a strict 15:1 average student-to-teacher ratio, with maximum class sizes capped at 22-25 students to guarantee individual pedagogical attention.'
  },
  {
    cat: 'fee',
    q: 'What digital payment methods are accepted for tuition fees?',
    a: 'Fee vouchers can be settled via 1Link, Kuickpay, mobile banking apps (JazzCash, Easypaisa, Nayapay), online portal credit/debit card gateway, or at any partner commercial bank branch across Pakistan.'
  },
  {
    cat: 'fee',
    q: 'Are merit-based scholarships and sibling kinship discounts available?',
    a: 'Yes. We provide up to 100% tuition scholarships for students securing 90%+ in board exams or straight A* in Cambridge mocks. A 20% kinship discount applies automatically to the second child, and 30% for third and subsequent siblings.'
  },
  {
    cat: 'facilities',
    q: 'How secure is the school campus and what monitoring systems are in place?',
    a: 'Our campus is secured with 24/7 biometric turnstile access, armed security guards, and 350+ CCTV cameras continuously monitored by an operations control room. Visitors must present original CNICs for electronic pass issuance.'
  },
  {
    cat: 'facilities',
    q: 'What safety measures exist on school transport buses?',
    a: 'All 30+ school buses feature GPS live-tracking accessible via the parent portal, onboard CCTV, first-aid kits, speed regulators, and female attendants present on all junior routes.'
  },
  {
    cat: 'cocurricular',
    q: 'Which sports and extracurricular activities are available for students?',
    a: 'Students can join our Cricket Academy, FIFA-turf Football League, Olympic Swimming Squad, Badminton, Table Tennis, Model United Nations, Parliamentary Debating Society, Science Olympiad, and Dramatics Guild.'
  }
];

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(null);

  const filteredFaqs = faqs.filter(f => {
    const matchCat = activeCat === 'all' || f.cat === activeCat;
    const matchSearch = f.q.toLowerCase().includes(search.toLowerCase()) ||
                        f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            Support & Knowledge Base
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Find immediate answers to inquiries regarding admissions, fee structures, 
            academic curricula, campus transport, and student welfare policies.
          </p>
        </div>
      </section>

      {/* Category Pills and Search */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type your question or keyword (e.g. fees, transport, cambridge, scholarship)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCat === cat.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#131D31] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-primary-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <HiOutlineQuestionMarkCircle className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm">No matching questions found for "{search}".</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131D31] overflow-hidden shadow-soft transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-4 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between hover:text-primary-600 dark:hover:text-primary-400 gap-4"
              >
                <span>{faq.q}</span>
                <HiOutlineChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openIdx === idx ? 'rotate-180 text-primary-500' : ''
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-3.5 leading-relaxed bg-slate-50/50 dark:bg-slate-900/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Still Have Questions Box */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-primary-600 to-indigo-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Have a specific question not covered here?</h3>
            <p className="text-xs sm:text-sm text-primary-100 max-w-md leading-relaxed">
              Our academic advisors and registrar team are happy to assist with detailed queries.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap gap-3">
            <Link to="/contact">
              <Button size="md" className="bg-white text-primary-900 hover:bg-slate-100 font-bold">
                Contact Helpdesk
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
