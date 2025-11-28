import { useCallback, useEffect, useState } from "react";
import { UserProfile, ProfileUpdatePayload } from "../types/profile";
import { apiGet, apiPost, apiPut, extractError } from "../lib/api";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<UserProfile>("/me");
      setProfile(data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (payload: ProfileUpdatePayload) => {
    setSaving(true);
    setError(null);
    try {
      const data = await apiPut<UserProfile, ProfileUpdatePayload>(
        "/me",
        payload
      );
      setProfile(data as UserProfile);
      return data;
    } catch (err) {
      setError(extractError(err));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setSaving(true);
    try {
      await apiPost("/me/change_password", { currentPassword, newPassword });
    } catch (err) {
      setError(extractError(err));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
  };
}
