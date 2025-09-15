import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UseLikeProps {
  type: 'quiz' | 'article';
  itemId: string;
  initialLiked?: boolean;
  initialCount?: number;
}

export function useLike({ type, itemId, initialLiked = false, initialCount = 0 }: UseLikeProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Check if item is already liked when component mounts
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch('/api/likes/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, itemId }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [type, itemId, session]);

  // Fetch like count when component mounts
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await fetch('/api/likes/count', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, itemId }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching like count:', error);
      }
    };

    fetchLikeCount();
  }, [type, itemId]);

  const toggleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      if (liked) {
        // Remove like
        const response = await fetch('/api/likes/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, itemId }),
        });
        
        if (response.ok) {
          setLiked(false);
          setCount(prev => Math.max(0, prev - 1));
        }
      } else {
        // Add like
        const response = await fetch('/api/likes/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, itemId, title: itemId }), // TODO: Get actual title
        });
        
        if (response.ok) {
          setLiked(true);
          setCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    liked,
    count,
    loading,
    toggleLike,
  };
}
