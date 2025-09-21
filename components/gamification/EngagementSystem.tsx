'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Star, Target, Zap, Award, TrendingUp, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Gamification system to increase engagement
export function EngagementSystem() {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-quiz',
      title: 'Self-Discovery Begins',
      description: 'Complete your first quiz',
      icon: <Star className="w-5 h-5" />,
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'reader',
      title: 'Knowledge Seeker',
      description: 'Read 5 articles',
      icon: <Trophy className="w-5 h-5" />,
      progress: 0,
      maxProgress: 5,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'streak-master',
      title: 'Consistency Champion',
      description: 'Maintain a 7-day streak',
      icon: <Flame className="w-5 h-5" />,
      progress: 0,
      maxProgress: 7,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'deep-diver',
      title: 'Deep Diver',
      description: 'Complete all available quizzes',
      icon: <Award className="w-5 h-5" />,
      progress: 0,
      maxProgress: 10,
      unlocked: false,
      rarity: 'legendary'
    }
  ]);

  // Calculate level from points
  useEffect(() => {
    const newLevel = Math.floor(points / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setShowLevelUp(true);
      celebrateLevelUp();
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [points, level]);

  const celebrateLevelUp = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B']
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-amber-400 to-amber-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="relative">
      {/* Floating engagement widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-40 max-w-xs"
      >
        {/* User stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">{level}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Level {level}</p>
              <p className="text-sm font-semibold">{points} XP</p>
            </div>
          </div>
          
          {/* Streak counter */}
          <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-600">{streak}</span>
          </div>
        </div>

        {/* Progress to next level */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress to Level {level + 1}</span>
            <span>{points % 100}/100 XP</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(points % 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Recent achievement */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Next Achievement</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Knowledge Seeker</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '60%' }} />
                </div>
                <span className="text-xs text-gray-500">3/5</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Level up animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center"
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Level Up!</h2>
              <p className="text-gray-600">You've reached Level {level}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook to track and reward user actions
export function useRewards() {
  const rewardAction = (action: string, points: number = 10) => {
    // Store in localStorage for persistence
    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
    const newPoints = currentPoints + points;
    localStorage.setItem('userPoints', newPoints.toString());
    
    // Track engagement
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'user_action', {
        action_type: action,
        points_earned: points,
        total_points: newPoints
      });
    }
    
    // Show reward animation
    const rewardAnimation = document.createElement('div');
    rewardAnimation.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none';
    rewardAnimation.innerHTML = `
      <div class="bg-green-500 text-white px-4 py-2 rounded-full font-bold animate-bounce">
        +${points} XP
      </div>
    `;
    document.body.appendChild(rewardAnimation);
    setTimeout(() => rewardAnimation.remove(), 2000);
    
    return newPoints;
  };
  
  return { rewardAction };
}
