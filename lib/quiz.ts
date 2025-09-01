import { Quiz } from '@/data/quizzes';

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'scale' | 'text';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  required: boolean;
}

export interface QuizData extends Omit<Quiz, 'questions'> {
  id: string;
  questions: QuizQuestion[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  responses: number;
}

export interface UserFeedback {
  id: string;
  quizId: string;
  userId: string;
  rating: number; // 1-5 stars
  comment: string;
  helpful: boolean;
  createdAt: Date;
}

// In-memory storage for demo (replace with database in production)
let quizzes: QuizData[] = [
  {
    id: '1',
    slug: 'cognitive-dissonance',
    title: 'The Mental Tug-of-War',
    description: 'Explore patterns of cognitive dissonance in your daily life and decision-making.',
    questions: [
      {
        id: 'q1',
        text: 'How often do you find yourself making quick justifications when your actions don\'t align with your values?',
        type: 'scale',
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: 'Never', max: 'Very Often' },
        required: true
      },
      {
        id: 'q2',
        text: 'When you notice a contradiction between what you believe and what you do, what\'s your typical response?',
        type: 'multiple-choice',
        options: [
          'I immediately try to change my behavior',
          'I look for reasons why the situation is different',
          'I question whether my belief is still valid',
          'I feel uncomfortable but don\'t act on it',
          'I don\'t usually notice these contradictions'
        ],
        required: true
      },
      {
        id: 'q3',
        text: 'Describe a recent situation where you felt torn between what you wanted to do and what you thought you should do.',
        type: 'text',
        required: false
      }
    ],
    bands: [
      { min: 0, max: 20, label: 'Low Dissonance', advice: 'You tend to maintain consistency between values and actions.' },
      { min: 21, max: 40, label: 'Moderate Dissonance', advice: 'Some tension exists between your beliefs and behaviors.' },
      { min: 41, max: 60, label: 'High Dissonance', advice: 'Frequent conflicts between values and actions may be causing stress.' }
    ],
    published: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    authorId: 'admin',
    responses: 247
  },
  {
    id: '2',
    slug: 'stress-patterns',
    title: 'Stress Patterns Check-in',
    description: 'Identify your stress triggers and coping patterns for better self-management.',
    questions: [
      {
        id: 'q1',
        text: 'How has your sleep quality been over the past week?',
        type: 'scale',
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: 'Very Poor', max: 'Excellent' },
        required: true
      },
      {
        id: 'q2',
        text: 'What are your most common stress triggers?',
        type: 'multiple-choice',
        options: [
          'Work deadlines and pressure',
          'Relationship conflicts',
          'Financial concerns',
          'Health issues',
          'Social situations',
          'Uncertainty about the future'
        ],
        required: true
      }
    ],
    bands: [
      { min: 0, max: 15, label: 'Low Stress', advice: 'Your stress levels appear manageable.' },
      { min: 16, max: 30, label: 'Moderate Stress', advice: 'Some stress patterns worth monitoring.' },
      { min: 31, max: 45, label: 'High Stress', advice: 'Consider stress management strategies.' }
    ],
    published: true,
    createdAt: new Date('2025-02-04'),
    updatedAt: new Date('2025-02-04'),
    authorId: 'admin',
    responses: 189
  }
];

let userFeedback: UserFeedback[] = [
  {
    id: '1',
    quizId: '1',
    userId: 'user1',
    rating: 5,
    comment: 'Really helped me understand my decision-making patterns. The insights were spot-on!',
    helpful: true,
    createdAt: new Date('2025-01-20')
  },
  {
    id: '2',
    quizId: '1',
    userId: 'user2',
    rating: 4,
    comment: 'Good quiz, though I wish there were more questions about workplace scenarios.',
    helpful: true,
    createdAt: new Date('2025-01-22')
  },
  {
    id: '3',
    quizId: '2',
    userId: 'user3',
    rating: 5,
    comment: 'The stress tracking approach is practical and actionable. Love the weekly check-in format.',
    helpful: true,
    createdAt: new Date('2025-02-10')
  }
];

// Quiz management functions
export function getAllQuizzes(includeUnpublished = false): QuizData[] {
  if (includeUnpublished) {
    return quizzes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  return quizzes
    .filter(quiz => quiz.published)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function getQuizById(id: string): QuizData | undefined {
  return quizzes.find(quiz => quiz.id === id);
}

export function getQuizBySlug(slug: string): QuizData | undefined {
  return quizzes.find(quiz => quiz.slug === slug && quiz.published);
}

export function createQuiz(data: Omit<QuizData, 'id' | 'createdAt' | 'updatedAt' | 'responses'>): QuizData {
  const newQuiz: QuizData = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    responses: 0
  };
  
  quizzes.push(newQuiz);
  return newQuiz;
}

export function updateQuiz(id: string, data: Partial<QuizData>): QuizData | null {
  const index = quizzes.findIndex(quiz => quiz.id === id);
  if (index === -1) return null;
  
  quizzes[index] = {
    ...quizzes[index],
    ...data,
    updatedAt: new Date()
  };
  
  return quizzes[index];
}

export function deleteQuiz(id: string): boolean {
  const index = quizzes.findIndex(quiz => quiz.id === id);
  if (index === -1) return false;
  
  quizzes.splice(index, 1);
  return true;
}

export function toggleQuizPublished(id: string): QuizData | null {
  const quiz = getQuizById(id);
  if (!quiz) return null;
  
  return updateQuiz(id, { published: !quiz.published });
}

// Feedback management functions
export function getFeedbackForQuiz(quizId: string): UserFeedback[] {
  return userFeedback
    .filter(feedback => feedback.quizId === quizId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getAllFeedback(): UserFeedback[] {
  return userFeedback.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function addFeedback(data: Omit<UserFeedback, 'id' | 'createdAt'>): UserFeedback {
  const newFeedback: UserFeedback = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  
  userFeedback.push(newFeedback);
  return newFeedback;
}

export function deleteFeedback(id: string): boolean {
  const index = userFeedback.findIndex(feedback => feedback.id === id);
  if (index === -1) return false;
  
  userFeedback.splice(index, 1);
  return true;
}

// Generate slug from title
export function generateQuizSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
