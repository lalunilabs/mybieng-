"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CollapsibleSection } from "@/components/ui/ProgressiveDisclosure";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LogOut, Settings, Sparkles, MessageSquare } from "lucide-react";
import { signOut } from "next-auth/react";

interface InsightsReviewsPanelProps {
  isPremium?: boolean;
  className?: string;
}

export default function InsightsReviewsPanel({ isPremium = false, className = "" }: InsightsReviewsPanelProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      // Clear anonymous session for quiz runs
      await fetch("/api/logout", { method: "POST" });
      // Sign out authenticated session if present
      await signOut({ callbackUrl: "/" });
    } finally {
      setLoggingOut(false);
    }
  }

  const testimonials = [
    {
      id: "t1",
      quote: "The insights made my patterns obvious. I finally knew what to change.",
      author: "Ava",
      role: "Designer",
    },
    {
      id: "t2",
      quote: "Refreshing, research-backed and humane. It feels like a mirror, not a diagnosis.",
      author: "Noah",
      role: "Engineer",
    },
    {
      id: "t3",
      quote: "I check in weekly now. The small shifts add up.",
      author: "Maya",
      role: "Writer",
    },
  ];

  return (
    <div className={className}>
      <CollapsibleSection
        title="Insights & Reviews"
        variant="card"
        defaultOpen
        icon={<Sparkles className="w-5 h-5" />}
      >
        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-5">
          <Link href="/settings">
            <Button variant="outline" size="sm" aria-label="Open Settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="gradient" size="sm" aria-label="Explore Premium">
              <Sparkles className="w-4 h-4 mr-2" />
              Explore Premium
            </Button>
          </Link>
          <Link href="/quizzes">
            <Button variant="outline" size="sm" aria-label="Take a new quiz">
              <MessageSquare className="w-4 h-4 mr-2" />
              Take a Quiz
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="destructive"
            size="sm"
            aria-label="Log out"
            disabled={loggingOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>

        {/* Reviews rail */}
        <div className="relative">
          {!isPremium && (
            <div className="mb-3 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 p-3 text-sm">
              Unlock full insights and audio reviews with Premium.
              <Link href="/pricing" className="ml-2 underline font-medium">Learn more</Link>
            </div>
          )}

          <div className="overflow-x-auto -mx-1 px-1">
            <div className="grid grid-flow-col auto-cols-[minmax(240px,280px)] gap-4">
              {testimonials.map((t) => (
                <Card key={t.id} className="p-4 border border-primary/10 bg-gradient-to-br from-white to-primary/5">
                  <p className="text-sm leading-relaxed text-muted-foreground">“{t.quote}”</p>
                  <div className="mt-3 text-sm font-medium text-foreground">
                    {t.author}
                    <span className="ml-2 text-muted-foreground/70 font-normal">• {t.role}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
