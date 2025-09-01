export type QuizBand = { min: number; max: number; label: string; advice: string };

export type QuizQuestion = {
  id: string;
  text: string;
  type: 'likert' | 'yes_no' | 'multiple_choice' | 'text_input';
  options?: string[]; // For multiple_choice questions
  placeholder?: string; // For text_input questions
};

export type Quiz = {
  slug: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  bands: QuizBand[];
  // Admin & SEO metadata
  published?: boolean;
  tags?: string[];
  isPaid?: boolean;
  price?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;
};

export const quizzes: Quiz[] = [
  {
    slug: 'cognitive-dissonance',
    title: 'The Mental Tug-of-War (Cognitive Dissonance)',
    description:
      'Detect where your values and actions are out of sync across five patterns: instant justification, gradual belief shift, selective evidence, identity protection, and social reality distortion.',
    questions: [
      { id: 'cd1', text: 'I quickly explain away choices that conflict with my values.', type: 'likert' }, // instant justification
      { id: 'cd2', text: 'When I feel tension, I tell myself it was unavoidable.', type: 'likert' },
      { id: 'cd3', text: 'Over time, I convince myself that a once-important value matters less.', type: 'likert' }, // gradual belief shift
      { id: 'cd4', text: 'I reframe past decisions to feel more consistent with who I am.', type: 'likert' },
      { id: 'cd5', text: 'I look for information that supports my decision and ignore the rest.', type: 'likert' }, // selective evidence
      { id: 'cd6', text: 'I spend more time with people who validate my choices.', type: 'likert' },
      { id: 'cd7', text: 'I feel threatened when feedback challenges a core part of my identity.', type: 'likert' }, // identity protection
      { id: 'cd8', text: 'I defend my choices to protect how I see myself.', type: 'likert' },
      { id: 'cd9', text: 'I justify actions by saying everyone around me does the same.', type: 'likert' }, // social reality distortion
      { id: 'cd10', text: 'I downplay contradictions if my group supports the behavior.', type: 'likert' },
    ],
    bands: [
      { min: 10, max: 20, label: 'Low dissonance', advice: 'You generally act in alignment with your values. Keep reflecting on decisions and use that alignment as a strength.' },
      { min: 21, max: 35, label: 'Moderate dissonance', advice: 'You may be managing occasional tensions by rationalizing or shifting beliefs. Choose one area to realign with a small, testable action.' },
      { min: 36, max: 50, label: 'High dissonance', advice: 'You often experience value–behavior gaps. Map the biggest friction point, identify one value to honor this week, and remove a small obstacle to acting on it.' },
    ],
  },
  {
    slug: 'stress-patterns',
    title: 'Stress Patterns Check-in',
    description: 'Spot recurring stress signals across sleep, energy, focus, mood, and social strain.',
    questions: [
      { id: 'sp1', text: 'My sleep is disrupted or unrefreshing.', type: 'likert' },
      { id: 'sp2', text: 'My energy crashes during the day.', type: 'likert' },
      { id: 'sp3', text: 'It is hard to focus or finish tasks.', type: 'likert' },
      { id: 'sp4', text: "I feel more irritable or on edge than usual.", type: 'likert' },
      { id: 'sp5', text: 'I withdraw from people or avoid conversations.', type: 'likert' },
      { id: 'sp6', text: 'Small problems feel overwhelming.', type: 'likert' },
      { id: 'sp7', text: 'I rely on short-term relief (scrolling, snacking, etc.).', type: 'likert' },
      { id: 'sp8', text: 'I notice physical tension (jaw, shoulders, stomach).', type: 'likert' },
    ],
    bands: [
      { min: 8, max: 16, label: 'Low stress pattern load', advice: 'You have manageable signals. Keep the basics steady: sleep window, movement, and one daily reset ritual.' },
      { min: 17, max: 28, label: 'Moderate stress pattern load', advice: 'Pick one reliable lever (sleep, movement, or focused breaks). Reduce one stress amplifier (late caffeine, late screens, or constant notifications).' },
      { min: 29, max: 40, label: 'High stress pattern load', advice: 'Prioritize recovery. Create a wind-down routine, schedule a supportive conversation, and remove one commitment to free up capacity.' },
    ],
  },
  {
    slug: 'self-awareness-mixed',
    title: 'Self-Awareness Check (Mixed Format)',
    description: 'A demonstration quiz using different question types to explore self-awareness patterns.',
    questions: [
      { id: 'sa1', text: 'I regularly reflect on my emotions and reactions.', type: 'likert' },
      { id: 'sa2', text: 'Do you keep a journal or practice regular self-reflection?', type: 'yes_no' },
      { id: 'sa3', text: 'What time of day do you feel most energetic?', type: 'multiple_choice', options: ['Early morning', 'Mid-morning', 'Afternoon', 'Evening', 'Late night'] },
      { id: 'sa4', text: 'I notice patterns in my behavior across different situations.', type: 'likert' },
      { id: 'sa5', text: 'Describe a recent situation where you learned something new about yourself:', type: 'text_input', placeholder: 'Share your experience and what you discovered...' },
      { id: 'sa6', text: 'Do you actively seek feedback from others about your behavior?', type: 'yes_no' },
      { id: 'sa7', text: 'Which best describes your approach to personal growth?', type: 'multiple_choice', options: ['Structured learning (books, courses)', 'Experiential learning (trying new things)', 'Social learning (conversations, mentors)', 'Reflective learning (journaling, meditation)', 'Mixed approach'] },
    ],
    bands: [
      { min: 4, max: 8, label: 'Developing awareness', advice: 'You\'re building self-awareness foundations. Focus on one consistent reflection practice and seek regular feedback.' },
      { min: 9, max: 12, label: 'Growing awareness', advice: 'You have good self-awareness habits. Deepen your practice by exploring patterns and seeking diverse perspectives.' },
      { min: 13, max: 16, label: 'Strong awareness', advice: 'You demonstrate strong self-awareness. Use this foundation to help others and continue challenging your assumptions.' },
    ],
  },
];

export function getQuizBySlug(slug: string) {
  return quizzes.find((q) => q.slug === slug);
}
