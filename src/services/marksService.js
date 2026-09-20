import { supabase } from '../config/supabaseClient';
import { calculateGrade } from '../utils/helpers';

export const marksService = {
  /**
   * Fetch marks entry sheet for a specific class, subject, and exam type
   */
  async getMarksSheet({
    className = 'Grade 10',
    section = 'A',
    subjectId,
    examType = 'mid_term',
    academicYear = 2026,
  }) {
    try {
      // 1. Fetch Subject details
      let subject = null;
      if (subjectId) {
        const { data: subData } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', subjectId)
          .single();
        subject = subData;
      }

      // 2. Fetch all active students in this class/section
      const { data: students, error: stdErr } = await supabase
        .from('students')
        .select(`
          id,
          roll_number,
          school_users (
            profiles (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('class', className)
        .eq('section', section)
        .eq('status', 'active')
        .order('roll_number');
      if (stdErr) throw stdErr;

      // 3. Fetch existing marks for these parameters
      let marksMap = {};
      if (subjectId) {
        const { data: existingMarks } = await supabase
          .from('marks')
          .select('*')
          .eq('subject_id', subjectId)
          .eq('exam_type', examType)
          .eq('academic_year', academicYear);

        existingMarks?.forEach((m) => {
          marksMap[m.student_id] = {
            id: m.id,
            marksObtained: Number(m.marks_obtained),
            totalMarks: Number(m.total_marks || 100),
            grade: m.grade,
            remarks: m.remarks || '',
          };
        });
      }

      const totalMarksDefault = subject?.total_marks || 100;

      const sheet = (students || []).map((s) => {
        const existing = marksMap[s.id];
        const marksObtained = existing ? existing.marksObtained : '';
        const grade = existing ? existing.grade : (marksObtained !== '' ? calculateGrade((marksObtained / totalMarksDefault) * 100).grade : '—');
        return {
          studentId: s.id,
          rollNumber: s.roll_number,
          studentName: s.school_users?.profiles?.full_name || 'Student',
          avatarUrl: s.school_users?.profiles?.avatar_url,
          marksObtained,
          totalMarks: existing ? existing.totalMarks : totalMarksDefault,
          grade,
          remarks: existing ? existing.remarks : '',
          existingId: existing ? existing.id : null,
        };
      });

      return {
        subject,
        examType,
        academicYear,
        className,
        section,
        sheet,
      };
    } catch (error) {
      console.error('Error in getMarksSheet:', error);
      throw error;
    }
  },

  /**
   * Bulk save or update marks for an exam
   */
  async saveBatchMarks({
    subjectId,
    examType,
    academicYear = 2026,
    totalMarks = 100,
    enteredById,
    records,
  }) {
    try {
      const recordsToUpsert = records
        .filter((r) => r.marksObtained !== '' && r.marksObtained != null)
        .map((r) => {
          const obtained = Number(r.marksObtained);
          const total = Number(r.totalMarks || totalMarks || 100);
          const percentage = total > 0 ? (obtained / total) * 100 : 0;
          const gradeInfo = calculateGrade(percentage);

          return {
            student_id: r.studentId,
            subject_id: subjectId,
            exam_type: examType,
            academic_year: Number(academicYear),
            marks_obtained: obtained,
            total_marks: total,
            grade: gradeInfo.grade,
            remarks: r.remarks?.trim() || null,
            entered_by: enteredById || null,
          };
        });

      if (recordsToUpsert.length === 0) return [];

      const { data, error } = await supabase
        .from('marks')
        .upsert(recordsToUpsert, {
          onConflict: 'student_id,subject_id,exam_type,academic_year',
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in saveBatchMarks:', error);
      throw error;
    }
  },

  /**
   * Fetch complete student report card with GPA and subject breakdown
   */
  async getStudentReportCard(studentId, academicYear = 2026) {
    try {
      // 1. Fetch student info
      const { data: student, error: stdErr } = await supabase
        .from('students')
        .select(`
          id,
          roll_number,
          class,
          section,
          guardian_name,
          school_users (
            profiles (
              full_name,
              email,
              avatar_url
            )
          )
        `)
        .eq('id', studentId)
        .single();
      if (stdErr) throw stdErr;

      // 2. Fetch marks for this student
      const { data: marksList, error: marksErr } = await supabase
        .from('marks')
        .select(`
          id,
          exam_type,
          marks_obtained,
          total_marks,
          grade,
          remarks,
          subjects (
            id,
            name,
            code,
            passing_marks
          )
        `)
        .eq('student_id', studentId)
        .eq('academic_year', academicYear);
      if (marksErr) throw marksErr;

      let totalMaxMarks = 0;
      let totalObtainedMarks = 0;
      let totalGpa = 0;

      const subjectsBreakdown = (marksList || []).map((m) => {
        const obtained = Number(m.marks_obtained);
        const total = Number(m.total_marks || 100);
        const percentage = total > 0 ? (obtained / total) * 100 : 0;
        const gradeInfo = calculateGrade(percentage);

        totalMaxMarks += total;
        totalObtainedMarks += obtained;
        totalGpa += gradeInfo.gpa;

        return {
          id: m.id,
          examType: m.exam_type,
          subjectName: m.subjects?.name || 'Subject',
          subjectCode: m.subjects?.code || '—',
          passingMarks: m.subjects?.passing_marks || 33,
          marksObtained: obtained,
          totalMarks: total,
          percentage: Math.round(percentage),
          grade: gradeInfo.grade,
          gpa: gradeInfo.gpa,
          status: obtained >= (m.subjects?.passing_marks || 33) ? 'Passed' : 'Failed',
          remarks: m.remarks,
        };
      });

      const overallPercentage = totalMaxMarks > 0 ? Math.round((totalObtainedMarks / totalMaxMarks) * 100) : 0;
      const overallGrade = calculateGrade(overallPercentage);
      const averageGpa = subjectsBreakdown.length > 0 ? (totalGpa / subjectsBreakdown.length).toFixed(2) : '0.00';

      return {
        student: {
          id: student.id,
          name: student.school_users?.profiles?.full_name || 'Student',
          rollNumber: student.roll_number,
          class: student.class,
          section: student.section,
          guardianName: student.guardian_name,
        },
        academicYear,
        subjectsBreakdown,
        totalMaxMarks,
        totalObtainedMarks,
        overallPercentage,
        overallGrade: overallGrade.grade,
        averageGpa,
        isPassed: overallPercentage >= 33,
      };
    } catch (error) {
      console.error('Error in getStudentReportCard:', error);
      throw error;
    }
  },

  /**
   * Update an individual mark record
   */
  async updateMark(id, { marksObtained, totalMarks = 100, remarks = '' }) {
    try {
      const obtained = Number(marksObtained);
      const total = Number(totalMarks);
      const percentage = total > 0 ? (obtained / total) * 100 : 0;
      const gradeInfo = calculateGrade(percentage);

      const { data, error } = await supabase
        .from('marks')
        .update({
          marks_obtained: obtained,
          total_marks: total,
          grade: gradeInfo.grade,
          remarks: remarks?.trim() || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in updateMark:', error);
      throw error;
    }
  },

  /**
   * Delete an individual mark record
   */
  async deleteMark(id) {
    try {
      const { error } = await supabase.from('marks').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error in deleteMark:', error);
      throw error;
    }
  },

  /**
   * Delete batch of marks for a subject and exam type
   */
  async deleteMarksBatch({ subjectId, examType, academicYear = 2026 }) {
    try {
      const { error } = await supabase
        .from('marks')
        .delete()
        .eq('subject_id', subjectId)
        .eq('exam_type', examType)
        .eq('academic_year', Number(academicYear));

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error in deleteMarksBatch:', error);
      throw error;
    }
  },
};
