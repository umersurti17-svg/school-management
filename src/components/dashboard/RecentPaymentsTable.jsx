import { Link, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { HiOutlineCurrencyDollar, HiOutlineArrowNarrowRight, HiOutlineCreditCard } from 'react-icons/hi';
import { formatCurrency, formatDate, capitalize } from '../../utils/helpers';

export default function RecentPaymentsTable({ payments = [], loading = false }) {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'partial':
        return 'yellow';
      case 'pending':
        return 'blue';
      case 'overdue':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Card
      title="Recent Fee Payments"
      subtitle="Latest collected transactions and student dues"
      actions={
        <Link
          to="/fees"
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 inline-flex items-center gap-1"
        >
          View All <HiOutlineArrowNarrowRight className="w-3.5 h-3.5" />
        </Link>
      }
      noPadding
    >
      {loading ? (
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center animate-pulse">
              <div className="space-y-1.5 w-1/3">
                <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={HiOutlineCurrencyDollar}
          title="No recent payments"
          message="No payment transactions recorded yet. Generate invoices or record student fees."
          actionLabel="Manage Fees"
          actionIcon={HiOutlineCreditCard}
          onAction={() => navigate('/fees')}
          compact
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 uppercase font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Receipt / Type</th>
                <th className="px-5 py-3">Paid Amount</th>
                <th className="px-5 py-3">Method / Date</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                        {payment.studentName}
                      </p>
                      {(payment.receiptNumber?.startsWith('DEMO-') || payment.studentName?.includes('(Demo)')) && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          Demo Data
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {payment.rollNumber} • {payment.class}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-mono text-gray-800 dark:text-gray-200 font-medium">
                      {payment.receiptNumber}
                    </p>
                    <p className="text-[11px] text-gray-500 capitalize">
                      {payment.feeType} Fee
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatCurrency(payment.paidAmount)}
                    </span>
                    {payment.paidAmount < payment.amount && (
                      <p className="text-[11px] text-yellow-600 dark:text-yellow-400">
                        Due: {formatCurrency(payment.amount - payment.paidAmount)}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      {capitalize(payment.paymentMethod?.replace('_', ' '))}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {formatDate(payment.paymentDate)}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Badge
                      text={payment.status}
                      color={getStatusColor(payment.status)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
