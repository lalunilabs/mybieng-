"use client";

import { useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import PrimaryCTA from "@/components/ui/PrimaryCTA";
import dynamic from "next/dynamic";
import { getQuizBySlug, getBandForScore } from "@/data/quizzes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from 'sonner';

export default function ReportDetailPage() {
  const [showEmailField, setShowEmailField] = useState(false);
  const [emailField, setEmailField] = useState('');
  const [sending, setSending] = useState(false);
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const reportId = (params?.reportId as string) || '';
  
  // Pull optional query params if present
  const scoreParam = search?.get("score");
  const maxParam = search?.get("maxScore");
  const quizIdParam = search?.get("quizId");

  const scoreValue = Number(scoreParam ?? 72);
  const maxScore = Number(maxParam ?? 100);

  const quiz = getQuizBySlug(reportId);
  const band = getBandForScore(scoreValue, maxScore)!;

  // Build placeholder responses for visualization
  const responses = useMemo(
    () =>
      (quiz?.questions || []).map((q, idx) => ({
        questionId: q.id ?? String(idx + 1),
        questionText: q.text,
        // Use a simple placeholder answer; visualization doesn't require specific types
        answer: "—",
        questionType: "text" as const,
      })),
    [quiz]
  );

  const chatSessionId = useMemo(() => {
    try {
      // Prefer browser crypto for good entropy
      return (crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2);
    } catch {
      return Math.random().toString(36).slice(2);
    }
  }, []);

  const chatHref = `/chat/${chatSessionId}?quizId=${encodeURIComponent(
    reportId
  )}&band=${encodeURIComponent(band.label)}&score=${encodeURIComponent(
    String(scoreValue)
  )}&maxScore=${encodeURIComponent(String(maxScore))}`;

  const QuizReportVisualization = dynamic(
    () => import("@/components/ui/QuizReportVisualization").then(m => m.QuizReportVisualization),
    { ssr: false, loading: () => <div className="h-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg animate-pulse" /> }
  );

  // Breadcrumbs structured data
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const pageUrl = `${base}/reports/${reportId}`;
  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Reports', item: `${base}/reports` },
      { '@type': 'ListItem', position: 3, name: quiz?.title || 'Assessment Report', item: pageUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/reports" className="inline-flex items-center text-sm text-purple-700 hover:text-purple-800">
            ← Back to reports
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              {quiz?.title || "Assessment Report"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Summary:</span> {band.label}
              </div>
              <div className="hidden md:block text-gray-600">
                <span className="font-semibold">Brief insight:</span> {band.advice}
              </div>
              <div>
                <span className="font-semibold">Quiz:</span> {quiz?.slug || reportId}
              </div>
              <div className="ml-auto flex flex-col gap-3 items-end">
                <PrimaryCTA href={chatHref} surface="report_detail" eventName="report_chat_start" variant="uiverse" className="whitespace-nowrap">
                  Ask AI about this report
                </PrimaryCTA>
                <div className="w-full">
                  <PrimaryCTA
                    surface="report_detail"
                    eventName="email_detailed_report_click"
                    variant="outline"
                    className="whitespace-nowrap"
                    onClick={() => setShowEmailField(v => !v)}
                  >
                    Email detailed report
                  </PrimaryCTA>
                </div>
                {showEmailField && (
                  <form
                    className="flex flex-col sm:flex-row gap-3 w-full"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!emailField || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField)) {
                        toast.error('Please enter a valid email');
                        return;
                      }
                      try {
                        setSending(true);
                        const res = await fetch('/api/quiz/email-results', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: emailField,
                            quizId: reportId,
                            quizTitle: quiz?.title || reportId,
                            score: scoreValue,
                            maxScore,
                            band: band.label,
                          }),
                        });
                        if (res.ok) {
                          toast.success('Detailed report will arrive by email shortly.');
                          setShowEmailField(false);
                          setEmailField('');
                        } else {
                          const j = await res.json().catch(() => ({} as any));
                          toast.error(j.error || 'Failed to queue email');
                        }
                      } catch {
                        toast.error('Network error. Please try again.');
                      } finally {
                        setSending(false);
                      }
                    }}
                  >
                    <input
                      type="email"
                      inputMode="email"
                      placeholder="Enter your email"
                      value={emailField}
                      onChange={(e) => setEmailField(e.target.value)}
                      className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Email address"
                      required
                    />
                    <Button type="submit" disabled={sending} className="px-5">
                      {sending ? 'Sending…' : 'Send report'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <QuizReportVisualization
          score={scoreValue}
          maxScore={maxScore}
          band={band}
          quizTitle={quiz?.title || "Assessment"}
          quizSlug={quiz?.slug || reportId}
          responses={responses as any}
          onRetake={() => {
            // Navigate back to quizzes listing (or quiz page if available)
            router.push("/quizzes");
          }}
          onShare={() => {
            try {
              navigator.clipboard.writeText(window.location.href);
            } catch {}
          }}
        />
      </div>
    </div>
  );
}
