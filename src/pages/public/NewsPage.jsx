import React, { useState } from 'react';
import {
  HiOutlineNewspaper,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineShare,
  HiOutlineSparkles
} from 'react-icons/hi2';
import Button from '../../components/common/Button';

const articles = [
  {
    id: 1,
    title: 'The Educator Students Secure 1st Place at National STEM Robotics Expo',
    category: 'STEM & Innovation',
    date: 'February 18, 2026',
    readTime: '3 min read',
    author: 'Editorial Desk',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    summary: 'Our 4-member robotics team engineered an autonomous disaster exploration rover with AI object detection, claiming the national championship gold.',
    content: `We are immensely proud to announce that the senior robotics squad from The Educator School has secured first position at the National Youth Robotics Olympiad held at the Pak-China Friendship Center. 

Competing against 42 prestigious institutions across the country, our student-engineered autonomous rover accomplished all obstacle navigation scenarios in record time while accurately classifying emergency supplies using computer vision models. 

The team, guided by Engr. Bilal Hashmi, was awarded a trophy, cash grant for our STEM lab, and full sponsorship for the upcoming Asia-Pacific Robotics Invitational in Singapore.`
  },
  {
    id: 2,
    title: 'Cambridge CAIE O & A-Level Distinction Holders Class of 2025 Honored',
    category: 'Student Achievements',
    date: 'February 10, 2026',
    readTime: '4 min read',
    author: 'Academic Directorate',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    summary: '14 world and national Cambridge distinctions awarded to Educator School scholars across Advanced Physics, Pure Mathematics, and Computer Science.',
    content: `Cambridge Assessment International Education (CAIE) has officially unveiled its Top in the World and Top in the Country distinction awards for the June/November 2025 examination series. 

We extend our heartiest congratulations to our 14 distinction scholars who proved once again that dedication, top-tier instructional mentoring, and analytical mastery lead to world-class outcomes.

A special honors banquet was held in their honor where the school board granted 100% university fellowship stipends to all world position holders.`
  },
  {
    id: 3,
    title: 'Circular No. 24: Term 1 Parent-Teacher Conference Schedule Released',
    category: 'Circulars & Notices',
    date: 'January 28, 2026',
    readTime: '2 min read',
    author: 'Registrar Office',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    summary: 'Important guidelines for parents regarding student progress portfolios, time slots, transport arrangements, and digital feedback submission.',
    content: `Dear Parents and Guardians, 

Please note that the Term 1 Parent-Teacher Conference is scheduled for Saturday, November 7th, 2026 from 9:00 AM to 2:00 PM. 

Parents will receive individual time appointment slots via the parent portal SMS notification. You are kindly requested to bring your child's student ID card and review the mid-term assessment scores beforehand on the portal dashboard. 

Complimentary refreshments will be served at the central cafeteria pavilion.`
  },
  {
    id: 4,
    title: 'Inauguration of New 300kW Rooftop Solar Clean Energy Array',
    category: 'Campus Updates',
    date: 'January 15, 2026',
    readTime: '3 min read',
    author: 'Campus Operations',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    summary: 'The Educator School achieves 100% green energy self-sufficiency, cutting over 240 tons of CO2 emissions annually.',
    content: `In our relentless pursuit of environmental stewardship, The Educator School has officially energized its 300kW grid-tied rooftop solar power system. 

The array powers all air-conditioned smart classrooms, computer centers, and athletic pavilion floodlights, producing zero carbon emissions during peak daytime hours.

An interactive digital energy display monitor has been installed in the main science lobby to teach students about renewable power generation in real-time.`
  },
  {
    id: 5,
    title: 'Annual Declamation & Bilingual Parliamentary Debate Championship',
    category: 'Student Achievements',
    date: 'January 05, 2026',
    readTime: '3 min read',
    author: 'Literary Society',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
    summary: 'Educator debaters lift the prestigious All-Pakistan Bilingual Trophy after thrilling final rounds on ethical AI policy.',
    content: `Over 30 collegiate debate teams from across the nation gathered at our central auditorium for the 18th Annual Bilingual Parliamentary Debate Championship. 

Following 5 intense elimination rounds analyzing contemporary economic and technological dilemmas, our Senior Urdu and English debate teams emerged victorious, bagging both Team Champions and Best Individual Speaker trophies.`
  }
];

export default function NewsPage() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = ['All', 'Circulars & Notices', 'Student Achievements', 'Campus Updates', 'STEM & Innovation'];

  const filtered = articles.filter(art => {
    const matchCat = selectedCat === 'All' || art.category === selectedCat;
    const matchSearch = art.title.toLowerCase().includes(search.toLowerCase()) ||
                        art.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            Press & Bulletins
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            School News & Official Circulars
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Read latest administrative notifications, student distinctions, 
            campus innovations, and educational milestones.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCat === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-[#131D31] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-primary-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news & circulars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </section>

      {/* News Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((art) => (
            <div
              key={art.id}
              className="bg-white dark:bg-[#131D31] rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-soft hover:shadow-soft-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    {art.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{art.date}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <HiOutlineClock className="w-3.5 h-3.5" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveArticle(art)}
                >
                  Read Full Article <HiOutlineArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#131D31] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="relative aspect-[16/9] w-full bg-slate-900">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="font-bold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                  {activeArticle.category}
                </span>
                <span>{activeArticle.date}</span>
                <span>&bull;</span>
                <span>By {activeArticle.author}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {activeArticle.title}
              </h2>

              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-800 pt-4">
                {activeArticle.content}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button variant="secondary" size="sm" onClick={() => setActiveArticle(null)}>
                  Close Article
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
