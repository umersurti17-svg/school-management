import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HiOutlineMail, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { isValidEmail } from '../../utils/validators';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await resetPassword(email);
      setIsSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Enter your registered school email to receive reset instructions
        </p>
      </div>

      {isSent ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
            <HiOutlineCheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Check your Inbox
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            We have sent password recovery instructions to <strong className="text-gray-900 dark:text-white">{email}</strong>. Please follow the link in the email to reset your password.
          </p>
          <div className="pt-4">
            <Link to="/login">
              <Button variant="secondary" icon={HiOutlineArrowLeft} className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. user@educator.edu.pk"
            icon={HiOutlineMail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            disabled={isSubmitting}
            autoFocus
          />

          <Button
            type="submit"
            className="w-full py-3"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Send Reset Link
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
