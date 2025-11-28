import React, { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import AvatarUploader from "./AvatarUploader";

export const ProfileSettings: React.FC = () => {
  const { profile, loading, updateProfile, changePassword } = useProfile();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name ?? profile.employee?.first_name ?? "",
        last_name: profile.last_name ?? profile.employee?.last_name ?? "",
        phone: profile.phone ?? profile.employee?.phone ?? "",
      });
    }
  }, [profile]);

  const save = async (auto = false) => {
    setStatus("saving");
    try {
      await updateProfile({ ...form, avatar: avatarFile });
      setStatus("saved");
      if (!auto) setTimeout(() => setStatus(null), 1500);
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    // simple auto-save after changes (debounced) - for demo we do immediate timeout
    const id = setTimeout(() => {
      if (profile) save(true);
    }, 2000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, avatarFile]);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Avatar
          </label>
          <AvatarUploader
            value={profile?.avatar_url || null}
            name={
              (profile?.first_name ??
                profile?.employee?.first_name ??
                profile?.user?.email) as string
            }
            onChange={(f) => setAvatarFile(f)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          <label className="block text-sm font-medium text-gray-700 mt-3">
            Last name
          </label>
          <input
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          <label className="block text-sm font-medium text-gray-700 mt-3">
            Phone
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Security</h3>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Change Password
            </label>
            <PasswordChange onChange={changePassword} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Two-factor authentication
            </label>
            <div className="mt-2 text-sm text-gray-600">
              Enable 2FA to add an extra layer of security to your account.
            </div>
            <button className="mt-2 px-3 py-1 border rounded">
              Manage 2FA
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => save(false)}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Save
        </button>
        <div className="text-sm text-gray-500">
          {status === "saving"
            ? "Saving..."
            : status === "saved"
            ? "Saved"
            : status === "error"
            ? "Error saving"
            : ""}
        </div>
      </div>
    </div>
  );
};

const PasswordChange: React.FC<{
  onChange: (curr: string, next: string) => Promise<void>;
}> = ({ onChange }) => {
  const [curr, setCurr] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    if (next !== confirm)
      return setMsg("New password and confirmation do not match");
    try {
      await onChange(curr, next);
      setMsg("Password updated");
    } catch (err) {
      setMsg("Failed to update password");
    }
  };

  return (
    <div>
      <input
        type="password"
        placeholder="Current password"
        value={curr}
        onChange={(e) => setCurr(e.target.value)}
        className="mt-1 block w-full border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="New password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        className="mt-2 block w-full border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="mt-2 block w-full border rounded px-3 py-2"
      />
      <button
        onClick={submit}
        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded"
      >
        Change password
      </button>
      {msg && <div className="mt-2 text-sm text-gray-500">{msg}</div>}
    </div>
  );
};

export default ProfileSettings;
