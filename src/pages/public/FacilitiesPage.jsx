import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineBuildingOffice2,
  HiOutlineBeaker,
  HiOutlineComputerDesktop,
  HiOutlineBookOpen,
  HiOutlineTrophy,
  HiOutlineShieldCheck,
  HiOutlineHeart,
  HiOutlineTruck,
  HiOutlineSparkles,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import Button from '../../components/common/Button';

const facilities = [
  {
    title: 'Advanced Science Research Labs',
    category: 'Academics & Research',
    desc: 'Three dedicated, fully equipped laboratories for Physics, Chemistry, and Biology complying with Cambridge CAIE and BISE safety standards.',
    features: ['High-precision optical microscopes', 'Digital spectrophotometers & fume hoods', 'Individual student workstations with emergency showers'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
    icon: HiOutlineBeaker
  },
  {
    title: 'AI, Coding & Robotics Studio',
    category: 'STEM Innovation',
    desc: 'High-speed gigabit workstations equipped with Python IDEs, 3D printers, drone test cages, Arduino and Raspberry Pi hardware kits.',
    features: ['3D Modeling & rapid prototyping stations', 'Robotics obstacle competition arena', 'Fiber-optic dual redundant internet'],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    icon: HiOutlineComputerDesktop
  },
  {
    title: 'Digital Central Library & Reading Pods',
    category: 'Knowledge Hub',
    desc: 'Over 25,000 physical volumes along with digital subscriptions to JSTOR, Oxford Reference, and quiet acoustic study cubicles.',
    features: ['Automated RFID book checkout kiosks', 'Quiet discussion pods & research carrels', 'Extensive Cambridge past-paper archive'],
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80',
    icon: HiOutlineBookOpen
  },
  {
    title: 'Olympic Swimming & Multi-Sport Complex',
    category: 'Athletics & Fitness',
    desc: 'Full-size FIFA-certified astroturf football field, Olympic standard 25m heated swimming pool, basketball courts, and indoor squash courts.',
    features: ['Certified male and female lifeguard attendants', 'Floodlights for evening collegiate tournaments', 'Dedicated fitness gymnasium & changing rooms'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    icon: HiOutlineTrophy
  },
  {
    title: 'Smart Interactive Classrooms',
    category: 'Modern Pedagogy',
    desc: 'Every classroom is equipped with 4K UHD touch interactive panels, ergonomic Herman Miller seating, and centralized climate control.',
    features: ['Ultra-short throw laser projection', 'High-fidelity audio systems for lectures', 'Air purification and continuous ventilation'],
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    icon: HiOutlineBuildingOffice2
  },
  {
    title: 'GPS-Tracked Safe Transport Fleet',
    category: 'Campus Mobility',
    desc: 'Over 30 modern, air-conditioned coaster buses traversing all city sectors with live parent GPS tracking app integration.',
    features: ['Onboard CCTV cameras & speed governors', 'Trained female conductors on all junior routes', 'Automated SMS boarding & drop-off alerts'],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    icon: HiOutlineTruck
  }
];

export default function FacilitiesPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            World-Class Infrastructure
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Campus Facilities Built for Brilliance
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Our 12-acre purpose-built campus provides safe, modern, and inspirational spaces 
            designed to stimulate curiosity, physical fitness, and technological leadership.
          </p>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {facilities.map((fac, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#131D31] border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-xl transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Image */}
            <div className={`lg:col-span-6 overflow-hidden rounded-2xl aspect-[16/10] relative shadow-md ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <img
                src={fac.image}
                alt={fac.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg">
                {fac.category}
              </div>
            </div>

            {/* Content */}
            <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                <fac.icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{fac.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{fac.desc}</p>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Specifications</p>
                {fac.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <HiOutlineSparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Safety & Medical Health Wing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-soft-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 space-y-2">
            <HiOutlineShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold">24/7 Biometric Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              350+ CCTV surveillance feeds, automated turnstile biometric access, and trained security personnel.
            </p>
          </div>
          <div className="p-4 space-y-2">
            <HiOutlineHeart className="w-8 h-8 text-rose-400 mx-auto" />
            <h4 className="text-base font-bold">On-Campus Medical Clinic</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resident full-time physician and nurse, emergency first-aid station, and tie-up with top tertiary hospitals.
            </p>
          </div>
          <div className="p-4 space-y-2">
            <HiOutlineSparkles className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold">Eco-Green Solar Campus</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              300kW rooftop solar power array with 100% uninterrupted power backup and zero carbon footprint initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Visit CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Come and See It for Yourself</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Book an in-person guided tour to walk through these facilities accompanied by our admissions dean.
        </p>
        <Link to="/contact">
          <Button size="lg" className="shadow-md">
            Schedule a Campus Tour <HiOutlineArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
