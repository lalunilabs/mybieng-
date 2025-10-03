import { NextRequest, NextResponse } from 'next/server';
import { loadAllArticles } from '@/lib/content';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quiz = searchParams.get('quiz');
    const band = searchParams.get('band');
    const resultType = searchParams.get('resultType');
    const limit = parseInt(searchParams.get('limit') || '6');

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz parameter required' }, { status: 400 });
    }

    const allArticles = loadAllArticles();
    let recommendations: any[] = [];

    // Quiz-specific recommendations
    const quizMappings: Record<string, string[]> = {
      'cognitive-dissonance': [
        'values', 'behavior', 'identity', 'decision-making', 'self-awareness', 'psychology'
      ],
      'stress-patterns': [
        'stress', 'sleep', 'energy', 'mindfulness', 'wellness', 'habits'
      ],
      'motivation-language': [
        'motivation', 'behavior', 'habits', 'productivity', 'goals', 'self-improvement'
      ],
      'self-awareness-mixed': [
        'self-awareness', 'reflection', 'personal-growth', 'mindfulness', 'psychology'
      ]
    };

    // Band-specific recommendations
    const bandMappings: Record<string, string[]> = {
      // Cognitive Dissonance bands
      'Low Dissonance': ['values', 'consistency', 'integrity', 'decision-making'],
      'Moderate Dissonance': ['alignment', 'values', 'behavior-change', 'self-reflection'],
      'High Dissonance': ['values-clarification', 'behavior-change', 'stress-management', 'therapy'],
      
      // Stress Pattern bands
      'Low Stress': ['wellness', 'maintenance', 'prevention', 'habits'],
      'Moderate Stress': ['stress-management', 'coping-strategies', 'self-care'],
      'High Stress': ['stress-relief', 'recovery', 'professional-help', 'burnout'],
      
      // Motivation Language profiles
      'THE ARCHITECT (Progress-Driven)': ['goal-setting', 'tracking', 'systems', 'productivity'],
      'THE ACHIEVER (Rewards-Driven)': ['celebration', 'recognition', 'achievement', 'success'],
      'THE ENCOURAGER (Affirmation-Driven)': ['support', 'community', 'encouragement', 'relationships'],
      'THE CONNECTOR (Accountability-Driven)': ['accountability', 'teamwork', 'commitment', 'social'],
      'THE VISIONARY (Inspiration-Driven)': ['purpose', 'meaning', 'vision', 'inspiration']
    };

    // Get relevant tags for this quiz and result
    const quizTags = quizMappings[quiz] || [];
    const bandTags = band ? (bandMappings[band] || []) : [];
    const relevantTags = [...new Set([...quizTags, ...bandTags])];

    // Score articles based on tag relevance
    const scoredArticles = allArticles
      .filter(article => article.published)
      .map(article => {
        let score = 0;
        const articleTags = article.tags || [];
        
        // Direct tag matches (highest weight)
        relevantTags.forEach(tag => {
          if (articleTags.some(articleTag => 
            articleTag.toLowerCase().includes(tag.toLowerCase()) ||
            tag.toLowerCase().includes(articleTag.toLowerCase())
          )) {
            score += 10;
          }
        });

        // Related quiz matches
        if (article.relatedQuizzes?.includes(quiz)) {
          score += 15;
        }

        // Title/content keyword matches
        const titleWords = article.title.toLowerCase();
        const excerptWords = article.excerpt?.toLowerCase() || '';
        
        relevantTags.forEach(tag => {
          if (titleWords.includes(tag.toLowerCase())) score += 5;
          if (excerptWords.includes(tag.toLowerCase())) score += 3;
        });

        // Boost premium content slightly for engaged users
        if (article.isPremium) score += 2;

        return { ...article, relevanceScore: score };
      })
      .filter(article => article.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    // If we don't have enough recommendations, add some general high-quality articles
    if (scoredArticles.length < limit) {
      const generalArticles = allArticles
        .filter(article => 
          article.published && 
          !scoredArticles.find(scored => scored.slug === article.slug)
        )
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, limit - scoredArticles.length)
        .map(article => ({ ...article, relevanceScore: 1 }));
      
      recommendations = [...scoredArticles, ...generalArticles];
    } else {
      recommendations = scoredArticles;
    }

    // Format response
    const formattedRecommendations = recommendations.map(article => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      author: article.author,
      readTime: article.readTime,
      tags: article.tags,
      imageUrl: article.imageUrl,
      isPremium: article.isPremium,
      relevanceScore: article.relevanceScore,
      publishedAt: article.publishedAt
    }));

    return NextResponse.json({
      articles: formattedRecommendations,
      total: formattedRecommendations.length,
      quiz,
      band,
      relevantTags
    });

  } catch (error) {
    console.error('Content recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
