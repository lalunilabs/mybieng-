"use client";

import { useEffect, useMemo, useState } from 'react';

type Quiz = any;

type Props = {
  value: Quiz;
  onChange: (q: Quiz) => void;
  onSave: (q: Quiz) => Promise<void> | void;
  onDelete: (slug: string) => Promise<void> | void;
  onUploadImage?: (file: File) => Promise<void> | void;
  onUploadQuestionImage?: (index: number, file: File) => Promise<void> | void;
  onGenerateMeta?: (q: Quiz) => Quiz | void;
  onValidateMeta?: (q: Quiz) => string | null;
};

export default function QuizEditor({ value, onChange, onSave, onDelete, onUploadImage, onUploadQuestionImage, onGenerateMeta, onValidateMeta }: Props) {
  const [tab, setTab] = useState<'overview' | 'questions' | 'bands' | 'results' | 'seo' | 'schedule' | 'research' | 'raw'>('overview');
  const [draft, setDraft] = useState<Quiz>(value || {});
  const [scheduleInput, setScheduleInput] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [insights, setInsights] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | 'all'>('all');

  useEffect(() => {
    setDraft(value || {});
  }, [value]);

  useEffect(() => {
    try {
      const d = draft?.publishedAt ? new Date(draft.publishedAt) : undefined;
      if (d && !isNaN(d.getTime())) {
        const pad = (n: number) => String(n).padStart(2, '0');
        const val = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setScheduleInput(val);
      } else {
        setScheduleInput('');
      }
    } catch { setScheduleInput(''); }
  }, [draft?.publishedAt]);

  const update = (u: Partial<Quiz>) => {
    const next = { ...draft, ...u };
    setDraft(next);
    onChange(next);
  };

  // Research insights
  useEffect(() => {
    if (!draft?.slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/research/quiz/${encodeURIComponent(draft.slug)}/insights?timeRange=${timeRange}`);
        if (res.ok) setInsights(await res.json());
      } catch {}
    })();
  }, [draft?.slug, timeRange]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setInfo('');
    try {
      await onSave(draft);
      setInfo('Saved.');
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    if (!draft?.slug) return;
    try {
      const res = await fetch(`/api/admin/research/quiz/${encodeURIComponent(draft.slug)}/export?format=${format}&timeRange=${timeRange}`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${draft.slug}-research-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  };

  const handleReport = async () => {
    if (!draft?.slug) return;
    try {
      const res = await fetch(`/api/admin/research/quiz/${encodeURIComponent(draft.slug)}/report?timeRange=${timeRange}`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${draft.slug}-research-report-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  };

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input className="mt-1 w-full border rounded px-2 py-1" value={draft.title || ''} onChange={e => update({ title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input className="mt-1 w-full border rounded px-2 py-1" value={draft.slug || ''} onChange={e => update({ slug: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea className="mt-1 w-full border rounded px-2 py-1" rows={3} value={draft.description || ''} onChange={e => update({ description: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Cover image URL</label>
          <input className="mt-1 w-full border rounded px-2 py-1" value={draft.imageUrl || ''} onChange={e => update({ imageUrl: e.target.value })} />
        </div>
        <div className="flex items-center gap-2">
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f && onUploadImage) onUploadImage(f); }} className="text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Tags (comma separated)</label>
          <input className="mt-1 w-full border rounded px-2 py-1" value={(draft.tags || []).join(', ')} onChange={e => update({ tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium flex items-center gap-2"><input type="checkbox" checked={!!draft.isPaid} onChange={e => update({ isPaid: e.target.checked })} /> Paid</label>
          <div className="flex-1">
            <label className="block text-sm font-medium">Price</label>
            <input type="number" className="mt-1 w-full border rounded px-2 py-1" value={draft.price ?? 0} onChange={e => update({ price: Number(e.target.value) })} />
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Attachments (links)</label>
          <button onClick={() => update({ attachments: [...(draft.attachments || []), { label: '', url: '', type: 'link' }] })} className="px-2 py-1 text-xs border rounded">Add Attachment</button>
        </div>
        <div className="mt-2 space-y-2">
          {(draft.attachments || []).map((att: any, idx: number) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-600">Label</label>
                <input className="w-full border rounded px-2 py-1 text-sm" value={att.label || ''} onChange={(e) => {
                  const arr = [...(draft.attachments || [])]; arr[idx] = { ...att, label: e.target.value }; update({ attachments: arr });
                }} />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs text-gray-600">URL</label>
                <input className="w-full border rounded px-2 py-1 text-sm" value={att.url || ''} onChange={(e) => {
                  const arr = [...(draft.attachments || [])]; arr[idx] = { ...att, url: e.target.value }; update({ attachments: arr });
                }} />
              </div>
              <div className="md:col-span-5 flex justify-end">
                <button onClick={() => { const arr = [...(draft.attachments || [])]; arr.splice(idx, 1); update({ attachments: arr }); }} className="px-2 py-1 text-xs border rounded text-red-600">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    const interpStr = JSON.stringify(draft.resultInterpretation || { single: '', dual: '', multi: '' }, null, 2);
    const profilesStr = JSON.stringify(draft.resultProfiles || {}, null, 2);
    const onInterpBlur = (val: string) => {
      try {
        const parsed = JSON.parse(val);
        update({ resultInterpretation: parsed });
        setInfo('Updated result interpretation.');
      } catch { setError('Invalid JSON for resultInterpretation'); }
    };
    const onProfilesBlur = (val: string) => {
      try {
        const parsed = JSON.parse(val);
        update({ resultProfiles: parsed });
        setInfo('Updated result profiles.');
      } catch { setError('Invalid JSON for resultProfiles'); }
    };
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Result Type</label>
            <input className="mt-1 w-full border rounded px-2 py-1" placeholder="e.g., numeric-bands, motivation-language"
              value={draft.resultType || ''} onChange={e => update({ resultType: e.target.value })} />
            <div className="text-xs text-gray-500 mt-1">Use "motivation-language" for categorical/profile-based results. Leave empty to default to numeric bands.</div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Result Interpretation (JSON)</label>
          </div>
          <textarea className="mt-1 w-full border rounded px-2 py-1 font-mono text-xs" rows={8}
            defaultValue={interpStr}
            onBlur={e => onInterpBlur(e.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Result Profiles (JSON)</label>
          </div>
          <textarea className="mt-1 w-full border rounded px-2 py-1 font-mono text-xs" rows={12}
            defaultValue={profilesStr}
            onBlur={e => onProfilesBlur(e.target.value)}
          />
          <div className="text-xs text-gray-500 mt-1">Profiles keyed by category (e.g., architect, achiever, encourager, connector, visionary).</div>
        </div>
      </div>
    );
  };

  const updateQuestion = (idx: number, q: any) => {
    const arr = Array.isArray(draft.questions) ? [...draft.questions] : [];
    arr[idx] = q; update({ questions: arr });
  };
  const addQuestion = () => update({ questions: [...(draft.questions || []), { id: `q${Date.now()}`, text: '', type: 'likert', options: [] }] });
  const delQuestion = (idx: number) => {
    const arr = [...(draft.questions || [])]; arr.splice(idx, 1); update({ questions: arr });
  };
  const moveQuestion = (idx: number, dir: -1 | 1) => {
    const arr = [...(draft.questions || [])]; const ni = idx + dir; if (ni < 0 || ni >= arr.length) return; const t = arr[idx]; arr[idx] = arr[ni]; arr[ni] = t; update({ questions: arr });
  };

  const renderQuestions = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Questions ({draft.questions?.length || 0})</h4>
        <button onClick={addQuestion} className="px-3 py-1 rounded-md bg-brand-700 text-white">Add Question</button>
      </div>
      <div className="space-y-3">
        {(draft.questions || []).map((q: any, i: number) => (
          <div key={q.id || i} className="p-3 border rounded-md bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">{q.id || `q${i+1}`}</div>
              <div className="flex items-center gap-2 text-sm">
                <button onClick={() => moveQuestion(i, -1)} className="px-2 py-1 border rounded">↑</button>
                <button onClick={() => moveQuestion(i, 1)} className="px-2 py-1 border rounded">↓</button>
                <button onClick={() => delQuestion(i)} className="px-2 py-1 border rounded text-red-600">Delete</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Text</label>
                <input className="mt-1 w-full border rounded px-2 py-1" value={q.text || ''} onChange={e => updateQuestion(i, { ...q, text: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Type</label>
                <select className="mt-1 w-full border rounded px-2 py-1" value={q.type || 'likert'} onChange={e => updateQuestion(i, { ...q, type: e.target.value })}>
                  <option value="likert">Likert (1-5)</option>
                  <option value="yes_no">Yes / No</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="text_input">Text Input</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Image URL (optional)</label>
                <input className="mt-1 w-full border rounded px-2 py-1" value={q.imageUrl || ''} onChange={e => updateQuestion(i, { ...q, imageUrl: e.target.value })} />
              </div>
              <div className="flex items-end">
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; if (onUploadQuestionImage) { onUploadQuestionImage(i, f); } }} className="text-sm" />
              </div>
            </div>
            {q.type === 'multiple_choice' && (
              <div className="mt-2">
                <label className="block text-sm font-medium">Options (one per line)</label>
                <textarea className="mt-1 w-full border rounded px-2 py-1" rows={3} value={(q.options || []).join('\n')} onChange={e => updateQuestion(i, { ...q, options: e.target.value.split('\n').map((s)=>s.trim()).filter(Boolean) })} />
              </div>
            )}
            {q.type === 'multiple_choice' && (
              <div className="mt-2">
                <label className="block text-sm font-medium">Option Categories (one per line; must match number of options)</label>
                <textarea
                  className="mt-1 w-full border rounded px-2 py-1"
                  rows={3}
                  value={(q.optionCategories || []).join('\n')}
                  onChange={e => updateQuestion(i, { ...q, optionCategories: e.target.value.split('\n').map((s)=>s.trim()).filter(Boolean) })}
                />
                <div className="text-xs text-gray-500 mt-1">Examples: architect, achiever, encourager, connector, visionary</div>
              </div>
            )}
            {q.type === 'text_input' && (
              <div className="mt-2">
                <label className="block text-sm font-medium">Placeholder (optional)</label>
                <input className="mt-1 w-full border rounded px-2 py-1" value={q.placeholder || ''} onChange={e => updateQuestion(i, { ...q, placeholder: e.target.value })} />
              </div>
            )}
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Attachments (links)</label>
                <button onClick={() => { const arr = [...(draft.questions || [])]; const qa = [...(q.attachments || [])]; qa.push({ label: '', url: '', type: 'link' }); arr[i] = { ...q, attachments: qa }; update({ questions: arr }); }} className="px-2 py-1 text-xs border rounded">Add Attachment</button>
              </div>
              <div className="mt-2 space-y-2">
                {(q.attachments || []).map((att: any, ai: number) => (
                  <div key={ai} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600">Label</label>
                      <input className="w-full border rounded px-2 py-1 text-sm" value={att.label || ''} onChange={(e) => { const arr = [...(draft.questions || [])]; const qa = [...(q.attachments || [])]; qa[ai] = { ...att, label: e.target.value }; arr[i] = { ...q, attachments: qa }; update({ questions: arr }); }} />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs text-gray-600">URL</label>
                      <input className="w-full border rounded px-2 py-1 text-sm" value={att.url || ''} onChange={(e) => { const arr = [...(draft.questions || [])]; const qa = [...(q.attachments || [])]; qa[ai] = { ...att, url: e.target.value }; arr[i] = { ...q, attachments: qa }; update({ questions: arr }); }} />
                    </div>
                    <div className="md:col-span-5 flex justify-end">
                      <button onClick={() => { const arr = [...(draft.questions || [])]; const qa = [...(q.attachments || [])]; qa.splice(ai, 1); arr[i] = { ...q, attachments: qa }; update({ questions: arr }); }} className="px-2 py-1 text-xs border rounded text-red-600">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const updateBand = (idx: number, b: any) => { const arr = [...(draft.bands || [])]; arr[idx] = b; update({ bands: arr }); };
  const addBand = () => update({ bands: [...(draft.bands || []), { min: 0, max: 0, label: '', advice: '' }] });
  const delBand = (idx: number) => { const arr = [...(draft.bands || [])]; arr.splice(idx,1); update({ bands: arr }); };
  const moveBand = (idx: number, dir: -1 | 1) => { const arr = [...(draft.bands || [])]; const ni = idx + dir; if (ni < 0 || ni >= arr.length) return; const t = arr[idx]; arr[idx]=arr[ni]; arr[ni]=t; update({ bands: arr }); };

  const renderBands = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Bands ({draft.bands?.length || 0})</h4>
        <button onClick={addBand} className="px-3 py-1 rounded-md bg-brand-700 text-white">Add Band</button>
      </div>
      <div className="space-y-3">
        {(draft.bands || []).map((b: any, i: number) => (
          <div key={i} className="p-3 border rounded-md bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Band #{i+1}</div>
              <div className="flex items-center gap-2 text-sm">
                <button onClick={() => moveBand(i, -1)} className="px-2 py-1 border rounded">↑</button>
                <button onClick={() => moveBand(i, 1)} className="px-2 py-1 border rounded">↓</button>
                <button onClick={() => delBand(i)} className="px-2 py-1 border rounded text-red-600">Delete</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium">Min</label>
                <input type="number" className="mt-1 w-full border rounded px-2 py-1" value={b.min ?? 0} onChange={e => updateBand(i, { ...b, min: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Max</label>
                <input type="number" className="mt-1 w-full border rounded px-2 py-1" value={b.max ?? 0} onChange={e => updateBand(i, { ...b, max: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Label</label>
                <input className="mt-1 w-full border rounded px-2 py-1" value={b.label || ''} onChange={e => updateBand(i, { ...b, label: e.target.value })} />
              </div>
              <div className="md:col-span-1"></div>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium">Advice</label>
              <textarea className="mt-1 w-full border rounded px-2 py-1" rows={2} value={b.advice || ''} onChange={e => updateBand(i, { ...b, advice: e.target.value })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSEO = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Meta Title</label>
          <input className="mt-1 w-full border rounded px-2 py-1" value={draft.metaTitle || ''} onChange={e => update({ metaTitle: e.target.value })} />
          <div className="text-xs text-gray-500 mt-1">{(draft.metaTitle || '').length} / 70</div>
        </div>
        <div>
          <label className="block text-sm font-medium">Canonical URL</label>
          <input className="mt-1 w-full border rounded px-2 py-1" value={draft.canonicalUrl || ''} onChange={e => update({ canonicalUrl: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Meta Description</label>
        <textarea className="mt-1 w-full border rounded px-2 py-1" rows={3} value={draft.metaDescription || ''} onChange={e => update({ metaDescription: e.target.value })} />
        <div className="text-xs text-gray-500 mt-1">{(draft.metaDescription || '').length} / 160</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Keywords (comma separated)</label>
          <input className="mt-1 w-full border rounded px-2 py-1" value={(draft.keywords || []).join(', ')} onChange={e => update({ keywords: e.target.value.split(',').map((s)=>s.trim()).filter(Boolean) })} />
        </div>
        <div>
          <label className="block text-sm font-medium">OG Image URL</label>
          <input className="mt-1 w-full border rounded px-2 py-1" value={draft.ogImage || ''} onChange={e => update({ ogImage: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Robots</label>
        <input className="mt-1 w-full border rounded px-2 py-1" value={draft.robots || ''} onChange={e => update({ robots: e.target.value })} />
      </div>
      <div className="flex items-center gap-2">
        {onGenerateMeta && (
          <button onClick={() => { const next = onGenerateMeta(draft); if (next) update(next as any); setInfo('Meta generated. Review and Save.'); }} className="px-3 py-1 rounded-md bg-sky-700 text-white">Generate Meta</button>
        )}
        {onValidateMeta && (
          <button onClick={() => { const msg = onValidateMeta(draft); if (msg) { setError(msg); } else { setInfo('Meta looks good.'); } }} className="px-3 py-1 rounded-md bg-amber-700 text-white">Validate Meta</button>
        )}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium flex items-center gap-2"><input type="checkbox" checked={!(draft.published === false)} onChange={(e) => update({ published: e.target.checked })} /> Published</label>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Publish at</label>
        <input type="datetime-local" value={scheduleInput} onChange={(e) => setScheduleInput(e.target.value)} className="text-sm border rounded px-2 py-1" />
        <button onClick={() => { if (!scheduleInput) { const { publishedAt, ...rest } = draft; update(rest as any); } else { update({ publishedAt: new Date(scheduleInput).toISOString() }); } }} className="px-3 py-1 rounded-md bg-blue-600 text-white">Apply Schedule</button>
        <button onClick={() => { update({ published: true, publishedAt: new Date().toISOString() }); }} className="px-3 py-1 rounded-md bg-green-700 text-white">Publish Now</button>
      </div>
    </div>
  );

  const renderResearch = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Time Range</span>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)} className="px-3 py-2 border rounded-md text-sm">
          <option value="24h">Last 24h</option>
          <option value="7d">Last 7d</option>
          <option value="30d">Last 30d</option>
          <option value="90d">Last 90d</option>
          <option value="all">All time</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => handleExport('json')} className="px-3 py-1 rounded-md border">Export JSON</button>
          <button onClick={() => handleExport('csv')} className="px-3 py-1 rounded-md border">Export CSV</button>
          <button onClick={handleReport} className="px-3 py-1 rounded-md bg-brand-700 text-white">Download Report</button>
        </div>
      </div>

      {!insights ? (
        <div className="text-sm text-gray-500">Loading insights...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border rounded-md bg-white">
            <h4 className="font-medium mb-2">Performance</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Total Completions</span><span>{insights.totalCompletions}</span></div>
              <div className="flex justify-between"><span>Average Score</span><span>{insights.averageScore?.toFixed?.(1) ?? insights.averageScore}</span></div>
            </div>
          </div>
          <div className="p-3 border rounded-md bg-white">
            <h4 className="font-medium mb-2">Score Distribution</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(insights.scoreDistribution || {}).map(([band, count]: any) => (
                <div key={band} className="flex justify-between"><span>{band}</span><span>{count}</span></div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 p-3 border rounded-md bg-white">
            <h4 className="font-medium mb-2">Top Questions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(insights.questionStats || {}).slice(0, 6).map(([qid, q]: any) => (
                <div key={qid} className="text-sm">
                  <div className="font-medium">{q.questionText}</div>
                  <div className="text-gray-600">Avg: {typeof q.averageResponse === 'number' ? q.averageResponse.toFixed(2) : '-'} | Responses: {Object.values(q.responseDistribution || {}).reduce((a: any, b: any) => a + (b as number), 0)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 p-3 border rounded-md bg-white">
            <h4 className="font-medium mb-2">Completion Trend (Daily)</h4>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-sm text-gray-700">
              {(insights.completionTrend || []).slice(-7).map((pt: any) => (
                <div key={pt.date} className="p-2 border rounded">
                  <div className="text-xs text-gray-500">{pt.date}</div>
                  <div className="font-medium">{pt.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRaw = () => (
    <div>
      <textarea className="w-full h-[50vh] border rounded-md p-2 font-mono text-sm" value={JSON.stringify(draft, null, 2)} onChange={(e) => { try { const obj = JSON.parse(e.target.value); setDraft(obj); onChange(obj); } catch { /* ignore */ } }} />
      <p className="text-xs text-gray-500 mt-2">Directly editing raw JSON will update the form if the JSON is valid.</p>
    </div>
  );

  return (
    <div>
      {(error || info) && (
        <div className="mb-3 space-y-2">
          {error && <div className="text-sm text-red-600 whitespace-pre-wrap">{error}</div>}
          {info && <div className="text-sm text-green-700">{info}</div>}
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          {(['overview','questions','bands','results','seo','schedule','research','raw'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-full border ${tab===t?'bg-brand-600 text-white border-brand-600':'bg-white'}`}>{t[0].toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
        <div className="space-x-2">
          <button onClick={handleSave} disabled={saving} className="px-3 py-1 rounded-md bg-green-700 text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
          <button onClick={() => draft?.slug && onDelete(draft.slug)} className="px-3 py-1 rounded-md bg-red-600 text-white">Delete</button>
        </div>
      </div>

      <div className="p-3 rounded-md border bg-white">
        {tab === 'overview' && renderOverview()}
        {tab === 'questions' && renderQuestions()}
        {tab === 'bands' && renderBands()}
        {tab === 'results' && renderResults()}
        {tab === 'seo' && renderSEO()}
        {tab === 'schedule' && renderSchedule()}
        {tab === 'research' && renderResearch()}
        {tab === 'raw' && renderRaw()}
      </div>
    </div>
  );
}
