import React, { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import AvatarUploader from "@/components/AvatarUploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language-context";

export const ProfileSettings: React.FC = () => {
  const { profile, loading, updateProfile, changePassword } = useProfile();
  const { t } = useLanguage();
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
    <Card>
      <CardHeader>
        <CardTitle>{t.profileSettings}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>{t.loading ?? "Loading..."}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              {t.avatar}
            </label>
            <div className="mt-2">
              <AvatarUploader
                value={profile?.avatar_url || null}
                name={
                  (profile?.first_name ??
                    profile?.employee?.first_name ??
                    profile?.email) as string
                }
                onChange={(f) => setAvatarFile(f)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              {t.firstName}
            </label>
            <Input
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="mt-1"
            />

            <label className="block text-sm font-medium text-muted-foreground mt-3">
              {t.lastName}
            </label>
            <Input
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="mt-1"
            />

            <label className="block text-sm font-medium text-muted-foreground mt-3">
              {t.phone}
            </label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-base">{t.security}</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                {t.changePassword}
              </label>
              <div className="mt-2">
                <PasswordChange onChange={changePassword} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                {t.twoFactorAuth}
              </label>
              <div className="mt-2 text-sm text-muted-foreground">
                {t.enable2FADesc ??
                  "Enable 2FA to add an extra layer of security to your account."}
              </div>
              <Button variant="outline" className="mt-3">
                {t.manage2FA}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-3 w-full justify-between">
          <div>
            <Button onClick={() => save(false)}>{t.save}</Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {status === "saving"
              ? t.saving
              : status === "saved"
              ? t.saved
              : status === "error"
              ? t.errorSaving
              : ""}
          </div>
        </div>
      </CardFooter>
    </Card>
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
      <Input
        type="password"
        placeholder="Current password"
        value={curr}
        onChange={(e) => setCurr(e.target.value)}
        className="mt-1"
      />
      <Input
        type="password"
        placeholder="New password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        className="mt-2"
      />
      <Input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="mt-2"
      />
      <Button onClick={submit} className="mt-3">
        Change password
      </Button>
      {msg && <div className="mt-2 text-sm text-muted-foreground">{msg}</div>}
    </div>
  );
};

export default ProfileSettings;
