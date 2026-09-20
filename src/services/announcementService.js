import { supabase } from '../config/supabaseClient';

export const announcementService = {
  /**
   * Fetch announcements for given role or all
   */
  async getAnnouncements({ targetRole = '', limit = 30 } = {}) {
    try {
      let query = supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          target_role,
          is_pinned,
          created_at,
          posted_by,
          profiles:posted_by (
            full_name,
            email,
            avatar_url
          )
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (targetRole && targetRole !== 'admin') {
        // Teachers/students see announcements targeted to all or their specific role
        query = query.in('target_role', ['all', targetRole]);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        targetRole: a.target_role,
        isPinned: a.is_pinned || false,
        createdAt: a.created_at,
        postedBy: a.profiles?.full_name || 'Administration',
        postedByEmail: a.profiles?.email || '',
        avatarUrl: a.profiles?.avatar_url,
      }));
    } catch (error) {
      console.error('Error in announcementService.getAnnouncements:', error);
      throw error;
    }
  },

  /**
   * Create new announcement
   */
  async createAnnouncement({ title, content, targetRole = 'all', isPinned = false, postedBy }) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: title.trim(),
          content: content.trim(),
          target_role: targetRole,
          is_pinned: isPinned,
          posted_by: postedBy || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in announcementService.createAnnouncement:', error);
      throw error;
    }
  },

  /**
   * Delete announcement
   */
  async deleteAnnouncement(id) {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  /**
   * Toggle pinned state
   */
  async togglePin(id, isPinned) {
    const { data, error } = await supabase
      .from('announcements')
      .update({ is_pinned: isPinned })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
