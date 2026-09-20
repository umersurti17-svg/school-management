import { supabase } from '../config/supabaseClient';

export const courseService = {
  /**
   * Fetch all courses with subject, teacher and class details
   */
  async getCourses({ classFilter = '', search = '' } = {}) {
    try {
      let query = supabase
        .from('courses')
        .select(`
          id,
          name,
          class,
          section,
          academic_year,
          schedule,
          created_at,
          subjects (
            id,
            name,
            code,
            description,
            total_marks,
            passing_marks
          ),
          teachers (
            id,
            employee_id,
            department,
            school_users (
              profiles (
                full_name,
                email
              )
            )
          )
        `)
        .order('class', { ascending: true })
        .order('name', { ascending: true });

      if (classFilter) {
        query = query.eq('class', classFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      let courses = (data || []).map((c) => {
        const teacherProfile = c.teachers?.school_users?.profiles;
        return {
          id: c.id,
          name: c.name,
          class: c.class,
          section: c.section,
          academicYear: c.academic_year,
          schedule: c.schedule || 'Schedule TBA',
          createdAt: c.created_at,
          subjectId: c.subjects?.id,
          subjectName: c.subjects?.name || 'Subject',
          subjectCode: c.subjects?.code || '—',
          totalMarks: c.subjects?.total_marks || 100,
          passingMarks: c.subjects?.passing_marks || 33,
          teacherId: c.teachers?.id,
          teacherName: teacherProfile?.full_name || 'Unassigned',
          teacherEmail: teacherProfile?.email || '—',
          department: c.teachers?.department || 'General',
        };
      });

      if (search.trim()) {
        const q = search.toLowerCase();
        courses = courses.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.subjectName.toLowerCase().includes(q) ||
            c.subjectCode.toLowerCase().includes(q) ||
            c.teacherName.toLowerCase().includes(q) ||
            c.class.toLowerCase().includes(q)
        );
      }

      return courses;
    } catch (error) {
      console.error('Error in courseService.getCourses:', error);
      throw error;
    }
  },

  /**
   * Fetch single course by ID with enrolled students
   */
  async getCourseById(id) {
    try {
      const { data: c, error } = await supabase
        .from('courses')
        .select(`
          id,
          name,
          class,
          section,
          academic_year,
          schedule,
          created_at,
          subjects (
            id,
            name,
            code,
            description,
            total_marks,
            passing_marks
          ),
          teachers (
            id,
            employee_id,
            department,
            school_users (
              profiles (
                full_name,
                email,
                phone
              )
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!c) return null;

      // Fetch enrolled students matching course's class & section
      const { data: enrolledStudents } = await supabase
        .from('students')
        .select(`
          id,
          roll_number,
          gender,
          status,
          school_users (
            profiles (
              full_name,
              email,
              avatar_url
            )
          )
        `)
        .eq('class', c.class)
        .eq('section', c.section)
        .eq('status', 'active');

      const teacherProfile = c.teachers?.school_users?.profiles;

      return {
        id: c.id,
        name: c.name,
        class: c.class,
        section: c.section,
        academicYear: c.academic_year,
        schedule: c.schedule,
        createdAt: c.created_at,
        subject: c.subjects,
        teacher: {
          id: c.teachers?.id,
          employeeId: c.teachers?.employee_id,
          department: c.teachers?.department,
          name: teacherProfile?.full_name || 'Unassigned',
          email: teacherProfile?.email,
          phone: teacherProfile?.phone,
        },
        students: (enrolledStudents || []).map((s) => ({
          id: s.id,
          rollNumber: s.roll_number,
          gender: s.gender,
          name: s.school_users?.profiles?.full_name || 'Student',
          email: s.school_users?.profiles?.email,
          avatarUrl: s.school_users?.profiles?.avatar_url,
        })),
      };
    } catch (error) {
      console.error('Error in courseService.getCourseById:', error);
      throw error;
    }
  },

  /**
   * Fetch all subjects catalog
   */
  async getSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch all available teachers
   */
  async getTeachers() {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        id,
        employee_id,
        department,
        school_users (
          profiles (
            full_name,
            email
          )
        )
      `)
      .eq('is_active', true);

    if (error) throw error;
    return (data || []).map((t) => ({
      id: t.id,
      employeeId: t.employee_id,
      department: t.department,
      name: t.school_users?.profiles?.full_name || 'Teacher',
      email: t.school_users?.profiles?.email,
    }));
  },

  /**
   * Create course
   */
  async createCourse(courseData) {
    const { data, error } = await supabase
      .from('courses')
      .insert({
        name: courseData.name.trim(),
        subject_id: courseData.subjectId,
        teacher_id: courseData.teacherId || null,
        class: courseData.class,
        section: courseData.section || 'A',
        academic_year: Number(courseData.academicYear || 2026),
        schedule: courseData.schedule?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update course
   */
  async updateCourse(id, courseData) {
    const { data, error } = await supabase
      .from('courses')
      .update({
        name: courseData.name.trim(),
        subject_id: courseData.subjectId,
        teacher_id: courseData.teacherId || null,
        class: courseData.class,
        section: courseData.section || 'A',
        academic_year: Number(courseData.academicYear || 2026),
        schedule: courseData.schedule?.trim() || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete course
   */
  async deleteCourse(id) {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  /**
   * Create a new subject in the catalog
   */
  async createSubject(subjectData) {
    const { data, error } = await supabase
      .from('subjects')
      .insert({
        name: subjectData.name.trim(),
        code: subjectData.code.trim().toUpperCase(),
        description: subjectData.description?.trim() || null,
        total_marks: Number(subjectData.totalMarks || 100),
        passing_marks: Number(subjectData.passingMarks || 33),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
