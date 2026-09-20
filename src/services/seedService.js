import { supabase } from '../config/supabaseClient';

/**
 * Demo Data Seeder and Management Service
 * Automatically seeds demo data when the database is empty.
 * Allows clearing all demo data without touching real records.
 */

// Generate a valid UUID
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const seedService = {
  /**
   * Check if the database has any real user data
   */
  async hasRealData() {
    try {
      const { count: realStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .not('roll_number', 'ilike', 'DEMO-%');

      const { count: realCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .not('name', 'ilike', '%(Demo)%');

      return (realStudents || 0) > 0 || (realCourses || 0) > 0;
    } catch (err) {
      console.warn('Error checking real data:', err);
      return false;
    }
  },

  /**
   * Check if demo data currently exists in the system
   */
  async hasDemoData() {
    try {
      const { count: demoStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .ilike('roll_number', 'DEMO-%');

      return (demoStudents || 0) > 0;
    } catch (err) {
      console.warn('Error checking demo data existence:', err);
      return false;
    }
  },

  /**
   * Auto-seed demo data if database has 0 records and no real data exists
   */
  async checkAndAutoSeed() {
    try {
      // 1. If real user records exist, do NOT touch or seed
      const realExists = await this.hasRealData();
      if (realExists) {
        return false;
      }

      // 2. Check total students count
      const { count: totalStudents, error: stdErr } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      if (stdErr) throw stdErr;

      // If database already has records (demo or real), no need to auto-seed
      if ((totalStudents || 0) > 0) {
        return false;
      }

      console.info('[DemoData] Database is empty. Seeding initial demo records...');
      await this.seedDemoData();
      return true;
    } catch (error) {
      console.error('[DemoData] Auto-seed check error:', error);
      return false;
    }
  },

  /**
   * Seed a complete set of interconnected demo records
   */
  async seedDemoData() {
    try {
      // 1. DEMO TEACHERS (Profiles -> School Users -> Teachers)
      const teacher1ProfileId = generateUUID();
      const teacher2ProfileId = generateUUID();
      const teacher3ProfileId = generateUUID();

      const teacher1UserId = generateUUID();
      const teacher2UserId = generateUUID();
      const teacher3UserId = generateUUID();

      const teacher1Id = generateUUID();
      const teacher2Id = generateUUID();
      const teacher3Id = generateUUID();

      const teacherProfiles = [
        {
          id: teacher1ProfileId,
          auth_id: teacher1ProfileId,
          full_name: 'Dr. Tariq Mahmood (Demo)',
          email: 'demo.tariq@demo.educator.pk',
          phone: '+92 300 5551122',
        },
        {
          id: teacher2ProfileId,
          auth_id: teacher2ProfileId,
          full_name: 'Ms. Aisha Khan (Demo)',
          email: 'demo.aisha@demo.educator.pk',
          phone: '+92 301 5552233',
        },
        {
          id: teacher3ProfileId,
          auth_id: teacher3ProfileId,
          full_name: 'Engr. Bilal Siddiqui (Demo)',
          email: 'demo.bilal@demo.educator.pk',
          phone: '+92 302 5553344',
        },
      ];

      await supabase.from('profiles').upsert(teacherProfiles, { onConflict: 'id' });

      const teacherSchoolUsers = [
        { id: teacher1UserId, profile_id: teacher1ProfileId, role: 'teacher', is_active: true },
        { id: teacher2UserId, profile_id: teacher2ProfileId, role: 'teacher', is_active: true },
        { id: teacher3UserId, profile_id: teacher3ProfileId, role: 'teacher', is_active: true },
      ];

      await supabase.from('school_users').upsert(teacherSchoolUsers, { onConflict: 'id' });

      const teachersData = [
        {
          id: teacher1Id,
          school_user_id: teacher1UserId,
          employee_id: 'DEMO-TCH-001',
          department: 'Science & Physics',
          qualification: 'Ph.D. in Applied Physics',
          joining_date: '2022-08-15',
          specialization: 'Quantum Mechanics & Modern Physics',
          is_active: true,
        },
        {
          id: teacher2Id,
          school_user_id: teacher2UserId,
          employee_id: 'DEMO-TCH-002',
          department: 'Mathematics',
          qualification: 'M.Phil Mathematics',
          joining_date: '2023-01-10',
          specialization: 'Pure Mathematics & Calculus',
          is_active: true,
        },
        {
          id: teacher3Id,
          school_user_id: teacher3UserId,
          employee_id: 'DEMO-TCH-003',
          department: 'Computer Science',
          qualification: 'MS Computer Science',
          joining_date: '2023-08-01',
          specialization: 'Artificial Intelligence & Software Engineering',
          is_active: true,
        },
      ];

      await supabase.from('teachers').upsert(teachersData, { onConflict: 'id' });

      // 2. DEMO SUBJECTS
      const sub1Id = generateUUID();
      const sub2Id = generateUUID();
      const sub3Id = generateUUID();
      const sub4Id = generateUUID();

      const subjectsData = [
        {
          id: sub1Id,
          name: 'Advanced Mathematics (Demo)',
          code: 'DEMO-MTH-10',
          description: 'Algebra, Trigonometry, Coordinate Geometry, and Calculus Basics',
          total_marks: 100,
          passing_marks: 33,
        },
        {
          id: sub2Id,
          name: 'Conceptual Physics (Demo)',
          code: 'DEMO-PHY-10',
          description: 'Mechanics, Electromagnetism, Optics, and Practical Laboratory',
          total_marks: 100,
          passing_marks: 33,
        },
        {
          id: sub3Id,
          name: 'Computer Science & AI (Demo)',
          code: 'DEMO-CSC-10',
          description: 'Algorithms, Data Structures, Python, and Web Foundations',
          total_marks: 100,
          passing_marks: 33,
        },
        {
          id: sub4Id,
          name: 'English Literature (Demo)',
          code: 'DEMO-ENG-10',
          description: 'Literary Analysis, Creative Writing, and Communication',
          total_marks: 100,
          passing_marks: 33,
        },
      ];

      await supabase.from('subjects').upsert(subjectsData, { onConflict: 'id' });

      // 3. DEMO COURSES
      const course1Id = generateUUID();
      const course2Id = generateUUID();
      const course3Id = generateUUID();
      const course4Id = generateUUID();

      const coursesData = [
        {
          id: course1Id,
          name: 'Grade 10 - Advanced Mathematics (Demo)',
          subject_id: sub1Id,
          teacher_id: teacher2Id,
          class: 'Grade 10',
          section: 'A',
          academic_year: 2026,
          schedule: 'Mon, Wed, Fri (08:30 AM - 09:30 AM)',
        },
        {
          id: course2Id,
          name: 'Grade 10 - Conceptual Physics & Lab (Demo)',
          subject_id: sub2Id,
          teacher_id: teacher1Id,
          class: 'Grade 10',
          section: 'A',
          academic_year: 2026,
          schedule: 'Tue, Thu (09:45 AM - 11:15 AM)',
        },
        {
          id: course3Id,
          name: 'Grade 10 - Computer Science & AI (Demo)',
          subject_id: sub3Id,
          teacher_id: teacher3Id,
          class: 'Grade 10',
          section: 'A',
          academic_year: 2026,
          schedule: 'Mon, Thu (11:30 AM - 12:45 PM)',
        },
        {
          id: course4Id,
          name: 'Grade 9 - English Literature (Demo)',
          subject_id: sub4Id,
          teacher_id: teacher2Id,
          class: 'Grade 9',
          section: 'A',
          academic_year: 2026,
          schedule: 'Wed, Fri (10:00 AM - 11:00 AM)',
        },
      ];

      await supabase.from('courses').upsert(coursesData, { onConflict: 'id' });

      // 4. DEMO STUDENTS (Profiles -> School Users -> Students)
      const studentProfiles = [
        {
          id: generateUUID(),
          name: 'Ali Raza (Demo)',
          email: 'demo.ali@demo.educator.pk',
          phone: '+92 300 1234567',
          roll: 'DEMO-101',
          class: 'Grade 10',
          sec: 'A',
          gender: 'male',
          dob: '2010-04-12',
          guardian: 'Muhammad Raza',
          guardianPhone: '+92 300 9876541',
          address: 'House 42, Model Town, Lahore',
          bloodGroup: 'B+',
        },
        {
          id: generateUUID(),
          name: 'Fatima Noor (Demo)',
          email: 'demo.fatima@demo.educator.pk',
          phone: '+92 301 2345678',
          roll: 'DEMO-102',
          class: 'Grade 10',
          sec: 'A',
          gender: 'female',
          dob: '2010-08-25',
          guardian: 'Noor ul Hassan',
          guardianPhone: '+92 301 9876542',
          address: 'Flat 12-B, Gulberg III, Lahore',
          bloodGroup: 'O+',
        },
        {
          id: generateUUID(),
          name: 'Zain Ahmed (Demo)',
          email: 'demo.zain@demo.educator.pk',
          phone: '+92 302 3456789',
          roll: 'DEMO-103',
          class: 'Grade 10',
          sec: 'A',
          gender: 'male',
          dob: '2009-11-18',
          guardian: 'Ahmed Bilal',
          guardianPhone: '+92 302 9876543',
          address: 'Sector F, DHA Phase 5, Lahore',
          bloodGroup: 'A+',
        },
        {
          id: generateUUID(),
          name: 'Ayesha Malik (Demo)',
          email: 'demo.ayesha@demo.educator.pk',
          phone: '+92 303 4567890',
          roll: 'DEMO-104',
          class: 'Grade 10',
          sec: 'A',
          gender: 'female',
          dob: '2010-01-05',
          guardian: 'Tariq Malik',
          guardianPhone: '+92 303 9876544',
          address: 'Street 9, Johar Town, Lahore',
          bloodGroup: 'AB+',
        },
        {
          id: generateUUID(),
          name: 'Hamza Farooq (Demo)',
          email: 'demo.hamza@demo.educator.pk',
          phone: '+92 304 5678901',
          roll: 'DEMO-105',
          class: 'Grade 9',
          sec: 'A',
          gender: 'male',
          dob: '2011-06-30',
          guardian: 'Farooq Azam',
          guardianPhone: '+92 304 9876545',
          address: 'Canal View Society, Lahore',
          bloodGroup: 'O-',
        },
      ];

      const insertedStudents = [];

      for (const sp of studentProfiles) {
        // Upsert Profile
        await supabase.from('profiles').upsert({
          id: sp.id,
          auth_id: sp.id,
          full_name: sp.name,
          email: sp.email,
          phone: sp.phone,
        }, { onConflict: 'id' });

        // Upsert School User
        const schoolUserId = generateUUID();
        await supabase.from('school_users').upsert({
          id: schoolUserId,
          profile_id: sp.id,
          role: 'student',
          is_active: true,
        }, { onConflict: 'id' });

        // Upsert Student
        const studentId = generateUUID();
        const { data: stdData } = await supabase.from('students').upsert({
          id: studentId,
          school_user_id: schoolUserId,
          roll_number: sp.roll,
          class: sp.class,
          section: sp.sec,
          date_of_birth: sp.dob,
          gender: sp.gender,
          guardian_name: sp.guardian,
          guardian_phone: sp.guardianPhone,
          address: sp.address,
          admission_date: '2024-03-01',
          blood_group: sp.bloodGroup,
          status: 'active',
        }, { onConflict: 'id' }).select().single();

        insertedStudents.push({ ...sp, studentId: stdData ? stdData.id : studentId });
      }

      // 5. DEMO ATTENDANCE RECORDS (Spread across last 5 weekdays)
      const attendanceRecords = [];
      const today = new Date();

      for (let dayOffset = 4; dayOffset >= 0; dayOffset--) {
        const d = new Date();
        d.setDate(today.getDate() - dayOffset);
        // Skip Sundays
        if (d.getDay() === 0) continue;
        const dateStr = d.toISOString().split('T')[0];

        insertedStudents.forEach((student, sIdx) => {
          let status = 'present';
          let remarks = '[Demo Data] Standard attendance';

          if (sIdx === 2 && dayOffset === 1) {
            status = 'late';
            remarks = '[Demo Data] Arrived 15 mins late';
          } else if (sIdx === 2 && dayOffset === 0) {
            status = 'absent';
            remarks = '[Demo Data] Medical leave';
          } else if (sIdx === 3 && dayOffset === 2) {
            status = 'excused';
            remarks = '[Demo Data] Family obligation';
          }

          attendanceRecords.push({
            student_id: student.studentId,
            course_id: student.class === 'Grade 10' ? course1Id : course4Id,
            date: dateStr,
            status,
            remarks,
          });
        });
      }

      if (attendanceRecords.length > 0) {
        await supabase.from('attendance').upsert(attendanceRecords, {
          onConflict: 'student_id,course_id,date',
        });
      }

      // 6. DEMO FEE INVOICES & PAYMENTS
      const feeRecords = [
        {
          student_id: insertedStudents[0].studentId,
          fee_type: 'tuition',
          amount: 8500,
          due_date: '2026-09-10',
          paid_amount: 8500,
          payment_date: '2026-09-05',
          payment_method: 'bank_transfer',
          receipt_number: 'DEMO-REC-2026-001',
          status: 'paid',
          academic_year: 2026,
        },
        {
          student_id: insertedStudents[1].studentId,
          fee_type: 'tuition',
          amount: 8500,
          due_date: '2026-09-10',
          paid_amount: 8500,
          payment_date: '2026-09-06',
          payment_method: 'online',
          receipt_number: 'DEMO-REC-2026-002',
          status: 'paid',
          academic_year: 2026,
        },
        {
          student_id: insertedStudents[2].studentId,
          fee_type: 'tuition',
          amount: 12000,
          due_date: '2026-09-15',
          paid_amount: 6000,
          payment_date: '2026-09-12',
          payment_method: 'cash',
          receipt_number: 'DEMO-REC-2026-003',
          status: 'partial',
          academic_year: 2026,
        },
        {
          student_id: insertedStudents[3].studentId,
          fee_type: 'transport',
          amount: 6500,
          due_date: '2026-09-30',
          paid_amount: 0,
          payment_date: null,
          payment_method: 'cash',
          receipt_number: 'DEMO-REC-2026-004',
          status: 'pending',
          academic_year: 2026,
        },
        {
          student_id: insertedStudents[4].studentId,
          fee_type: 'tuition',
          amount: 18500,
          due_date: '2026-09-10',
          paid_amount: 18500,
          payment_date: '2026-09-08',
          payment_method: 'bank_transfer',
          receipt_number: 'DEMO-REC-2026-005',
          status: 'paid',
          academic_year: 2026,
        },
        {
          student_id: insertedStudents[0].studentId,
          fee_type: 'lab',
          amount: 4500,
          due_date: '2026-09-20',
          paid_amount: 4500,
          payment_date: '2026-09-10',
          payment_method: 'cash',
          receipt_number: 'DEMO-REC-2026-006',
          status: 'paid',
          academic_year: 2026,
        },
      ];

      await supabase.from('fees').upsert(feeRecords);

      // 7. DEMO MARKS & ASSESSMENTS
      const marksRecords = [
        // Ali Raza
        { student_id: insertedStudents[0].studentId, subject_id: sub1Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 94, total_marks: 100, grade: 'A+', remarks: '[Demo Data] Outstanding analytical skills' },
        { student_id: insertedStudents[0].studentId, subject_id: sub2Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 88, total_marks: 100, grade: 'A', remarks: '[Demo Data] Excellent lab work' },
        { student_id: insertedStudents[0].studentId, subject_id: sub3Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 96, total_marks: 100, grade: 'A+', remarks: '[Demo Data] Top score in coding' },

        // Fatima Noor
        { student_id: insertedStudents[1].studentId, subject_id: sub1Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 98, total_marks: 100, grade: 'A+', remarks: '[Demo Data] Perfect score in Algebra' },
        { student_id: insertedStudents[1].studentId, subject_id: sub2Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 92, total_marks: 100, grade: 'A+', remarks: '[Demo Data] High distinction' },
        { student_id: insertedStudents[1].studentId, subject_id: sub3Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 95, total_marks: 100, grade: 'A+', remarks: '[Demo Data] Excellent project design' },

        // Zain Ahmed
        { student_id: insertedStudents[2].studentId, subject_id: sub1Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 72, total_marks: 100, grade: 'B', remarks: '[Demo Data] Good effort, needs practice' },
        { student_id: insertedStudents[2].studentId, subject_id: sub2Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 68, total_marks: 100, grade: 'C', remarks: '[Demo Data] Revise electromagnetism' },
        { student_id: insertedStudents[2].studentId, subject_id: sub3Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 81, total_marks: 100, grade: 'B', remarks: '[Demo Data] Good programming logic' },

        // Ayesha Malik
        { student_id: insertedStudents[3].studentId, subject_id: sub1Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 89, total_marks: 100, grade: 'A', remarks: '[Demo Data] Very good performance' },
        { student_id: insertedStudents[3].studentId, subject_id: sub2Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 84, total_marks: 100, grade: 'B', remarks: '[Demo Data] Solid conceptual grasp' },
        { student_id: insertedStudents[3].studentId, subject_id: sub3Id, exam_type: 'mid_term', academic_year: 2026, marks_obtained: 91, total_marks: 100, grade: 'A+', remarks: '[Demo Data] Great software presentation' },
      ];

      await supabase.from('marks').upsert(marksRecords, {
        onConflict: 'student_id,subject_id,exam_type,academic_year',
      });

      // 8. DEMO ANNOUNCEMENTS
      const demoAnnouncements = [
        {
          title: 'Annual Sports Gala & Science Exhibition 2026 [Demo Data]',
          content: 'The Educator School cordially announces the Annual Sports Week and Science Fair starting next month. All students from Grade 1 to 12 are encouraged to participate in track, robotics, and scientific exhibition booths.',
          target_role: 'all',
          is_pinned: true,
        },
        {
          title: 'Mid-Term Examination Schedule Announcement [Demo Data]',
          content: 'Mid-Term theoretical and practical assessments will commence as per the published calendar. Detailed date sheets and syllabus guides have been distributed.',
          target_role: 'student',
          is_pinned: false,
        },
        {
          title: 'Parent-Teacher Council Consultation Session [Demo Data]',
          content: 'Quarterly parent-teacher interactive session will be held this Saturday from 10:00 AM to 02:00 PM. Individual student progress reports will be handed over.',
          target_role: 'all',
          is_pinned: false,
        },
      ];

      await supabase.from('announcements').insert(demoAnnouncements);

      console.info('[DemoData] Successfully seeded demo dataset.');
      return true;
    } catch (error) {
      console.error('[DemoData] Failed to seed demo data:', error);
      throw error;
    }
  },

  /**
   * Clear all demo records without affecting any real user data
   */
  async clearDemoData() {
    try {
      // 1. Delete demo marks
      await supabase
        .from('marks')
        .delete()
        .ilike('remarks', '%[Demo Data]%');

      // 2. Delete demo attendance
      await supabase
        .from('attendance')
        .delete()
        .ilike('remarks', '%[Demo Data]%');

      // 3. Delete demo fees
      await supabase
        .from('fees')
        .delete()
        .ilike('receipt_number', 'DEMO-%');

      // 4. Delete demo courses
      await supabase
        .from('courses')
        .delete()
        .ilike('name', '%(Demo)%');

      // 5. Delete demo subjects
      await supabase
        .from('subjects')
        .delete()
        .ilike('name', '%(Demo)%');

      // 6. Delete demo announcements
      await supabase
        .from('announcements')
        .delete()
        .ilike('title', '%[Demo Data]%');

      // 7. Find and delete demo students and profiles
      const { data: demoStudents } = await supabase
        .from('students')
        .select('id, school_user_id, school_users(profile_id)')
        .ilike('roll_number', 'DEMO-%');

      if (demoStudents && demoStudents.length > 0) {
        const studentIds = demoStudents.map((s) => s.id);
        const profileIds = demoStudents
          .map((s) => s.school_users?.profile_id)
          .filter(Boolean);

        // Delete from students table
        await supabase.from('students').delete().in('id', studentIds);

        // Delete from profiles (which cascades to school_users)
        if (profileIds.length > 0) {
          await supabase.from('profiles').delete().in('id', profileIds);
        }
      }

      // 8. Find and delete demo teachers and profiles
      const { data: demoTeachers } = await supabase
        .from('teachers')
        .select('id, school_user_id, school_users(profile_id)')
        .ilike('employee_id', 'DEMO-%');

      if (demoTeachers && demoTeachers.length > 0) {
        const teacherIds = demoTeachers.map((t) => t.id);
        const teacherProfileIds = demoTeachers
          .map((t) => t.school_users?.profile_id)
          .filter(Boolean);

        await supabase.from('teachers').delete().in('id', teacherIds);

        if (teacherProfileIds.length > 0) {
          await supabase.from('profiles').delete().in('id', teacherProfileIds);
        }
      }

      // 9. Clean any leftover demo profiles
      await supabase
        .from('profiles')
        .delete()
        .ilike('email', '%@demo.educator.pk');

      console.info('[DemoData] Successfully cleared all demo records.');
      return true;
    } catch (error) {
      console.error('[DemoData] Failed to clear demo data:', error);
      throw error;
    }
  },
};
