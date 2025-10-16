'use client';

import { useEffect, useMemo, useState } from 'react';
import { UniversalAIChat } from '@/components/ui/UniversalAIChat';
import type { QuizResults, UserSubscription } from '@/types/ai-chat';

interface ArticleAIChatDockProps {
  articleTitle: string;
}

export default function ArticleAIChatDock({ articleTitle }: ArticleAIChatDockProps) {
  const [quizResults, setQuizResults] = useState<QuizResults | undefined>(undefined);
  const [subscription, setSubscription] = useState<UserSubscription | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    // Fetch latest quiz results (authorized; fallback if 401)
    (async () => {
      try {
        const res = await fetch('/api/user/quiz-results', { cache: 'no-store' });
        if (!mounted) return;
        if (res.ok) {
          const results = await res.json();
          const latest = Array.isArray(results) ? results[0] : null;
          if (latest) {
            // Map API shape to QuizResults (band object expected)
            const bandLabel = (latest.band as string) || 'Insight';
            const insights: string[] = latest.insights || [];
            const mapped: QuizResults = {
              quizTitle: latest.quizTitle,
              score: latest.score ?? 0,
              maxScore: latest.maxScore ?? 100,
              band: {
                label: bandLabel,
                description: insights.length ? insights.join(' • ') : "Let's explore what this means for you.",
                advice: 'Ask for 1–2 actionable steps you can apply this week.'
              },
              answers: {},
            };
            setQuizResults(mapped);
          }
        }
      } catch {
        // ignore
      }
    })();

    // Fetch subscription status (optional)
    (async () => {
      try {
        const res = await fetch('/api/user/subscription', { cache: 'no-store' });
        if (!mounted) return;
        if (res.ok) {
          const json = await res.json();
          const stats = json?.stats;
          const isPremium = !!json?.isPremium;
          setSubscription({
            isSubscribed: isPremium,
            plan: isPremium ? 'premium' : 'free',
            freeQuizzesUsed: stats?.freeQuizzesUsed,
            premiumArticlesUsed: stats?.premiumArticlesUsed,
          });
        } else {
          setSubscription({ isSubscribed: false, plan: 'free' });
        }
      } catch {
        setSubscription({ isSubscribed: false, plan: 'free' });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const initial = useMemo(() => (
    `💡 You're reading "${articleTitle}". Ask me to clarify ideas, apply frameworks, or connect this to your quiz patterns. Try: \n• "Summarize the TL;DR in 3 bullets for me"\n• "What action can I take this week based on this?"\n• "Relate this to my latest quiz result"`
  ), [articleTitle]);

  return (
    <UniversalAIChat 
      mode={quizResults ? 'quiz-results' : 'general'}
      quizResults={quizResults}
      userSubscription={subscription}
      initialMessage={initial}
      className="sticky top-24"
    />
  );
}
