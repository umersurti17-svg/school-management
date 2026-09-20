import { supabase } from '../config/supabaseClient';

/**
 * Dashboard Service for The Educator School
 * Interacts directly with Supabase Database tables
 */
export const dashboardService = {
  /**
   * Fetch high-level statistics for Admin Dashboard
   */
  async getAdminDashboardStats() {
    try {
      // 1. Total Students
      const { count: totalStudents, error: studentErr } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      if (studentErr) console.warn('Student count warning:', studentErr.message);

      // 2. Total Courses
      const { count: totalCourses, error: courseErr } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
      if (courseErr) console.warn('Course count warning:', courseErr.message);

      // 3. Total Teachers
      const { count: totalTeachers, error: teacherErr } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true });
      if (teacherErr) console.warn('Teacher count warning:', teacherErr.message);

      // 4. Attendance Today / Latest Attendance
      const todayStr = new Date().toISOString().split('T')[0];
      const { data: attendanceData, error: attErr } = await supabase
        .from('attendance')
        .select('status, date');
      if (attErr) console.warn('Attendance stats warning:', attErr.message);

      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;

      if (attendanceData && attendanceData.length > 0) {
        // Filter for today or latest available date
        const dates = [...new Set(attendanceData.map((a) => a.date))].sort().reverse();
        const targetDate = dates[0] || todayStr;
        const targetDayAttendance = attendanceData.filter((a) => a.date === targetDate);

        presentCount = targetDayAttendance.filter((a) => a.status === 'present').length;
        absentCount = targetDayAttendance.filter((a) => a.status === 'absent').length;
        lateCount = targetDayAttendance.filter((a) => a.status === 'late').length;
      }

      // 5. Fee Metrics (Total Collected & Pending Fees)
      const { data: feeRecords, error: feeErr } = await supabase
        .from('fees')
        .select('amount, paid_amount, status');
      if (feeErr) console.warn('Fee stats warning:', feeErr.message);

      let totalCollectedFees = 0;
      let totalPendingFees = 0;

      if (feeRecords) {
        feeRecords.forEach((record) => {
          const paid = Number(record.paid_amount || 0);
          const total = Number(record.amount || 0);
          totalCollectedFees += paid;
          if (paid < total) {
            totalPendingFees += (total - paid);
          }
        });
      }

      return {
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        totalTeachers: totalTeachers || 0,
        presentStudents: presentCount,
        absentStudents: absentCount,
        lateStudents: lateCount,
        totalCollectedFees,
        pendingFees: totalPendingFees,
      };
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Fetch recent students with profile information
   */
  async getRecentStudents(limit = 5) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        id,
        roll_number,
        class,
        section,
        status,
        admission_date,
        school_users (
          profiles (
            full_name,
            email,
            avatar_url
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent students:', error);
      return [];
    }

    return (data || []).map((s) => {
      const profile = s.school_users?.profiles;
      return {
        id: s.id,
        rollNumber: s.roll_number,
        class: s.class,
        section: s.section,
        status: s.status,
        admissionDate: s.admission_date,
        name: profile?.full_name || 'Student',
        email: profile?.email || '—',
        avatarUrl: profile?.avatar_url,
      };
    });
  },

  /**
   * Fetch recent fee payments
   */
  async getRecentPayments(limit = 5) {
    const { data, error } = await supabase
      .from('fees')
      .select(`
        id,
        fee_type,
        amount,
        paid_amount,
        payment_date,
        payment_method,
        receipt_number,
        status,
        created_at,
        students (
          roll_number,
          class,
          school_users (
            profiles (
              full_name
            )
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent payments:', error);
      return [];
    }

    return (data || []).map((f) => {
      const studentName = f.students?.school_users?.profiles?.full_name || 'Student';
      return {
        id: f.id,
        studentName,
        rollNumber: f.students?.roll_number || '—',
        class: f.students?.class || '—',
        feeType: f.fee_type,
        amount: Number(f.amount || 0),
        paidAmount: Number(f.paid_amount || 0),
        paymentDate: f.payment_date || f.created_at?.split('T')[0],
        paymentMethod: f.payment_method || 'cash',
        receiptNumber: f.receipt_number || '—',
        status: f.status,
      };
    });
  },

  /**
   * Fetch recent attendance records
   */
  async getRecentAttendance(limit = 6) {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        id,
        date,
        status,
        remarks,
        students (
          roll_number,
          class,
          section,
          school_users (
            profiles (
              full_name
            )
          )
        ),
        courses (
          name
        )
      `)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent attendance:', error);
      return [];
    }

    return (data || []).map((a) => ({
      id: a.id,
      date: a.date,
      status: a.status,
      remarks: a.remarks,
      studentName: a.students?.school_users?.profiles?.full_name || 'Student',
      rollNumber: a.students?.roll_number,
      className: `${a.students?.class || ''} ${a.students?.section || ''}`.trim(),
      courseName: a.courses?.name || 'Course',
    }));
  },

  /**
   * Fetch Weekly Attendance Chart Data
   */
  async getAttendanceChartData() {
    const { data, error } = await supabase
      .from('attendance')
      .select('date, status')
      .order('date', { ascending: true });

    if (error || !data) {
      return [
        { day: 'Mon', present: 5, absent: 1, late: 0 },
        { day: 'Tue', present: 6, absent: 0, late: 0 },
        { day: 'Wed', present: 4, absent: 1, late: 1 },
        { day: 'Thu', present: 5, absent: 0, late: 1 },
        { day: 'Fri', present: 6, absent: 0, late: 0 },
      ];
    }

    // Group by date
    const dateGroups = {};
    data.forEach((item) => {
      if (!dateGroups[item.date]) {
        dateGroups[item.date] = { present: 0, absent: 0, late: 0, excused: 0 };
      }
      if (item.status) {
        dateGroups[item.date][item.status] = (dateGroups[item.date][item.status] || 0) + 1;
      }
    });

    const chartPoints = Object.entries(dateGroups)
      .slice(-7)
      .map(([date, counts]) => {
        const d = new Date(date);
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        return {
          day: dayLabel,
          date,
          present: counts.present || 0,
          absent: counts.absent || 0,
          late: counts.late || 0,
          excused: counts.excused || 0,
        };
      });

    return chartPoints.length > 0 ? chartPoints : [
      { day: 'Mon', present: 5, absent: 1, late: 0 },
      { day: 'Tue', present: 6, absent: 0, late: 0 },
      { day: 'Wed', present: 4, absent: 1, late: 1 },
      { day: 'Thu', present: 5, absent: 0, late: 1 },
      { day: 'Fri', present: 6, absent: 0, late: 0 },
    ];
  },

  /**
   * Fetch Fee Collection breakdown for Charts
   */
  async getFeeCollectionChartData() {
    const { data, error } = await supabase
      .from('fees')
      .select('fee_type, amount, paid_amount, status');

    if (error || !data || data.length === 0) {
      return [
        { name: 'Tuition', collected: 32500, pending: 17500 },
        { name: 'Lab', collected: 4500, pending: 4500 },
        { name: 'Transport', collected: 6000, pending: 0 },
        { name: 'Library', collected: 2500, pending: 1000 },
      ];
    }

    const typeMap = {};
    data.forEach((f) => {
      const type = (f.fee_type || 'other').toUpperCase();
      if (!typeMap[type]) {
        typeMap[type] = { collected: 0, pending: 0 };
      }
      const paid = Number(f.paid_amount || 0);
      const total = Number(f.amount || 0);
      typeMap[type].collected += paid;
      if (paid < total) {
        typeMap[type].pending += (total - paid);
      }
    });

    return Object.entries(typeMap).map(([name, val]) => ({
      name,
      collected: val.collected,
      pending: val.pending,
    }));
  },

  /**
   * Alias for getAdminDashboardStats used across analytical reports
   */
  async getDashboardMetrics() {
    return await this.getAdminDashboardStats();
  },

  /**
   * Fetch attendance and fee collection charts data concurrently
   */
  async getDashboardChartsData() {
    try {
      const [attendance, feeCollection] = await Promise.all([
        this.getAttendanceChartData(),
        this.getFeeCollectionChartData(),
      ]);
      return { attendance, feeCollection };
    } catch (err) {
      console.error('Error in getDashboardChartsData:', err);
      return {
        attendance: [],
        feeCollection: [],
      };
    }
  },
};

