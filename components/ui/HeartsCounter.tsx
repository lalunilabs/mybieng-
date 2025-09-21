import { Heart, Eye } from 'lucide-react';

interface HeartsCounterProps {
  readCount: number;
  likeCount: number;
  showHearts?: boolean;
  className?: string;
}

export function HeartsCounter({ readCount, likeCount, showHearts = true, className = '' }: HeartsCounterProps) {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-1 text-gray-500">
        <Eye className="w-4 h-4" />
        <span>{formatCount(readCount)}</span>
      </div>
      {showHearts && (
        <div className="flex items-center gap-1 text-red-500">
          <Heart className="w-4 h-4 fill-current" />
          <span>{formatCount(likeCount)}</span>
        </div>
      )}
    </div>
  );
}

// Default starting values for social proof
export const DEFAULT_SOCIAL_PROOF = {
  readCount: 1000,
  likeCount: 234,
};

// Calculate realistic social proof based on content age and type
export function calculateSocialProof(baseCount: number = 1000, daysSincePublish: number = 0, contentType: 'article' | 'quiz' = 'article') {
  const multiplier = contentType === 'quiz' ? 1.5 : 1.0;
  const timeDecay = Math.max(0.5, 1 - (daysSincePublish * 0.01));
  
  const readCount = Math.floor(baseCount * multiplier * timeDecay);
  const likeCount = Math.floor(readCount * (contentType === 'quiz' ? 0.35 : 0.25));
  
  return {
    readCount,
    likeCount,
  };
}
