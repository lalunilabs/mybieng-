// Sample data for development and testing
// This will be replaced with actual database data in production

export const sampleBlogs = [
  {
    id: '1',
    title: 'Understanding Your Cognitive Patterns',
    slug: 'understanding-cognitive-patterns',
    excerpt: 'Discover how your mind processes information and makes decisions through research-backed insights.',
    content: `# Understanding Your Cognitive Patterns

Cognitive patterns are the mental frameworks that guide how we process information, make decisions, and interpret the world around us. These patterns, developed over years of experience, can either serve us well or hold us back from reaching our full potential.

## What Are Cognitive Patterns?

Cognitive patterns are automatic ways of thinking that our brains use to quickly process information. They include:

- **Attention patterns**: What we notice and what we ignore
- **Processing styles**: How we analyze and organize information
- **Decision-making frameworks**: The criteria we use to make choices
- **Bias tendencies**: Systematic errors in thinking

## Why Understanding Them Matters

Research shows that people who understand their cognitive patterns are better at:
- Making more objective decisions
- Recognizing when emotions might be clouding judgment
- Adapting their thinking to different situations
- Communicating more effectively with others

## Common Cognitive Patterns

### 1. Confirmation Bias
The tendency to search for, interpret, and recall information that confirms our pre-existing beliefs.

### 2. Anchoring Bias
Over-relying on the first piece of information encountered when making decisions.

### 3. Pattern Recognition
Our brain's ability to identify regularities and make predictions based on past experiences.

## How to Identify Your Patterns

1. **Self-reflection**: Regular introspection about your thinking processes
2. **Feedback from others**: Ask trusted friends or colleagues about your decision-making style
3. **Assessment tools**: Take validated psychological assessments
4. **Mindfulness practice**: Develop awareness of your thoughts in real-time

## Practical Applications

Understanding your cognitive patterns can help you:
- Choose careers that align with your natural thinking style
- Improve relationships by understanding how you and others process information
- Make better financial decisions by recognizing emotional influences
- Enhance learning by adapting study methods to your cognitive preferences

## The Science Behind It

Recent neuroscience research using fMRI scans has shown that different people's brains activate different regions when processing the same information. This biological basis for cognitive differences validates the importance of understanding your unique patterns.

## Next Steps

Take our Cognitive Patterns Assessment to discover your unique thinking style and receive personalized recommendations for leveraging your cognitive strengths while mitigating potential blind spots.`,
    image_url: '/images/blog/cognitive-patterns.jpg',
    tags: ['psychology', 'self-awareness', 'decision-making'],
    published: true,
    published_at: new Date('2024-01-15').toISOString(),
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
    author_id: 'dr-n'
  },
  {
    id: '2',
    title: 'The Science of Stress Response',
    slug: 'stress-response-mechanisms',
    excerpt: 'Learn about your body\'s stress mechanisms and how to develop healthier coping strategies.',
    content: `# The Science of Stress Response

Stress is an inevitable part of human experience, but understanding how your body and mind respond to stress can be the key to managing it effectively and maintaining your well-being.

## The Physiology of Stress

When you encounter a stressor, your body initiates a complex cascade of physiological responses:

### The HPA Axis
The hypothalamic-pituitary-adrenal (HPA) axis is your body's primary stress response system:
1. **Hypothalamus** releases CRH (corticotropin-releasing hormone)
2. **Pituitary gland** responds by releasing ACTH (adrenocorticotropic hormone)
3. **Adrenal glands** produce cortisol, the primary stress hormone

### Immediate vs. Chronic Stress
- **Acute stress**: Short-term response that can be beneficial
- **Chronic stress**: Long-term activation that can be harmful to health

## Individual Differences in Stress Response

Research shows significant variation in how people respond to stress:

### Genetic Factors
- Variations in genes affecting serotonin, dopamine, and cortisol
- Inherited differences in stress sensitivity
- Family history of anxiety or mood disorders

### Environmental Influences
- Early life experiences and trauma
- Social support systems
- Cultural background and stress perception

### Personality Traits
- Type A vs. Type B personality patterns
- Neuroticism and emotional stability
- Resilience and coping style preferences

## Common Stress Response Patterns

### 1. Fight-or-Flight Response
- Increased heart rate and blood pressure
- Heightened alertness and energy
- Muscle tension and rapid breathing

### 2. Freeze Response
- Feeling paralyzed or unable to act
- Difficulty making decisions
- Mental fog or confusion

### 3. Fawn Response
- People-pleasing behaviors
- Avoiding conflict at personal cost
- Suppressing own needs and feelings

## Healthy Coping Strategies

### Physiological Approaches
- **Deep breathing exercises**: Activate the parasympathetic nervous system
- **Progressive muscle relaxation**: Reduce physical tension
- **Regular exercise**: Natural stress hormone regulation

### Cognitive Strategies
- **Reframing**: Changing how you interpret stressful situations
- **Mindfulness**: Present-moment awareness without judgment
- **Problem-solving**: Breaking down stressors into manageable parts

### Social Support
- Building strong relationships
- Seeking professional help when needed
- Participating in community activities

## The Role of Cortisol

Cortisol, often called the "stress hormone," plays a crucial role in your stress response:

### Healthy Cortisol Patterns
- Natural daily rhythm (high in morning, low at night)
- Appropriate response to stressors
- Quick return to baseline after stress

### Disrupted Cortisol Patterns
- Chronic elevation leading to health problems
- Flattened daily rhythm
- Inadequate response to stress

## Building Stress Resilience

### Lifestyle Factors
- Consistent sleep schedule
- Balanced nutrition
- Regular physical activity
- Limiting alcohol and caffeine

### Mental Training
- Meditation and mindfulness practices
- Cognitive behavioral techniques
- Gratitude and positive psychology exercises

### Environmental Modifications
- Creating calming spaces
- Reducing unnecessary stressors
- Building supportive relationships

## When to Seek Help

Consider professional support if you experience:
- Persistent anxiety or worry
- Sleep disturbances
- Physical symptoms without medical cause
- Difficulty functioning in daily life
- Substance use as coping mechanism

## Conclusion

Understanding your unique stress response pattern is the first step toward developing effective coping strategies. By recognizing your body's signals and implementing evidence-based techniques, you can build resilience and maintain well-being even in challenging times.

Take our Stress Pattern Analysis to identify your personal stress triggers and discover customized strategies for managing stress effectively.`,
    image_url: '/images/blog/stress-response.jpg',
    tags: ['wellness', 'stress-management', 'health'],
    published: true,
    published_at: new Date('2024-01-10').toISOString(),
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-01-10').toISOString(),
    author_id: 'dr-n'
  }
];

