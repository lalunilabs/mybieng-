"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service if desired
    // eslint-disable-next-line no-console
    console.error("Article page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="mb-6 text-5xl">🛠️</div>
      <h2 className="text-2xl font-bold mb-2">We couldn't load this article</h2>
      <p className="text-gray-600 mb-6 max-w-xl">
        Something went wrong while rendering the article. You can try again, or go back to the articles list.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()} variant="outline">Try again</Button>
        <Button asChild>
          <Link href="/blog">Back to Articles</Link>
        </Button>
      </div>
    </div>
  );
}
