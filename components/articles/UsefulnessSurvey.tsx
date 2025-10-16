'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { event as gaEvent } from '@/lib/analytics/gtag';

interface UsefulnessSurveyProps {
  articleId: string;
  articleTitle: string;
}

type Score = 1 | 2 | 3 | 4 | 5;

export default function UsefulnessSurvey({ articleId, articleTitle }: UsefulnessSurveyProps) {
  const storageKey = `usefulness_submitted_${articleId}`;
  const [submitted, setSubmitted] = useState(false);
  const [clarity, setClarity] = useState<Score | 0>(0);
  const [actionability, setActionability] = useState<Score | 0>(0);
  const [credibility, setCredibility] = useState<Score | 0>(0);

  useEffect(() => {
    try {
      setSubmitted(localStorage.getItem(storageKey) === '1');
    } catch {}
  }, [storageKey]);

  const onSubmit = () => {
    if (!clarity || !actionability || !credibility) return;
    // Send GA event with signals
    gaEvent('usefulness_feedback', {
      article_id: articleId,
      article_title: articleTitle,
      clarity,
      actionability,
      credibility,
      composite_score: Math.round(((clarity + actionability + credibility) / 15) * 100),
      event_category: 'engagement',
    });
    try { localStorage.setItem(storageKey, '1'); } catch {}
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="mt-12 border-2 border-emerald-200">
        <CardContent className="p-6 text-center text-emerald-700 font-medium">
          Thank you for your feedback — it helps us make articles more useful.
        </CardContent>
      </Card>
    );
  }

  const renderScale = (label: string, value: number, setValue: (v: Score) => void) => (
    <div className="space-y-2">
      <div className="text-sm text-gray-700 font-medium">{label}</div>
      <div className="flex items-center gap-2">
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setValue(n as Score)}
            className={`w-9 h-9 rounded-full border text-sm transition-all ${
              value === n ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:border-indigo-400 text-gray-700'
            }`}
            aria-label={`${label} ${n}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-gray-500">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="text-lg">Was this article useful?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderScale('Clarity (easy to understand)', clarity, (v) => setClarity(v))}
        {renderScale('Actionability (can apply it)', actionability, (v) => setActionability(v))}
        {renderScale('Credibility (well-sourced)', credibility, (v) => setCredibility(v))}
        <div className="pt-2">
          <Button onClick={onSubmit} disabled={!clarity || !actionability || !credibility} className="w-full md:w-auto">
            Submit feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
