import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HiOutlineShieldExclamation, HiOutlineHome, HiOutlineLogout } from 'react-icons/hi';
import Button from '../components/common/Button';
import { capitalize } from '../utils/helpers';

export default function UnauthorizedPage() {
  const { role, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiOutlineShieldExclamation className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          403 — Access Denied
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          You are currently signed in as <span className="font-semibold text-primary-600 dark:text-primary-400">{capitalize(role || 'guest')}</span>, which does not have permission to view this module.
        </p>

        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          If you believe this is a mistake, please contact the School Administrator to update your role permissions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard" className="flex-1">
            <Button variant="primary" icon={HiOutlineHome} className="w-full">
              Go to Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            icon={HiOutlineLogout}
            onClick={signOut}
            className="flex-1"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
