import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUser, HiLogout, HiLockClosed, HiCheck } from 'react-icons/hi';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout, updateUser ,changePassword,} = useAuth();
  const navigate = useNavigate();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLogoutConfirm, setIsLogoutConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

const handleProfileSave = async () => {
  try {
    await updateUser(profileForm);

    setIsEditingProfile(false);

    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  } catch (err) {
    alert(err.response?.data?.message || "Update failed");
  }
};

const handlePasswordChange = async () => {
  if (!passwordForm.current) {
    setPasswordError("Enter current password");
    return;
  }

  if (passwordForm.newPass.length < 6) {
    setPasswordError("New password must be at least 6 characters");
    return;
  }

  if (passwordForm.newPass !== passwordForm.confirm) {
    setPasswordError("Passwords do not match");
    return;
  }

  try {
    await changePassword(
      passwordForm.current,
      passwordForm.newPass
    );

    setIsChangingPassword(false);

    setPasswordForm({
      current: "",
      newPass: "",
      confirm: "",
    });

    setPasswordError("");

    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  } catch (err) {
    setPasswordError(
      err.response?.data?.message || "Failed to change password"
    );
  }
};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account settings.</p>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 text-accent-700 dark:bg-accent-900/30 dark:border-accent-700 dark:text-accent-400 px-4 py-2.5 rounded-lg text-sm">
          <HiCheck size={16} />
          Changes saved successfully
        </div>
      )}

      {/* Profile card */}
      <div className="card">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-primary-600 text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
            {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Member since January 2024</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-0.5">Full Name</p>
              <p className="font-medium text-gray-700 dark:text-gray-200">{user?.name}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-0.5">Email</p>
              <p className="font-medium text-gray-700 dark:text-gray-200 truncate">{user?.email}</p>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => setIsEditingProfile(true)}
            icon={<HiUser size={15} />}
            className="w-full justify-center"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Security card */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Security</h3>
        <Button
          variant="secondary"
          onClick={() => setIsChangingPassword(true)}
          icon={<HiLockClosed size={14} />}
          className="w-full justify-center"
        >
          Change Password
        </Button>
      </div>

      {/* Danger zone */}
      <div className="card border border-red-200 dark:border-red-800/50">
        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Account Actions</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
          Signing out will end your current session.
        </p>
        <Button
          variant="danger"
          onClick={() => setIsLogoutConfirm(true)}
          icon={<HiLogout size={14} />}
          className="w-full justify-center"
        >
          Sign Out
        </Button>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditingProfile} onClose={() => setIsEditingProfile(false)} title="Edit Profile">
        <div className="flex flex-col gap-4">
          <Input
            label="Full Name"
            value={profileForm.name}
            onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
          />
          <Input
            label="Email"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Your email"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
            <Button onClick={handleProfileSave}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={isChangingPassword} onClose={() => setIsChangingPassword(false)} title="Change Password">
        <div className="flex flex-col gap-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.current}
            onChange={(e) => {
              setPasswordForm((p) => ({ ...p, current: e.target.value }));
              setPasswordError('');
            }}
            placeholder="Current password"
          />
          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPass}
            onChange={(e) => {
              setPasswordForm((p) => ({ ...p, newPass: e.target.value }));
              setPasswordError('');
            }}
            placeholder="Min. 6 characters"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirm}
            onChange={(e) => {
              setPasswordForm((p) => ({ ...p, confirm: e.target.value }));
              setPasswordError('');
            }}
            placeholder="Re-enter new password"
          />
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </div>
      </Modal>

      {/* Logout confirm modal */}
      <Modal isOpen={isLogoutConfirm} onClose={() => setIsLogoutConfirm(false)} title="Sign Out">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
          Are you sure you want to sign out?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setIsLogoutConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleLogout} icon={<HiLogout size={14} />}>Sign Out</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
