import { useState, useEffect } from 'react';
import {
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlinePrinter,
  HiOutlineDocumentText,
} from 'react-icons/hi';
import { feeService } from '../../services/feeService';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function FeeStatementPage() {
  const { user, isStudent, isAdmin, isTeacher } = useAuth();

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printFee, setPrintFee] = useState(null);

  // 1. Initialize students list or student profile
  useEffect(() => {
    async function init() {
      try {
        if (isStudent && user?.id) {
          const studentProfile = await studentService.getStudentByAuthId(user.id);
          if (studentProfile) {
            setSelectedStudentId(studentProfile.id);
            setStudents([studentProfile]);
            return;
          }
        }

        const list = await studentService.getAllStudentsList();
        setStudents(list || []);
        if (list && list.length > 0) {
          setSelectedStudentId((prev) => (prev && list.some((s) => s.id === prev) ? prev : list[0].id));
        }
      } catch (err) {
        console.error('Error initializing student for fee statement:', err);
      }
    }
    init();
  }, [user, isStudent]);

  // 2. Load fee statement when selectedStudentId changes
  useEffect(() => {
    async function loadStatement() {
      if (!selectedStudentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await feeService.getStudentFeeStatement(selectedStudentId);
        setStatement(data);
      } catch (err) {
        toast.error('Failed to load fee statement');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStatement();
  }, [selectedStudentId]);

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

  if (loading) {
    return (
      <div className="py-20">
        <Loader size="lg" text="Loading your fee statement and dues..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fee Statement & Dues
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your academic fee invoices, payment history, and download official receipts.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={HiOutlinePrinter}
          onClick={() => window.print()}
        >
          Print Statement
        </Button>
      </div>

      {/* Staff / Admin Student Selector */}
      {!isStudent && students.length > 0 && (
        <Card className="p-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Select Student To Inspect Statement
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNumber}) — {s.class} ({s.section})
              </option>
            ))}
          </select>
        </Card>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Amount Paid
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <HiOutlineCheckCircle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {formatCurrency(statement?.totalPaid || 0)}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Cleared dues</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Outstanding Balance
            </span>
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <HiOutlineClock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">
            {formatCurrency(statement?.totalDue || 0)}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Payable at accounts counter</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent border-primary-100 dark:border-primary-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Billed
            </span>
            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
              <HiOutlineCurrencyDollar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {formatCurrency(statement?.totalInvoiced || 0)}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{statement?.records?.length || 0} Total invoices</p>
        </Card>
      </div>

      {/* Statement Ledger Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Fee Invoices & Receipts Ledger
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Session 2026
          </span>
        </div>

        {!statement?.records || statement.records.length === 0 ? (
          <div className="p-8 sm:p-12">
            <EmptyState
              icon={HiOutlineDocumentText}
              title="No Invoices on File"
              description="No fee charges or payment vouchers have been issued for this student account yet. Once school billing generates term invoices, they will appear here with printable receipts."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Receipt #</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Paid Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Receipt Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {statement.records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-primary-600 dark:text-primary-400">
                      {rec.receiptNumber || '—'}
                    </td>
                    <td className="py-3 px-4 capitalize font-semibold text-slate-800 dark:text-slate-200">
                      {rec.feeType} Fee
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(rec.dueDate)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(rec.amount)}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(rec.paidAmount)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(rec.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setPrintFee(rec)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                      >
                        <HiOutlineDocumentText className="w-4 h-4" />
                        <span>View Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Slip Modal */}
      <Modal
        isOpen={!!printFee}
        onClose={() => setPrintFee(null)}
        title="Fee Deposit Slip"
      >
        {printFee && (
          <div className="space-y-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 text-slate-900 dark:text-white text-xs">
              <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="font-extrabold text-base text-primary-600">The Educator School</h4>
                <p className="text-slate-500 text-[11px]">Fee Deposit Slip</p>
                <div className="mt-1 font-mono font-bold text-slate-700 dark:text-slate-300">
                  Slip #{printFee.receiptNumber}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Fee Category:</span>
                  <span className="font-bold capitalize">{printFee.feeType} Fee</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Due Date:</span>
                  <span className="font-semibold">{formatDate(printFee.dueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Billed:</span>
                  <span className="font-bold">{formatCurrency(printFee.amount)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span className="font-bold">Paid:</span>
                  <span className="font-bold">{formatCurrency(printFee.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-600 border-t border-slate-100 dark:border-slate-800 pt-1">
                  <span className="font-bold">Remaining Due:</span>
                  <span className="font-bold">{formatCurrency(printFee.dueAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPrintFee(null)}>
                Close
              </Button>
              <Button variant="primary" icon={HiOutlinePrinter} onClick={() => window.print()}>
                Print Slip
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
