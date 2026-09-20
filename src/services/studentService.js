import { supabase } from '../config/supabaseClient';

/**
 * Student Management Service
 * Full CRUD and Supabase database/storage integration for student records
 */
export const studentService = {
  /**
   * Fetch a clean list of all students for dropdowns and selectors
   */
  async getAllStudentsList() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          roll_number,
          class,
          section,
          status,
          guardian_name,
          guardian_phone,
          school_users (
            id,
            profiles (
              id,
              full_name,
              email,
              avatar_url
            )
          )
        `)
        .order('roll_number', { ascending: true });

      if (error) throw error;

      return (data || []).map((s) => ({
        id: s.id,
        name: s.school_users?.profiles?.full_name || 'Student ' + s.roll_number,
        rollNumber: s.roll_number,
        class: s.class,
        section: s.section,
        guardianName: s.guardian_name || '',
        email: s.school_users?.profiles?.email || '',
        status: s.status || 'active',
      }));
    } catch (err) {
      console.error('Error in getAllStudentsList:', err);
      throw err;
    }
  },

  /**
   * Fetch all students with optional search, filtering, and pagination
   */
  async getStudents({
    search = '',
    classFilter = '',
    sectionFilter = '',
    statusFilter = '',
    genderFilter = '',
    page = 1,
    pageSize = 10,
    limit,
  } = {}) {
    try {
      const effectivePageSize = limit || pageSize || 10;
      let query = supabase
        .from('students')
        .select(`
          id,
          school_user_id,
          roll_number,
          class,
          section,
          date_of_birth,
          gender,
          guardian_name,
          guardian_phone,
          address,
          admission_date,
          blood_group,
          status,
          created_at,
          school_users (
            id,
            profile_id,
            role,
            is_active,
            profiles (
              id,
              full_name,
              email,
              phone,
              avatar_url
            )
          )
        `, { count: 'exact' });

      // Apply Filters
      if (classFilter) {
        query = query.eq('class', classFilter);
      }
      if (sectionFilter) {
        query = query.eq('section', sectionFilter);
      }
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      if (genderFilter) {
        query = query.eq('gender', genderFilter);
      }

      // Order by created_at DESC
      query = query.order('created_at', { ascending: false });

      // Pagination
      const from = (page - 1) * effectivePageSize;
      const to = from + effectivePageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      // Transform data for UI
      let formattedStudents = (data || []).map((s) => {
        const profile = s.school_users?.profiles;
        return {
          id: s.id,
          schoolUserId: s.school_user_id,
          profileId: profile?.id,
          name: profile?.full_name || 'Unnamed Student',
          email: profile?.email || '',
          phone: profile?.phone || s.guardian_phone || '',
          avatarUrl: profile?.avatar_url || null,
          rollNumber: s.roll_number,
          class: s.class,
          section: s.section,
          gender: s.gender || 'male',
          dateOfBirth: s.date_of_birth,
          guardianName: s.guardian_name || '',
          guardianPhone: s.guardian_phone || '',
          address: s.address || '',
          admissionDate: s.admission_date,
          bloodGroup: s.blood_group || '',
          status: s.status || 'active',
          createdAt: s.created_at,
        };
      });

      // Client-side text search (if search query provided) across student name, email, roll number, father name
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        formattedStudents = formattedStudents.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.rollNumber.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.guardianName.toLowerCase().includes(q) ||
            s.class.toLowerCase().includes(q)
        );
      }

      return {
        students: formattedStudents,
        totalCount: count || formattedStudents.length,
      };
    } catch (error) {
      console.error('Error in studentService.getStudents:', error);
      throw error;
    }
  },

  /**
   * Fetch single student details by student ID
   */
  async getStudentById(id) {
    try {
      const { data: s, error } = await supabase
        .from('students')
        .select(`
          id,
          school_user_id,
          roll_number,
          class,
          section,
          date_of_birth,
          gender,
          guardian_name,
          guardian_phone,
          address,
          admission_date,
          blood_group,
          status,
          created_at,
          school_users (
            id,
            profile_id,
            role,
            is_active,
            profiles (
              id,
              full_name,
              email,
              phone,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!s) return null;

      const profile = s.school_users?.profiles;

      // Also fetch related attendance summary
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('id, date, status, remarks, courses(name)')
        .eq('student_id', id)
        .order('date', { ascending: false });

      // Also fetch related fee records
      const { data: feeData } = await supabase
        .from('fees')
        .select('*')
        .eq('student_id', id)
        .order('created_at', { ascending: false });

      // Also fetch class courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, name, schedule, subjects(name, code, total_marks)')
        .eq('class', s.class)
        .eq('section', s.section);

      return {
        id: s.id,
        schoolUserId: s.school_user_id,
        profileId: profile?.id,
        name: profile?.full_name || 'Unnamed Student',
        email: profile?.email || '',
        phone: profile?.phone || s.guardian_phone || '',
        avatarUrl: profile?.avatar_url || null,
        rollNumber: s.roll_number,
        class: s.class,
        section: s.section,
        gender: s.gender || 'male',
        dateOfBirth: s.date_of_birth,
        guardianName: s.guardian_name || '',
        guardianPhone: s.guardian_phone || '',
        address: s.address || '',
        admissionDate: s.admission_date,
        bloodGroup: s.blood_group || '',
        status: s.status || 'active',
        createdAt: s.created_at,
        attendance: attendanceData || [],
        fees: feeData || [],
        courses: coursesData || [],
      };
    } catch (error) {
      console.error('Error in studentService.getStudentById:', error);
      throw error;
    }
  },

  /**
   * Fetch student details by Supabase Auth User ID
   */
  async getStudentByAuthId(authId) {
    try {
      if (!authId) return null;

      // 1. First find school_users record for this authId (profile_id)
      const { data: suData, error: suErr } = await supabase
        .from('school_users')
        .select('id, profile_id, role')
        .eq('profile_id', authId)
        .maybeSingle();

      if (suErr) throw suErr;
      if (!suData) return null;

      // 2. Find students record
      const { data: studentRecord, error: stdErr } = await supabase
        .from('students')
        .select('id')
        .eq('school_user_id', suData.id)
        .maybeSingle();

      if (stdErr) throw stdErr;
      if (!studentRecord) return null;

      return await this.getStudentById(studentRecord.id);
    } catch (error) {
      console.error('Error in studentService.getStudentByAuthId:', error);
      return null;
    }
  },

  /**
   * Check if email is already registered by another profile
   */
  async checkEmailExists(email, excludeProfileId = null) {
    try {
      let query = supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase());

      if (excludeProfileId) {
        query = query.neq('id', excludeProfileId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data && data.length > 0);
    } catch (error) {
      console.error('Error checking email exists:', error);
      return false;
    }
  },

  /**
   * Upload student profile picture to Supabase Storage
   */
  async uploadAvatar(file) {
    if (!file) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('school-avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.warn('Storage upload error:', uploadError);
        // Fallback: Read as base64 data URL
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      const { data: { publicUrl } } = supabase.storage
        .from('school-avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return null;
    }
  },

  /**
   * Create a new student record
   */
  async createStudent(studentData, avatarFile = null) {
    try {
      // 1. Check duplicate email
      if (studentData.email) {
        const exists = await this.checkEmailExists(studentData.email);
        if (exists) {
          throw new Error(`Email "${studentData.email}" is already registered. Please use a unique email address.`);
        }
      }

      // 2. Upload avatar if provided
      let avatarUrl = studentData.avatarUrl || null;
      if (avatarFile) {
        const uploaded = await this.uploadAvatar(avatarFile);
        if (uploaded) avatarUrl = uploaded;
      }

      // 3. Create profile ID
      const newAuthId = crypto.randomUUID();
      const email = studentData.email?.trim().toLowerCase() || `${studentData.rollNumber.trim().toLowerCase()}@educator.edu.pk`;

      const { error: profError } = await supabase.from('profiles').insert({
        id: newAuthId,
        full_name: studentData.name.trim(),
        email,
        phone: studentData.phone?.trim() || studentData.guardianPhone?.trim() || null,
        avatar_url: avatarUrl,
      });
      if (profError) {
        if (profError.code === '23505' || profError.message?.includes('profiles_email_key')) {
          throw new Error(`Email "${email}" is already registered. Please provide a different email.`);
        }
        throw new Error(profError.message || 'Failed to create student user profile.');
      }

      // 4. Create school_users entry
      const { data: schoolUser, error: suError } = await supabase
        .from('school_users')
        .insert({
          profile_id: newAuthId,
          role: 'student',
          is_active: studentData.status === 'active',
        })
        .select()
        .single();
      if (suError) {
        // Rollback profile if school_user fails
        await supabase.from('profiles').delete().eq('id', newAuthId);
        throw new Error(suError.message || 'Failed to initialize student school account.');
      }

      // 5. Create student entry
      const { data: student, error: stdError } = await supabase
        .from('students')
        .insert({
          school_user_id: schoolUser.id,
          roll_number: studentData.rollNumber.trim(),
          class: studentData.class || 'Grade 10',
          section: studentData.section || 'A',
          date_of_birth: studentData.dateOfBirth?.trim() || null,
          gender: studentData.gender || 'male',
          guardian_name: studentData.guardianName?.trim() || null,
          guardian_phone: studentData.guardianPhone?.trim() || null,
          address: studentData.address?.trim() || null,
          admission_date: studentData.admissionDate?.trim() || new Date().toISOString().split('T')[0],
          blood_group: studentData.bloodGroup?.trim() || null,
          status: studentData.status || 'active',
        })
        .select()
        .single();

      if (stdError) {
        // Rollback school_user and profile if student record insertion fails
        await supabase.from('school_users').delete().eq('id', schoolUser.id);
        await supabase.from('profiles').delete().eq('id', newAuthId);

        if (stdError.code === '23505' || stdError.message?.includes('students_roll_number_key')) {
          throw new Error(`Roll number "${studentData.rollNumber.trim()}" is already assigned to another student. Please enter a unique roll number.`);
        }
        throw new Error(stdError.message || 'Failed to register student record.');
      }

      return student;
    } catch (error) {
      console.error('Error in studentService.createStudent:', error);
      throw error;
    }
  },

  /**
   * Update an existing student record
   */
  async updateStudent(id, studentData, avatarFile = null) {
    try {
      // 1. Fetch current student record
      const current = await this.getStudentById(id);
      if (!current) throw new Error('Student not found');

      // 2. Check duplicate email if changed
      if (studentData.email && studentData.email !== current.email) {
        const exists = await this.checkEmailExists(studentData.email, current.profileId);
        if (exists) {
          throw new Error(`Email "${studentData.email}" is already registered by another user.`);
        }
      }

      // 3. Upload avatar if new file provided
      let avatarUrl = current.avatarUrl;
      if (avatarFile) {
        const uploaded = await this.uploadAvatar(avatarFile);
        if (uploaded) avatarUrl = uploaded;
      }

      // 4. Update profiles table
      if (current.profileId) {
        const { error: profError } = await supabase
          .from('profiles')
          .update({
            full_name: studentData.name?.trim() || current.name,
            email: studentData.email?.trim().toLowerCase() || current.email,
            phone: studentData.phone || studentData.guardianPhone || current.phone,
            avatar_url: avatarUrl,
          })
          .eq('id', current.profileId);
        if (profError) throw profError;
      }

      // 5. Update school_users table
      if (current.schoolUserId) {
        const { error: suError } = await supabase
          .from('school_users')
          .update({
            is_active: studentData.status === 'active',
          })
          .eq('id', current.schoolUserId);
        if (suError) throw suError;
      }

      // 6. Update students table
      const { data: updatedStudent, error: stdError } = await supabase
        .from('students')
        .update({
          roll_number: studentData.rollNumber?.trim() || current.rollNumber,
          class: studentData.class || current.class,
          section: studentData.section || current.section,
          date_of_birth: studentData.dateOfBirth?.trim() || null,
          gender: studentData.gender || current.gender,
          guardian_name: studentData.guardianName?.trim() || null,
          guardian_phone: studentData.guardianPhone?.trim() || null,
          address: studentData.address?.trim() || null,
          admission_date: studentData.admissionDate?.trim() || current.admissionDate,
          blood_group: studentData.bloodGroup?.trim() || null,
          status: studentData.status || current.status,
        })
        .eq('id', id)
        .select()
        .single();

      if (stdError) {
        if (stdError.code === '23505' || stdError.message?.includes('students_roll_number_key')) {
          throw new Error(`Roll number "${studentData.rollNumber.trim()}" is already assigned to another student.`);
        }
        throw new Error(stdError.message || 'Failed to update student profile.');
      }
      return updatedStudent;
    } catch (error) {
      console.error('Error in studentService.updateStudent:', error);
      throw error;
    }
  },

  /**
   * Delete student record and cascading user/profile
   */
  async deleteStudent(id) {
    try {
      // Find profileId before deletion
      const current = await this.getStudentById(id);

      // Deleting from profiles will cascade delete school_users and students automatically
      if (current?.profileId) {
        const { error: profError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', current.profileId);

        if (profError) {
          // If cascading fails, delete directly from students
          const { error: stdError } = await supabase
            .from('students')
            .delete()
            .eq('id', id);
          if (stdError) throw new Error(stdError.message || 'Failed to delete student record.');
        }
      } else {
        const { error: stdError } = await supabase
          .from('students')
          .delete()
          .eq('id', id);
        if (stdError) throw new Error(stdError.message || 'Failed to delete student record.');
      }

      return true;
    } catch (error) {
      console.error('Error in studentService.deleteStudent:', error);
      throw error;
    }
  },
};
