"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { removeBookmark } from "@/lib/bookmarks";
import { TrashIcon } from "@radix-ui/react-icons";

interface Bookmark {
  id: string;
  type: 'quiz' | 'article';
  itemId: string;
  title: string;
  createdAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  async function fetchBookmarks() {
    try {
      const response = await fetch('/api/bookmarks');
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveBookmark(bookmarkId: string) {
    setDeletingId(bookmarkId);
    try {
      await removeBookmark(bookmarkId);
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 p-4 md:p-8">
        <div className="max-w-4xl mx-auto pt-2">
          <h1 className="text-3xl font-bold text-foreground mb-8">Your Bookmarks</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your Bookmarks</h1>
          <PrimaryCTA href="/quizzes" variant="outline" surface="bookmarks_page" eventName="browse_quizzes">
            Browse Quizzes
          </PrimaryCTA>
        </div>
        
        {bookmarks.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🔖</div>
            <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground mb-6">Start bookmarking quizzes and articles to save them for later</p>
            <PrimaryCTA href="/quizzes" surface="bookmarks_empty" eventName="explore_quizzes" variant="uiverse">
              Explore Quizzes
            </PrimaryCTA>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link href={`/${bookmark.type}s/${bookmark.itemId}`}>
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                          {bookmark.title}
                        </h3>
                      </Link>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <span className="capitalize px-2 py-1 bg-primary/10 text-primary rounded mr-3">
                          {bookmark.type}
                        </span>
                        <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                      disabled={deletingId === bookmark.id}
                      aria-label="Remove bookmark"
                    >
                      {deletingId === bookmark.id ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <TrashIcon className="w-4 h-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
