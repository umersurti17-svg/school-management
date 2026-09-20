import { useState, useEffect } from 'react';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineCamera,
  HiOutlineLockClosed,
  HiOutlineSave,
  HiOutlineKey,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabaseClient';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, profile, role, updateUserProfile, updatePassword } = useAuth();

  // Profile Edit State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }

      setUploadingAvatar(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `profile-${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('school-avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('school-avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      await updateUserProfile({ avatarUrl: publicUrl });
      toast.success('Avatar updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload avatar');
      console.error(err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Full Name is required');
      return;
    }

    try {
      setSavingProfile(true);
      await updateUserProfile({ fullName, phone });
    } catch (err) {
      // Toast handled by AuthContext
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setSavingPassword(true);
      await updatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Toast handled by AuthContext
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User Profile & Security
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, profile picture, and account credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Overview Card */}
        <Card className="p-6 text-center space-y-4 flex flex-col items-center justify-center">
          <div className="relative group">
            <Avatar
              src={avatarUrl}
              name={fullName || profile?.full_name}
              size="2xl"
              className="ring-4 ring-primary-500/20 shadow-xl"
            />
            <label className="absolute bottom-0 right-0 p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 cursor-pointer shadow-lg transition-transform hover:scale-110">
              <HiOutlineCamera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {fullName || profile?.full_name || 'User'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {profile?.email || user?.email}
            </p>
            <div className="mt-2.5 inline-block">
              <Badge variant="primary" size="md" className="uppercase font-bold tracking-wider">
                {role || 'Student'}
              </Badge>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Account ID:</span>
              <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                {user?.id?.slice(0, 13)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Active
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Member Since:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatDate(profile?.created_at || new Date().toISOString())}
              </span>
            </div>
          </div>
        </Card>

        {/* Right Column: Edit Profile & Password Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Information Card */}
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <HiOutlineUser className="w-5 h-5 text-primary-600" />
              Personal Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={HiOutlineUser}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  value={profile?.email || user?.email || ''}
                  icon={HiOutlineMail}
                  disabled
                  helper="Email cannot be altered once registered."
                />

                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={HiOutlinePhone}
                  placeholder="+92 300 1234567"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  icon={HiOutlineSave}
                  loading={savingProfile}
                  disabled={savingProfile}
                >
                  Save Profile Info
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Card */}
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <HiOutlineKey className="w-5 h-5 text-primary-600" />
              Change Security Password
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={HiOutlineLockClosed}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={HiOutlineLockClosed}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={savingPassword}
                  disabled={savingPassword}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
