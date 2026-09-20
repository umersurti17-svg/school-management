import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import StudentForm from '../../components/students/StudentForm';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AddStudentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  const handleSubmit = async (formData, avatarFile) => {
    try {
      setLoading(true);
      setErrorBanner('');
      const student = await studentService.createStudent(formData, avatarFile);
      toast.success(`Student "${formData.name}" admitted successfully!`);
      navigate(`/students/${student.id}`);
    } catch (err) {
      console.error(err);
      const errorMessage = err.message || 'Failed to register student. Please check all fields.';
      setErrorBanner(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/students"
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          title="Back to Students"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Register New Student
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Admit a student to The Educator School academic roster.
          </p>
        </div>
      </div>

      {errorBanner && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span>{errorBanner}</span>
        </div>
      )}

      {/* Form Component */}
      <StudentForm
        isEditing={false}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
