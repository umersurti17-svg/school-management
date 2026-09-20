import React, { useState } from 'react';
import {
  HiOutlinePhoto,
  HiOutlineXMark,
  HiOutlineSparkles,
  HiOutlineArrowsPointingOut
} from 'react-icons/hi2';

const galleryItems = [
  {
    id: 1,
    title: 'High-School STEM Robotics Invitational 2025',
    category: 'Science & Innovation',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    date: 'November 2025',
    desc: 'Students competing in the Autonomous Robotics Arena showcasing obstacle navigating AI rovers.'
  },
  {
    id: 2,
    title: 'Annual Sports Gala & Inter-House Athletics',
    category: 'Sports & Athletics',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    date: 'February 2026',
    desc: 'Exciting 4x100m sprint relay finals at the school Olympic athletic track.'
  },
  {
    id: 3,
    title: 'Cambridge Graduation & Honors Convocation',
    category: 'Graduations',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    date: 'May 2025',
    desc: 'Graduating Class of 2025 celebrating exceptional Cambridge O & A Level distinctions.'
  },
  {
    id: 4,
    title: 'Central Digital Science & Chemistry Discovery Lab',
    category: 'Campus Life',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    date: 'January 2026',
    desc: 'Middle school students conducting safe acid-base titration investigations.'
  },
  {
    id: 5,
    title: 'Annual Performing Arts & Theater Production',
    category: 'Annual Gala & Arts',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
    date: 'December 2025',
    desc: 'The school drama club stage production of Shakespeare at the central auditorium.'
  },
  {
    id: 6,
    title: 'Olympic 25-Meter Heated Swimming Championship',
    category: 'Sports & Athletics',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
    date: 'October 2025',
    desc: 'Inter-collegiate freestyle swimming finals at our on-campus aquatic complex.'
  },
  {
    id: 7,
    title: 'Modern Library Discussion Pods & Research Hub',
    category: 'Campus Life',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
    date: 'September 2025',
    desc: 'Collaborative group study in the central air-conditioned research pavilion.'
  },
  {
    id: 8,
    title: 'Montessori Sensory & Play Discovery Arena',
    category: 'Campus Life',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
    date: 'January 2026',
    desc: 'Early years learners exploring sensory geometry models and cooperative play.'
  },
  {
    id: 9,
    title: 'Model United Nations (EDUMUN) General Assembly',
    category: 'Annual Gala & Arts',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
    date: 'January 2026',
    desc: 'Over 400 national delegates resolving climate policy in the main auditorium.'
  }
];

export default function GalleryPage() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [activeModal, setActiveModal] = useState(null);

  const categories = ['All', 'Campus Life', 'Science & Innovation', 'Sports & Athletics', 'Annual Gala & Arts', 'Graduations'];

  const filtered = selectedCat === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCat);

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            Visual Highlights
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Life, Energy & Moments at Campus
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Browse photographs capturing scientific discovery, athletic triumphs, 
            theatrical performances, and memorable student milestones.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#131D31] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-primary-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModal(item)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-[#131D31] border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-xl transition-all"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                    <HiOutlineArrowsPointingOut className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                  {item.category}
                </div>
              </div>

              <div className="p-4 space-y-1">
                <p className="text-[11px] font-medium text-slate-400">{item.date}</p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#131D31] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="relative aspect-[16/10] w-full bg-slate-900">
              <img
                src={activeModal.image}
                alt={activeModal.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300">
                  {activeModal.category}
                </span>
                <span className="text-xs text-slate-400">{activeModal.date}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeModal.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeModal.desc}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
