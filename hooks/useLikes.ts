'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseLikesProps {
  itemId: string;
  itemType: 'article' | 'quiz';
  initialLikeCount?: number;
}

export function useLikes({ itemId, itemType, initialLikeCount = 0 }: UseLikesProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLikeStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/likes/check?type=${itemType}&itemId=${itemId}`);
      const data = await response.json();
      if (response.ok) {
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error('Failed to fetch like status:', error);
    }
  }, [itemId, itemType]);

  const fetchLikeCount = useCallback(async () => {
    try {
      const response = await fetch(`/api/likes/count?type=${itemType}&itemId=${itemId}`);
      const data = await response.json();
      if (response.ok) {
        setLikeCount(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch like count:', error);
    }
  }, [itemId, itemType]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchLikeStatus(), fetchLikeCount()]).finally(() => {
      setIsLoading(false);
    });
  }, [fetchLikeStatus, fetchLikeCount]);

  const toggleLike = async () => {
    // Optimistic UI update
    const originalLikedState = isLiked;
    const originalLikeCount = likeCount;

    setIsLiked(!originalLikedState);
    setLikeCount(originalLikeCount + (!originalLikedState ? 1 : -1));

    try {
      const endpoint = `/api/likes/${!originalLikedState ? 'add' : 'remove'}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: itemType, itemId }),
      });

      if (!response.ok) {
        // Revert on error
        throw new Error('Failed to update like status');
      }

      // Optionally, re-fetch the count from the server to ensure consistency
      const data = await response.json();
      setLikeCount(data.count);

    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert UI on failure
      setIsLiked(originalLikedState);
      setLikeCount(originalLikeCount);
    }
  };

  return { isLiked, likeCount, isLoading, toggleLike };
}
