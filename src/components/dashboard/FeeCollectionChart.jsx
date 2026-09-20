import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/helpers';

export default function FeeCollectionChart({ data = [], loading = false }) {
  const isDataEmpty =
    !data ||
    data.length === 0 ||
    data.every((d) => (!d.collected || d.collected === 0) && (!d.pending || d.pending === 0));

  const fallbackData = [
    { name: 'Jan', collected: 0, pending: 0 },
    { name: 'Feb', collected: 0, pending: 0 },
    { name: 'Mar', collected: 0, pending: 0 },
    { name: 'Apr', collected: 0, pending: 0 },
    { name: 'May', collected: 0, pending: 0 },
    { name: 'Jun', collected: 0, pending: 0 },
  ];

  const chartData = !data || data.length === 0 ? fallbackData : data;

  return (
    <Card
      title="Fee Revenue & Dues"
      subtitle="Total collected payments vs pending balances (PKR)"
      className="h-full relative overflow-hidden"
      hoverable
    >
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="h-48 w-full skeleton-shimmer rounded-xl" />
        </div>
      ) : (
        <div className="h-64 w-full pt-2 relative">
          {/* Subtle Empty State Overlay when no fee data recorded */}
          {isDataEmpty && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 dark:bg-[#131D31]/75 backdrop-blur-[2px] rounded-xl text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 shadow-sm border border-indigo-200/50 dark:border-indigo-800/50">
                <HiOutlineCurrencyDollar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No Fee Records Available
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                Monthly revenue and collection vs dues trends will appear once invoices and payments are issued.
              </p>
            </div>
          )}

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `Rs ${val / 1000}k`}
              />
              <Tooltip
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                formatter={(val) => [formatCurrency(val), '']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  padding: '10px 14px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                iconType="circle"
              />
              <Bar
                dataKey="collected"
                name="Collected"
                fill="#4F46E5"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                fill="#FBBF24"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
