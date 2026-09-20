import { useState, useEffect } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  delay = 300,
  className = '',
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(query);
    }, delay);
    return () => clearTimeout(timer);
  }, [query, delay, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
      />
    </div>
  );
}
