'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/profile/Header';
import AvatarUploader from '@/components/profile/AvatarUploader';
import { profileAPI, authAPI } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';

const ProfilePage: React.FC = () => {
  const router = useRouter();
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
            field === 'email' ||
            field === 'phone' ||
            field === 'address' ||
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
    // For phone field, only allow numeric values
    if (field === 'phone') {
      const numericValue = value.replace(/[^0-9+\-\s()]/g, '');
      setEditValues((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setEditValues((prev) => ({ ...prev, [field]: value }));
    }
  };

  const hasChanges = Object.keys(editingFields).some(
    (field) => editingFields[field]
  );

  const getFieldIcon = (field: string) => {
    const icons = {
      full_name: (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      email: (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
          />
        </svg>
      ),
      phone: (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      address: (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      polar_api_key: (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      ),
      polar_organization_id: (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    };
    return icons[field as keyof typeof icons] || null;
  };

  const renderField = (field: string, label: string, type: string = 'text') => {
    const isEditing = editingFields[field];
    const currentValue = profileData[field] || '';
    const editValue = editValues[field] || '';
    const isSecureField =
      field === 'polar_api_key' || field === 'polar_organization_id';
    const isEmailField = field === 'email';

    return (
      <div className="relative group transition-all duration-200 hover:shadow-sm">
        <div className="p-4 border rounded-lg bg-white border-gray-200 hover:border-orange-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {getFieldIcon(field)}
              <label className="text-sm font-medium text-gray-700">
                {label}
              </label>
            </div>
            {!isEditing && !isEmailField && (
              <button
                onClick={() => startEditing(field)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Edit</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={type}
                  value={isSecureField && editValue ? '*******' : editValue}
                  onChange={(e) => updateEditValue(field, e.target.value)}
                  className="w-full p-3 pr-10 border rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  autoFocus
                />
                {isSecureField && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => cancelEditing(field)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-900">
              {isSecureField ? (
                currentValue ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-500">•••••••</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      Configured
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <span>Not configured</span>
                  </span>
                )
              ) : (
                currentValue || (
                  <span className="text-gray-400 italic">Not provided</span>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={() => router.push('/')} />
        <div className="px-4 py-6 mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="animate-pulse space-y-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={() => router.push('/')} />

      <div className="px-4 py-6 mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8"></div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">
                        Error updating profile
                      </h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        Success!
                      </h3>
                      <p className="text-sm text-green-700 mt-1">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {/* User Header Section */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                  <div className="flex flex-col items-center space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-8">
                    <AvatarUploader
                      imageUrl={profileData.profile_image || null}
                      onImageUpdated={handleImageUpdated}
                      onError={handleError}
                    />
                    <div className="flex-1 text-center md:text-left">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {profileData.full_name || 'User'}
                      </h1>
                      <p className="text-gray-600 mb-1 flex items-center justify-center md:justify-start">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                        {profileData.email || 'No email provided'}
                      </p>
                      {profileData.role && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize">
                          {profileData.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Información Personal
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderField('full_name', 'Nombre Completo')}
                      {renderField('email', 'Correo Electrónico', 'email')}
                      {renderField('phone', 'Número de Teléfono')}
                      <div className="md:col-span-2"></div>
                    </div>
                  </div>
                </div>

                {/* API Configuration Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Configuración API
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Configura tu integración con Polar
                        </p>
                      </div>
                      <a
                        href="https://www.youtube.com/watch?v=u_FrN7xLQn0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 text-sm font-medium rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Ver Tutorial</span>
                      </a>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
