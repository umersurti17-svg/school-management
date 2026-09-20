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
import { HiOutlineChartBar } from 'react-icons/hi';
import Card from '../common/Card';

export default function AttendanceChart({ data = [], loading = false }) {
  const isDataEmpty =
    !data ||
    data.length === 0 ||
    data.every((d) => (!d.present || d.present === 0) && (!d.absent || d.absent === 0) && (!d.late || d.late === 0));

  const fallbackData = [
    { day: 'Mon', present: 0, absent: 0, late: 0 },
    { day: 'Tue', present: 0, absent: 0, late: 0 },
    { day: 'Wed', present: 0, absent: 0, late: 0 },
    { day: 'Thu', present: 0, absent: 0, late: 0 },
    { day: 'Fri', present: 0, absent: 0, late: 0 },
    { day: 'Sat', present: 0, absent: 0, late: 0 },
  ];

  const chartData = !data || data.length === 0 ? fallbackData : data;

  return (
    <Card
      title="Attendance Analytics"
      subtitle="Weekly distribution across attendance categories"
      className="h-full relative overflow-hidden"
      hoverable
    >
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="h-48 w-full skeleton-shimmer rounded-xl" />
        </div>
      ) : (
        <div className="h-64 w-full pt-2 relative">
          {/* Subtle Empty State Overlay when no attendance recorded */}
          {isDataEmpty && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 dark:bg-[#131D31]/75 backdrop-blur-[2px] rounded-xl text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50">
                <HiOutlineChartBar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No Attendance Records Available
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                Weekly attendance trend charts will display automatically once classes start recording attendance.
              </p>
            </div>
          )}

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
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
                dataKey="present"
                name="Present"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="absent"
                name="Absent"
                fill="#F43F5E"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="late"
                name="Late"
                fill="#F59E0B"
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
