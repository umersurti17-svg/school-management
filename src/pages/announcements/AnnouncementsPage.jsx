import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineSpeakerphone,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineBookmark,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { announcementService } from '../../services/announcementService';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AnnouncementsPage() {
  const { user, isAdmin, role } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetRoleFilter, setTargetRoleFilter] = useState('');

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    targetRole: 'all',
    isPinned: false,
  });

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncements({
        targetRole: targetRoleFilter || role,
      });
      setAnnouncements(data);
    } catch (err) {
      toast.error('Failed to load announcements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [targetRoleFilter, role]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and message content are required');
      return;
    }

    try {
      setSubmitting(true);
      await announcementService.createAnnouncement({
        ...form,
        postedBy: user?.id,
      });
      toast.success('Announcement broadcasted successfully!');
      setShowCreateModal(false);
      setForm({
        title: '',
        content: '',
        targetRole: 'all',
        isPinned: false,
      });
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.message || 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async (id, currentPinned) => {
    try {
      await announcementService.togglePin(id, !currentPinned);
      toast.success(!currentPinned ? 'Announcement pinned to top' : 'Announcement unpinned');
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to update pin state');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await announcementService.deleteAnnouncement(deleteId);
      toast.success('Announcement removed');
      setDeleteId(null);
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to delete announcement');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getTargetBadge = (target) => {
    switch (target) {
      case 'all':
        return <Badge variant="primary">All School</Badge>;
      case 'teacher':
        return <Badge variant="warning">Faculty Only</Badge>;
      case 'student':
        return <Badge variant="success">Students Only</Badge>;
      default:
        return <Badge variant="default">{target}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            School Notices & Announcements
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with academic circulars, exam schedules, events, and institutional notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={HiOutlineRefresh}
            onClick={fetchAnnouncements}
          >
            Refresh
          </Button>

          {isAdmin && (
            <Button
              variant="primary"
              icon={HiOutlinePlus}
              onClick={() => setShowCreateModal(true)}
            >
              Post Notice
            </Button>
          )}
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: '', label: 'All Notices' },
          { id: 'all', label: 'School Wide' },
          { id: 'student', label: 'Student Notices' },
          { id: 'teacher', label: 'Faculty Notices' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTargetRoleFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              targetRoleFilter === tab.id
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="py-16">
          <Loader size="lg" text="Loading school notices..." />
        </div>
      ) : announcements.length === 0 ? (
        <Card className="p-8 sm:p-12">
          <EmptyState
            icon={HiOutlineSpeakerphone}
            title={targetRoleFilter ? 'No Notices for Selected Filter' : 'Noticeboard is Empty'}
            description={
              targetRoleFilter
                ? 'No announcements or circulars found for the selected recipient role. Try selecting All Notices.'
                : 'There are currently no circulars or announcements posted on the school noticeboard. Important notices and institutional memos will appear here.'
            }
            actionLabel={
              targetRoleFilter
                ? 'Show All Notices'
                : isAdmin
                ? 'Post Announcement'
                : undefined
            }
            actionIcon={targetRoleFilter ? HiOutlineRefresh : HiOutlinePlus}
            onAction={
              targetRoleFilter
                ? () => setTargetRoleFilter('')
                : isAdmin
                ? () => setShowCreateModal(true)
                : undefined
            }
            secondaryActionLabel={
              targetRoleFilter && isAdmin ? 'Post Announcement' : undefined
            }
            onSecondaryAction={
              targetRoleFilter && isAdmin ? () => setShowCreateModal(true) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {announcements.map((item) => (
            <Card
              key={item.id}
              className={`p-5 flex flex-col justify-between transition-all duration-200 ${
                item.isPinned
                  ? 'border-2 border-primary-500/80 bg-primary-50/20 dark:bg-primary-950/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getTargetBadge(item.targetRole)}
                    {item.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 px-2 py-0.5 rounded-md">
                        <HiOutlineBookmark className="w-3.5 h-3.5 fill-current" />
                        Pinned
                      </span>
                    )}
                    {(item.title?.includes('Demo Data') || item.title?.includes('(Demo)')) && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        Demo Data
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  {item.title}
                </h3>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              {/* Author & Controls footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-700 dark:text-slate-200">
                    {item.postedBy.charAt(0)}
                  </div>
                  <span>Posted by: <strong className="text-slate-700 dark:text-slate-200">{item.postedBy}</strong></span>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePin(item.id, item.isPinned)}
                      className="p-1 rounded-lg text-slate-400 hover:text-primary-600 transition-colors"
                      title={item.isPinned ? 'Unpin notice' : 'Pin to top'}
                    >
                      <HiOutlineBookmark className={`w-4 h-4 ${item.isPinned ? 'text-primary-600 fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1 rounded-lg text-rose-400 hover:text-rose-600 transition-colors"
                      title="Delete notice"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Post Notice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Post School Notice"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Notice Title"
            placeholder="e.g. Mid-Term Examination Schedule Announcement"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Notice Content
            </label>
            <textarea
              rows="4"
              placeholder="Write the circular message here..."
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Target Audience
              </label>
              <select
                value={form.targetRole}
                onChange={(e) => setForm((p) => ({ ...p, targetRole: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Everyone (All School)</option>
                <option value="student">Students Only</option>
                <option value="teacher">Faculty Only</option>
              </select>
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isPinned}
                  onChange={(e) => setForm((p) => ({ ...p, isPinned: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                />
                <span>Pin to top</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting}
            >
              Publish Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Notice"
        message="Are you sure you want to remove this announcement from the school notice board?"
        confirmText="Yes, Delete"
        confirmVariant="danger"
        isLoading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
