'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/profile/Header';
import Sidebar from '@/components/profile/Sidebar';
import AvatarUploader from '@/components/profile/AvatarUploader';
import ProfileForm from '@/components/profile/ProfileForm';
import { profileAPI, authAPI } from '@/services/api.service';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitSignal, setSubmitSignal] = useState(0);

  const sections = [
    { id: 'profile', name: 'Profile' },
    { id: 'personal', name: 'Personal Data' },
    { id: 'security', name: 'Security' },
    { id: 'preferences', name: 'Preferences' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'billing', name: 'Billing & Plan' },
    { id: 'support', name: 'Support & Help' },
  ];

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await profileAPI.get().catch(() => null);
        if (canceled) return;
        if (res && (res as any).user) setProfileData((res as any).user);
        else {
          const me = await authAPI.getCurrentUser().catch(() => null);
          if (me && (me as any).user) setProfileData((me as any).user);
        }
      } catch (err) {
        // keep silent - non-critical
      }
      if (!canceled) setLoading(false);
    })();
    return () => {
      canceled = true;
    };
  }, []);

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
      if (res && (res as any).user) setProfileData((res as any).user);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='min-h-screen pt-16 bg-bg-main'>
      <Header
        onBack={() => router.push('/')}
        onSave={() => setSubmitSignal((s) => s + 1)}
        saving={saving}
      />

      <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          <div className='hidden lg:block'>
            <Sidebar
              sections={sections}
              active={activeSection}
              onSelect={setActiveSection}
            />
          </div>

          <div className='mb-6 lg:hidden'>
            <div className='overflow-hidden border rounded-lg shadow-sm bg-bg-surface border-divider'>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-b border-divider last:border-b-0 ${
                    activeSection === s.id
                      ? 'bg-complement-50 text-complement-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className='font-medium'>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className='lg:col-span-3'>
            <div className='p-6 mb-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <h2 className='mb-6 text-xl font-semibold text-text-primary'>
                {sections.find((s) => s.id === activeSection)?.name}
              </h2>

              {activeSection === 'profile' && (
                <div className='flex flex-col gap-6'>
                  <div className='p-6 mb-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
                    <div className='flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6'>
                      <AvatarUploader
                        imageUrl={profileData.image || null}
                        onChange={setAvatarFile}
                      />
                      <div className='flex-1'>
                        <h2 className='text-xl font-bold text-text-primary'>
                          {profileData.full_name}
                        </h2>
                        <p className='text-text-secondary'>
                          {profileData.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ProfileForm
                    initialValues={profileData}
                    onSubmit={handleSave}
                    submitSignal={submitSignal}
                  />
                </div>
              )}

              {activeSection !== 'profile' && (
                <div className='text-sm text-text-secondary'>
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
