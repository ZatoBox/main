'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/profile/Header';
import AvatarUploader from '@/components/profile/AvatarUploader';
import CryptoStoreSetup from '@/components/profile/CryptoStoreSetup';
import Loader from '@/components/ui/Loader';
import { profileAPI, authAPI } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';
import {
  Bitcoin,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Lock,
  LogOut,
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {},
  );
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const { user, initialized, setUser, logout } = useAuth();

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
          if (field === 'email' || field === 'phone') {
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
    updatedUser?: any,
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
    (field) => editingFields[field],
  );

  const getFieldIcon = (field: string) => {
    const icons = {
      full_name: <User className="w-4 h-4 text-gray-400" />,
      email: <Mail className="w-4 h-4 text-gray-400" />,
      phone: <Phone className="w-4 h-4 text-gray-400" />,
      address: <MapPin className="w-4 h-4 text-gray-400" />,
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
                <Edit className="w-3 h-3" />
                <span>Editar</span>
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
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => cancelEditing(field)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors"
                >
                  Guardar
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
                      Configurado
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>No está configurado</span>
                  </span>
                )
              ) : (
                currentValue || (
                  <span className="text-gray-400 italic">No proporcionado</span>
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
      <>
        <Header onBack={() => router.push('/')} />
        <Loader fullScreen size="large" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={() => router.push('/')} />

      {saving && <Loader fullScreen size="large" />}

      <div className="px-4 py-6 mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8"></div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">
                        Error editando perfil
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
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        ¡Éxito!
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
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
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
                      <User className="w-5 h-5 mr-2 text-orange-500" />
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

                {/* Crypto Payments Configuration Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Bitcoin className="w-5 h-5 mr-2 text-orange-500" />
                          Pagos con Crypto
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Configura tu tienda BTCPay Server para recibir pagos
                          en Bitcoin
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <CryptoStoreSetup />
                  </div>
                </div>

                {/* Account Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-orange-500" />
                      Cuenta
                    </h2>
                  </div>
                  <div className="p-6">
                    <button
                      onClick={() => {
                        logout();
                        router.push('/login');
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Cerrar Sesión
                    </button>
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
