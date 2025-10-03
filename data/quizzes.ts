export type QuizBand = { min: number; max: number; label: string; advice: string };

export type QuizAttachment = { label: string; url: string; type?: 'link' | 'image' | 'file' };

export type QuizQuestion = {
  id: string;
  text: string;
  type: 'likert' | 'yes_no' | 'multiple_choice' | 'text_input';
  options?: string[]; // For multiple_choice questions
  optionCategories?: string[]; // Optional mapping for categorical scoring
  placeholder?: string; // For text_input questions
  imageUrl?: string; // Optional visual aid
  attachments?: QuizAttachment[]; // Optional related resources
};

export type MotivationProfile = {
  title: string;
  subtitle: string;
  dna: string[];
  lights: string[];
  kills: string[];
  support: string[];
};

export type Quiz = {
  slug: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  bands: QuizBand[];
  resultType?: string;
  resultProfiles?: Record<string, MotivationProfile>;
  resultInterpretation?: {
    single: string;
    dual: string;
    multi: string;
  };
  // Admin & SEO metadata
  published?: boolean;
  publishedAt?: string; // ISO timestamp for scheduling
  tags?: string[];
  isPaid?: boolean;
  price?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;
  imageUrl?: string; // optional cover image for listings
  attachments?: QuizAttachment[]; // quiz-level resources
  // Listing UX
  benefits?: string[]; // what you get
  requirements?: string[]; // what you need
};

