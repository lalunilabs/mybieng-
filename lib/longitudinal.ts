interface ProgressEntry {
  id: string;
  userId: string;
  quizSlug: string;
  timestamp: string;
  score: number;
  maxScore: number;
  band: string;
  answers: Record<string, any>;
  notes?: string;
}

interface UserProfile {
  id: string;
  createdAt: string;
  lastActivity: string;
  totalQuizzes: number;
  completedQuizzes: string[];
  streak: number;
  preferences: {
    weeklyReminders: boolean;
    monthlyCheckins: boolean;
    email?: string;
  };
}

// Generate or get user ID from localStorage
export function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  let userId = localStorage.getItem('mybeing_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('mybeing_user_id', userId);
  }
  return userId;
}

// Save quiz completion with progress tracking
export async function saveProgress(
  quizSlug: string,
  score: number,
  maxScore: number,
  band: string,
  answers: Record<string, any>,
  notes?: string
): Promise<void> {
  const userId = getUserId();
  const entry: ProgressEntry = {
    id: `progress_${Date.now()}`,
    userId,
    quizSlug,
    timestamp: new Date().toISOString(),
    score,
    maxScore,
    band,
    answers,
    notes
  };

  // Always use localStorage for client-side storage
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('mybeing_progress') || '[]');
    existing.push(entry);
    localStorage.setItem('mybeing_progress', JSON.stringify(existing));
    
    // Update user profile in localStorage
    updateUserProfile(userId, quizSlug);
  }
}

// Update user profile with quiz completion
function updateUserProfile(userId: string, quizSlug: string): void {
  if (typeof window === 'undefined') return;
  
  const usersData = localStorage.getItem('mybeing_users');
  const users: Record<string, UserProfile> = usersData ? JSON.parse(usersData) : {};

  if (!users[userId]) {
    users[userId] = {
      id: userId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      totalQuizzes: 0,
      completedQuizzes: [],
      streak: 0,
      preferences: {
        weeklyReminders: true,
        monthlyCheckins: true
      }
    };
  }

  const user = users[userId];
  user.lastActivity = new Date().toISOString();
  
  if (!user.completedQuizzes.includes(quizSlug)) {
    user.completedQuizzes.push(quizSlug);
    user.totalQuizzes += 1;
  }

  // Calculate streak
  const recentCompletions = getRecentCompletions(userId, 7);
  user.streak = recentCompletions.length >= 1 ? user.streak + 1 : 0;

  users[userId] = user;
  localStorage.setItem('mybeing_users', JSON.stringify(users));
}

// Get user's progress for a specific quiz
export async function getProgress(quizSlug: string): Promise<ProgressEntry[]> {
  const userId = getUserId();
  
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('mybeing_progress');
    if (data) {
      const progress: ProgressEntry[] = JSON.parse(data);
      return progress.filter(p => p.userId === userId && p.quizSlug === quizSlug);
    }
  }
  return [];
}

// Get all user progress
export async function getAllProgress(): Promise<ProgressEntry[]> {
  const userId = getUserId();
  
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('mybeing_progress');
    if (data) {
      const progress: ProgressEntry[] = JSON.parse(data);
      return progress.filter(p => p.userId === userId);
    }
  }
  return [];
}

// Get recent completions for streak calculation
function getRecentCompletions(userId: string, days: number): ProgressEntry[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem('mybeing_progress');
  if (!data) return [];
  
  const progress: ProgressEntry[] = JSON.parse(data);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return progress.filter(p => 
    p.userId === userId && 
    new Date(p.timestamp) >= cutoffDate
  );
}

// Get progress trends for analytics
export async function getProgressTrends(quizSlug: string) {
  const progress = await getProgress(quizSlug);
  
  if (progress.length === 0) return null;
  
  const sorted = progress.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const scores = sorted.map(p => (p.score / p.maxScore) * 100);
  const dates = sorted.map(p => new Date(p.timestamp).toLocaleDateString());
  const bands = sorted.map(p => p.band);
  
  return {
    scores,
    dates,
    bands,
    improvement: scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0,
    averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    timesTaken: progress.length
  };
}

// Export progress data for user
export async function exportUserData() {
  const userId = getUserId();
  const progress = await getAllProgress();
  
  const exportData = {
    userId,
    exportDate: new Date().toISOString(),
    totalQuizzes: progress.length,
    progress
  };
  
  if (typeof window !== 'undefined') {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mybeing-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Check for weekly/monthly reminders
export async function checkReminders() {
  const userId = getUserId();
  const allProgress = await getAllProgress();
  
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentWeekly = allProgress.filter(p => new Date(p.timestamp) >= oneWeekAgo);
  const recentMonthly = allProgress.filter(p => new Date(p.timestamp) >= oneMonthAgo);
  
  return {
    needsWeeklyCheckin: recentWeekly.length === 0,
    needsMonthlyCheckin: recentMonthly.length === 0,
    lastActivity: allProgress.length > 0 ? 
      new Date(Math.max(...allProgress.map(p => new Date(p.timestamp).getTime()))) : null
  };
}
