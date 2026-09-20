import { supabase } from '../config/supabaseClient';

/**
 * Authentication Service for The Educator School
 */
export const authService = {
  /**
   * Sign up with email, password, full name, and role
   * The first registered user automatically becomes Admin.
   * If an Admin already exists, new users become Students by default.
   */
  async signUp({ email, password, fullName, role = 'student', phone = '' }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    // Check if an admin currently exists in the system
    let assignedRole = 'student';
    try {
      const { count } = await supabase
        .from('school_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')
        .eq('is_active', true);

      if (count === 0) {
        // First user becomes Admin automatically
        assignedRole = 'admin';
      } else {
        // Admin already exists, default to student (or teacher if specifically created)
        assignedRole = (role === 'teacher' || role === 'admin') ? role : 'student';
      }
    } catch (e) {
      console.warn('Could not check admin count before signup:', e);
      assignedRole = (role === 'admin' || role === 'teacher') ? role : 'student';
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          role: assignedRole,
          phone: phone.trim(),
        },
      },
    });

    if (error) throw error;

    // The database trigger `on_auth_user_created` (`handle_new_user`) handles
    // creating profiles, school_users, and students rows atomically.
    return data;
  },

  /**
   * Ensure profiles & school_users records exist for an authenticated user
   */
  async ensureProfileAndRole(authUser, defaultRole = null, name = '', phone = '') {
    if (!authUser?.id) return null;

    const userId = authUser.id;
    const userEmail = authUser.email || '';
    const userName = name || authUser.user_metadata?.full_name || userEmail.split('@')[0] || 'User';
    const userPhone = phone || authUser.user_metadata?.phone || null;

    try {
      // Check existing school_user record first
      const { data: existingSU } = await supabase
        .from('school_users')
        .select('id, role, is_active')
        .eq('profile_id', userId)
        .maybeSingle();

      let targetRole = existingSU?.role;

      if (!targetRole) {
        if (defaultRole) {
          targetRole = defaultRole;
        } else {
          // Check if any admin exists in the system
          const { count } = await supabase
            .from('school_users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'admin')
            .eq('is_active', true);

          if (count === 0) {
            targetRole = 'admin';
          } else {
            targetRole = authUser.user_metadata?.role || 'student';
          }
        }
      }

      // 1. Ensure profile exists
      const { error: profErr } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            auth_id: userId,
            full_name: userName,
            email: userEmail,
            phone: userPhone,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (profErr) {
        console.warn('Profile upsert warning:', profErr.message);
      }

      // 2. Ensure school_users exists with valid role
      const { data: suData, error: suErr } = await supabase
        .from('school_users')
        .upsert(
          {
            profile_id: userId,
            role: targetRole,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'profile_id' }
        )
        .select()
        .maybeSingle();

      if (suErr) {
        console.warn('school_users upsert warning:', suErr.message);
      }

      const activeSUId = suData?.id || existingSU?.id;

      // 3. If student, ensure student record exists
      if (targetRole === 'student' && activeSUId) {
        const { data: existingStudent } = await supabase
          .from('students')
          .select('id')
          .eq('school_user_id', activeSUId)
          .maybeSingle();

        if (!existingStudent) {
          const rollNum = 'STD-2026-' + Math.floor(100 + Math.random() * 900);
          await supabase
            .from('students')
            .insert({
              school_user_id: activeSUId,
              roll_number: rollNum,
              class: 'Grade 10',
              section: 'A',
              status: 'active',
              admission_date: new Date().toISOString().split('T')[0],
            });
        }
      }

      // 4. If teacher, ensure teacher record exists
      if (targetRole === 'teacher' && activeSUId) {
        const { data: existingTeacher } = await supabase
          .from('teachers')
          .select('id')
          .eq('school_user_id', activeSUId)
          .maybeSingle();

        if (!existingTeacher) {
          await supabase
            .from('teachers')
            .insert({
              school_user_id: activeSUId,
              employee_id: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
              qualification: 'M.Sc. Education',
              specialization: 'General Academics',
              joining_date: new Date().toISOString().split('T')[0],
              status: 'active',
            });
        }
      }

      return {
        role: targetRole,
        school_user_id: activeSUId,
      };
    } catch (e) {
      console.warn('Self-heal ensureProfileAndRole caught error:', e);
      return null;
    }
  },

  /**
   * Update user profile info (name, phone, avatar)
   */
  async updateProfile(userId, { fullName, phone, avatarUrl }) {
    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (fullName !== undefined) updates.full_name = fullName.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email, password, rememberMe = true) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw error;

    if (!rememberMe) {
      sessionStorage.setItem('school_session_mode', 'transient');
    } else {
      sessionStorage.removeItem('school_session_mode');
    }

    return data;
  },

  /**
   * Fetch user profile and assigned role from database
   * Never falls back to Guest if the user is authenticated.
   */
  async getUserProfileAndRole(authUserId) {
    if (!authUserId) return null;

    try {
      // 1. Query profiles + joined school_users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          avatar_url,
          created_at,
          school_users (
            id,
            role,
            is_active
          )
        `)
        .or(`id.eq.${authUserId},auth_id.eq.${authUserId}`)
        .maybeSingle();

      if (!profileError && profileData) {
        const schoolUser = Array.isArray(profileData.school_users)
          ? profileData.school_users[0]
          : profileData.school_users;

        if (schoolUser?.role) {
          return {
            id: profileData.id,
            full_name: profileData.full_name,
            email: profileData.email,
            phone: profileData.phone,
            avatar_url: profileData.avatar_url,
            role: schoolUser.role,
            school_user_id: schoolUser.id,
            is_active: schoolUser.is_active ?? true,
          };
        }
      }

      // 2. Self-heal: If profile or school_users was missing, ensure it
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser && currentUser.id === authUserId) {
        await this.ensureProfileAndRole(currentUser);

        // Retry query once after self-healing
        const { data: healedProfile } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            email,
            phone,
            avatar_url,
            created_at,
            school_users (
              id,
              role,
              is_active
            )
          `)
          .or(`id.eq.${authUserId},auth_id.eq.${authUserId}`)
          .maybeSingle();

        if (healedProfile) {
          const healedSchoolUser = Array.isArray(healedProfile.school_users)
            ? healedProfile.school_users[0]
            : healedProfile.school_users;

          return {
            id: healedProfile.id,
            full_name: healedProfile.full_name,
            email: healedProfile.email,
            phone: healedProfile.phone,
            avatar_url: healedProfile.avatar_url,
            role: healedSchoolUser?.role || currentUser.user_metadata?.role || 'student',
            school_user_id: healedSchoolUser?.id,
            is_active: healedSchoolUser?.is_active ?? true,
          };
        }

        // Fallback to auth metadata if DB table read was constrained
        return {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Student',
          email: currentUser.email,
          phone: currentUser.user_metadata?.phone || null,
          avatar_url: null,
          role: currentUser.user_metadata?.role || 'student',
          school_user_id: null,
          is_active: true,
        };
      }

      return null;
    } catch (err) {
      console.error('Unexpected error fetching profile, falling back to auth user metadata:', err);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        return {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Student',
          email: currentUser.email,
          phone: currentUser.user_metadata?.phone || null,
          avatar_url: null,
          role: currentUser.user_metadata?.role || 'student',
          school_user_id: null,
          is_active: true,
        };
      }
      return null;
    }
  },

  /**
   * Request password reset email
   */
  async sendPasswordResetEmail(email) {
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: redirectUrl }
    );
    if (error) throw error;
    return data;
  },

  /**
   * Update password for current authenticated user
   */
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    sessionStorage.clear();
    if (error) throw error;
  },

  /**
   * Get current active session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
};
