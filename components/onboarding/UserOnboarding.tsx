'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Brain, 
  Target, 
  Sparkles,
  Heart,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

interface UserPreferences {
  goals: string[];
  experience: string;
  frequency: string;
  interests: string[];
  privacy: boolean;
}

interface UserOnboardingProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip: () => void;
}

export function UserOnboarding({ onComplete, onSkip }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    goals: [],
    experience: '',
    frequency: '',
    interests: [],
    privacy: false
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to MyBeing',
      description: 'Your journey of self-discovery starts here',
      icon: Heart,
      content: <WelcomeStep />
    },
    {
      id: 'goals',
      title: 'What brings you here?',
      description: 'Help us personalize your experience',
      icon: Target,
      content: <GoalsStep preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 'experience',
      title: 'Your background',
      description: 'Tell us about your experience with self-assessment',
      icon: User,
      content: <ExperienceStep preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 'interests',
      title: 'Areas of interest',
      description: 'What aspects of yourself would you like to explore?',
      icon: Brain,
      content: <InterestsStep preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      description: 'Understanding how we protect your information',
      icon: Shield,
      content: <PrivacyStep preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 'complete',
      title: 'You\'re all set!',
      description: 'Ready to begin your journey of discovery',
      icon: Sparkles,
      content: <CompleteStep />
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = validateStep(currentStep, preferences);

  const handleNext = () => {
    if (isLastStep) {
      onComplete(preferences);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-gray-500">
              Skip for now
            </Button>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <currentStepData.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
                  {currentStepData.title}
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  {currentStepData.description}
                </p>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                {currentStepData.content}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="text-gray-600 hover:text-purple-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full disabled:opacity-50"
          >
            {isLastStep ? 'Start Journey' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Research-Backed</h3>
          <p className="text-sm text-gray-600">Based on validated psychology research</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
          <p className="text-sm text-gray-600">Your data is completely anonymous</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">At Your Pace</h3>
          <p className="text-sm text-gray-600">Take your time, no pressure</p>
        </div>
      </div>
      
      <p className="text-gray-600 max-w-2xl mx-auto">
        We'll ask you a few questions to personalize your experience. 
        This should take about 2 minutes, and you can skip any step.
      </p>
    </div>
  );
}

function GoalsStep({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (p: UserPreferences) => void }) {
  const goals = [
    'Better understand my personality',
    'Improve my relationships',
    'Make better decisions',
    'Reduce stress and anxiety',
    'Enhance my career',
    'Personal growth and development',
    'Understand my motivations',
    'Improve communication skills'
  ];

  const toggleGoal = (goal: string) => {
    setPreferences({
      ...preferences,
      goals: preferences.goals.includes(goal)
        ? preferences.goals.filter(g => g !== goal)
        : [...preferences.goals, goal]
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-gray-600">
        Select all that apply (you can choose multiple):
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`p-4 text-left rounded-lg border-2 transition-all ${
              preferences.goals.includes(goal)
                ? 'border-purple-500 bg-purple-50 text-purple-900'
                : 'border-gray-200 hover:border-purple-300 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                preferences.goals.includes(goal)
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300'
              }`}>
                {preferences.goals.includes(goal) && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              <span>{goal}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ExperienceStep({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (p: UserPreferences) => void }) {
  const experiences = [
    { id: 'beginner', label: 'New to this', description: 'First time exploring personality assessments' },
    { id: 'some', label: 'Some experience', description: 'Taken a few quizzes or assessments before' },
    { id: 'experienced', label: 'Experienced', description: 'Regular user of self-assessment tools' },
    { id: 'professional', label: 'Professional', description: 'Work in psychology, coaching, or related field' }
  ];

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <button
          key={exp.id}
          onClick={() => setPreferences({ ...preferences, experience: exp.id })}
          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
            preferences.experience === exp.id
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 ${
              preferences.experience === exp.id
                ? 'border-purple-500 bg-purple-500'
                : 'border-gray-300'
            }`}>
              {preferences.experience === exp.id && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">{exp.label}</div>
              <div className="text-sm text-gray-600">{exp.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function InterestsStep({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (p: UserPreferences) => void }) {
  const interests = [
    'Personality traits',
    'Emotional intelligence',
    'Communication styles',
    'Decision-making patterns',
    'Stress responses',
    'Motivation drivers',
    'Relationship dynamics',
    'Work preferences',
    'Learning styles',
    'Leadership qualities'
  ];

  const toggleInterest = (interest: string) => {
    setPreferences({
      ...preferences,
      interests: preferences.interests.includes(interest)
        ? preferences.interests.filter(i => i !== interest)
        : [...preferences.interests, interest]
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-gray-600">
        What aspects of yourself are you most curious about?
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {interests.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`px-4 py-2 rounded-full border-2 transition-all ${
              preferences.interests.includes(interest)
                ? 'border-purple-500 bg-purple-500 text-white'
                : 'border-gray-300 text-gray-700 hover:border-purple-300'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
}

function PrivacyStep({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (p: UserPreferences) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Your Privacy is Protected</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• All responses are completely anonymous</li>
              <li>• No personal information is stored or shared</li>
              <li>• Data is used only for generating your insights</li>
              <li>• You can delete your data at any time</li>
              <li>• We follow strict data protection standards</li>
            </ul>
          </div>
        </div>
      </div>
      
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={preferences.privacy}
          onChange={(e) => setPreferences({ ...preferences, privacy: e.target.checked })}
          className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
        />
        <div className="text-sm">
          <span className="text-gray-900 font-medium">
            I understand and agree to the privacy policy
          </span>
          <p className="text-gray-600 mt-1">
            By checking this box, you acknowledge that you've read our privacy policy 
            and understand how your data is protected.
          </p>
        </div>
      </label>
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Perfect! You're ready to begin
        </h3>
        <p className="text-gray-600">
          Based on your preferences, we've personalized your experience. 
          You can always update these settings later in your profile.
        </p>
      </div>
      
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          <strong>Pro tip:</strong> Take your first assessment when you have 10-15 minutes 
          of uninterrupted time for the best experience.
        </p>
      </div>
    </div>
  );
}

function validateStep(step: number, preferences: UserPreferences): boolean {
  switch (step) {
    case 0: return true; // Welcome step
    case 1: return preferences.goals.length > 0;
    case 2: return preferences.experience !== '';
    case 3: return preferences.interests.length > 0;
    case 4: return preferences.privacy;
    case 5: return true; // Complete step
    default: return false;
  }
}
