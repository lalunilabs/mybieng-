import { useLike } from '@/hooks/useLike';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartButtonProps {
  type: 'quiz' | 'article';
  itemId: string;
  title?: string;
  className?: string;
}

export function HeartButton({ type, itemId, title, className = '' }: HeartButtonProps) {
  const { liked, count, loading, toggleLike } = useLike({ type, itemId });

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className={`p-2 rounded-full transition-colors ${
          liked 
            ? 'text-red-500 bg-red-50' 
            : 'text-gray-400 hover:text-red-400 hover:bg-red-50'
        }`}
        onClick={toggleLike}
        disabled={loading}
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <Heart 
          className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} 
        />
      </motion.button>
      
      {count >= 50 && (
        <span className="text-sm text-gray-600">
          {count}
        </span>
      )}
    </div>
  );
}
