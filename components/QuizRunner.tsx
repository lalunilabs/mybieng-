'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Quiz } from '@/data/quizzes';
import { ensureSessionId } from '@/lib/session';
import { QuizCompletion } from '@/components/QuizCompletion';

const likert = [
  { label: 'Strongly disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly agree', value: 5 },
];

const yesNo = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 },
];

export default function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const total = useMemo(() => {
    return Object.values(answers).reduce((sum: number, answer) => {
      const numValue = typeof answer === 'number' ? answer : 0;
      return sum + numValue;
    }, 0);
  }, [answers]);

  const band = useMemo(() => {
    return quiz.bands.find((b) => total >= b.min && total <= b.max) ?? null;
  }, [quiz.bands, total]);

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  useEffect(() => {
    // Ensure anonymous session cookie exists
    ensureSessionId();
  }, []);

  function handleChange(id: string, value: number | string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
  }

  function renderQuestion(q: any, idx: number) {
    const questionNumber = `${idx + 1}. `;
    
    switch (q.type) {
      case 'likert':
        return (
          <div key={q.id} className="rounded-lg border p-4">
            <p className="font-medium">{questionNumber}{q.text}</p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-2">
              {likert.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-50">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.value}
                    checked={answers[q.id] === opt.value}
                    onChange={() => handleChange(q.id, opt.value)}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'yes_no':
        return (
          <div key={q.id} className="rounded-lg border p-4">
            <p className="font-medium">{questionNumber}{q.text}</p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {yesNo.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-50">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.value}
                    checked={answers[q.id] === opt.value}
                    onChange={() => handleChange(q.id, opt.value)}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <div key={q.id} className="rounded-lg border p-4">
            <p className="font-medium">{questionNumber}{q.text}</p>
            <div className="mt-3 space-y-2">
              {q.options?.map((option: string, optIdx: number) => (
                <label key={optIdx} className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-50">
                  <input
                    type="radio"
                    name={q.id}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleChange(q.id, option)}
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'text_input':
        return (
          <div key={q.id} className="rounded-lg border p-4">
            <p className="font-medium">{questionNumber}{q.text}</p>
            <div className="mt-3">
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={q.placeholder || 'Type your answer here...'}
                value={answers[q.id] as string || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="mt-6">
      <div className="space-y-6">
        {quiz.questions.map((q, idx) => renderQuestion(q, idx))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Answered {Object.keys(answers).length} / {quiz.questions.length}
        </p>
        <button
          disabled={!allAnswered}
          onClick={handleSubmit}
          className={`px-4 py-2 rounded-md ${allAnswered ? 'bg-brand-700 text-white hover:bg-brand-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          See Results
        </button>
      </div>

      {submitted && (
        <div className="mt-8">
          <QuizCompletion
            quizSlug={quiz.slug}
            quizTitle={quiz.title}
            responses={quiz.questions.map(q => ({
              questionId: q.id,
              questionText: q.text,
              answer: answers[q.id],
              questionType: 'scale' as const
            }))}
          />
        </div>
      )}
    </div>
  );
}
