
import { useState } from "react";
import apiClient from "../../lib/apiClient";
import axios from "axios";

interface Profile {
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSettings({ user }: Profile) {
  const [username, setUsername] = useState(user.username);
  const [email] = useState(user.email);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [originalUsername, setOriginalUsername] = useState(user.username);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [passwordChange, setPasswordChange] = useState<PasswordChange>({ oldPassword: "", newPassword: "", confirmPassword: ""});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSaveSuccess, setPasswordSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await apiClient.put("/user/details", { username });
      setOriginalUsername(username);
      setIsEditingUsername(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(originalUsername);
    setIsEditingUsername(false);
    setSaveSuccess(false);
  };

  const changePassword = async () => {
    setSaving(true);
    setPasswordSaveSuccess(false);
    try {
      await apiClient.put("/user/password", passwordChange);
      setPasswordChange({ oldPassword: "", newPassword: "", confirmPassword: ""});
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        setPasswordErrors(err.response?.data.data);
      }

      // Optionally show an error message
    }
  };

  return (
    <div className="w-full text-gray-700 font-sans flex flex-col gap-4">

      {/* Username */}
      <div className="flex items-center space-x-2">
        <label className="flex-shrink-0 w-[75px] font-semibold border">Username:</label>
        {isEditingUsername ? (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="New username"
              disabled={saving}
              className="flex-grow px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="flex-grow">{username}</span>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Edit
            </button>
          </>
        )}
      </div>
      {saveSuccess && <p className="text-green-600 ml-[75px]">Username updated!</p>}

      {/* Email */}
      <div className="flex items-center space-x-2 py-1">
        <label className="flex-shrink-0 w-[75px] font-semibold">Email:</label>
        <span className="flex-grow break-all">{email}</span>
      </div>

      {/* Password */}
      <div className="flex flex-col justify-center py-1 space-y-3">
        <label className="block font-semibold">Change Password</label>

        <div className="flex items-center space-x-2">
          <label className="w-[75px] text-right text-sm">Old:</label>
          <input
            type="password"
            value={passwordChange.oldPassword}
            onChange={(e) => setPasswordChange({ ...passwordChange, oldPassword: e.target.value })}
            placeholder="Old password"
            disabled={saving}
            className={`flex-grow px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              passwordErrors.oldPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {passwordErrors.oldPassword && (
          <p className="text-xs text-red-600 ml-[75px]">{passwordErrors.oldPassword}</p>
        )}

        <div className="flex items-center space-x-2">
          <label className="w-[75px] text-right text-sm">New:</label>
          <input
            type="password"
            value={passwordChange.newPassword}
            onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
            placeholder="New password"
            disabled={saving}
            className={`flex-grow px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              passwordErrors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {passwordErrors.newPassword && (
          <p className="text-xs text-red-600 ml-[75px]">{passwordErrors.newPassword}</p>
        )}

        <div className="flex items-center space-x-2">
          <label className="w-[75px] text-right text-sm">Confirm:</label>
          <input
            type="password"
            value={passwordChange.confirmPassword}
            onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
            disabled={saving}
            className={`flex-grow px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {passwordErrors.confirmPassword && (
          <p className="text-xs text-red-600 ml-[75px]">{passwordErrors.confirmPassword}</p>
        )}

        <button
          onClick={changePassword}
          disabled={saving}
          className="mt-1 w-full py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Password"}
        </button>
        {passwordSaveSuccess && (
          <p className="text-green-600 text-center mt-1">Password updated!</p>
        )}
      </div>
    </div>
  );
}

