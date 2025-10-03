import fs from 'fs';
import path from 'path';

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'scale' | 'multiple-choice' | 'text';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  required?: boolean;
}

export interface QuizBand {
  label: string;
  min: number;
  max: number;
  description: string;
  advice: string;
  color?: string;
}

export interface Quiz {
  slug: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number;
  questions: QuizQuestion[];
  bands: QuizBand[];
  featured: boolean;
  researchBased: boolean;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  author: string;
  image?: string;
}

const QUIZ_DIRECTORY = path.join(process.cwd(), 'content/quizzes');

// Ensure quiz directory exists
if (!fs.existsSync(QUIZ_DIRECTORY)) {
  fs.mkdirSync(QUIZ_DIRECTORY, { recursive: true });
}

export function getAllQuizzes(): Quiz[] {
  try {
    const files = fs.readdirSync(QUIZ_DIRECTORY);
    const quizzes = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const slug = file.replace(/\.json$/, '');
        return getQuiz(slug);
      })
      .filter(Boolean) as Quiz[];

    return quizzes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error reading quizzes:', error);
    return [];
  }
}

export function getQuiz(slug: string): Quiz | null {
  try {
    const filePath = path.join(QUIZ_DIRECTORY, `${slug}.json`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const quiz = JSON.parse(fileContent);

    return {
      slug,
      ...quiz,
    };
  } catch (error) {
    console.error(`Error reading quiz ${slug}:`, error);
    return null;
  }
}

export function getFeaturedQuizzes(): Quiz[] {
  return getAllQuizzes().filter(quiz => quiz.featured).slice(0, 4);
}

export function getQuizzesByCategory(category: string): Quiz[] {
  return getAllQuizzes().filter(quiz => 
    quiz.category.toLowerCase() === category.toLowerCase()
  );
}

export function getAllCategories(): string[] {
  const allQuizzes = getAllQuizzes();
  const categories = new Set<string>();
  
  allQuizzes.forEach(quiz => {
    categories.add(quiz.category);
  });
  
  return Array.from(categories).sort();
}

export function searchQuizzes(query: string): Quiz[] {
  const quizzes = getAllQuizzes();
  const lowercaseQuery = query.toLowerCase();
  
  return quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(lowercaseQuery) ||
    quiz.description.toLowerCase().includes(lowercaseQuery) ||
    quiz.category.toLowerCase().includes(lowercaseQuery) ||
    quiz.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function calculateQuizScore(answers: Record<string, number>, quiz: Quiz): {
  score: number;
  maxScore: number;
  band: QuizBand;
} {
  const scores = Object.values(answers);
  const score = scores.reduce((sum, val) => sum + val, 0);
  const maxScore = quiz.questions.length * (quiz.questions[0]?.scaleMax || 5);
  
  // Find appropriate band
  const percentage = (score / maxScore) * 100;
  const band = quiz.bands.find(b => percentage >= b.min && percentage <= b.max) || quiz.bands[0];
  
  return { score, maxScore, band };
}
