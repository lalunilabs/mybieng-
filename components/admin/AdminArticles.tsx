"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

type Article = any;

export default function AdminArticles() {
  const [items, setItems] = useState<Article[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [editor, setEditor] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [scheduleInput, setScheduleInput] = useState('');

  const selected = useMemo(() => items.find(i => i.slug === selectedSlug), [items, selectedSlug]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/articles');
      if (!res.ok) throw new Error('Failed to load');
      const j = await res.json();
      const list = (j?.data?.items ?? j?.items ?? []) as Article[];
      setItems(list);
      if (!selectedSlug && list.length > 0) {
        setSelectedSlug(list[0].slug);
        setEditor(JSON.stringify(list[0], null, 2));
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const generateMeta = () => {
    setError('');
    setInfo('');
    try {
      const payload = JSON.parse(editor || '{}');
      const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.com';
      const title: string = payload.title || '';
      const excerpt: string = payload.excerpt || payload.metaDescription || '';
      const metaTitle = payload.metaTitle || `${title} | MyBeing`;
      const metaDescription = (payload.metaDescription || excerpt || '')
        .toString()
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160);
      const keywords: string[] = Array.isArray(payload.keywords) && payload.keywords.length
        ? payload.keywords
        : Array.from(new Set([...(payload.tags || []), 'psychology', 'behavior', 'self-discovery'])).slice(0, 8);
      const canonicalUrl = payload.canonicalUrl || `${base}/blog/${payload.slug}`;
      const ogImage = payload.ogImage || `${base}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(metaDescription)}`;
      const robots = payload.robots || 'index,follow';
      const next = { ...payload, metaTitle, metaDescription, keywords, canonicalUrl, ogImage, robots };
      setEditor(JSON.stringify(next, null, 2));
      setInfo('Meta generated. Review and Save to persist.');
    } catch (e: any) {
      setError(e?.message || 'Failed to generate meta');
    }
  };

  const validateMeta = () => {
    setError('');
    setInfo('');
    try {
      const payload = JSON.parse(editor || '{}');
      const errs: string[] = [];
      if (!payload.slug) errs.push('Missing slug');
      if (!payload.title) errs.push('Missing title');
      if (payload.published && !payload.publishedAt) errs.push('Published items should have publishedAt');
      if (!payload.metaTitle) errs.push('Missing metaTitle');
      if ((payload.metaTitle || '').length > 70) errs.push('metaTitle should be <= 70 chars');
      if (!payload.metaDescription) errs.push('Missing metaDescription');
      if ((payload.metaDescription || '').length > 160) errs.push('metaDescription should be <= 160 chars');
      if (!payload.canonicalUrl) errs.push('Missing canonicalUrl');
      if (!Array.isArray(payload.keywords)) errs.push('keywords should be an array');
      if (errs.length) {
        setError('Meta validation failed:\n- ' + errs.join('\n- '));
      } else {
        setInfo('Meta looks good.');
      }
    } catch (e: any) {
      setError(e?.message || 'Validation error');
    }
  };

  const applySchedule = async () => {
    try {
      const payload = JSON.parse(editor || '{}');
      if (!scheduleInput) {
        delete payload.publishedAt;
      } else {
        const iso = new Date(scheduleInput).toISOString();
        payload.publishedAt = iso;
      }
      setEditor(JSON.stringify(payload, null, 2));
      setSaving(true);
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to apply schedule');
    } finally {
      setSaving(false);
    }
  };

  const publishNow = async () => {
    try {
      const payload = JSON.parse(editor || '{}');
      payload.published = true;
      payload.publishedAt = new Date().toISOString();
      setEditor(JSON.stringify(payload, null, 2));
      setSaving(true);
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to publish now');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    try {
      const payload = JSON.parse(editor || '{}');
      const nextPublished = !(payload.published !== false);
      payload.published = nextPublished;
      if (nextPublished && !payload.publishedAt) {
        payload.publishedAt = new Date().toISOString();
      }
      setEditor(JSON.stringify(payload, null, 2));
      // Save immediately
      setSaving(true);
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Toggle failed');
    } finally {
      setSaving(false);
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
    setInfo('');
    try {
      const d = (found as any)?.publishedAt ? new Date((found as any).publishedAt) : undefined;
      if (d && !isNaN(d.getTime())) {
        const pad = (n: number) => String(n).padStart(2, '0');
        const val = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setScheduleInput(val);
      } else {
        setScheduleInput('');
      }
    } catch { setScheduleInput(''); }
    setError('');
  };

  const newArticle = () => {
    const now = new Date().toISOString();
    const randomId = crypto.randomUUID();
    const tpl = {
      id: randomId,
      title: 'New Article',
      slug: `new-article-${Date.now()}`,
      excerpt: 'Write a compelling excerpt that summarizes your article...',
      content: '# Your Article Title\n\nStart writing your detailed, research-backed article here. Remember to:\n\n- Use personal examples and stories\n- Include scientific backing where relevant\n- Make it actionable and practical\n- Write in a conversational, human tone\n\n## Section 1\n\nYour content here...\n\n## Section 2\n\nMore content...\n\n## Conclusion\n\nWrap up with key takeaways and next steps.',
      author: 'MyBeing Research',
      publishedAt: now,
      tags: ['psychology', 'self-discovery'],
      readTime: 10,
      imageUrl: '',
      published: false,
      relatedQuizzes: [],
      isPremium: false,
      likes: 0,
      price: 0,
      metaTitle: '',
      metaDescription: '',
      keywords: ['psychology', 'self-discovery', 'personal-growth'],
      canonicalUrl: '',
      ogImage: '',
      robots: 'index,follow'
    };
    setSelectedSlug(tpl.slug);
    setEditor(JSON.stringify(tpl, null, 2));
    setScheduleInput(now.slice(0,16));
    setError('');
    setInfo('');
  };

  const onUploadImage = async (file: File) => {
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const j = await res.json();
      if (!res.ok || !j?.imageUrl) throw new Error(j?.error || 'Upload failed');
      // inject imageUrl and ogImage into the JSON editor
      try {
        const payload = JSON.parse(editor || '{}');
        payload.imageUrl = j.imageUrl;
        if (!payload.ogImage) payload.ogImage = j.imageUrl;
        setEditor(JSON.stringify(payload, null, 2));
      } catch {
        // If editor is empty or invalid, create a minimal object
        const payload: any = { imageUrl: j.imageUrl, ogImage: j.imageUrl };
        setEditor(JSON.stringify(payload, null, 2));
      }
    } catch (e: any) {
      setUploadError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError('');
    setInfo('');
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
      setInfo('Saved.');
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
          <h2 className="font-medium text-lg">Articles ({items.length})</h2>
          <button onClick={newArticle} className="px-4 py-2 rounded-md bg-brand-700 text-white hover:bg-brand-800 font-medium">+ New Article</button>
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
          <h2 className="font-medium text-lg">Article Editor</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={generateMeta} className="px-3 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 text-sm font-medium">Generate SEO</button>
            <button onClick={validateMeta} className="px-3 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 text-sm font-medium">Validate</button>
            <button onClick={togglePublish} className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium">
              {selected?.published ? 'Unpublish' : 'Publish'}
            </button>
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 font-medium">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={del} className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm font-medium">Delete</button>
          </div>
        </div>
        {error && <div className="text-sm text-red-600 mb-2 whitespace-pre-wrap">{error}</div>}
        {info && <div className="text-sm text-green-700 mb-2">{info}</div>}
        {/* Image and Media Management */}
        <div className="mb-4 p-4 rounded-lg border bg-gray-50">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">Media & Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadImage(f); }}
                disabled={uploading}
                className="w-full text-sm border rounded px-3 py-2"
              />
              {uploading && <span className="text-xs text-blue-600 mt-1 block">Uploading image...</span>}
              {uploadError && <span className="text-xs text-red-600 mt-1 block">{uploadError}</span>}
              {selected?.imageUrl && (
                <div className="mt-2">
                  <Image src={selected.imageUrl} alt="Cover" width={80} height={80} className="object-cover rounded border" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quick Actions</label>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    const payload = JSON.parse(editor || '{}');
                    payload.readTime = Math.max(1, Math.ceil((payload.content || '').length / 1000));
                    setEditor(JSON.stringify(payload, null, 2));
                  }}
                  className="block w-full text-left px-3 py-2 text-sm bg-white border rounded hover:bg-gray-50"
                >
                  Auto-calculate read time
                </button>
                <button 
                  onClick={() => {
                    const payload = JSON.parse(editor || '{}');
                    if (payload.content) {
                      const words = payload.content.split(/\s+/).length;
                      payload.readTime = Math.max(1, Math.ceil(words / 200));
                      setEditor(JSON.stringify(payload, null, 2));
                    }
                  }}
                  className="block w-full text-left px-3 py-2 text-sm bg-white border rounded hover:bg-gray-50"
                >
                  Calculate by word count
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-3 p-3 rounded-md border bg-white">
          <label className="text-sm font-medium">Publish at</label>
          <input
            type="datetime-local"
            value={scheduleInput}
            onChange={(e) => setScheduleInput(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          />
          <button onClick={applySchedule} className="px-3 py-1 rounded-md bg-blue-600 text-white">Apply Schedule</button>
          <button onClick={publishNow} className="px-3 py-1 rounded-md bg-green-700 text-white">Publish Now</button>
        </div>
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
