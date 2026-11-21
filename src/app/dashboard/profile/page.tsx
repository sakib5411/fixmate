"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Mail, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { ImageField } from "@/components/ui/image-field";
import { Spinner } from "@/components/ui/loaders";
import { RoleBadge } from "@/components/ui/badges";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError, apiGet, apiSend } from "@/lib/api";
import type { SessionUser } from "@/lib/types";

export default function ProfilePage() {
  const { user, refresh } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<SessionUser["role"]>("customer");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await apiGet<SessionUser>("/api/users/me");
        if (cancelled) return;
        const profile = response.data;
        setName(profile.name ?? "");
        setPhone(profile.phone ?? "");
        setArea(profile.area ?? "");
        setBio(profile.bio ?? "");
        setImage(profile.image ?? "");
        setEmail(profile.email ?? "");
        setRole(profile.role ?? "customer");
      } catch (error) {
        if (!cancelled) {
          toast.error(error instanceof ApiError ? error.message : "Could not load your profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) return toast.error("Name must be at least 2 characters");

    setSaving(true);
    try {
      await apiSend(
        "/api/users/profile",
        {
          name: name.trim(),
          phone: phone.trim(),
          area: area.trim(),
          bio: bio.trim(),
          ...(image ? { image } : {}),
        },
        "PATCH"
      );
      await refresh();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not save your profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Update profile"
        description="Your name and photo appear across the navbar and dashboard immediately after saving."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-7 text-brand-500" />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <form onSubmit={submit} className="dash-card space-y-4">
            <ImageField
              value={image}
              onChange={setImage}
              label="Profile photo"
              hint="Uploaded to ImgBB · shown on your avatar"
            />

            <div>
              <label className="label" htmlFor="profile-name">
                Full name
              </label>
              <input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="input"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="profile-phone">
                  Phone
                </label>
                <input
                  id="profile-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="profile-area">
                  Area / city
                </label>
                <input
                  id="profile-area"
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  placeholder="Mirpur, Dhaka"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="profile-bio">
                Bio
              </label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={4}
                placeholder="Tell customers about your skills and experience (technicians) or about yourself."
                className="input resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="label">Email (read-only)</span>
                <p className="flex items-center gap-2 rounded-xl bg-ink-50 px-3.5 py-2.5 text-sm text-ink-600">
                  <Mail className="size-4 text-ink-400" /> {email}
                </p>
              </div>
              <div>
                <span className="label">Role (read-only)</span>
                <p className="flex items-center gap-2 rounded-xl bg-ink-50 px-3.5 py-2.5">
                  <RoleBadge role={role} />
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="btn-primary" disabled={saving}>
                <Save className="size-4" /> {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>

          <aside className="dash-card">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <ShieldCheck className="size-4 text-emerald-500" /> Account details
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-500">
              Email and role are managed by FixMate. Contact an admin if your role needs to change.
              {user?.role === "technician" && (
                <>
                  {" "}
                  Your profile photo, area and bio are shown to customers on every service you list.
                </>
              )}
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
