// Anonymous research data collection for MyBeing platform
// Collects quiz responses anonymously for research purposes while maintaining privacy

export interface AnonymousQuizResponse {
  id: string;
  quizSlug: string;
  responses: {
    questionId: string;
    questionText: string;
    answer: string | number;
    questionType: 'multiple-choice' | 'scale' | 'text';
  }[];
  metadata: {
    completedAt: Date;
    userAgent: string;
    sessionId: string; // Anonymous session identifier
    totalScore?: number;
    bandResult?: string;
  };
  demographics?: {
    ageRange?: string;
    region?: string;
    // No personally identifiable information
  };
}

export interface ResearchAnalytics {
  totalResponses: number;
  quizBreakdown: Record<string, number>;
  responsePatterns: {
    questionId: string;
    questionText: string;
    averageScore?: number;
    responseDistribution: Record<string | number, number>;
    commonPatterns: string[];
  }[];
  timeAnalytics: {
    averageCompletionTime: number;
    peakUsageHours: number[];
    dailyCompletions: Record<string, number>;
  };
  averageScore: number;
}

// In-memory storage for research data (in production, use database)
let researchData: AnonymousQuizResponse[] = [];

// Generate a simple anonymous ID
function generateAnonymousId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Sanitize user agent string
function sanitizeUserAgent(userAgent: string): string {
  // Remove potentially identifying information from user agent
  return userAgent ? userAgent.replace(/\d+\.\d+\.\d+/g, 'X.X.X') : 'unknown'; // Remove version numbers
}

