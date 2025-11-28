import React, { useEffect, useState } from "react";
import { UserPreferences as PrefsType, Theme } from "@/types/preferences";
import { apiGet, apiPut, extractError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

const defaultPrefs: PrefsType = {
  theme: "system",
  language: "en",
  notification_preferences: { email: true, push: true, sms: false },
  privacy_opt_out: false,
  reduced_motion: false,
};

export const UserPreferences: React.FC = () => {
  const [prefs, setPrefs] = useState<PrefsType>(defaultPrefs);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<PrefsType>("/me/preferences");
        setPrefs({ ...defaultPrefs, ...data });
      } catch (err) {
        // ignore, keep defaults
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiPut("/me/preferences", prefs);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h3 className="font-medium">Theme</h3>
            <div className="mt-2 flex gap-2">
              {(["light", "dark", "system"] as Theme[]).map((t) => (
                <label key={t} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    checked={prefs.theme === t}
                    onChange={() => setPrefs((p) => ({ ...p, theme: t }))}
                  />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-medium">Language</h3>
            <select
              value={prefs.language}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, language: e.target.value }))
              }
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
              <option value="om">Oromiffa</option>
            </select>
          </section>

          <section>
            <h3 className="font-medium">Notifications</h3>
            <div className="mt-2 flex flex-col gap-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={prefs.notification_preferences.email}
                  onChange={(e) =>
                    setPrefs((p) => ({
                      ...p,
                      notification_preferences: {
                        ...p.notification_preferences,
                        email: e.target.checked,
                      },
                    }))
                  }
                />{" "}
                Email
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={prefs.notification_preferences.push}
                  onChange={(e) =>
                    setPrefs((p) => ({
                      ...p,
                      notification_preferences: {
                        ...p.notification_preferences,
                        push: e.target.checked,
                      },
                    }))
                  }
                />{" "}
                Push
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={prefs.notification_preferences.sms}
                  onChange={(e) =>
                    setPrefs((p) => ({
                      ...p,
                      notification_preferences: {
                        ...p.notification_preferences,
                        sms: e.target.checked,
                      },
                    }))
                  }
                />{" "}
                SMS
              </label>
            </div>
          </section>

          <section>
            <h3 className="font-medium">Privacy & Accessibility</h3>
            <div className="mt-2 flex flex-col gap-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={prefs.privacy_opt_out}
                  onChange={(e) =>
                    setPrefs((p) => ({
                      ...p,
                      privacy_opt_out: e.target.checked,
                    }))
                  }
                />{" "}
                Opt-out of analytics
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={prefs.reduced_motion}
                  onChange={(e) =>
                    setPrefs((p) => ({
                      ...p,
                      reduced_motion: e.target.checked,
                    }))
                  }
                />{" "}
                Reduce motion
              </label>
            </div>
          </section>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center justify-between gap-3">
          <div>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save preferences"}
            </Button>
          </div>
          <div>
            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserPreferences;
