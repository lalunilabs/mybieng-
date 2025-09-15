"use client";

import { useEffect, useMemo, useState } from 'react';

type DailyEntry = {
  date: string;
  energy: number;
  mood: number;
  focus: number;
  stress: number;
  notes?: string;
};

type WeeklyEntry = {
  week: string; // YYYY-WW
  alignment: number; // 1-5
  progress: number; // 1-5
  challenge?: string;
  nextAction?: string;
};

type MonthlyEntry = {
  month: string; // YYYY-MM
  valueAlignment: number;
  biggestPattern?: string;
  learning?: string;
  priority?: string;
};

function todayKey() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function weekKey() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d as any) - (onejan as any)) / 86400000 + onejan.getDay() + 1) / 7);
  const w = String(week).padStart(2, '0');
  return `${d.getFullYear()}-${w}`;
}

function monthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function saveLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function readLocal<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export default function CheckInsClient() {
  const [tab, setTab] = useState<'daily' | 'weekly' | 'monthly' | 'history'>('daily');
  // Daily state
  const [daily, setDaily] = useState<DailyEntry>({
    date: todayKey(),
    energy: 3,
    mood: 3,
    focus: 3,
    stress: 3,
    notes: ''
  });
  const [weekly, setWeekly] = useState<WeeklyEntry>({
    week: weekKey(),
    alignment: 3,
    progress: 3,
    challenge: '',
    nextAction: ''
  });
  const [monthly, setMonthly] = useState<MonthlyEntry>({
    month: monthKey(),
    valueAlignment: 3,
    biggestPattern: '',
    learning: '',
    priority: ''
  });
  const [savedMsg, setSavedMsg] = useState<string>('');

  useEffect(() => {
    // Hydrate from localStorage if exists
    const d = readLocal<DailyEntry>(`mybeing_ema_daily_${todayKey()}`);
    if (d) setDaily(d);
    const w = readLocal<WeeklyEntry>(`mybeing_ema_weekly_${weekKey()}`);
    if (w) setWeekly(w);
    const m = readLocal<MonthlyEntry>(`mybeing_ema_monthly_${monthKey()}`);
    if (m) setMonthly(m);
  }, []);

  const [history, setHistory] = useState<Array<{ key: string; value: any }>>([]);

  useEffect(() => {
    // Recompute history when tab changes or after saves to reflect latest localStorage
    if (typeof window === 'undefined') return;
    const out: { key: string; value: any }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith('mybeing_ema_')) {
        const v = readLocal<any>(k);
        out.push({ key: k, value: v });
      }
    }
    out.sort((a, b) => a.key.localeCompare(b.key));
    setHistory(out);
  }, [tab, savedMsg]);

  const saveDaily = () => {
    const key = `mybeing_ema_daily_${daily.date}`;
    saveLocal(key, daily);
    setSavedMsg('Daily check-in saved.');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  const saveWeekly = () => {
    const key = `mybeing_ema_weekly_${weekly.week}`;
    saveLocal(key, weekly);
    setSavedMsg('Weekly reflection saved.');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  const saveMonthly = () => {
    const key = `mybeing_ema_monthly_${monthly.month}`;
    saveLocal(key, monthly);
    setSavedMsg('Monthly review saved.');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['daily','weekly','monthly','history'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-full border ${tab===t?'bg-primary text-white border-primary':'bg-white text-foreground'}`}
          >
            {t[0].toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {savedMsg && (<div className="mb-4 text-green-700">{savedMsg}</div>)}

      {tab==='daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(
              [
                { key: 'energy', label: 'Energy' },
                { key: 'mood', label: 'Mood' },
                { key: 'focus', label: 'Focus' },
                { key: 'stress', label: 'Stress' },
              ] as const
            ).map(item => (
              <div key={item.key} className="p-4 rounded-xl border bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{(daily as any)[item.key]}</div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={(daily as any)[item.key]}
                  onChange={(e) => setDaily(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border bg-white">
            <div className="font-medium mb-2">Notes (optional)</div>
            <textarea
              value={daily.notes}
              onChange={(e) => setDaily(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full border rounded-md p-2"
              rows={3}
              placeholder="Any quick observations..."
            />
          </div>

          <div className="flex justify-end">
            <button onClick={saveDaily} className="px-4 py-2 rounded-md bg-primary text-white">Save Daily</button>
          </div>
          <p className="text-xs text-muted-foreground">No right or wrong answers. This is about noticing patterns over time.</p>
        </div>
      )}

      {tab==='weekly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(
              [
                { key: 'alignment', label: 'Value Alignment This Week' },
                { key: 'progress', label: 'Progress Toward Intentions' },
              ] as const
            ).map(item => (
              <div key={item.key} className="p-4 rounded-xl border bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{(weekly as any)[item.key]}</div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={(weekly as any)[item.key]}
                  onChange={(e) => setWeekly(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-4 rounded-xl border bg-white">
              <div className="font-medium mb-2">Biggest challenge or pattern noticed</div>
              <textarea
                value={weekly.challenge}
                onChange={(e) => setWeekly(prev => ({ ...prev, challenge: e.target.value }))}
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="What stood out this week?"
              />
            </div>
            <div className="p-4 rounded-xl border bg-white">
              <div className="font-medium mb-2">Next week: one small action</div>
              <textarea
                value={weekly.nextAction}
                onChange={(e) => setWeekly(prev => ({ ...prev, nextAction: e.target.value }))}
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="Choose one small, testable step"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={saveWeekly} className="px-4 py-2 rounded-md bg-primary text-white">Save Weekly</button>
          </div>
          <p className="text-xs text-muted-foreground">Weekly reflection helps transform insights into experiments and measurable change.</p>
        </div>
      )}

      {tab==='monthly' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Overall Value Alignment</div>
              <div className="text-sm text-muted-foreground">{monthly.valueAlignment}</div>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={monthly.valueAlignment}
              onChange={(e) => setMonthly(prev => ({ ...prev, valueAlignment: Number(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-4 rounded-xl border bg-white">
              <div className="font-medium mb-2">Biggest pattern this month</div>
              <textarea
                value={monthly.biggestPattern}
                onChange={(e) => setMonthly(prev => ({ ...prev, biggestPattern: e.target.value }))}
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="What repeated the most?"
              />
            </div>
            <div className="p-4 rounded-xl border bg-white">
              <div className="font-medium mb-2">What did you learn?</div>
              <textarea
                value={monthly.learning}
                onChange={(e) => setMonthly(prev => ({ ...prev, learning: e.target.value }))}
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="Insights, shifts, observations"
              />
            </div>
            <div className="p-4 rounded-xl border bg-white">
              <div className="font-medium mb-2">Priority for next month</div>
              <textarea
                value={monthly.priority}
                onChange={(e) => setMonthly(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="One area to focus on"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={saveMonthly} className="px-4 py-2 rounded-md bg-primary text-white">Save Monthly</button>
          </div>
          <p className="text-xs text-muted-foreground">Monthly review consolidates growth and sets a focused direction.</p>
        </div>
      )}

      {tab==='history' && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No check-ins saved yet.</p>
          ) : (
            <ul className="space-y-2">
              {history.map(h => (
                <li key={h.key} className="p-3 rounded-lg border bg-white">
                  <div className="text-xs text-muted-foreground mb-1">{h.key}</div>
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(h.value, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
