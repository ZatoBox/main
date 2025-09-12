"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/profile/Header";
import Sidebar from "@/components/profile/Sidebar";
import AvatarUploader from "@/components/profile/AvatarUploader";
import ProfileForm from "@/components/profile/ProfileForm";
import { profileAPI, authAPI } from "@/services/api.service";
import { useAuth } from "@/context/auth-store";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitSignal, setSubmitSignal] = useState(0);
  const { user, initialized, setUser } = useAuth();

  const sections = [
    { id: "profile", name: "Profile" },
    { id: "personal", name: "Personal Data" },
    { id: "security", name: "Security" },
    { id: "preferences", name: "Preferences" },
    { id: "notifications", name: "Notifications" },
    { id: "billing", name: "Billing & Plan" },
    { id: "support", name: "Support & Help" },
  ];

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      setLoading(true);
      try {
        if (user) {
          if (!canceled) setProfileData(user as any);
        } else {
          const res = await profileAPI.get().catch(() => null);
          if (canceled) return;
          if (res && (res as any).user) {
            setUser((res as any).user as any);
            if (!canceled) setProfileData((res as any).user);
          } else {
            const me = await authAPI.getCurrentUser().catch(() => null);
            if (me && (me as any).user) {
              setUser((me as any).user as any);
              if (!canceled) setProfileData((me as any).user);
            }
          }
        }
      } catch (err) {
        // non-critical
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    if (initialized) {
      load();
    }

    return () => {
      canceled = true;
    };
  }, [initialized, user, setUser]);

  const handleSave = async (values: Record<string, any>) => {
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        language: values.language,
        timezone: values.timezone,
        dateFormat: values.dateFormat,
        currency: values.currency,
        twoFactorEnabled: values.twoFactorEnabled,
      };

      const res = await profileAPI.update(payload as any);
      if (res && (res as any).user) {
        const updated = (res as any).user;
        setProfileData(updated);
        try {
          setUser(updated as any);
        } catch {
          // ignore if store setUser fails
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <Header
        onBack={() => router.push("/")}
        onSave={() => setSubmitSignal((s) => s + 1)}
        saving={saving}
      />

      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              sections={sections}
              active={activeSection}
              onSelect={setActiveSection}
            />
          </div>

          {/* Mobile Section Selector */}
          <div className="mb-6 lg:hidden">
            <div className="overflow-hidden border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === s.id
                      ? "bg-[#FBEFCA] text-[#000000] border border-[#F6DE91]"
                      : "text-[#888888] hover:bg-[#F6DE91] hover:text-[#000000]"
                  } border-b  border-[#F6DE91] shadow-sm`}
                >
                  <span className="text-sm font-medium">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Contenedor unificado con padding y border constante */}
            <div className="p-6 mb-6 border rounded-lg shadow-sm bg-bg-surface border-[#CBD5E1] min-h-[600px]">
              <h2 className="mb-6 text-xl font-semibold text-text-primary">
                {sections.find((s) => s.id === activeSection)?.name}
              </h2>

              {activeSection === "profile" ? (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6">
                    <AvatarUploader
                      imageUrl={profileData.image || null}
                      onChange={setAvatarFile}
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-text-primary">
                        {profileData.full_name}
                      </h2>
                      <p className="text-text-secondary">{profileData.email}</p>
                    </div>
                  </div>

                  <ProfileForm
                    initialValues={profileData}
                    onSubmit={handleSave}
                    submitSignal={submitSignal}
                  />
                </div>
              ) : (
                <div className="text-sm text-text-secondary min-h-[150px]">
                  Section content moved to components.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
