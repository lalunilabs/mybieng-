'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { 
  Battery, 
  Brain, 
  Heart, 
  Zap, 
  Sun, 
  Moon, 
  Coffee, 
  Users, 
  MapPin, 
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Check,
  Mic,
  Camera
} from 'lucide-react';

interface CheckInData {
  energy: number;
  mood: number;
  stress: number;
  focus: number;
  alignment: number;
  context: {
    location: string;
    social: string;
    activity: string;
    weather: string;
  };
  notes?: string;
  photo?: string;
  voice?: string;
}

interface MobileCheckInProps {
  onComplete: (data: CheckInData) => void;
  onSkip: () => void;
  previousData?: Partial<CheckInData>;
}

export function MobileCheckIn({ onComplete, onSkip, previousData }: MobileCheckInProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CheckInData>({
    energy: previousData?.energy || 5,
    mood: previousData?.mood || 5,
    stress: previousData?.stress || 5,
    focus: previousData?.focus || 5,
    alignment: previousData?.alignment || 5,
    context: {
      location: previousData?.context?.location || '',
      social: previousData?.context?.social || '',
      activity: previousData?.context?.activity || '',
      weather: previousData?.context?.weather || ''
    },
    notes: '',
    photo: '',
    voice: ''
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const steps = [
    { id: 'energy', title: 'Energy Level', icon: Battery, color: 'from-green-500 to-emerald-500' },
    { id: 'mood', title: 'Mood', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'stress', title: 'Stress Level', icon: Zap, color: 'from-orange-500 to-red-500' },
    { id: 'focus', title: 'Mental Focus', icon: Brain, color: 'from-blue-500 to-indigo-500' },
    { id: 'alignment', title: 'Value Alignment', icon: Check, color: 'from-purple-500 to-violet-500' },
    { id: 'context', title: 'Context', icon: MapPin, color: 'from-teal-500 to-cyan-500' },
    { id: 'notes', title: 'Quick Note', icon: Smartphone, color: 'from-gray-500 to-slate-500' }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSwipe = (event: any, info: PanInfo) => {
    if (info.offset.x > 100 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (info.offset.x < -100 && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSliderChange = (field: keyof CheckInData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleContextChange = (field: keyof CheckInData['context'], value: string) => {
    setData(prev => ({
      ...prev,
      context: { ...prev.context, [field]: value }
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getEmoji = (value: number, type: string) => {
    const ranges = {
      energy: ['😴', '😪', '😐', '😊', '⚡'],
      mood: ['😢', '😔', '😐', '😊', '😄'],
      stress: ['😌', '😐', '😰', '😫', '🤯'],
      focus: ['🌫️', '😵‍💫', '😐', '🎯', '🧠'],
      alignment: ['❌', '😕', '😐', '✅', '🎯']
    };
    
    const emojis = ranges[type as keyof typeof ranges] || ['😐', '😐', '😐', '😐', '😐'];
    return emojis[Math.min(Math.floor((value - 1) / 2), 4)];
  };

  const SliderStep = ({ field, title, icon: Icon, color }: { 
    field: keyof CheckInData, 
    title: string, 
    icon: any, 
    color: string 
  }) => (
    <motion.div
      key={field}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleSwipe}
      className="flex flex-col items-center justify-center h-full p-8"
    >
      <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center mb-8 shadow-xl`}>
        <Icon className="w-12 h-12 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">{title}</h2>
      
      <div className="text-6xl mb-8">
        {getEmoji(data[field] as number, field)}
      </div>
      
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Low</span>
          <span>High</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="1"
            max="10"
            value={data[field] as number}
            onChange={(e) => handleSliderChange(field, parseInt(e.target.value))}
            className={`w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider-${field}`}
            style={{
              background: `linear-gradient(to right, rgb(156, 163, 175) 0%, rgb(156, 163, 175) ${((data[field] as number - 1) / 9) * 100}%, rgb(229, 231, 235) ${((data[field] as number - 1) / 9) * 100}%, rgb(229, 231, 235) 100%)`
            }}
          />
          <div 
            className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br ${color} rounded-full shadow-lg border-2 border-white pointer-events-none`}
            style={{ left: `calc(${((data[field] as number - 1) / 9) * 100}% - 12px)` }}
          />
        </div>
        
        <div className="text-center mt-4">
          <span className="text-2xl font-bold text-gray-900">{data[field]}/10</span>
        </div>
      </div>
    </motion.div>
  );

  const ContextStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleSwipe}
      className="flex flex-col justify-center h-full p-8"
    >
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-8 mx-auto shadow-xl">
        <MapPin className="w-12 h-12 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What's Your Context?</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Where are you?</label>
          <div className="grid grid-cols-2 gap-3">
            {['Home', 'Work', 'Commuting', 'Social'].map((location) => (
              <button
                key={location}
                onClick={() => handleContextChange('location', location)}
                className={`p-3 rounded-2xl border-2 transition-all ${
                  data.context.location === location
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Who's around?</label>
          <div className="grid grid-cols-2 gap-3">
            {['Alone', 'Family', 'Friends', 'Colleagues'].map((social) => (
              <button
                key={social}
                onClick={() => handleContextChange('social', social)}
                className={`p-3 rounded-2xl border-2 transition-all ${
                  data.context.social === social
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {social}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What are you doing?</label>
          <div className="grid grid-cols-2 gap-3">
            {['Working', 'Relaxing', 'Exercising', 'Learning'].map((activity) => (
              <button
                key={activity}
                onClick={() => handleContextChange('activity', activity)}
                className={`p-3 rounded-2xl border-2 transition-all ${
                  data.context.activity === activity
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const NotesStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleSwipe}
      className="flex flex-col justify-center h-full p-8"
    >
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-500 to-slate-500 flex items-center justify-center mb-8 mx-auto shadow-xl">
        <Smartphone className="w-12 h-12 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Quick Note</h2>
      <p className="text-gray-600 text-center mb-8">Anything specific you want to remember about this moment?</p>
      
      <div className="space-y-6">
        <textarea
          value={data.notes}
          onChange={(e) => setData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="What's on your mind? (optional)"
          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none resize-none"
          rows={4}
        />
        
        <div className="flex gap-4">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              isRecording
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <Mic className="w-5 h-5" />
            {isRecording ? 'Recording...' : 'Voice Note'}
          </button>
          
          <button
            onClick={() => setShowCamera(!showCamera)}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 transition-all"
          >
            <Camera className="w-5 h-5" />
            Photo
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onSkip} className="text-gray-500 hover:text-gray-700">
          Skip
        </button>
        
        <div className="flex-1 mx-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        
        <span className="text-sm text-gray-500">
          {currentStep + 1}/{steps.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStepData.id === 'context' ? (
            <ContextStep key="context" />
          ) : currentStepData.id === 'notes' ? (
            <NotesStep key="notes" />
          ) : (
            <SliderStep
              key={currentStepData.id}
              field={currentStepData.id as keyof CheckInData}
              title={currentStepData.title}
              icon={currentStepData.icon}
              color={currentStepData.color}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-5 h-5" />
                Complete Check-in
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
        
        {/* Quick navigation dots */}
        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-indigo-600 w-6'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
