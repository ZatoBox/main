'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/profile/Header';
import Sidebar from '@/components/profile/Sidebar';
import AvatarUploader from '@/components/profile/AvatarUploader';
import { profileAPI, authAPI } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {}
  );
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const { user, initialized, setUser } = useAuth();

  const sections = [
    { id: 'profile', name: 'Profile' },
    { id: 'billing', name: 'Billing & Plan' },
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

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: Record<string, unknown> = {};

      Object.keys(editValues).forEach((field) => {
        const newValue = editValues[field]?.trim();
        const oldValue = profileData[field];

        if (newValue !== oldValue) {
          if (
            field === 'phone' ||
            field === 'polar_api_key' ||
            field === 'polar_organization_id'
          ) {
            payload[field] = newValue || null;
          } else if (newValue) {
            payload[field] = newValue;
          }
        }
      });

      if (Object.keys(payload).length === 0) {
        setSuccess('No changes to save');
        setTimeout(() => setSuccess(null), 3000);
        return;
      }

      const res = await profileAPI.update(payload as any);
      if (res && (res as any).user) {
        const updated = (res as any).user;
        setProfileData(updated);
        setUser(updated as any);
        setEditingFields({});
        setEditValues({});
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpdated = async (
    newImageUrl: string | null,
    updatedUser?: any
  ) => {
    if (updatedUser) {
      setProfileData(updatedUser);
      setUser(updatedUser as any);
    } else {
      const updated = { ...profileData, profile_image: newImageUrl };
      setProfileData(updated);
      setUser(updated as any);
    }
    setSuccess('Avatar updated successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
    setTimeout(() => setError(null), 5000);
  };

  const startEditing = (field: string) => {
    setEditingFields((prev) => ({ ...prev, [field]: true }));
    setEditValues((prev) => ({ ...prev, [field]: profileData[field] || '' }));
  };

  const cancelEditing = (field: string) => {
    setEditingFields((prev) => ({ ...prev, [field]: false }));
    setEditValues((prev) => {
      const newValues = { ...prev };
      delete newValues[field];
      return newValues;
    });
  };

  const updateEditValue = (field: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const hasChanges = Object.keys(editingFields).some(
    (field) => editingFields[field]
  );

  const renderField = (field: string, label: string, type: string = 'text') => {
    const isEditing = editingFields[field];
    const currentValue = profileData[field] || '';
    const editValue = editValues[field] || '';

    return (
      <div className='p-4 border rounded-lg bg-[#FFFFFF] border-[#CBD5E1] hover:border-[#F6DE91] transition-colors'>
        <div className='flex items-center justify-between mb-2'>
          <label className='text-sm font-medium text-[#000000]'>{label}</label>
          {!isEditing && (
            <button
              onClick={() => startEditing(field)}
              className='text-sm text-[#A94D14] hover:text-[#8A3D16] font-medium transition-colors'
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className='space-y-3'>
            <input
              type={type}
              value={editValue}
              onChange={(e) => updateEditValue(field, e.target.value)}
              className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#F6DE91] focus:border-[#A94D14] bg-[#FFFFFF] text-[#000000]'
              placeholder={`Enter ${label.toLowerCase()}`}
            />
            <div className='flex space-x-2'>
              <button
                onClick={() => cancelEditing(field)}
                className='px-3 py-1 text-sm text-[#888888] hover:text-[#000000] transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className='text-[#000000]'>
            {field === 'polar_api_key' ? (
              currentValue ? (
                '*******'
              ) : (
                <span className='text-[#888888] italic'>Not set</span>
              )
            ) : (
              currentValue || (
                <span className='text-[#888888] italic'>Not set</span>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-bg-main'>
      <Header
        onBack={() => router.push('/')}
        onSave={hasChanges ? () => handleSave() : () => {}}
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
            <div className='overflow-hidden border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]'>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === s.id
                      ? 'bg-[#FBEFCA] text-[#000000] border border-[#F6DE91]'
                      : 'text-[#888888] hover:bg-[#F6DE91] hover:text-[#000000]'
                  } border-b  border-[#F6DE91] shadow-sm`}
                >
                  <span className='text-sm font-medium'>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className='lg:col-span-3'>
            <div className='p-6 mb-6 border rounded-lg shadow-sm bg-bg-surface border-[#CBD5E1] min-h-[600px]'>
              <h2 className='mb-6 text-xl font-semibold text-text-primary'>
                {sections.find((s) => s.id === activeSection)?.name}
              </h2>

              {error && (
                <div className='p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg'>
                  {error}
                </div>
              )}

              {success && (
                <div className='p-4 mb-4 text-green-700 bg-green-100 border border-green-300 rounded-lg'>
                  {success}
                </div>
              )}

              {activeSection === 'profile' ? (
                <div className='flex flex-col gap-6'>
                  <div className='flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6'>
                    <AvatarUploader
                      imageUrl={profileData.profile_image || null}
                      onImageUpdated={handleImageUpdated}
                      onError={handleError}
                    />
                    <div className='flex-1'>
                      <h2 className='text-xl font-bold text-text-primary'>
                        {profileData.full_name || 'User'}
                      </h2>
                      <p className='text-text-secondary'>
                        {profileData.email || ''}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-[#000000] mb-4'>
                      Profile Information
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {renderField('full_name', 'Full Name')}
                      {renderField('email', 'Email', 'email')}
                      {renderField('phone', 'Phone')}
                      {renderField(
                        'polar_api_key',
                        'Polar API Key',
                        'password'
                      )}
                      {renderField(
                        'polar_organization_id',
                        'Polar Organization ID'
                      )}
                    </div>

                    {hasChanges && (
                      <div className='flex justify-end pt-4 border-t'>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className='px-6 py-2 bg-[#A94D14] text-white rounded-lg hover:bg-[#8A3D16] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className='text-sm text-text-secondary min-h-[150px]'>
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
