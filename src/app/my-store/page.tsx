'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { layoutAPI } from '@/services/api.service';

function slugify(input: string) {
  return input
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function MyStorePage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [github, setGithub] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = useMemo(() => slugify(title || 'mi-tienda'), [title]);

  const handleCreate = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    const socialLinks: Record<string, string> = {};
    if (instagram.trim()) socialLinks.instagram = instagram.trim();
    if (facebook.trim()) socialLinks.facebook = facebook.trim();
    if (github.trim()) socialLinks.github = github.trim();
    setSubmitting(true);
    try {
      const payload = {
        slug,
        hero_title: title,
        web_description: description || undefined,
        social_links: Object.keys(socialLinks).length ? socialLinks : undefined,
      };
      const res = await layoutAPI.create(payload as any);
      const finalSlug = (res as any)?.layout?.slug || slug;
      router.push(`/link/${finalSlug}`);
    } catch (e: any) {
      setError(e?.message || 'Could not create the store');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-black mb-3">
          Create your store
        </h1>
        <p className="text-gray-600 mb-8">
          Here you can create your own virtual store to offer your services or
          products. Customize the title, description, and add links to your
          social networks.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-5 py-3 rounded-lg bg-[#F88612] text-white hover:bg-[#d17110] transition"
          >
            {showForm ? 'Close form' : 'Create my store'}
          </button>
        </div>
        {showForm && (
          <div className="mt-8 p-6 border border-[#CBD5E1] rounded-lg bg-white shadow-sm">
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Name of your store"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F88612]"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Suggested slug: {slug}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Briefly tell about your products or services"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F88612]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Instagram
                </label>
                <input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/yourusername"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F88612]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Facebook
                </label>
                <input
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/yourusername"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F88612]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  GitHub
                </label>
                <input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F88612]"
                />
              </div>
              <div className="pt-2">
                <button
                  disabled={submitting}
                  onClick={handleCreate}
                  className="px-5 py-3 rounded-lg bg-[#F88612] text-white hover:bg-[#d17110] transition disabled:opacity-60"
                >
                  {submitting ? 'Creating...' : 'Create store'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
