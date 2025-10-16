import { Quiz, QuizQuestion } from '@/data/quizzes';

type Answer = {
  questionId: string;
  value: string | number | string[];
};

// Randomize question order while keeping required questions first
export function randomizeQuestions(quiz: Quiz, keepFirstN = 0): QuizQuestion[] {
  const questions = [...quiz.questions];
  const requiredQuestions = questions.splice(0, keepFirstN);
  
  // Fisher-Yates shuffle for the remaining questions
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  
  return [...requiredQuestions, ...questions];
}

// Calculate time remaining and format it
export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Calculate score based on answers and quiz type
export function calculateScore(quiz: Quiz, answers: Answer[]): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  band: string;
  advice: string;
} {
  let totalScore = 0;
  
  // Calculate total score
  for (const answer of answers) {
    const question = quiz.questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    let value = 0;
    
    switch (question.type) {
      case 'likert':
        value = typeof answer.value === 'number' ? answer.value : 0;
        break;
      case 'yes_no':
        value = answer.value === 'yes' ? 1 : 0;
        break;
      case 'multiple_choice':
        // For multiple choice, we need to know the correct answer
        // This is a simplified version - you might want to store correct answers in your quiz data
        value = 1; // Default to 1 point per correct answer
        break;
      case 'text_input':
        // Text input would need more complex scoring logic
        value = 0; // Not scored by default
        break;
    }
    
    totalScore += value;
  }

  // Calculate max possible score
  const maxScore = quiz.questions.reduce((max, q) => {
    if (q.type === 'likert') return max + 7; // 7-point Likert
    if (q.type === 'yes_no' || q.type === 'multiple_choice') return max + 1;
    return max;
  }, 0);

  // Calculate percentage
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  // Find the appropriate band
  const band = quiz.bands.find(
    b => percentage >= b.min && percentage <= b.max
  ) || quiz.bands[quiz.bands.length - 1];

  return {
    totalScore,
    maxScore,
    percentage,
    band: band?.label || '',
    advice: band?.advice || '',
  };
}

// Check if an answer is valid for a question
export function isValidAnswer(question: QuizQuestion, value: any): boolean {
  if (!question) return false;
  
  switch (question.type) {
    case 'likert':
      return typeof value === 'number' && value >= 1 && value <= 7;
    case 'yes_no':
      return value === 'yes' || value === 'no';
    case 'multiple_choice':
      return question.options?.includes(value) || false;
    case 'text_input':
      return typeof value === 'string' && value.trim().length > 0;
    default:
      return false;
  }
}

// Get the next question based on current answers (for adaptive quizzes)
export function getNextQuestion(quiz: Quiz, answers: Answer[]): QuizQuestion | null {
  const answeredIds = new Set(answers.map(a => a.questionId));
  return quiz.questions.find(q => !answeredIds.has(q.id)) || null;
}

// Generate a summary of the quiz results
export function generateResultSummary(quiz: Quiz, score: number, band: string): string {
  return `You scored ${score} on ${quiz.title}. ${band}.`;
}
