import { useState, useEffect } from 'react';
import { HiOutlineArrowUp } from 'react-icons/hi';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/30 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer animate-fade-in focus:outline-none focus:ring-4 focus:ring-primary-500/20"
      aria-label="Scroll to top of page"
      title="Scroll to top"
    >
      <HiOutlineArrowUp className="w-5 h-5" />
    </button>
  );
}