export const quizzes: Quiz[] = [
  {
    slug: 'cognitive-dissonance',
    title: 'The Mental Tug-of-War (Cognitive Dissonance)',
    description:
      'Detect where your values and actions are out of sync across five patterns: instant justification, gradual belief shift, selective evidence, identity protection, and social reality distortion.',
    isPaid: true,
    price: 45,
    published: true,
    publishedAt: '2025-08-01T00:00:00.000Z',
    tags: ['cognitive dissonance', 'values', 'behavior', 'identity', 'justification', 'patterns'],
    metaTitle: 'The Mental Tug-of-War: Cognitive Dissonance Assessment',
    metaDescription: 'Spot contradictions between values and actions across 5 patterns. No right/wrong answers—use this assessment to recognize dissonance cues and choose small alignment steps.',
    keywords: ['cognitive dissonance', 'values vs actions', 'instant justification', 'identity protection', 'selective evidence', 'self-discovery'],
    canonicalUrl: '/quizzes/cognitive-dissonance',
    ogImage: '',
    robots: 'index,follow',
    benefits: [
      'Pinpoint value–behavior gaps across 5 dissonance patterns',
      'Get simple realignment suggestions you can act on this week',
      'Judgment-free insights to build integrity over time',
    ],
    requirements: [
      '10 minutes of quiet focus',
      'Honest reflection about recent choices',
      'Premium access (included in plan)',
    ],
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
    isPaid: true,
    price: 35,
    published: true,
    publishedAt: '2025-08-10T00:00:00.000Z',
    tags: ['stress', 'energy', 'sleep', 'focus', 'mood', 'patterns'],
    metaTitle: 'Stress Patterns Check-in: Daily Signals Overview',
    metaDescription: 'Identify stress signals across sleep, energy, focus, mood, and social strain. Quick check-in designed for practical insight and small adjustments.',
    keywords: ['stress patterns', 'sleep', 'energy levels', 'focus', 'mood', 'self-assessment'],
    canonicalUrl: '/quizzes/stress-patterns',
    ogImage: '',
    robots: 'index,follow',
    benefits: [
      'Identify daily stress signals across 5 domains',
      'Get 1–2 small levers to reset (sleep, movement, breaks)',
      'Build pattern awareness you can track week to week',
    ],
    requirements: [
      '5–10 minutes to check in',
      'Context from the last 3–7 days',
      'Premium access (included in plan)',
    ],
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
    benefits: [
      'Explore your self-awareness habits with mixed question types',
      'Personalized prompts to deepen reflection',
      'Quick snapshot you can revisit anytime',
    ],
    requirements: [
      '5–10 minutes of honest reflection',
      'Openness to notice patterns',
    ],
  },
  {
    slug: 'motivation-language',
    title: 'Motivation Language Quiz: Discover What Actually Drives You',
    description: '15-question assessment revealing your dominant motivation style across progress, rewards, affirmation, accountability, and purpose.',
    isPaid: false,
    published: true,
    publishedAt: '2025-09-30T11:30:00.000Z',
    tags: ['motivation', 'behavior', 'self-discovery', 'accountability', 'purpose'],
    metaTitle: 'Motivation Language Quiz | Discover What Drives You',
    metaDescription: 'Take this free 15-question assessment to uncover your motivation blueprint. Learn if you are progress, rewards, affirmation, accountability, or purpose driven. No right or wrong answers.',
    keywords: ['motivation quiz', 'self-discovery', 'motivation language', 'behavior patterns', 'motivation blueprint'],
    canonicalUrl: '/quizzes/motivation-language',
    imageUrl: '/images/quizzes/motivation-language-cover.jpg',
    benefits: [
      'Identify the motivation language that actually keeps you moving',
      'Get a human, research-backed profile of what fuels and drains you',
      'Design incentives, accountability, and environments that match your style',
    ],
    requirements: [
      '10 minutes of honest reflection',
      'Recent examples from work or personal goals',
    ],
    resultType: 'motivation-language',
    resultInterpretation: {
      single: 'A dominant score (10+ points) means this motivation language reliably drives you. Design your environment around it.',
      dual: 'Balanced scores (7-9 points in two areas) mean you are bilingual in motivation. Blend both languages depending on context.',
      multi: 'If no category crosses 6 points, you are motivation-flexible. Experiment with different approaches for different goals.',
    },
    resultProfiles: {
      architect: {
        title: 'THE ARCHITECT (Progress-Driven) 🏗️',
        subtitle: '“Show me the data, give me the plan, let me build something great.”',
        dna: [
          'Fueled by visible advancement and systematic growth',
          'Needs to track steps, progress, and measurable wins',
          'Finds deep satisfaction in consistent, steady improvement',
        ],
        lights: [
          'Progress trackers, streaks, before/after comparisons',
          'Step-by-step frameworks with clear milestones',
        ],
        kills: [
          'Moving goalposts or vague objectives',
          '“Just wing it” approaches with no measurement',
        ],
        support: [
          'Project plans with checkpoints and review cadence',
          'Mentors who help break big goals into smaller steps',
        ],
      },
      achiever: {
        title: 'THE ACHIEVER (Rewards-Driven) 🏆',
        subtitle: '“Celebrate the wins, honor the effort, make success feel amazing.”',
        dna: [
          'Driven by recognition, celebration, and tangible payoffs',
          'Needs something to look forward to and acknowledgement when they deliver',
          'Believes success should feel good and be celebrated',
        ],
        lights: [
          'Milestone celebrations and achievement badges',
          'Public recognition or personal rewards after hard work',
        ],
        kills: [
          'Unacknowledged effort or indefinitely delayed payoffs',
          'Being taken for granted with zero celebration',
        ],
        support: [
          'Planned celebrations for milestones',
          'People who notice effort, not just outcomes',
        ],
      },
      encourager: {
        title: 'THE ENCOURAGER (Affirmation-Driven) 💙',
        subtitle: '“I can do this when I feel believed in, supported, and emotionally safe.”',
        dna: [
          'Powered by belief, support, and positive reinforcement',
          'Needs emotional safety to take risks and push through challenges',
          'Thrives when seen, valued, and supported through struggles',
        ],
        lights: [
          '“I believe in you” messages and supportive check-ins',
          'Mentors who celebrate courage and effort',
        ],
        kills: [
          'Harsh criticism or emotionally cold environments',
          'Feeling judged or told to figure it out alone',
        ],
        support: [
          'Encouraging accountability partners',
          'Regular emotional check-ins focused on support',
        ],
      },
      connector: {
        title: 'THE CONNECTOR (Accountability-Driven) 🤝',
        subtitle: '“I show up best when others are counting on me and we’re in this together.”',
        dna: [
          'Motivated by shared commitments and external expectations',
          'Needs workout buddies, team members, and people depending on them',
          'Performs best when there are real stakes and consequences',
        ],
        lights: [
          'Public commitments, mastermind groups, and team goals',
          'Deadlines with real impact on others',
        ],
        kills: [
          'Solo goals with no external accountability',
          'People letting them off the hook too easily',
        ],
        support: [
          'Accountability partners who check in regularly',
          'Shared goals where others depend on their role',
        ],
      },
      visionary: {
        title: 'THE VISIONARY (Inspiration-Driven) ✨',
        subtitle: '“When I connect this to a meaningful future, I become unstoppable.”',
        dna: [
          'Fueled by purpose, meaning, and connection to something bigger',
          'Needs clarity on why goals matter and how they serve their values',
          'Finds energy when work aligns with a deeper mission',
        ],
        lights: [
          'Mission statements, vision boards, and clearly articulated impact',
          'Autonomy to design approach while staying anchored to purpose',
        ],
        kills: [
          'Meaningless busy work or micromanagement',
          'Goals disconnected from personal values',
        ],
        support: [
          'Mentors who re-anchor them to the bigger picture',
          'Purpose check-ins to reconnect with core values',
        ],
      },
    },
    questions: [
      { id: 'ml1', text: "You've just committed to a challenging 6-month goal. Three weeks in, what keeps the momentum alive?", type: 'multiple_choice', options: ['Seeing concrete evidence I\'m 20% of the way there', 'A celebration dinner I\'ve planned for hitting my first milestone', 'My mentor texting “How\'s it going? I believe in you!”', 'Knowing my workout partner is counting on me to show up', 'Remembering this connects to the life I\'m trying to build'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml2', text: "You've had the worst week in months. What helps you reset?", type: 'multiple_choice', options: ['Breaking tomorrow into tiny, manageable 30-minute blocks', 'Promising myself something nice if I just get one thing done', 'A friend reminding me: “You\'ve overcome worse than this”', 'A deadline that forces me to push through anyway', 'Stepping back and remembering why any of this matters'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml3', text: 'Learning something difficult—the turning point was?', type: 'multiple_choice', options: ['Tracking measurable improvement week over week', 'Earning my first real recognition or reward for it', 'Hearing someone say “You\'re really getting this!”', 'Making a commitment I couldn\'t back out of', 'Connecting it to something I deeply care about'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml4', text: 'Your brain works best when challenges are presented as:', type: 'multiple_choice', options: ['Puzzles with clear steps and measurable progress', 'Games with levels, achievements, and rewards', 'Conversations with encouragement and feedback', 'Commitments with deadlines and shared accountability', 'Stories with meaningful outcomes and purpose'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml5', text: 'What kind of “help” makes you want to give up?', type: 'multiple_choice', options: ['Someone constantly changing the plan or moving the goalposts', 'Rewards that feel manipulative or fake', 'Harsh criticism when you\'re already struggling', 'Being guilted about letting others down', 'Someone questioning whether your goals matter'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml6', text: 'Peak performance memory—what made you unstoppable?', type: 'multiple_choice', options: ['Seeing how far I\'d come and what was left', 'An amazing reward at the finish line', 'People cheering me on and believing in me', 'Promises to people counting on me', 'Being crystal clear about why it mattered'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml7', text: "It\'s Tuesday at 3 PM and you\'re overwhelmed. What gets you moving?", type: 'multiple_choice', options: ['Picking the smallest task and timing myself doing it', 'Promising myself coffee/a snack/a break after one task', 'Texting someone: “Send me good vibes, tough day”', 'Remembering someone is expecting an update from me', 'Asking: “Which task serves my bigger vision?”'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml8', text: 'Which feedback motivates you most?', type: 'multiple_choice', options: ['“You\'ve improved 30% since last month”', '“Amazing work! Let\'s celebrate this properly”', '“I\'m so proud of you— you\'re capable of incredible things”', '“The team is counting on you to keep this up”', '“Your work is making a real difference”'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml9', text: 'Two weeks off track. How do you restart?', type: 'multiple_choice', options: ['Set a tiny daily minimum I can\'t fail at', 'Plan a small reward for my first day back', 'Ask for encouragement from someone who believes in me', 'Set a non-negotiable deadline with real consequences', 'Reconnect with the original vision that inspired me'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml10', text: 'I\'d rather be someone who…', type: 'multiple_choice', options: ['Delivers steadily through progress', 'Celebrates every victory', 'Lifts others up with emotional safety', 'Keeps others accountable', 'Inspires people to dream bigger'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml11', text: 'Your motivation dies fastest when…', type: 'multiple_choice', options: ['Progress becomes impossible to track', 'The payoff gets delayed indefinitely with no recognition', 'You feel criticized or unsupported', 'No one else really cares if you succeed', 'The original purpose gets lost'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml12', text: 'In group projects, you naturally become the person who…', type: 'multiple_choice', options: ['Tracks milestones and progress', 'Plans celebrations and acknowledges contributions', 'Encourages morale and positivity', 'Keeps everyone accountable to deadlines', 'Reminds the team of impact and meaning'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml13', text: 'Under intense pressure, what self-talk helps?', type: 'multiple_choice', options: ['“Just focus on the next single step”', '“Push through this and something good is waiting”', '“You\'ve got what it takes—trust yourself”', '“People are depending on you—don\'t let them down”', '“This struggle is part of something meaningful”'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml14', text: 'After a major setback, you bounce back by…', type: 'multiple_choice', options: ['Analyzing what went wrong and creating a better plan', 'Treating myself kindly and celebrating small steps', 'Getting reassurance from people I trust', 'Having someone check in regularly to keep me accountable', 'Reflecting on how setbacks are part of a worthwhile journey'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
      { id: 'ml15', text: 'Looking back on your proudest achievement, you remember…', type: 'multiple_choice', options: ['Week-after-week progress', 'Celebrations and recognition along the way', 'Encouragement during tough moments', 'Accountability that pushed you forward', 'The inspiration of working toward something meaningful'], optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary'] },
    ],
    bands: [
      { min: 0, max: 100, label: 'Motivation languages are type-based', advice: 'See your detailed profile below. Lean into your highest category (10+) and combine secondary styles when useful.' },
    ],
  },
];

export function getQuizBySlug(slug: string) {
  return quizzes.find((q) => q.slug === slug);
}

export function getBandForScore(score: number, maxScore: number): QuizBand | null {
  // Convert score to a percentage-based system (0-100)
  const percentage = (score / maxScore) * 100;
  
  // For now, we'll use a simple approach based on the cognitive dissonance quiz bands
  // In a real implementation, this would be more sophisticated
  if (percentage <= 40) {
    return {
      min: 10,
      max: 20,
      label: 'Low dissonance',
      advice: 'You generally act in alignment with your values. Keep reflecting on decisions and use that alignment as a strength.'
    };
  } else if (percentage <= 70) {
    return {
      min: 21,
      max: 35,
      label: 'Moderate dissonance',
      advice: 'You may be managing occasional tensions by rationalizing or shifting beliefs. Choose one area to realign with a small, testable action.'
    };
  } else {
    return {
      min: 36,
      max: 50,
      label: 'High dissonance',
      advice: 'You often experience value–behavior gaps. Map the biggest friction point, identify one value to honor this week, and remove a small obstacle to acting on it.'
    };
  }
}
