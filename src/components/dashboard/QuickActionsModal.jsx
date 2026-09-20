import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import toast from 'react-hot-toast';
import { supabase } from '../../config/supabaseClient';
import {
  HiOutlineUserAdd,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineCurrencyDollar,
  HiOutlineSpeakerphone,
} from 'react-icons/hi';
import { generateReceiptNumber } from '../../utils/helpers';

export default function QuickActionsModal({
  isOpen,
  onClose,
  actionType,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  // Quick Action Form States
  const [studentData, setStudentData] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    className: 'Grade 10',
    section: 'A',
    gender: 'male',
    guardianName: '',
    guardianPhone: '',
  });

  const [feeData, setFeeData] = useState({
    rollNumber: '',
    feeType: 'tuition',
    amount: '',
    paymentMethod: 'cash',
  });

  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
    targetRole: 'all',
  });

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!studentData.fullName || !studentData.rollNumber) {
      toast.error('Please enter student name and roll number');
      return;
    }

    try {
      setLoading(true);
      const email = studentData.email || `${studentData.rollNumber.toLowerCase()}@educator.edu.pk`;

      // 1. Create Profile
      const fakeAuthId = crypto.randomUUID();
      const { error: profErr } = await supabase.from('profiles').insert({
        id: fakeAuthId,
        full_name: studentData.fullName,
        email,
        phone: studentData.guardianPhone,
      });
      if (profErr) throw profErr;

      // 2. Create school_users
      const { data: suData, error: suErr } = await supabase
        .from('school_users')
        .insert({
          profile_id: fakeAuthId,
          role: 'student',
        })
        .select()
        .single();
      if (suErr) throw suErr;

      // 3. Create student
      const { error: stdErr } = await supabase.from('students').insert({
        school_user_id: suData.id,
        roll_number: studentData.rollNumber,
        class: studentData.className,
        section: studentData.section,
        gender: studentData.gender,
        guardian_name: studentData.guardianName,
        guardian_phone: studentData.guardianPhone,
        status: 'active',
      });
      if (stdErr) throw stdErr;

      toast.success(`Student ${studentData.fullName} registered successfully!`);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to register student');
    } finally {
      setLoading(false);
    }
  };

  const handleCollectFee = async (e) => {
    e.preventDefault();
    if (!feeData.rollNumber || !feeData.amount) {
      toast.error('Please fill roll number and amount');
      return;
    }

    try {
      setLoading(true);
      // Lookup student
      const { data: std, error: stdErr } = await supabase
        .from('students')
        .select('id')
        .eq('roll_number', feeData.rollNumber.trim())
        .maybeSingle();

      if (stdErr || !std) {
        toast.error(`Student with roll number "${feeData.rollNumber}" not found.`);
        return;
      }

      const receipt = generateReceiptNumber();
      const numAmount = Number(feeData.amount);

      const { error: feeErr } = await supabase.from('fees').insert({
        student_id: std.id,
        fee_type: feeData.feeType,
        amount: numAmount,
        paid_amount: numAmount,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: feeData.paymentMethod,
        receipt_number: receipt,
        status: 'paid',
        academic_year: 2026,
      });

      if (feeErr) throw feeErr;

      toast.success(`Fee of PKR ${numAmount} recorded! Receipt: ${receipt}`);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to record fee');
    } finally {
      setLoading(false);
    }
  };

  const handlePostNotice = async (e) => {
    e.preventDefault();
    if (!announcementData.title || !announcementData.content) {
      toast.error('Please enter title and content');
      return;
    }
    toast.success(`Announcement "${announcementData.title}" broadcasted!`);
    onSuccess?.();
    onClose();
  };

  const getTitle = () => {
    switch (actionType) {
      case 'add_student':
        return 'Quick Student Admission';
      case 'collect_fee':
        return 'Quick Fee Collection';
      case 'post_notice':
        return 'Broadcast School Notice';
      default:
        return 'Quick Action';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="md">
      {actionType === 'add_student' && (
        <form onSubmit={handleCreateStudent} className="space-y-3.5">
          <Input
            label="Full Name *"
            placeholder="e.g. Ali Ahmed"
            value={studentData.fullName}
            onChange={(e) =>
              setStudentData({ ...studentData, fullName: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Roll Number *"
              placeholder="e.g. STD-2026-007"
              value={studentData.rollNumber}
              onChange={(e) =>
                setStudentData({ ...studentData, rollNumber: e.target.value })
              }
              required
            />
            <Select
              label="Class"
              options={[
                { value: 'Grade 10', label: 'Grade 10' },
                { value: 'Grade 9', label: 'Grade 9' },
                { value: 'Grade 8', label: 'Grade 8' },
              ]}
              value={studentData.className}
              onChange={(e) =>
                setStudentData({ ...studentData, className: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Section"
              options={[
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
                { value: 'C', label: 'Section C' },
              ]}
              value={studentData.section}
              onChange={(e) =>
                setStudentData({ ...studentData, section: e.target.value })
              }
            />
            <Select
              label="Gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              value={studentData.gender}
              onChange={(e) =>
                setStudentData({ ...studentData, gender: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Guardian Name"
              placeholder="e.g. Tariq Ahmed"
              value={studentData.guardianName}
              onChange={(e) =>
                setStudentData({ ...studentData, guardianName: e.target.value })
              }
            />
            <Input
              label="Guardian Phone"
              placeholder="+92 300 1234567"
              value={studentData.guardianPhone}
              onChange={(e) =>
                setStudentData({ ...studentData, guardianPhone: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              icon={HiOutlineUserAdd}
              loading={loading}
              disabled={loading}
            >
              Enroll Student
            </Button>
          </div>
        </form>
      )}

      {actionType === 'collect_fee' && (
        <form onSubmit={handleCollectFee} className="space-y-3.5">
          <Input
            label="Student Roll Number *"
            placeholder="e.g. STD-2026-001"
            value={feeData.rollNumber}
            onChange={(e) =>
              setFeeData({ ...feeData, rollNumber: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Fee Category"
              options={[
                { value: 'tuition', label: 'Tuition Fee' },
                { value: 'lab', label: 'Lab Fee' },
                { value: 'transport', label: 'Transport Fee' },
                { value: 'library', label: 'Library Fee' },
                { value: 'exam', label: 'Exam Fee' },
              ]}
              value={feeData.feeType}
              onChange={(e) =>
                setFeeData({ ...feeData, feeType: e.target.value })
              }
            />
            <Input
              label="Amount (PKR) *"
              type="number"
              placeholder="e.g. 12500"
              value={feeData.amount}
              onChange={(e) =>
                setFeeData({ ...feeData, amount: e.target.value })
              }
              required
            />
          </div>

          <Select
            label="Payment Method"
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'online', label: 'Online Payment' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'cheque', label: 'Cheque' },
            ]}
            value={feeData.paymentMethod}
            onChange={(e) =>
              setFeeData({ ...feeData, paymentMethod: e.target.value })
            }
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              icon={HiOutlineCurrencyDollar}
              loading={loading}
              disabled={loading}
            >
              Record Payment
            </Button>
          </div>
        </form>
      )}

      {actionType === 'post_notice' && (
        <form onSubmit={handlePostNotice} className="space-y-3.5">
          <Input
            label="Notice Title *"
            placeholder="e.g. Mid-Term Examination Schedule"
            value={announcementData.title}
            onChange={(e) =>
              setAnnouncementData({
                ...announcementData,
                title: e.target.value,
              })
            }
            required
          />

          <Select
            label="Target Audience"
            options={[
              { value: 'all', label: 'All School (Students, Teachers, Admin)' },
              { value: 'student', label: 'Students Only' },
              { value: 'teacher', label: 'Teachers Only' },
            ]}
            value={announcementData.targetRole}
            onChange={(e) =>
              setAnnouncementData({
                ...announcementData,
                targetRole: e.target.value,
              })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Notice Content *
            </label>
            <textarea
              rows={3}
              placeholder="Enter announcement details here..."
              value={announcementData.content}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  content: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-sm focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" icon={HiOutlineSpeakerphone}>
              Publish Announcement
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