// Hash session ID for anonymity
function hashSessionId(sessionId: string): string {
  // Simple hash for anonymity (in production, use proper hashing)
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    const char = sessionId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Identify patterns in responses
function identifyPatterns(responses: (string | number)[]): string[] {
  const patterns: string[] = [];
  // Simple pattern detection - can be enhanced
  const uniqueResponses = new Set(responses);
  if (uniqueResponses.size === 1) {
    patterns.push('All respondents answered the same way');
  }
  return patterns;
}

// Convert data to CSV format
function convertToCSV(data: AnonymousQuizResponse[]): string {
  if (!data.length) return '';
  
  // Get all unique question IDs
  const questionIds = new Set<string>();
  data.forEach(response => {
    response.responses.forEach(r => {
      questionIds.add(r.questionId);
    });
  });
  
  // Create headers
  const headers = [
    'response_id',
    'quiz_slug',
    'completed_at',
    'total_score',
    'band_result',
    ...Array.from(questionIds).map(id => `q_${id}`)
  ];
  
  // Create rows
  const rows = data.map(response => {
    const row: Record<string, string> = {
      response_id: response.id,
      quiz_slug: response.quizSlug,
      completed_at: response.metadata.completedAt.toISOString(),
      total_score: String(response.metadata.totalScore || ''),
      band_result: response.metadata.bandResult || ''
    };
    
    // Add question responses
    response.responses.forEach(r => {
      row[`q_${r.questionId}`] = String(r.answer);
    });
    
    return headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
}

export function collectAnonymousResponse(
  quizSlug: string,
  responses: Array<{
    questionId: string;
    questionText: string;
    answer: string | number;
    questionType: 'multiple-choice' | 'scale' | 'text';
  }>,
  sessionId: string,
  userAgent: string,
  totalScore?: number,
  bandResult?: string
): void {
  const anonymousResponse: AnonymousQuizResponse = {
    id: generateAnonymousId(),
    quizSlug,
    responses,
    metadata: {
      completedAt: new Date(),
      userAgent: sanitizeUserAgent(userAgent),
      sessionId: hashSessionId(sessionId), // Hash for anonymity
      totalScore,
      bandResult
    }
  };

  // Store anonymously (no personal data)
  researchData.push(anonymousResponse);
  
  // Log for research purposes
  console.log('📊 [RESEARCH] Anonymous response collected:', {
    quizSlug,
    responseCount: responses.length,
    totalScore,
    bandResult,
    timestamp: new Date().toISOString()
  });
}

export function getResearchAnalytics(timeRange: string = '7d'): ResearchAnalytics {
  // Filter responses based on time range
  const now = new Date();
  let cutoffDate = new Date();
  
  switch (timeRange) {
    case '24h':
      cutoffDate.setDate(now.getDate() - 1);
      break;
    case '30d':
      cutoffDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      cutoffDate.setDate(now.getDate() - 90);
      break;
    case 'all':
      cutoffDate = new Date(0); // Beginning of time
      break;
    case '7d':
    default:
      cutoffDate.setDate(now.getDate() - 7);
  }

  const filteredData = researchData.filter(
    response => new Date(response.metadata.completedAt) >= cutoffDate
  );
  
  const totalResponses = filteredData.length;
  // Total responses already defined above
  
  // Quiz breakdown with score distribution
  const quizBreakdown: Record<string, number> = {};
  const quizScores: Record<string, number[]> = {};
  
  filteredData.forEach(response => {
    const slug = response.quizSlug;
    quizBreakdown[slug] = (quizBreakdown[slug] || 0) + 1;
    
    // Track scores for each quiz
    if (response.metadata.totalScore !== undefined) {
      if (!quizScores[slug]) {
        quizScores[slug] = [];
      }
      quizScores[slug].push(response.metadata.totalScore);
    }
  });
  
  // Calculate average scores per quiz
  const quizAverages: Record<string, number> = {};
  Object.entries(quizScores).forEach(([quiz, scores]) => {
    quizAverages[quiz] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  });

  // Calculate overall average score across all filtered responses
  const allScores = filteredData
    .map(r => r.metadata.totalScore)
    .filter((s): s is number => s !== undefined);
  const overallAverageScore = allScores.length > 0
    ? allScores.reduce((a, b) => a + b, 0) / allScores.length
    : 0;

  // Response patterns analysis
  const questionAnalysis: Record<string, {
    questionText: string;
    responses: (string | number)[];
    questionType: string;
  }> = {};

  filteredData.forEach(response => {
    response.responses.forEach(r => {
      if (!questionAnalysis[r.questionId]) {
        questionAnalysis[r.questionId] = {
          questionText: r.questionText,
          responses: [],
          questionType: r.questionType
        };
      }
      questionAnalysis[r.questionId].responses.push(r.answer);
    });
  });

  const responsePatterns = Object.entries(questionAnalysis).map(([questionId, data]) => {
    const responses = data.responses;
    const distribution: Record<string | number, number> = {};
    
    responses.forEach(response => {
      distribution[response] = (distribution[response] || 0) + 1;
    });

    const averageScore = data.questionType === 'scale' 
      ? responses.reduce((sum: number, val) => sum + (typeof val === 'number' ? val : Number(val)), 0) / responses.length
      : undefined;

    return {
      questionId,
      questionText: data.questionText,
      averageScore,
      responseDistribution: distribution,
      commonPatterns: identifyPatterns(responses)
    };
  });

  // Time analytics with enhanced metrics
  const completionTimes = filteredData.map(r => r.metadata.completedAt);
  const responseTimes: number[] = []; // Would be populated with actual response times if tracked
  const hourCounts: Record<number, number> = {};
  const dailyCounts: Record<string, number> = {};

  completionTimes.forEach(time => {
    const hour = time.getHours();
    const day = time.toISOString().split('T')[0];
    
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  });

  const peakUsageHours = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  // Calculate completion rate if we have session data
  const sessions = new Set(filteredData.map(r => r.metadata.sessionId));
  const completionRate = sessions.size > 0 
    ? (filteredData.length / sessions.size) * 100 
    : 0;

  return {
    totalResponses,
    averageScore: parseFloat(overallAverageScore.toFixed(2)),
    quizBreakdown,
    responsePatterns,
    timeAnalytics: {
      averageCompletionTime: responseTimes.length > 0 
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
        : 0,
      peakUsageHours,
      dailyCompletions: dailyCounts
    }
  };
}

export function exportResearchData(format: 'json' | 'csv' = 'json'): string {
  if (format === 'csv') {
    return convertToCSV(researchData);
  }
  
  // Remove any potentially identifying information before export
  const sanitizedData = researchData.map(response => ({
    ...response,
    metadata: {
      ...response.metadata,
      userAgent: 'sanitized',
      sessionId: 'anonymized'
    }
  }));

  return JSON.stringify(sanitizedData, null, 2);
}

interface QuizInsights {
  totalCompletions: number;
  averageScore: number;
  scoreDistribution: Record<string, number>;
  scoreDistributionDetailed: Record<string, { count: number; percentage: number }>;
  commonResponsePatterns: string[];
  improvementSuggestions: string[];
  questionStats: Record<string, {
    questionText: string;
    type: string;
    averageResponse: number;
    responseDistribution: Record<string | number, number>;
    skipped: number;
  }>;
  completionTrend: Array<{ date: string; count: number }>;
  completionRate: number;
  averageCompletionTime: number;
  timeRange: {
    start: string;
    end: string;
    label: string;
  };
}

export function getQuizInsights(
  quizSlug: string, 
  timeRange: string = 'all'
): QuizInsights {
  // Filter by time range first
  const now = new Date();
  let cutoffDate = new Date(0); // Default to beginning of time
  
  // Set cutoff date based on time range
  switch (timeRange) {
    case '24h':
      cutoffDate.setDate(now.getDate() - 1);
      break;
    case '7d':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      cutoffDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      cutoffDate.setDate(now.getDate() - 90);
      break;
    case 'all':
    default:
      cutoffDate = new Date(0); // Beginning of time
  }

  const quizResponses = researchData.filter(
    r => r.quizSlug === quizSlug && 
         new Date(r.metadata.completedAt) >= cutoffDate
  );
  
  if (quizResponses.length === 0) {
    return {
      totalCompletions: 0,
      averageScore: 0,
      scoreDistribution: {},
      scoreDistributionDetailed: {},
      commonResponsePatterns: [],
      improvementSuggestions: [],
      questionStats: {},
      completionTrend: [],
      completionRate: 0,
      averageCompletionTime: 0,
      timeRange: {
        start: cutoffDate.toISOString(),
        end: now.toISOString(),
        label: timeRange
      }
    };
  }

  const totalCompletions = quizResponses.length;
  const scores = quizResponses
    .map(r => r.metadata.totalScore)
    .filter((score): score is number => score !== undefined);
    
  const averageScore = scores.length > 0 
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
    : 0;
    
  // Initialize question stats
  const questionStats: Record<string, {
    questionText: string;
    type: string;
    averageResponse: number;
    responseDistribution: Record<string | number, number>;
    skipped: number;
  }> = {};
  
  // Calculate response distributions and averages
  quizResponses.forEach(response => {
    response.responses.forEach(r => {
      if (!questionStats[r.questionId]) {
        questionStats[r.questionId] = {
          questionText: r.questionText,
          type: r.questionType,
          averageResponse: 0,
          responseDistribution: {},
          skipped: 0
        };
      }
      
      // Track response distribution
      const dist = questionStats[r.questionId].responseDistribution;
      const answerKey = String(r.answer);
      dist[answerKey] = (dist[answerKey] || 0) + 1;
      
      // Calculate average for scale questions
      if (r.questionType === 'scale' && typeof r.answer === 'number') {
        const current = questionStats[r.questionId].averageResponse || 0;
        const totalResponses = Object.values(dist).reduce((sum, count) => sum + count, 0);
        questionStats[r.questionId].averageResponse = 
          (current * (totalResponses - 1) + r.answer) / totalResponses;
      }
    });
  });
  
  // Calculate completion trend
  const dailyCompletions: Record<string, number> = {};
  quizResponses.forEach(response => {
    const date = response.metadata.completedAt.toISOString().split('T')[0];
    dailyCompletions[date] = (dailyCompletions[date] || 0) + 1;
  });
  
  const completionTrend = Object.entries(dailyCompletions)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({ date, count }));
  
  // Calculate score distribution
  const scoreDistributionDetailed: Record<string, { count: number; percentage: number }> = {};
  const scoreDistribution: Record<string, number> = {};
  
  quizResponses.forEach(response => {
    if (response.metadata.bandResult) {
      const band = response.metadata.bandResult;
      scoreDistribution[band] = (scoreDistribution[band] || 0) + 1;
      
      if (!scoreDistributionDetailed[band]) {
        scoreDistributionDetailed[band] = { count: 0, percentage: 0 };
      }
      scoreDistributionDetailed[band].count++;
    }
  });
  
  // Calculate percentages
  Object.keys(scoreDistributionDetailed).forEach(band => {
    scoreDistributionDetailed[band].percentage = 
      totalCompletions > 0 
        ? (scoreDistributionDetailed[band].count / totalCompletions) * 100 
        : 0;
  });
  
  // Analyze response patterns
  const responsePatterns = identifyPatterns(quizResponses.flatMap(r => r.responses.map(r => r.answer)));
  const improvementSuggestions = [
    'Consider adding more questions to assess different dimensions',
    'Review questions with low response variance',
    'Check for any ambiguous or confusing questions'
  ];
  
  // Calculate completion rate (if we had session data)
  const completionRate = totalCompletions > 0 ? 100 : 0;
  
  return {
    totalCompletions,
    averageScore: parseFloat(averageScore.toFixed(2)),
    scoreDistribution,
    scoreDistributionDetailed,
    commonResponsePatterns: responsePatterns,
    improvementSuggestions,
    questionStats,
    completionTrend,
    completionRate,
    averageCompletionTime: 0, // Would be calculated from session data
    timeRange: {
      start: cutoffDate.toISOString(),
      end: now.toISOString(),
      label: timeRange
    }
  };
}

// Helper function to analyze response patterns
function analyzeResponsePatterns(responses: AnonymousQuizResponse[]): string[] {
  const patterns: string[] = [];
  
  if (!responses.length) return patterns;
  
  // Analyze completion times
  const completionHours = responses.map(r => r.metadata.completedAt.getHours());
  const avgHour = completionHours.reduce((sum, h) => sum + h, 0) / completionHours.length;
  
  // Time-based patterns
  if (avgHour < 12) patterns.push('Morning completions common');
  if (avgHour > 18) patterns.push('Evening completions common');
  
  // Check for morning completions (6 AM - 12 PM)
  const morningCompletions = completionHours.filter(h => h >= 6 && h < 12).length;
  if (morningCompletions / responses.length > 0.6) {
    patterns.push('Morning completions common');
  }
  
  // Check for low engagement (quick completions)
  const quickResponses = responses.filter(r => {
    const responseTime = r.metadata.completedAt.getTime() - new Date(r.metadata.completedAt).setHours(0, 0, 0, 0);
    return responseTime < 30000; // Less than 30 seconds
  });
  
  if (quickResponses.length / responses.length > 0.3) {
    patterns.push('Low engagement detected');
  }
  
  // Analyze score patterns
  const scores = responses
    .map(r => r.metadata.totalScore)
    .filter((s): s is number => s !== undefined);
    
  if (scores.length > 0) {
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    
    if (maxScore - minScore < 10) patterns.push('Narrow score range');
    if (avgScore > maxScore * 0.8) patterns.push('High average scores');
    if (avgScore < maxScore * 0.3) patterns.push('Low average scores');
  }
  
  return patterns;
}

// Helper function to generate improvement suggestions
function generateImprovementSuggestions(patterns: string[], averageScore: number): string[] {
  const suggestions: string[] = [];
  
  if (patterns.includes('Narrow score range')) {
    suggestions.push('Consider adding more diverse question types to increase score variance');
  }
  
  if (patterns.includes('High average scores')) {
    suggestions.push('Questions might be too easy - consider adding more challenging scenarios');
  }
  
  if (patterns.includes('Low average scores')) {
    suggestions.push('Questions might be too difficult - consider simplifying language or scenarios');
  }

  if (patterns.includes('Low engagement detected')) {
    suggestions.push('Review question clarity and engagement - many users are completing the quiz very quickly');
  }
  
  if (averageScore < 50) {
    suggestions.push('Consider adjusting question difficulty - average score is quite low');
  } else if (averageScore > 90) {
    suggestions.push('Quiz may be too easy - consider adding more challenging questions');
  }
  
  if (patterns.includes('Morning completions common')) {
    suggestions.push('Consider adding morning-specific content or features');
  }
  
  return suggestions.length > 0 ? suggestions : [
    'No major issues detected. Continue monitoring for patterns.'
  ];
}


// Per-quiz export helpers
export function exportQuizData(quizSlug: string, format: 'json' | 'csv' = 'json'): string {
  const filtered = researchData.filter(r => r.quizSlug === quizSlug);
  if (format === 'csv') {
    return convertToCSV(filtered);
  }
  return JSON.stringify(filtered, null, 2);
}

export function generateQuizReportMarkdown(
  quizSlug: string,
  timeRange: '24h' | '7d' | '30d' | '90d' | 'all' = 'all'
): string {
  const insights = getQuizInsights(quizSlug, timeRange);

  const lines: string[] = [];
  lines.push(`# Research Report: ${quizSlug}`);
  lines.push('');
  lines.push(`Time Range: ${insights.timeRange.label}`);
  lines.push('');
  lines.push('## Summary');
  lines.push(`- Total Completions: ${insights.totalCompletions}`);
  lines.push(`- Average Score: ${insights.averageScore.toFixed(2)}`);
  lines.push(`- Completion Rate: ${insights.completionRate.toFixed(2)}%`);
  lines.push('');
  lines.push('## Score Distribution');
  const distEntries = Object.entries(insights.scoreDistributionDetailed);
  if (distEntries.length === 0) {
    lines.push('_No band data available._');
  } else {
    lines.push('Band | Count | %');
    lines.push('---|---:|--:');
    distEntries.forEach(([band, data]) => {
      lines.push(`${band} | ${data.count} | ${data.percentage.toFixed(1)}%`);
    });
  }
  lines.push('');
  lines.push('## Question Highlights');
  const qKeys = Object.keys(insights.questionStats);
  if (qKeys.length === 0) {
    lines.push('_No question analytics available._');
  } else {
    const top = qKeys.slice(0, 5);
    top.forEach((qid) => {
      const q = insights.questionStats[qid];
      const totalResponses = Object.values(q.responseDistribution).reduce((a, b) => a + (b as number), 0);
      lines.push(`- ${q.questionText} (type: ${q.type})`);
      if (q.type === 'scale' && typeof q.averageResponse === 'number') {
        lines.push(`  - Avg Response: ${q.averageResponse.toFixed(2)} (n=${totalResponses})`);
      } else {
        lines.push(`  - Responses: n=${totalResponses}`);
      }
    });
  }
  lines.push('');
  if (insights.commonResponsePatterns.length > 0) {
    lines.push('## Response Patterns');
    insights.commonResponsePatterns.forEach((p) => lines.push(`- ${p}`));
    lines.push('');
  }
  if (insights.improvementSuggestions.length > 0) {
    lines.push('## Improvement Suggestions');
    insights.improvementSuggestions.forEach((s) => lines.push(`- ${s}`));
    lines.push('');
  }
  if (insights.completionTrend.length > 0) {
    lines.push('## Completion Trend (Daily)');
    lines.push('Date | Count');
    lines.push('---|---:');
    insights.completionTrend.slice(-14).forEach((pt) => {
      lines.push(`${pt.date} | ${pt.count}`);
    });
    lines.push('');
  }
  lines.push('_Generated by MyBeing Research Tools_');

  return lines.join('\n');
}
