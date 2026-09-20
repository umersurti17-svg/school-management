import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import StudentForm from '../../components/students/StudentForm';
import Loader from '../../components/common/Loader';
import { HiOutlineArrowLeft, HiOutlineExclamation } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function EditStudentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoading(true);
        const data = await studentService.getStudentById(id);
        if (!data) throw new Error('Student not found');
        setStudent(data);
      } catch (err) {
        console.error(err);
        setErrorBanner('Failed to load student information.');
      } finally {
        setLoading(false);
      }
    }
    loadStudent();
  }, [id]);

  const handleSubmit = async (formData, avatarFile) => {
    try {
      setSaving(true);
      setErrorBanner('');
      await studentService.updateStudent(id, formData, avatarFile);
      toast.success(`Student "${formData.name}" updated successfully!`);
      navigate(`/students/${id}`);
    } catch (err) {
      console.error(err);
      const errorMessage = err.message || 'Failed to update student profile.';
      setErrorBanner(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <Loader size="lg" text="Loading student record..." />
      </div>
    );
  }

  if (errorBanner && !student) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto">
          <HiOutlineExclamation className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Student Record Not Found
        </h2>
        <p className="text-sm text-gray-500">
          The requested student could not be located in the school database.
        </p>
        <Link
          to="/students"
          className="inline-block px-4 py-2 rounded-xl bg-primary-600 text-white font-medium text-sm"
        >
          Back to Student Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/students/${id}`}
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          title="Back to Student Profile"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Student Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Updating records for <strong className="text-gray-900 dark:text-white">{student?.name}</strong> ({student?.rollNumber})
          </p>
        </div>
      </div>

      {errorBanner && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span>{errorBanner}</span>
        </div>
      )}

      {/* Form with preloaded data */}
      <StudentForm
        initialData={student}
        isEditing={true}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
