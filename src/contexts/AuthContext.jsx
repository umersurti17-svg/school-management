import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../config/supabaseClient';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to load profile & role from DB
  const loadProfile = useCallback(async (authUserId, authUserObj = null) => {
    if (!authUserId) {
      setProfile(null);
      setRole(null);
      return null;
    }

    try {
      const userDetails = await authService.getUserProfileAndRole(authUserId);
      if (userDetails) {
        setProfile(userDetails);
        const resolvedRole = userDetails.role || authUserObj?.user_metadata?.role || 'student';
        setRole(resolvedRole);
        return { ...userDetails, role: resolvedRole };
      }

      // Fallback if DB fetch returned empty
      const fallbackRole = authUserObj?.user_metadata?.role || 'student';
      const fallbackName = authUserObj?.user_metadata?.full_name || authUserObj?.email?.split('@')[0] || 'User';
      const fallbackProfile = {
        id: authUserId,
        full_name: fallbackName,
        email: authUserObj?.email || '',
        phone: authUserObj?.user_metadata?.phone || null,
        avatar_url: null,
        role: fallbackRole,
        is_active: true,
      };
      setProfile(fallbackProfile);
      setRole(fallbackRole);
      return fallbackProfile;
    } catch (err) {
      console.error('Error in loadProfile:', err);
      const fallbackRole = authUserObj?.user_metadata?.role || 'student';
      setRole(fallbackRole);
      return null;
    }
  }, []);

  // Initialize and restore session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // 1. Get initial session
        const currentSession = await authService.getSession();
        if (!isMounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await loadProfile(currentSession.user.id, currentSession.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Error initializing auth session:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    // 2. Listen to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        if (newSession?.user) {
          setSession(newSession);
          setUser(newSession.user);
          await loadProfile(newSession.user.id, newSession.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [loadProfile]);

  /**
   * User Sign Up
   * Uses supabase.auth.signUp() and handles immediate session creation or email verification gracefully.
   */
  const signUp = useCallback(async ({ email, password, fullName, role = 'student', phone = '' }) => {
    try {
      setLoading(true);
      const assignedRole = (role === 'admin' || role === 'teacher') ? role : 'student';
      const cleanEmail = email.trim().toLowerCase();
      
      // 1. Call standard Supabase signUp
      const data = await authService.signUp({ email: cleanEmail, password, fullName, role: assignedRole, phone });
      
      // Check if user already exists with empty identities (GoTrue behavior for duplicate emails)
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error('This email is already registered. Please sign in instead.');
      }

      let activeSession = data?.session;
      let activeUser = data?.user;

      // 2. Direct session returned (email confirmation disabled)
      if (activeSession && activeUser) {
        setUser(activeUser);
        setSession(activeSession);
        const userProfile = await loadProfile(activeUser.id, activeUser);
        toast.success('Account created successfully. Welcome!');
        return { success: true, autoLogin: true, role: userProfile?.role || assignedRole };
      }

      // 3. If session wasn't bundled, safely attempt authentication once
      if (activeUser && !activeSession) {
        try {
          const loginRes = await authService.signIn(cleanEmail, password);
          if (loginRes?.session && loginRes?.user) {
            setUser(loginRes.user);
            setSession(loginRes.session);
            const userProfile = await loadProfile(loginRes.user.id, loginRes.user);
            toast.success('Account created successfully. Welcome!');
            return { success: true, autoLogin: true, role: userProfile?.role || assignedRole };
          }
        } catch (signInErr) {
          // If direct login is deferred or confirmation is pending, do not throw 'Invalid login credentials'
          console.log('Direct sign-in deferred:', signInErr?.message);
        }
      }

      // 4. If confirmation required or auto-login deferred
      toast.success('Account created successfully! Please verify your email or sign in.');
      return { success: true, autoLogin: false, emailConfirmationRequired: true, role: assignedRole };
    } catch (error) {
      const message = error.message || 'Failed to create account. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadProfile]);

  /**
   * User Sign In
   */
  const signIn = useCallback(async (email, password, rememberMe = true) => {
    try {
      setLoading(true);
      const data = await authService.signIn(email, password, rememberMe);
      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        const userProfile = await loadProfile(data.user.id, data.user);
        toast.success(`Welcome back, ${userProfile?.full_name || 'User'}!`);
        return { success: true, role: userProfile?.role || 'student' };
      }
      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to sign in. Please check your credentials.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadProfile]);

  /**
   * User Sign Out
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Send Password Reset
   */
  const resetPassword = useCallback(async (email) => {
    try {
      await authService.sendPasswordResetEmail(email);
      toast.success('Password reset instructions sent to your email.');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to send password reset email.';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Update Password
   */
  const updatePassword = useCallback(async (newPassword) => {
    try {
      await authService.updatePassword(newPassword);
      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to update password.';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Refresh profile data
   */
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      return await loadProfile(user.id, user);
    }
  }, [user, loadProfile]);

  /**
   * Update profile info
   */
  const updateUserProfile = useCallback(async (details) => {
    if (!user?.id) throw new Error('Not logged in');
    try {
      setLoading(true);
      await authService.updateProfile(user.id, details);
      const updated = await loadProfile(user.id, user);
      toast.success('Profile updated successfully!');
      return updated;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, loadProfile]);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      role,
      loading,
      isAuthenticated: !!user,
      isAdmin: role === 'admin',
      isTeacher: role === 'teacher',
      isStudent: role === 'student',
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      updateUserProfile,
      refreshProfile,
    }),
    [session, user, profile, role, loading, signUp, signIn, signOut, resetPassword, updatePassword, updateUserProfile, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