export const sampleQuizzes = [
  {
    id: '1',
    title: 'Cognitive Dissonance Assessment',
    slug: 'cognitive-dissonance-assessment',
    description: 'Discover how aligned your actions are with your core values and beliefs.',
    questions: [
      {
        id: 'q1',
        text: 'How often do you find yourself making quick justifications when your actions don\'t align with your values?',
        type: 'likert',
        scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
        required: true
      },
      {
        id: 'q2',
        text: 'When you notice a contradiction between what you believe and what you do, what\'s your typical response?',
        type: 'multiple_choice',
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
        text: 'How comfortable are you with holding two seemingly contradictory ideas at the same time?',
        type: 'likert',
        scale: ['Very uncomfortable', 'Uncomfortable', 'Neutral', 'Comfortable', 'Very comfortable'],
        required: true
      }
    ],
    scoring_bands: [
      {
        min: 0,
        max: 20,
        label: 'Low Dissonance',
        description: 'You tend to maintain consistency between values and actions. This suggests strong self-awareness and alignment.',
        recommendations: [
          'Continue practicing self-reflection',
          'Consider mentoring others in value-based decision making',
          'Explore leadership opportunities that align with your values'
        ]
      },
      {
        min: 21,
        max: 40,
        label: 'Moderate Dissonance',
        description: 'Some tension exists between your beliefs and behaviors. This is normal and offers opportunities for growth.',
        recommendations: [
          'Regular self-reflection practices',
          'Identify specific areas where values and actions misalign',
          'Develop strategies for making value-based decisions under pressure'
        ]
      },
      {
        min: 41,
        max: 60,
        label: 'High Dissonance',
        description: 'Frequent conflicts between values and actions may be causing stress and impacting well-being.',
        recommendations: [
          'Consider working with a counselor or coach',
          'Examine whether your stated values truly reflect your priorities',
          'Develop specific action plans for aligning behavior with values'
        ]
      }
    ],
    published: true,
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
    author_id: 'dr-n',
    responses: 1250
  },
  {
    id: '2',
    title: 'Stress Pattern Analysis',
    slug: 'stress-pattern-analysis',
    description: 'Understand your stress triggers and develop personalized coping strategies.',
    questions: [
      {
        id: 'q1',
        text: 'How has your sleep quality been over the past week?',
        type: 'likert',
        scale: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'],
        required: true
      },
      {
        id: 'q2',
        text: 'What are your most common stress triggers? (Select all that apply)',
        type: 'multiple_select',
        options: [
          'Work deadlines and pressure',
          'Relationship conflicts',
          'Financial concerns',
          'Health issues',
          'Social situations',
          'Uncertainty about the future'
        ],
        required: true
      },
      {
        id: 'q3',
        text: 'When you feel stressed, what is your most common physical response?',
        type: 'multiple_choice',
        options: [
          'Muscle tension (shoulders, neck, jaw)',
          'Digestive issues (stomach upset, loss of appetite)',
          'Sleep disturbances (difficulty falling asleep, waking up)',
          'Headaches or migraines',
          'Changes in energy (fatigue or restlessness)'
        ],
        required: true
      }
    ],
    scoring_bands: [
      {
        min: 0,
        max: 15,
        label: 'Low Stress',
        description: 'Your stress levels appear manageable. You likely have effective coping strategies in place.',
        recommendations: [
          'Maintain your current stress management practices',
          'Continue regular self-care routines',
          'Consider sharing your strategies with others'
        ]
      },
      {
        min: 16,
        max: 30,
        label: 'Moderate Stress',
        description: 'Some stress patterns worth monitoring. You may benefit from additional coping strategies.',
        recommendations: [
          'Implement daily stress-reduction practices',
          'Identify and address specific stress triggers',
          'Consider mindfulness or relaxation techniques'
        ]
      },
      {
        min: 31,
        max: 45,
        label: 'High Stress',
        description: 'Consider stress management strategies and possibly professional support.',
        recommendations: [
          'Prioritize stress management as a health necessity',
          'Consider professional counseling or therapy',
          'Evaluate lifestyle changes that could reduce stress'
        ]
      }
    ],
    published: true,
    created_at: new Date('2024-01-05').toISOString(),
    updated_at: new Date('2024-01-05').toISOString(),
    author_id: 'dr-n',
    responses: 890
  }
];
