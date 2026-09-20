import { supabase } from '../config/supabaseClient';

export const attendanceService = {
  /**
   * Fetch attendance checklist for a given course and date
   */
  async getCourseAttendanceSheet(courseId, date = new Date().toISOString().split('T')[0]) {
    try {
      // 1. Fetch course details
      const { data: course, error: courseErr } = await supabase
        .from('courses')
        .select('id, name, class, section')
        .eq('id', courseId)
        .single();
      if (courseErr) throw courseErr;

      // 2. Fetch all active students in this class/section
      const { data: students, error: stdErr } = await supabase
        .from('students')
        .select(`
          id,
          roll_number,
          gender,
          school_users (
            profiles (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('class', course.class)
        .eq('section', course.section)
        .eq('status', 'active')
        .order('roll_number');
      if (stdErr) throw stdErr;

      // 3. Fetch existing attendance records for this date
      const { data: existingAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('course_id', courseId)
        .eq('date', date);

      const attMap = {};
      existingAttendance?.forEach((a) => {
        attMap[a.student_id] = {
          id: a.id,
          status: a.status,
          remarks: a.remarks || '',
        };
      });

      // Combine into checklist items
      const sheet = (students || []).map((s) => ({
        studentId: s.id,
        rollNumber: s.roll_number,
        studentName: s.school_users?.profiles?.full_name || 'Student',
        avatarUrl: s.school_users?.profiles?.avatar_url,
        status: attMap[s.id]?.status || 'present', // Default to present
        remarks: attMap[s.id]?.remarks || '',
        existingId: attMap[s.id]?.id || null,
      }));

      return {
        course,
        date,
        sheet,
        isRecorded: (existingAttendance && existingAttendance.length > 0),
      };
    } catch (error) {
      console.error('Error in getCourseAttendanceSheet:', error);
      throw error;
    }
  },

  /**
   * Bulk save or update attendance sheet for a course
   */
  async saveBatchAttendance({ courseId, date, records, markedById }) {
    try {
      const recordsToUpsert = records.map((r) => ({
        student_id: r.studentId,
        course_id: courseId,
        date,
        status: r.status,
        remarks: r.remarks?.trim() || null,
        marked_by: markedById || null,
      }));

      const { data, error } = await supabase
        .from('attendance')
        .upsert(recordsToUpsert, {
          onConflict: 'student_id,course_id,date',
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in saveBatchAttendance:', error);
      throw error;
    }
  },

  /**
   * Fetch comprehensive attendance logs & reports
   */
  async getAttendanceLogs({
    courseId = '',
    studentId = '',
    status = '',
    startDate = '',
    endDate = '',
    limit = 50,
  } = {}) {
    try {
      let query = supabase
        .from('attendance')
        .select(`
          id,
          date,
          status,
          remarks,
          students (
            id,
            roll_number,
            class,
            section,
            school_users (
              profiles (
                full_name,
                avatar_url
              )
            )
          ),
          courses (
            id,
            name,
            class,
            section
          )
        `)
        .order('date', { ascending: false });

      if (courseId) query = query.eq('course_id', courseId);
      if (studentId) query = query.eq('student_id', studentId);
      if (status) query = query.eq('status', status);
      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);

      query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((a) => ({
        id: a.id,
        date: a.date,
        status: a.status,
        remarks: a.remarks,
        studentId: a.students?.id,
        rollNumber: a.students?.roll_number,
        studentName: a.students?.school_users?.profiles?.full_name || 'Student',
        className: `${a.students?.class || ''} - ${a.students?.section || ''}`,
        courseName: a.courses?.name || 'Class Session',
      }));
    } catch (error) {
      console.error('Error in getAttendanceLogs:', error);
      throw error;
    }
  },

  /**
   * Update an individual attendance record
   */
  async updateAttendance(id, { status, remarks }) {
    try {
      const updates = {};
      if (status !== undefined) updates.status = status;
      if (remarks !== undefined) updates.remarks = remarks?.trim() || null;

      const { data, error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in updateAttendance:', error);
      throw error;
    }
  },

  /**
   * Delete single attendance record by ID
   */
  async deleteAttendance(id) {
    try {
      const { error } = await supabase.from('attendance').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error in deleteAttendance:', error);
      throw error;
    }
  },

  /**
   * Delete full batch of attendance for a given course and date
   */
  async deleteAttendanceBatch({ courseId, date }) {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('course_id', courseId)
        .eq('date', date);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error in deleteAttendanceBatch:', error);
      throw error;
    }
  },

  /**
   * Fetch attendance grouped for a calendar month
   */
  async getMonthAttendance({ courseId = '', studentId = '', year = new Date().getFullYear(), month = new Date().getMonth() + 1 }) {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      let query = supabase
        .from('attendance')
        .select(`
          id,
          date,
          status,
          remarks,
          students (
            id,
            roll_number,
            school_users (
              profiles (
                full_name
              )
            )
          ),
          courses (
            id,
            name
          )
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (courseId) query = query.eq('course_id', courseId);
      if (studentId) query = query.eq('student_id', studentId);

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((a) => ({
        id: a.id,
        date: a.date,
        status: a.status,
        remarks: a.remarks,
        studentId: a.students?.id,
        rollNumber: a.students?.roll_number,
        studentName: a.students?.school_users?.profiles?.full_name || 'Student',
        courseName: a.courses?.name,
      }));
    } catch (error) {
      console.error('Error in getMonthAttendance:', error);
      throw error;
    }
  },
};
