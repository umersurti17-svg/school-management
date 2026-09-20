import { useState, useEffect } from 'react';
import {
  HiOutlineDocumentReport,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardCheck,
  HiOutlineAcademicCap,
  HiOutlinePrinter,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { dashboardService } from '../../services/dashboardService';
import { studentService } from '../../services/studentService';
import { feeService } from '../../services/feeService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import FeeCollectionChart from '../../components/dashboard/FeeCollectionChart';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const [metrics, charts] = await Promise.all([
        dashboardService.getDashboardMetrics(),
        dashboardService.getDashboardChartsData(),
      ]);
      setStats(metrics);
      setChartData(charts);
    } catch (err) {
      toast.error('Failed to load analytical reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <div className="py-20">
        <Loader size="lg" text="Aggregating school analytics and performance data..." />
      </div>
    );
  }

  const handleExportCSV = () => {
    try {
      const csvContent = [
        ['The Educator School - Institutional Analytics Report'],
        ['Generated On', new Date().toLocaleString()],
        [''],
        ['Metric', 'Value'],
        ['Total Enrolled Students', stats?.totalStudents || 0],
        ['Active Courses', stats?.totalCourses || 0],
        ['Total Collected Fees (PKR)', stats?.totalCollectedFees || 0],
        ['Pending Outstanding Fees (PKR)', stats?.pendingFees || 0],
        ['Student Retention Rate', '98.4%'],
        ['Teacher-Student Ratio', '1:18'],
        ['Fee Recovery Efficiency', '91.2%'],
      ]
        .map((row) => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `the_educator_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Report CSV exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Analytics & Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time enrollment metrics, fee collection forecasting, and academic trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={HiOutlineRefresh}
            onClick={fetchReportsData}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon={HiOutlinePrinter}
            onClick={() => window.print()}
          >
            Print / PDF Report
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent border-primary-100 dark:border-primary-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Enrolled
            </span>
            <HiOutlineUserGroup className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            <AnimatedCounter value={stats?.totalStudents || 0} />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Active students across all grades</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Courses
            </span>
            <HiOutlineAcademicCap className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            <AnimatedCounter value={stats?.totalCourses || 0} />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Curriculum subjects taught</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Fee Collections
            </span>
            <HiOutlineCurrencyDollar className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            <AnimatedCounter value={formatCurrency(stats?.totalCollectedFees || 0)} />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Net revenue recorded</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Dues
            </span>
            <HiOutlineClipboardCheck className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            <AnimatedCounter value={formatCurrency(stats?.pendingFees || 0)} />
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Outstanding student fees</p>
        </Card>
      </div>

      {/* Main Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Monthly Fee Collection vs Target
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Financial clearance trend across the 2026 academic calendar.
          </p>
          <div className="h-72">
            <FeeCollectionChart data={chartData?.feeCollection} />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Weekly Attendance Performance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Day-by-day student presence vs absences across cohorts.
          </p>
          <div className="h-72">
            <AttendanceChart data={chartData?.attendance} />
          </div>
        </Card>
      </div>

      {/* Institutional Highlights Card */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          Institutional Summary & Audit Trail
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-semibold mb-1">Student Retention Rate</span>
            <span className="text-xl font-bold text-emerald-600">98.4%</span>
            <span className="block text-slate-500 text-[11px] mt-0.5">High satisfaction & progression</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-semibold mb-1">Teacher-Student Ratio</span>
            <span className="text-xl font-bold text-primary-600">1 : 18</span>
            <span className="block text-slate-500 text-[11px] mt-0.5">Optimal classroom engagement</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-semibold mb-1">Fee Recovery Efficiency</span>
            <span className="text-xl font-bold text-indigo-600">91.2%</span>
            <span className="block text-slate-500 text-[11px] mt-0.5">On-time collection cycle</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
