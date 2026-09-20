import { useState, useEffect } from 'react';
import {
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
} from 'react-icons/hi';

export default function LiveClockQuoteWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quotes = [
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  ];

  // Daily rotational quote
  const quoteIndex = Math.floor((new Date().getDate()) % quotes.length);
  const todayQuote = quotes[quoteIndex];

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Live Digital Clock Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-primary-200 tracking-wider flex items-center gap-1">
            <HiOutlineClock className="w-3.5 h-3.5" /> Campus Standard Time
          </span>
          <h3 className="text-2xl font-black font-mono tracking-tight mt-0.5">
            {formattedTime}
          </h3>
          <p className="text-xs text-primary-100 mt-0.5">{formattedDate}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
          <HiOutlineCalendar className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Motivational Quote Card */}
      <div className="md:col-span-2 p-4 rounded-2xl bg-white dark:bg-[#131D31] border border-slate-200/80 dark:border-slate-800 shadow-soft flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          <HiOutlineSparkles className="w-6 h-6" />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-md">
              Quote of the Day
            </span>
            <span className="text-xs text-slate-400">— {todayQuote.author}</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 italic truncate sm:whitespace-normal">
            "{todayQuote.text}"
          </p>
        </div>
      </div>
    </div>
  );
}
