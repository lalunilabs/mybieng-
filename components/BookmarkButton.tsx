"use client";

import { useState, useEffect } from "react";
import { BookmarkIcon, BookmarkFilledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/Button";

interface BookmarkButtonProps {
  type: 'quiz' | 'article';
  itemId: string;
  title: string;
  className?: string;
}

export default function BookmarkButton({ type, itemId, title, className = "" }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/bookmarks/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, itemId }),
        });
        
        if (response.ok) {
          const result = await response.json();
          if (!cancelled && result.exists) {
            setIsBookmarked(true);
            setBookmarkId(result.id);
          }
        }
        if (!cancelled) setIsLoading(false);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [type, itemId]);

  async function handleToggleBookmark() {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isBookmarked && bookmarkId) {
        const response = await fetch('/api/bookmarks/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookmarkId }),
        });
        
        if (response.ok) {
          setIsBookmarked(false);
          setBookmarkId(null);
        }
      } else {
        const response = await fetch('/api/bookmarks/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, itemId, title }),
        });
        
        if (response.ok) {
          const newBookmark = await response.json();
          setIsBookmarked(true);
          setBookmarkId(newBookmark.id);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className={className}
        disabled
      >
        <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleToggleBookmark}
      className={className}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <BookmarkFilledIcon className="w-4 h-4 text-primary" />
      ) : (
        <BookmarkIcon className="w-4 h-4" />
      )}
    </Button>
  );
}
