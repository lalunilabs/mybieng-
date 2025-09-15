"use client";

import { useEffect, useMemo, useState } from 'react';
import QuizEditor from '@/components/admin/QuizEditor';

type Quiz = any;

export default function AdminQuizzes() {
  const [items, setItems] = useState<Quiz[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [current, setCurrent] = useState<Quiz | null>(null);
  const [error, setError] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // selected quiz object is tracked in `current`

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/quizzes');
      if (!res.ok) throw new Error('Failed to load');
      const j = await res.json();
      setItems(j.items || []);
      if (!selectedSlug && (j.items?.length ?? 0) > 0) {
        setSelectedSlug(j.items[0].slug);
        setCurrent(j.items[0]);
      } else if (selectedSlug) {
        const found = (j.items || []).find((q: any) => q.slug === selectedSlug);
        if (found) setCurrent(found);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const onUploadQuestionImage = async (index: number, file: File) => {
    if (!file || !current) return;
    setUploadError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const j = await res.json();
      if (!res.ok || !j?.imageUrl) throw new Error(j?.error || 'Upload failed');
      setCurrent((prev: any) => {
        const next = { ...(prev || {}), questions: [...((prev?.questions) || [])] };
        if (!next.questions[index]) return prev;
        next.questions[index] = { ...next.questions[index], imageUrl: j.imageUrl };
        return next;
      });
    } catch (e: any) {
      setUploadError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const generateMeta = (payload: any): any => {
    const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.com';
    const title: string = payload.title || '';
    const description: string = payload.description || payload.metaDescription || '';
    const metaTitle = payload.metaTitle || `${title} | MyBeing Quiz`;
    const metaDescription = (payload.metaDescription || description || '')
      .toString()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);
    const keywords: string[] = Array.isArray(payload.keywords) && payload.keywords.length
      ? payload.keywords
      : Array.from(new Set([...(payload.tags || []), 'quiz', 'assessment', 'psychology', 'patterns'])).slice(0, 8);
    const canonicalUrl = payload.canonicalUrl || `${base}/quizzes/${payload.slug}`;
    const ogImage = payload.ogImage || `${base}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(metaDescription)}`;
    const robots = payload.robots || 'index,follow';
    const next = { ...payload, metaTitle, metaDescription, keywords, canonicalUrl, ogImage, robots };
    return next;
  };

  const validateMeta = (payload: any): string | null => {
    const errs: string[] = [];
    if (!payload.slug) errs.push('Missing slug');
    if (!payload.title) errs.push('Missing title');
    if (!Array.isArray(payload.questions)) errs.push('questions[] missing');
    if (!Array.isArray(payload.bands)) errs.push('bands[] missing');
    if (payload.published && !payload.publishedAt) errs.push('Published items should have publishedAt');
    if (!payload.metaTitle) errs.push('Missing metaTitle');
    if ((payload.metaTitle || '').length > 70) errs.push('metaTitle should be <= 70 chars');
    if (!payload.metaDescription) errs.push('Missing metaDescription');
    if ((payload.metaDescription || '').length > 160) errs.push('metaDescription should be <= 160 chars');
    if (!payload.canonicalUrl) errs.push('Missing canonicalUrl');
    if (!Array.isArray(payload.keywords)) errs.push('keywords should be an array');
    return errs.length ? ('Meta validation failed:\n- ' + errs.join('\n- ')) : null;
  };

  // Scheduling controls are handled inside QuizEditor

  // publishNow handled in QuizEditor

  // togglePublish handled in QuizEditor

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = (slug: string) => {
    setSelectedSlug(slug);
    const found = items.find(i => i.slug === slug) || null;
    setCurrent(found);
    setInfo('');
    setError('');
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
      setCurrent((prev: any) => ({ ...(prev || {}), imageUrl: j.imageUrl }));
    } catch (e: any) {
      setUploadError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const newQuiz = () => {
    const tpl = {
      slug: 'new-quiz',
      title: 'New Quiz',
      description: 'Description...',
      imageUrl: '',
      questions: [],
      bands: [],
      published: false,
      publishedAt: undefined as any,
      tags: [],
      isPaid: false,
      price: 0,
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      canonicalUrl: '',
      ogImage: '',
      robots: 'index,follow'
    };
    setSelectedSlug(tpl.slug);
    setCurrent(tpl as any);
    setError('');
    setInfo('');
  };

  const saveObject = async (payload: any) => {
    if (!payload.slug || !payload.title || !Array.isArray(payload.questions) || !Array.isArray(payload.bands)) {
      throw new Error('slug, title, questions[], and bands[] are required');
    }
    const res = await fetch('/api/admin/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || 'Save failed');
    }
    await load();
  };

  const del = async () => {
    if (!selectedSlug) return;
    if (!confirm(`Delete quiz ${selectedSlug}?`)) return;
    try {
      const res = await fetch(`/api/admin/quizzes?slug=${encodeURIComponent(selectedSlug)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSelectedSlug('');
      setCurrent(null);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Quizzes</h2>
          <button onClick={newQuiz} className="px-3 py-1 rounded-md bg-brand-700 text-white">New</button>
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
        {error && <div className="text-sm text-red-600 mb-2 whitespace-pre-wrap">{error}</div>}
        {info && <div className="text-sm text-green-700 mb-2">{info}</div>}
        {!current ? (
          <div className="p-6 text-sm text-gray-500 border rounded-md bg-white">Select a quiz or click New to start.</div>
        ) : (
          <QuizEditor
            value={current}
            onChange={(q) => setCurrent(q)}
            onSave={async (q) => { setSaving(true); try { await saveObject(q); setInfo('Saved.'); } catch (e: any) { setError(e?.message || 'Save failed'); } finally { setSaving(false); } }}
            onDelete={async (_slug: string) => { await del(); }}
            onUploadImage={onUploadImage}
            onUploadQuestionImage={onUploadQuestionImage}
            onGenerateMeta={(q) => generateMeta(q)}
            onValidateMeta={(q) => validateMeta(q)}
          />
        )}
        {uploadError && <span className="text-xs text-red-600 block mt-2">{uploadError}</span>}
      </div>
    </div>
  );
}
