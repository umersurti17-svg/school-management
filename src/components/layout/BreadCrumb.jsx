import { Link, useLocation } from 'react-router-dom';
import { HiOutlineChevronRight, HiOutlineHome } from 'react-icons/hi';
import { capitalize } from '../../utils/helpers';

export default function BreadCrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400"
      >
        <HiOutlineHome className="w-4 h-4" />
        <span>Home</span>
      </Link>

      {pathnames.map((segment, index) => {
        const path = '/' + pathnames.slice(0, index + 1).join('/');
        const isLast = index === pathnames.length - 1;

        return (
          <span key={path} className="flex items-center gap-1">
            <HiOutlineChevronRight className="w-3 h-3" />
            {isLast ? (
              <span className="text-gray-900 dark:text-white font-medium">
                {capitalize(segment.replace(/-/g, ' '))}
              </span>
            ) : (
              <Link
                to={path}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {capitalize(segment.replace(/-/g, ' '))}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
