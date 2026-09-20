import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';
import StudentFilters from '../../components/students/StudentFilters';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  HiOutlineUserAdd,
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineDownload,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [filters, setFilters] = useState({
    classFilter: '',
    sectionFilter: '',
    statusFilter: '',
    genderFilter: '',
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    studentId: null,
    studentName: '',
    loading: false,
  });

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await studentService.getStudents({
        search: searchQuery,
        classFilter: filters.classFilter,
        sectionFilter: filters.sectionFilter,
        statusFilter: filters.statusFilter,
        genderFilter: filters.genderFilter,
        page: currentPage,
        pageSize,
      });

      setStudents(res.students);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load student list');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, currentPage]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleResetFilters = () => {
    setFilters({
      classFilter: '',
      sectionFilter: '',
      statusFilter: '',
      genderFilter: '',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleDeleteClick = (student) => {
    setDeleteDialog({
      isOpen: true,
      studentId: student.id,
      studentName: student.name,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.studentId) return;

    try {
      setDeleteDialog((prev) => ({ ...prev, loading: true }));
      await studentService.deleteStudent(deleteDialog.studentId);
      toast.success(`Student "${deleteDialog.studentName}" has been removed`);
      setDeleteDialog({ isOpen: false, studentId: null, studentName: '', loading: false });
      loadStudents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete student record');
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'gray';
      case 'graduated':
        return 'blue';
      case 'transferred':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Student Directory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage student registrations, academic placements, and profile details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={HiOutlineRefresh}
            onClick={loadStudents}
            disabled={loading}
          >
            Refresh
          </Button>

          {isAdmin && (
            <Link to="/students/add">
              <Button icon={HiOutlineUserAdd} size="sm">
                Register Student
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3">
        <SearchBar
          placeholder="Search by student name, roll number, father name, or email..."
          onSearch={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
        />

        <StudentFilters
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
          totalResults={totalCount}
        />
      </div>

      {/* 3. Students Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <Loader size="md" text="Loading student records..." />
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            icon={HiOutlineUserGroup}
            title={searchQuery || Object.values(filters).some(Boolean) ? 'No Matching Students Found' : 'No Students Registered Yet'}
            message={
              searchQuery || Object.values(filters).some(Boolean)
                ? 'No students matched your search criteria or selected filters. Try clearing your filters or changing search keywords.'
                : 'There are currently no students enrolled in the school database. Add your first student to begin managing classes, attendance, and fees.'
            }
            actionLabel={
              searchQuery || Object.values(filters).some(Boolean)
                ? 'Clear Filters'
                : isAdmin
                ? 'Enroll New Student'
                : undefined
            }
            actionIcon={
              searchQuery || Object.values(filters).some(Boolean)
                ? HiOutlineRefresh
                : HiOutlineUserAdd
            }
            onAction={
              searchQuery || Object.values(filters).some(Boolean)
                ? handleResetFilters
                : isAdmin
                ? () => navigate('/students/add')
                : undefined
            }
            secondaryActionLabel={
              (searchQuery || Object.values(filters).some(Boolean)) && isAdmin
                ? 'Enroll Student'
                : undefined
            }
            onSecondaryAction={
              (searchQuery || Object.values(filters).some(Boolean)) && isAdmin
                ? () => navigate('/students/add')
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Roll No</th>
                  <th className="px-5 py-3.5">Class / Section</th>
                  <th className="px-5 py-3.5">Father / Contact</th>
                  <th className="px-5 py-3.5">Admission Date</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    {/* Student Info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={student.name}
                          src={student.avatarUrl}
                          size="md"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              to={`/students/${student.id}`}
                              className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                              {student.name}
                            </Link>
                            {(student.rollNumber?.startsWith('DEMO-') || student.name?.includes('(Demo)')) && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                Demo Data
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-primary-700 dark:text-primary-300">
                      {student.rollNumber}
                    </td>

                    {/* Class & Section */}
                    <td className="px-5 py-3.5 text-xs text-gray-700 dark:text-gray-300">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 font-medium">
                        {student.class} - {student.section}
                      </span>
                    </td>

                    {/* Father / Contact */}
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {student.guardianName || '—'}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {student.phone || student.guardianPhone || '—'}
                      </p>
                    </td>

                    {/* Admission Date */}
                    <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(student.admissionDate)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5 text-center">
                      <Badge
                        text={student.status}
                        color={getStatusColor(student.status)}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/students/${student.id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="View Details"
                        >
                          <HiOutlineEye className="w-4 h-4" />
                        </Link>

                        {isAdmin && (
                          <>
                            <Link
                              to={`/students/${student.id}/edit`}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                              title="Edit Student"
                            >
                              <HiOutlinePencilAlt className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDeleteClick(student)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete Student"
                            >
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        title="Delete Student Record"
        message={`Are you sure you want to delete ${deleteDialog.studentName}? This will permanently remove their academic records, attendance history, and fee profile.`}
        confirmText="Yes, Delete Student"
        variant="danger"
        loading={deleteDialog.loading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
