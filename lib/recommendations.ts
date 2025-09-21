import { loadAllArticles, loadAllQuizzes, type Blog, type Quiz } from '@/lib/content';

interface ContentItem {
  slug: string;
  tags?: string[];
}

// A unified type for content scoring
type ScorableContent = (Blog | Quiz) & { type: 'article' | 'quiz', category: string };

/**
 * Gets related articles and quizzes for a given content item.
 * This is a simple but effective recommendation engine based on shared tags and categories.
 *
 * @param currentItem The article or quiz the user just finished.
 * @param limit The maximum number of recommendations to return.
 * @returns A list of related content, scored and sorted by relevance.
 */
export async function getRelatedContent(currentItem: ContentItem, limit: number = 2): Promise<ScorableContent[]> {
  const articles = loadAllArticles();
  const quizzes = loadAllQuizzes();

  const allContent: ScorableContent[] = [
    ...articles.map((a: Blog) => ({ ...a, type: 'article' as const, category: a.tags?.[0] || 'General' })),
    ...quizzes.map((q: Quiz) => ({ ...q, type: 'quiz' as const, category: q.tags?.[0] || 'General' })),
  ];


  const scoredContent = allContent
    .filter(item => item.slug !== currentItem.slug) // Exclude the current item
    .map(item => {
      let score = 0;
      // Score based on shared tags (high value)
      const sharedTags = item.tags?.filter((tag: string) => currentItem.tags?.includes(tag)) || [];
      score += sharedTags.length * 3;

      // Small boost for being the same type (article/quiz)
      if (item.type === (currentItem as any).type) {
        score += 1;
      }

      return { ...item, score };
    })
    .filter(item => item.score > 0) // Only include items with some relevance
    .sort((a, b) => b.score - a.score); // Sort by highest score

  return scoredContent.slice(0, limit);
}

/**
 * A placeholder for a more advanced, future AI-powered recommendation engine.
 * This could use embeddings or user behavior to provide hyper-personalized suggestions.
 */
export async function getAIRecommendations(userId: string, currentItem: ContentItem) {
  // In the future, this would call a machine learning model.
  // For now, it can fall back to the basic tag-based system.
  console.log(`Fetching AI recommendations for user ${userId}...`);
  return getRelatedContent(currentItem, 3);
}

