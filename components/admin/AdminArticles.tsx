"use client";

import { useEffect, useMemo, useState } from 'react';

type Article = any;

export default function AdminArticles() {
  const [items, setItems] = useState<Article[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [editor, setEditor] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const selected = useMemo(() => items.find(i => i.slug === selectedSlug), [items, selectedSlug]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/articles');
      if (!res.ok) throw new Error('Failed to load');
      const j = await res.json();
      setItems(j.items || []);
      if (!selectedSlug && (j.items?.length ?? 0) > 0) {
        setSelectedSlug(j.items[0].slug);
        setEditor(JSON.stringify(j.items[0], null, 2));
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = (slug: string) => {
    setSelectedSlug(slug);
    const found = items.find(i => i.slug === slug);
    setEditor(JSON.stringify(found ?? {}, null, 2));
    setError('');
  };

  const newArticle = () => {
    const now = new Date().toISOString();
    const tpl = {
      id: crypto.randomUUID(),
      title: 'New Article',
      slug: 'new-article',
      excerpt: 'Short summary...',
      content: 'Full content here...',
      author: 'MyBeing Research',
      publishedAt: now,
      tags: [],
      readTime: 5,
      imageUrl: '',
      published: false,
      relatedQuizzes: [],
      isPremium: false,
      likes: 0,
      price: 0,
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      canonicalUrl: '',
      ogImage: '',
      robots: 'index,follow'
    };
    setSelectedSlug(tpl.slug);
    setEditor(JSON.stringify(tpl, null, 2));
    setError('');
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = JSON.parse(editor);
      if (!payload.slug || !payload.title || !payload.publishedAt) {
        throw new Error('slug, title, and publishedAt are required');
      }
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Save failed');
      }
      await load();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!selectedSlug) return;
    if (!confirm(`Delete article ${selectedSlug}?`)) return;
    try {
      const res = await fetch(`/api/admin/articles?slug=${encodeURIComponent(selectedSlug)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSelectedSlug('');
      setEditor('');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Articles</h2>
          <button onClick={newArticle} className="px-3 py-1 rounded-md bg-brand-700 text-white">New</button>
        </div>
        <div className="border rounded-md divide-y max-h-[60vh] overflow-auto">
          {loading && <div className="p-2 text-sm text-gray-500">Loading...</div>}
          {items.map((a) => (
            <button
              key={a.slug}
              onClick={() => onSelect(a.slug)}
              className={`w-full text-left p-2 hover:bg-brand-50 ${selectedSlug === a.slug ? 'bg-brand-100' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.slug}</div>
                </div>
                <div className="text-xs">{a.published !== false ? 'Published' : 'Draft'}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Editor</h2>
          <div className="space-x-2">
            <button onClick={save} disabled={saving} className="px-3 py-1 rounded-md bg-green-700 text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={del} className="px-3 py-1 rounded-md bg-red-600 text-white">Delete</button>
          </div>
        </div>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <textarea
          className="w-full h-[60vh] border rounded-md p-2 font-mono text-sm"
          value={editor}
          onChange={(e) => setEditor(e.target.value)}
          placeholder="Edit article JSON..."
        />
        <p className="text-xs text-gray-500 mt-2">Tip: Ensure publishedAt is ISO string. Use published=true to publish. Related quizzes go in relatedQuizzes as slugs.</p>
      </div>
    </div>
  );
}
