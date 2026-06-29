import { FormEvent, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Camera01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';
import { api, type ApiResponse, type User } from '../../lib/api';

type AccountType = 'customer' | 'handyman' | 'business';

const ACCOUNT_TYPES: Array<{ value: AccountType; label: string }> = [
  { value: 'customer', label: 'Customer' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'business', label: 'Business' },
];

const AVATAR_PLACEHOLDER = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=019B5F&color=fff&size=128`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-5">{title}</h2>
      {children}
    </div>
  );
}

export default function DashboardProfile() {
  const { user, updateUser } = useAuth();

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
  const avatarSrc = user?.avatar?.url ?? AVATAR_PLACEHOLDER(displayName);

  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [dob, setDob] = useState(user?.dob ?? '');
  const [accountType, setAccountType] = useState<AccountType>((user?.accountType as AccountType) ?? 'customer');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  // Suretag
  const [suretag, setSuretag] = useState(user?.suretag ?? '');
  const [suretagLoading, setSuretagLoading] = useState(false);
  const [suretagError, setSuretagError] = useState('');
  const [suretagSuccess, setSuretagSuccess] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const isSeller = user?.role === 'seller';

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);
    setProfileLoading(true);
    try {
      const res = await api.put<ApiResponse<User>>('/users/', {
        firstName,
        lastName,
        phone,
        bio,
        dob: dob || undefined,
        accountType,
      }, true);
      updateUser(res.data);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError('');
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setAvatarLoading(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
      const res = await api.post<ApiResponse<User>>('/users/avatar', form, true);
      updateUser(res.data);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Failed to upload avatar');
      setAvatarPreview(null);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSuretagSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuretagError('');
    setSuretagSuccess(false);
    setSuretagLoading(true);
    try {
      const res = await api.patch<ApiResponse<User>>('/users/suretag', { suretag }, true);
      updateUser(res.data);
      setSuretagSuccess(true);
      setTimeout(() => setSuretagSuccess(false), 3000);
    } catch (err) {
      setSuretagError(err instanceof Error ? err.message : 'Failed to update suretag');
    } finally {
      setSuretagLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    setPasswordLoading(true);
    try {
      await api.patch<ApiResponse<unknown>>('/auth/change-password', { password: newPassword }, true);
      setCurrentPassword('');
      setNewPassword('');
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">

      {/* Avatar */}
      <Section title="Profile photo">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={avatarPreview ?? avatarSrc}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover border border-gray-200"
            />
            {avatarLoading && (
              <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <HugeiconsIcon icon={Camera01Icon} size={15} color="currentColor" strokeWidth={2} />
              Change photo
            </button>
            {avatarError && <p className="text-xs text-red-500 mt-1.5">{avatarError}</p>}
            <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WEBP · Max 5 MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </Section>

      {/* Personal info */}
      <Section title="Personal information">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="auth-label">First name</label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ada"
                className="auth-input"
              />
            </div>
            <div>
              <label className="auth-label">Last name</label>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Okonkwo"
                className="auth-input"
              />
            </div>
          </div>

          <div>
            <label className="auth-label">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08012345678"
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-label">Date of birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-label">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell customers a bit about yourself…"
              className="auth-input resize-none"
            />
          </div>

          <div>
            <label className="auth-label">Account type</label>
            <div className="grid grid-cols-3 gap-2">
              {ACCOUNT_TYPES.map((type) => {
                const active = accountType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setAccountType(type.value)}
                    className={`py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      active
                        ? 'border-[#019B5F] bg-[#019B5F]/6 text-[#019B5F]'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {profileError && <p className="text-sm text-red-600">{profileError}</p>}
          {profileSuccess && (
            <p className="text-sm text-[#019B5F] flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} color="currentColor" strokeWidth={2.5} />
              Profile updated
            </p>
          )}

          <button
            type="submit"
            disabled={profileLoading}
            className="btn-pill disabled:opacity-60"
          >
            {profileLoading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </Section>

      {/* Suretag — sellers only */}
      {isSeller && (
        <Section title="Your plug tag">
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Your suretag is your public handle — customers can find you at{' '}
            <span className="font-mono text-gray-700">sureplug.com/p/{suretag || 'yourtag'}</span>.
          </p>
          <form onSubmit={handleSuretagSubmit} className="flex gap-2">
            <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-[#019B5F]/30 focus-within:border-[#019B5F] transition-all">
              <span className="text-gray-400 text-sm mr-1">@</span>
              <input
                value={suretag}
                onChange={(e) => setSuretag(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                placeholder="yourtag"
                className="flex-1 py-2.5 text-sm text-gray-900 bg-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={suretagLoading || !suretag}
              className="btn-pill shrink-0 disabled:opacity-60"
            >
              {suretagLoading ? 'Saving…' : 'Update'}
            </button>
          </form>
          {suretagError && <p className="text-sm text-red-600 mt-2">{suretagError}</p>}
          {suretagSuccess && (
            <p className="text-sm text-[#019B5F] mt-2 flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} color="currentColor" strokeWidth={2.5} />
              Suretag updated
            </p>
          )}
        </Section>
      )}

      {/* Change password */}
      <Section title="Change password">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="auth-label">Current password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="auth-input"
            />
          </div>
          <div>
            <label className="auth-label">New password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="auth-input"
            />
          </div>
          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordSuccess && (
            <p className="text-sm text-[#019B5F] flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} color="currentColor" strokeWidth={2.5} />
              Password changed
            </p>
          )}
          <button type="submit" disabled={passwordLoading} className="btn-pill disabled:opacity-60">
            {passwordLoading ? 'Updating…' : 'Change password'}
          </button>
        </form>
      </Section>
    </div>
  );
}
