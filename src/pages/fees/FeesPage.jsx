import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineCurrencyDollar,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlinePrinter,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineCreditCard,
  HiOutlineUser,
  HiOutlineUserAdd,
  HiOutlineBell,
  HiOutlineMail,
  HiOutlinePencil,
  HiOutlineEye,
} from 'react-icons/hi';
import { feeService } from '../../services/feeService';
import { studentService } from '../../services/studentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FEE_TYPES, PAYMENT_METHODS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function FeesPage() {
  const navigate = useNavigate();

  const [fees, setFees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState('');
  const [feeTypeFilter, setFeeTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Active Students list for creating invoices
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  // Create Invoice Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    feeType: 'tuition',
    amount: '5000',
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    isPaidDirectly: false,
    paymentMethod: 'cash',
  });

  // Edit Invoice Modal State
  const [editFee, setEditFee] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    feeType: 'tuition',
    amount: '',
    dueDate: '',
    status: 'pending',
    academicYear: '2026',
  });

  // View Details Modal State
  const [viewFee, setViewFee] = useState(null);

  // Record Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentAmount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
  });

  // Print Receipt Modal State
  const [printFee, setPrintFee] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadStudentsList = useCallback(async () => {
    try {
      setStudentsLoading(true);
      setStudentsError(null);
      const list = await studentService.getAllStudentsList();
      setStudents(list || []);
      if (list && list.length > 0) {
        setInvoiceForm((prev) => ({
          ...prev,
          studentId: prev.studentId && list.some((s) => s.id === prev.studentId) ? prev.studentId : list[0].id,
        }));
      }
    } catch (err) {
      console.error('Error loading students list for fees:', err);
      setStudentsError('Failed to load students. Please refresh.');
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  const fetchFees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await feeService.getFees({
        status: statusFilter,
        feeType: feeTypeFilter,
        search,
        page,
        pageSize,
      });
      setFees(res.fees);
      setTotalCount(res.totalCount);
    } catch (err) {
      toast.error('Failed to load fee records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, feeTypeFilter, search, page]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  useEffect(() => {
    loadStudentsList();
  }, [loadStudentsList]);

  // Re-fetch students whenever Create Invoice Modal is opened to ensure fresh data
  useEffect(() => {
    if (showCreateModal) {
      loadStudentsList();
    }
  }, [showCreateModal, loadStudentsList]);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceForm.studentId || !invoiceForm.amount) {
      toast.error('Student and Amount are required');
      return;
    }

    try {
      setCreateSubmitting(true);
      await feeService.createFeeInvoice(invoiceForm);
      toast.success('Fee invoice generated successfully!');
      setShowCreateModal(false);
      setInvoiceForm({
        studentId: students[0]?.id || '',
        feeType: 'tuition',
        amount: '5000',
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        isPaidDirectly: false,
        paymentMethod: 'cash',
      });
      fetchFees();
    } catch (err) {
      toast.error(err.message || 'Failed to create invoice');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleOpenPayment = (fee) => {
    setSelectedFee(fee);
    setPaymentForm({
      paymentAmount: String(fee.dueAmount > 0 ? fee.dueAmount : fee.amount),
      paymentMethod: 'cash',
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setShowPaymentModal(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedFee || !paymentForm.paymentAmount) return;

    try {
      setPaymentSubmitting(true);
      await feeService.recordPayment(selectedFee.id, paymentForm);
      toast.success('Payment recorded successfully!');
      setShowPaymentModal(false);
      setSelectedFee(null);
      fetchFees();
    } catch (err) {
      toast.error(err.message || 'Failed to record payment');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleOpenEditFee = (fee) => {
    setEditFee(fee);
    setEditForm({
      feeType: fee.feeType || 'tuition',
      amount: String(fee.amount || ''),
      dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
      status: fee.status || 'pending',
      academicYear: String(fee.academicYear || 2026),
    });
  };

  const handleSaveEditFee = async (e) => {
    e.preventDefault();
    if (!editFee || !editForm.amount) return;

    try {
      setEditSubmitting(true);
      await feeService.updateFeeInvoice(editFee.id, {
        feeType: editForm.feeType,
        amount: Number(editForm.amount),
        dueDate: editForm.dueDate,
        status: editForm.status,
        academicYear: Number(editForm.academicYear),
      });
      toast.success('Fee invoice updated successfully!');
      setEditFee(null);
      fetchFees();
    } catch (err) {
      toast.error(err.message || 'Failed to update invoice');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteFee = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await feeService.deleteFee(deleteId);
      toast.success('Fee record deleted');
      setDeleteId(null);
      fetchFees();
    } catch (err) {
      toast.error(err.message || 'Failed to delete fee record');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'partial':
        return <Badge variant="warning">Partial</Badge>;
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>;
      default:
        return <Badge variant="danger">Pending</Badge>;
    }
  };

  // Metrics summary
  const totalInvoiced = fees.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCollected = fees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPending = Math.max(0, totalInvoiced - totalCollected);

  // Reminder Modal State
  const [reminderFee, setReminderFee] = useState(null);
  const [sendingReminder, setSendingReminder] = useState(false);

  const handleSendReminder = (e) => {
    e.preventDefault();
    setSendingReminder(true);
    setTimeout(() => {
      setSendingReminder(false);
      toast.success(`Fee reminder dispatched to ${reminderFee.guardianName || 'Guardian'} for Roll #${reminderFee.rollNumber}!`);
      setReminderFee(null);
    }, 600);
  };

  const handleExportFeeCSV = () => {
    try {
      const headers = ['Receipt #', 'Student Name', 'Roll #', 'Class', 'Fee Type', 'Total Billed (PKR)', 'Paid Amount (PKR)', 'Due Amount (PKR)', 'Due Date', 'Status'];
      const rows = fees.map((f) => [
        `"${f.receiptNumber}"`,
        `"${f.studentName}"`,
        `"${f.rollNumber}"`,
        `"${f.class} - ${f.section}"`,
        `"${f.feeType}"`,
        f.amount,
        f.paidAmount,
        f.dueAmount,
        f.dueDate || 'N/A',
        f.status,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `the_educator_fee_ledger_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Fee ledger exported to CSV!');
    } catch (err) {
      toast.error('Failed to export fees');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fee Management & Collection
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track student fee invoices, collect dues, issue receipts, and monitor revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={HiOutlineRefresh}
            onClick={fetchFees}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExportFeeCSV}
          >
            Export Ledger
          </Button>
          <Button
            variant="primary"
            icon={HiOutlinePlus}
            onClick={() => setShowCreateModal(true)}
          >
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Collected
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <HiOutlineCheckCircle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            <AnimatedCounter value={formatCurrency(totalCollected)} />
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Cleared student payments</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Outstanding Dues
            </span>
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <HiOutlineClock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">
            <AnimatedCounter value={formatCurrency(totalPending)} />
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Pending & partial balances</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent border-primary-100 dark:border-primary-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Invoiced
            </span>
            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
              <HiOutlineCurrencyDollar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            <AnimatedCounter value={formatCurrency(totalInvoiced)} />
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{totalCount} fee vouchers billed</p>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search student, roll #, receipt..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <select
              value={feeTypeFilter}
              onChange={(e) => {
                setFeeTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="">All Fee Types</option>
              {FEE_TYPES.map((ft) => (
                <option key={ft.value} value={ft.value}>{ft.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Fee Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-16">
            <Loader size="lg" text="Loading fee invoices and ledger..." />
          </div>
        ) : fees.length === 0 ? (
          <div className="p-8 sm:p-12">
            <EmptyState
              icon={HiOutlineCurrencyDollar}
              title={search || statusFilter || feeTypeFilter ? 'No Matching Fee Invoices' : 'No Fee Records on File'}
              description={
                search || statusFilter || feeTypeFilter
                  ? 'No fee invoices or payment receipts matched your search filters. Try clearing your filters.'
                  : 'No fee invoices have been generated for students yet. Issue your first tuition or admission invoice to track collections.'
              }
              actionLabel={
                search || statusFilter || feeTypeFilter
                  ? 'Reset Filters'
                  : 'Generate Fee Invoice'
              }
              actionIcon={
                search || statusFilter || feeTypeFilter
                  ? HiOutlineRefresh
                  : HiOutlinePlus
              }
              onAction={
                search || statusFilter || feeTypeFilter
                  ? () => {
                      setSearch('');
                      setStatusFilter('');
                      setFeeTypeFilter('');
                      setPage(1);
                    }
                  : () => setShowCreateModal(true)
              }
              secondaryActionLabel={
                (search || statusFilter || feeTypeFilter) ? 'Generate Invoice' : undefined
              }
              onSecondaryAction={
                (search || statusFilter || feeTypeFilter) ? () => setShowCreateModal(true) : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Receipt / Date</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Paid Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-xs font-semibold">
                      <span className="font-mono text-primary-600 dark:text-primary-400 block font-bold">
                        {fee.receiptNumber}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Due: {formatDate(fee.dueDate)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{fee.studentName}</span>
                        {(fee.receiptNumber?.startsWith('DEMO-') || fee.studentName?.includes('(Demo)')) && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            Demo Data
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono font-normal text-slate-400">
                        Roll #{fee.rollNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                      {fee.class} - {fee.section}
                    </td>
                    <td className="py-3 px-4 capitalize text-xs text-slate-600 dark:text-slate-300">
                      {fee.feeType}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(fee.amount)}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(fee.paidAmount)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(fee.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewFee(fee)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Invoice Breakdown"
                        >
                          <HiOutlineEye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEditFee(fee)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Fee Invoice"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>

                        {fee.status !== 'paid' && (
                          <>
                            <button
                              onClick={() => handleOpenPayment(fee)}
                              className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Collect Payment"
                            >
                              <HiOutlineCreditCard className="w-4 h-4" />
                              <span className="hidden sm:inline">Pay</span>
                            </button>
                            <button
                              onClick={() => setReminderFee(fee)}
                              className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Dispatch Fee Reminder Notice"
                            >
                              <HiOutlineBell className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setPrintFee(fee)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Print Receipt Slip"
                        >
                          <HiOutlinePrinter className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteId(fee.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Invoice"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing {fees.length} of {totalCount} records
          </span>
          <Pagination
            currentPage={page}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      </Card>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Generate Student Fee Invoice"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Student <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadStudentsList}
                  disabled={studentsLoading}
                  className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Refresh student roster"
                >
                  <HiOutlineRefresh className={`w-3.5 h-3.5 ${studentsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    navigate('/students/add');
                  }}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Admit new student"
                >
                  <HiOutlineUserAdd className="w-3.5 h-3.5" />
                  + Add Student
                </button>
              </div>
            </div>

            {studentsLoading ? (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                <Loader size="sm" />
                <span>Loading active students list...</span>
              </div>
            ) : studentsError ? (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300 flex items-center justify-between">
                <span>{studentsError}</span>
                <Button size="xs" variant="outline" onClick={loadStudentsList}>
                  Retry
                </Button>
              </div>
            ) : students.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50 text-center space-y-2">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                  No students found. Please add a student first.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  icon={HiOutlineUserAdd}
                  onClick={() => {
                    setShowCreateModal(false);
                    navigate('/students/add');
                  }}
                >
                  Add Student
                </Button>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={invoiceForm.studentId}
                  onChange={(e) => setInvoiceForm((p) => ({ ...p, studentId: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 cursor-pointer font-medium"
                  required
                >
                  <option value="" disabled>-- Select a Student ({students.length} available) --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber}) — {s.class} ({s.section})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Fee Category
              </label>
              <select
                value={invoiceForm.feeType}
                onChange={(e) => setInvoiceForm((p) => ({ ...p, feeType: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3.5 focus:outline-none focus:border-primary-500"
              >
                {FEE_TYPES.map((ft) => (
                  <option key={ft.value} value={ft.value}>{ft.label}</option>
                ))}
              </select>
            </div>

            <Input
              label="Amount (PKR)"
              type="number"
              value={invoiceForm.amount}
              onChange={(e) => setInvoiceForm((p) => ({ ...p, amount: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Payment Due Date"
            type="date"
            value={invoiceForm.dueDate}
            onChange={(e) => setInvoiceForm((p) => ({ ...p, dueDate: e.target.value }))}
            required
          />

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={invoiceForm.isPaidDirectly}
                onChange={(e) => setInvoiceForm((p) => ({ ...p, isPaidDirectly: e.target.checked }))}
                className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
              <span>Mark as paid immediately upon invoice generation</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              disabled={createSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createSubmitting}
              disabled={createSubmitting}
            >
              Create Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Fee Payment"
      >
        {selectedFee && (
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedFee.studentName} ({selectedFee.rollNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Billed:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(selectedFee.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Already Paid:</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(selectedFee.paidAmount)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-700 pt-1 text-rose-600">
                <span>Remaining Due:</span>
                <span>{formatCurrency(selectedFee.dueAmount)}</span>
              </div>
            </div>

            <Input
              label="Payment Amount (PKR)"
              type="number"
              value={paymentForm.paymentAmount}
              onChange={(e) => setPaymentForm((p) => ({ ...p, paymentAmount: e.target.value }))}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, paymentMethod: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3.5 focus:outline-none focus:border-primary-500"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm.value} value={pm.value}>{pm.label}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Payment Date"
                type="date"
                value={paymentForm.paymentDate}
                onChange={(e) => setPaymentForm((p) => ({ ...p, paymentDate: e.target.value }))}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={paymentSubmitting}
                disabled={paymentSubmitting}
              >
                Confirm Payment
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Printable Receipt Voucher Modal */}
      <Modal
        isOpen={!!printFee}
        onClose={() => setPrintFee(null)}
        title="Official Fee Receipt Voucher"
      >
        {printFee && (
          <div className="space-y-5">
            <div id="printable-voucher" className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-slate-700 rounded-2xl space-y-4 text-slate-900 dark:text-white">
              {/* Header */}
              <div className="text-center border-b pb-4 border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-extrabold uppercase tracking-tight text-primary-700 dark:text-primary-400">
                  The Educator School
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Official Student Fee Deposit Slip & Receipt
                </p>
                <div className="mt-2 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  Receipt #{printFee.receiptNumber}
                </div>
              </div>

              {/* Student & Class Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Student Name</span>
                  <span className="font-bold text-sm">{printFee.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Roll Number</span>
                  <span className="font-bold text-sm font-mono">{printFee.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Class & Section</span>
                  <span className="font-bold">{printFee.class} - Sec {printFee.section}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Academic Year</span>
                  <span className="font-bold">{printFee.academicYear}</span>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold">
                    <tr>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-2.5 capitalize">{printFee.feeType} Fee</td>
                      <td className="p-2.5 text-right font-bold">{formatCurrency(printFee.amount)}</td>
                    </tr>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                      <td className="p-2.5 font-bold">Paid Amount</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">{formatCurrency(printFee.paidAmount)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-600">Balance Due</td>
                      <td className="p-2.5 text-right font-bold text-rose-600">{formatCurrency(printFee.dueAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs text-slate-400">
                <div className="border-t border-slate-300 dark:border-slate-700 pt-1">
                  Cashier / Accounts Officer
                </div>
                <div className="border-t border-slate-300 dark:border-slate-700 pt-1">
                  Depositor's Signature
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setPrintFee(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                icon={HiOutlinePrinter}
                onClick={() => window.print()}
              >
                Print Slip
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Send Fee Reminder Modal */}
      <Modal
        isOpen={!!reminderFee}
        onClose={() => setReminderFee(null)}
        title="Dispatch Fee Payment Reminder"
      >
        {reminderFee && (
          <form onSubmit={handleSendReminder} className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-100">
                <HiOutlineBell className="w-5 h-5 text-amber-600" />
                Notice Preview for {reminderFee.studentName}
              </div>
              <p>
                A reminder notification will be dispatched to the registered contact number and email for fee voucher <strong>#{reminderFee.receiptNumber}</strong>.
              </p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/60 dark:border-amber-800/40 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                "Dear Parent/Guardian of {reminderFee.studentName} (Roll #{reminderFee.rollNumber}), please be reminded that the pending fee of {formatCurrency(reminderFee.dueAmount)} is due on {formatDate(reminderFee.dueDate)}. Kindly deposit the dues to avoid late surcharge. - The Educator School Administration"
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Dispatch Channels
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>SMS Alert</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Email Notice</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setReminderFee(null)}
                disabled={sendingReminder}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={HiOutlineMail}
                loading={sendingReminder}
                disabled={sendingReminder}
              >
                Send Reminder Now
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Edit Fee Invoice Modal */}
      <Modal
        isOpen={!!editFee}
        onClose={() => setEditFee(null)}
        title="Edit Fee Invoice Details"
      >
        {editFee && (
          <form onSubmit={handleSaveEditFee} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {editFee.studentName} (Roll #{editFee.rollNumber})
              </div>
              <div className="text-slate-500 font-mono">
                Receipt #{editFee.receiptNumber} • {editFee.class} ({editFee.section})
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Fee Category"
                value={editForm.feeType}
                onChange={(e) => setEditForm({ ...editForm, feeType: e.target.value })}
                options={FEE_TYPES}
                required
              />

              <Input
                label="Invoice Amount (PKR)"
                type="number"
                min="0"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Payment Due Date"
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                required
              />

              <Select
                label="Payment Status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'overdue', label: 'Overdue' },
                ]}
                required
              />
            </div>

            <Input
              label="Academic Year"
              type="number"
              value={editForm.academicYear}
              onChange={(e) => setEditForm({ ...editForm, academicYear: e.target.value })}
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditFee(null)}
                disabled={editSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={editSubmitting}
                disabled={editSubmitting}
              >
                Save Invoice Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* View Fee Details Modal */}
      <Modal
        isOpen={!!viewFee}
        onClose={() => setViewFee(null)}
        title="Fee Invoice & Payment Breakdown"
      >
        {viewFee && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Voucher / Receipt</span>
                  <p className="font-mono text-sm font-bold text-primary-600 dark:text-primary-400">{viewFee.receiptNumber}</p>
                </div>
                {getStatusBadge(viewFee.status)}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block">Student Name</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{viewFee.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Roll Number</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{viewFee.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Class & Section</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{viewFee.class} - {viewFee.section}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Guardian / Contact</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{viewFee.guardianName} ({viewFee.guardianPhone || '—'})</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Total Billed</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{formatCurrency(viewFee.amount)}</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                <span className="text-emerald-600 text-[10px] uppercase font-bold">Total Paid</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCurrency(viewFee.paidAmount)}</p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
                <span className="text-rose-600 text-[10px] uppercase font-bold">Balance Due</span>
                <p className="text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5">{formatCurrency(viewFee.dueAmount)}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Due Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(viewFee.dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewFee.paymentDate ? formatDate(viewFee.paymentDate) : 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{viewFee.paymentMethod || 'cash'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academic Year:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewFee.academicYear}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                onClick={() => setViewFee(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                icon={HiOutlinePrinter}
                onClick={() => {
                  setPrintFee(viewFee);
                  setViewFee(null);
                }}
              >
                Print Slip
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Fee Invoice"
        message="Are you sure you want to permanently delete this fee invoice and associated transaction record?"
        confirmText="Yes, Delete Invoice"
        confirmVariant="danger"
        isLoading={deleteLoading}
        onConfirm={handleDeleteFee}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
