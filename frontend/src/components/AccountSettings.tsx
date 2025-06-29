
import { useState } from "react";
import apiClient from "../../lib/apiClient";

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

  const [passwordChange, setPasswordChange] = useState<PasswordChange>({ oldPassword: "", newPassword: "", confirmPassword: ""});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put("/user/details", { "username": username });
      setOriginalUsername(username);
      setIsEditingUsername(false);
    } catch (err) {
      console.error(err);
      // Optionally show an error message
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(originalUsername);
    setIsEditingUsername(false);
  };

  const changePassword = async () => {
    try {
      await apiClient.put("/user/password", passwordChange);
      setPasswordChange({ oldPassword: "", newPassword: "", confirmPassword: ""});
    } catch (err : any) {
      console.log(err);
      setPasswordErrors(err.response.data.data);
      // Optionally show an error message
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-16 gap-4 justify-between text-gray-800">
      <div className="flex justify-between">
        <div className="flex flex-col">
            <label className="font-semibold">Username:</label>
            {isEditingUsername ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="py-2 rounded-lg focus:outline-none focus:ring"
              />
            ) : (
              <span className="py-2">{username}</span>
            )}
            </div>

        <div className="flex gap-4 mt-4">
          {isEditingUsername ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[rgb(85,73,255)] text-white rounded-lg hover:opacity-90"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditingUsername(true)}
              className="px-4 py-2 bg-[rgb(85,73,255)] text-white rounded-lg hover:opacity-90"
            >
              Edit Username
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold">Email:</label>
        <span>{email}</span>
      </div>

      <div className="flex flex-col justify-between">
          <label className="font-semibold">Change Password</label>
          <label className="">Old Password</label>
          <input
                type="password"
                value={passwordChange.oldPassword}
                onChange={(e) => setPasswordChange({...passwordChange, oldPassword: e.target.value})}
                className="py-2 rounded-lg focus:outline-none focus:ring"
              />
          <label className="text-red-400 text-sm">{passwordErrors?.oldPassword}</label>

          <label className="">New Password</label>
          <input
                type="password"
                value={passwordChange.newPassword}
                onChange={(e) => setPasswordChange({...passwordChange, newPassword: e.target.value})}
                className="py-2 rounded-lg focus:outline-none focus:ring"
              />
          <label className="text-red-400 text-sm">{passwordErrors?.newPassword}</label>

          <label className="">Confirm Password</label>
          <input
                type="password"
                value={passwordChange.confirmPassword}
                onChange={(e) => setPasswordChange({...passwordChange, confirmPassword: e.target.value})}
                className="py-2 rounded-lg focus:outline-none focus:ring"
              />
          <label className="text-red-400 text-sm">{passwordErrors?.confirmPassword}</label>

          <button
                onClick={changePassword}
                disabled={saving}
                className="px-4 py-2 mt-2 bg-[rgb(85,73,255)] text-white rounded-lg hover:opacity-90"
              >
                {saving ? "Saving..." : "Save"}
          </button>
      </div>

    </div>
  );
}
