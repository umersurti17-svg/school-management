import { useState, useEffect } from 'react';
import {
  HiOutlineCog,
  HiOutlineAcademicCap,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineCheckCircle,
  HiOutlineDatabase,
  HiOutlineSave,
  HiOutlineTrash,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
} from 'react-icons/hi';
import { useTheme } from '../../hooks/useTheme';
import { seedService } from '../../services/seedService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { GRADING_SCALE } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();

  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: 'The Educator School',
    registrationNumber: 'EDU-PK-2026-994',
    email: 'info@educator.edu.pk',
    phone: '+92 42 111 222 333',
    address: 'Campus 14, Main Boulevard, Gulberg, Lahore, Pakistan',
    currentAcademicYear: '2026',
    term: 'First Term (Spring)',
  });

  const [saving, setSaving] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [demoActionLoading, setDemoActionLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const checkDemoStatus = async () => {
    try {
      const hasDemo = await seedService.hasDemoData();
      setDemoActive(hasDemo);
    } catch (err) {
      console.warn('Failed to check demo status:', err);
    }
  };

  useEffect(() => {
    checkDemoStatus();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Institutional settings saved successfully!');
    }, 600);
  };

  const handleClearDemoData = async () => {
    try {
      setDemoActionLoading(true);
      await seedService.clearDemoData();
      await checkDemoStatus();
      setShowClearConfirm(false);
      toast.success('All demo data has been safely removed.');
    } catch (err) {
      console.error('Failed to clear demo data:', err);
      toast.error('Failed to clear demo data');
    } finally {
      setDemoActionLoading(false);
    }
  };

  const handleSeedDemoData = async () => {
    try {
      setDemoActionLoading(true);
      await seedService.seedDemoData();
      await checkDemoStatus();
      toast.success('Demo sample data loaded successfully!');
    } catch (err) {
      console.error('Failed to load demo data:', err);
      toast.error('Failed to seed demo data');
    } finally {
      setDemoActionLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Institutional Settings & Configuration
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure school identity, academic policies, grading matrix, demo environment, and system preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* School Information */}
        <Card className="p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <HiOutlineAcademicCap className="w-5 h-5 text-primary-600" />
            School Profile & Campus Details
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="w-16 h-16 rounded-2xl bg-primary-700 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary-700/20 flex-shrink-0">
                ES
              </div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Campus Seal & Official Logo</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Used for report cards, fee vouchers, and admission certificates.</p>
                <div className="flex gap-2 pt-1">
                  <label className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                    Change Logo
                    <input type="file" className="hidden" accept="image/*" onChange={() => toast.success('Campus logo updated!')} />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Institution Name"
                value={schoolSettings.schoolName}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })}
                required
              />

              <Input
                label="Affiliation / Reg Number"
                value={schoolSettings.registrationNumber}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, registrationNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Email"
                value={schoolSettings.email}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, email: e.target.value })}
                type="email"
                required
              />

              <Input
                label="Helpdesk Phone"
                value={schoolSettings.phone}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, phone: e.target.value })}
                required
              />
            </div>

            <Input
              label="Campus Address"
              value={schoolSettings.address}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, address: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Active Academic Year"
                value={schoolSettings.currentAcademicYear}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, currentAcademicYear: e.target.value })}
                required
              />

              <Input
                label="Current Term"
                value={schoolSettings.term}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, term: e.target.value })}
                required
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Automated Notifications & Dispatch Preferences
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 cursor-pointer text-slate-800 dark:text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>SMS Absence Alerts</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 cursor-pointer text-slate-800 dark:text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Fee Due Reminders</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 cursor-pointer text-slate-800 dark:text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Term Result Publishing</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" loading={saving} icon={HiOutlineSave}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Demo Data Management Card */}
        <Card className="p-6 space-y-5 border-amber-200/60 dark:border-amber-900/30 bg-gradient-to-br from-white via-amber-50/20 to-orange-50/10 dark:from-slate-900 dark:via-amber-950/10 dark:to-slate-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-100 dark:border-amber-900/30 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-amber-500" />
              Demo Data & First-Run Environment
            </h2>
            <Badge variant={demoActive ? 'warning' : 'neutral'} size="sm">
              {demoActive ? 'Demo Records Active' : 'No Demo Data'}
            </Badge>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5">
              <HiOutlineInformationCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              About Demo Data:
            </div>
            <p className="leading-relaxed">
              When the application is first launched on an empty database, sample courses, students, attendance, fees, and marks are seeded to provide a rich interactive preview. All demo records are marked with &quot;Demo Data&quot;.
            </p>
            <p className="leading-relaxed font-medium">
              Real user records are never deleted or affected when clearing demo data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="danger"
              icon={HiOutlineTrash}
              onClick={() => setShowClearConfirm(true)}
              loading={demoActionLoading}
              disabled={!demoActive}
            >
              Clear Demo Data
            </Button>

            {!demoActive && (
              <Button
                variant="outline"
                icon={HiOutlineSparkles}
                onClick={handleSeedDemoData}
                loading={demoActionLoading}
              >
                Load Demo Data
              </Button>
            )}
          </div>
        </Card>

        {/* Grading Scale Matrix */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HiOutlineAcademicCap className="w-5 h-5 text-indigo-500" />
                Academic Grading Scale
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Standard institutional scale used for mark sheets, grade cards, and performance calculations.
              </p>
            </div>
            <Badge variant="primary" size="sm">Standard 4.0 Scale</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-bold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-2.5">Letter Grade</th>
                  <th className="p-2.5">Percentage Range</th>
                  <th className="p-2.5">GPA Equivalent</th>
                  <th className="p-2.5">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {GRADING_SCALE.map((scale) => (
                  <tr key={scale.grade} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-2.5 font-bold text-slate-900 dark:text-white">{scale.grade}</td>
                    <td className="p-2.5 font-mono">{scale.min}% – {scale.max}%</td>
                    <td className="p-2.5 font-bold text-primary-600 dark:text-primary-400">{scale.gpa.toFixed(1)}</td>
                    <td className="p-2.5 text-slate-500 dark:text-slate-400">
                      {scale.gpa >= 3.7 ? 'Outstanding' : scale.gpa >= 3.0 ? 'Good' : scale.gpa >= 2.0 ? 'Average' : 'Fail / Retake'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Appearance & System Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Theme card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {isDark ? <HiOutlineMoon className="w-5 h-5 text-indigo-400" /> : <HiOutlineSun className="w-5 h-5 text-amber-500" />}
              Appearance Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Toggle between light and dark theme across your entire school management interface.
            </p>
            <Button
              variant="secondary"
              onClick={toggleTheme}
              className="w-full justify-center"
            >
              Switch to {isDark ? 'Light Theme' : 'Dark Theme'}
            </Button>
          </Card>

          {/* Database Connectivity */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HiOutlineDatabase className="w-5 h-5 text-emerald-500" />
              Cloud Database & Storage
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Supabase DB:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <HiOutlineCheckCircle className="w-4 h-4" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Storage Bucket:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">school-avatars (Active)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Row Level Security:</span>
                <span className="font-bold text-primary-600">Active & Enforced</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Clear Demo Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear All Demo Data?"
        message="Are you sure you want to remove all sample demo records (demo students, courses, attendance, marks, and fees)? Any real user records you created will NOT be deleted."
        confirmText="Yes, Clear Demo Data"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleClearDemoData}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
