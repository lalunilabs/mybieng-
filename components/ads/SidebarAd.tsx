'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Brain, Mail, BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface SidebarAdProps {
  type?: 'quiz' | 'newsletter' | 'article' | 'premium';
  className?: string;
}

const adConfigs = {
  quiz: {
    icon: Brain,
    title: 'Discover Your Patterns',
    description: 'Take our behavioral assessment to understand your unique psychological profile',
    buttonText: 'Start Quiz',
    buttonLink: '/quizzes',
    gradient: 'from-purple-100 to-blue-100',
    buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white'
  },
  newsletter: {
    icon: Mail,
    title: 'Weekly Insights',
    description: 'Get research-backed psychology insights delivered to your inbox',
    buttonText: 'Subscribe',
    buttonLink: '#newsletter',
    gradient: 'from-green-100 to-emerald-100',
    buttonClass: 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
  },
  article: {
    icon: BookOpen,
    title: 'Explore More',
    description: 'Discover articles on behavioral psychology and personal growth',
    buttonText: 'Browse Articles',
    buttonLink: '/blog',
    gradient: 'from-blue-100 to-indigo-100',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  premium: {
    icon: TrendingUp,
    title: 'Go Premium',
    description: 'Unlock advanced insights and personalized recommendations',
    buttonText: 'Upgrade Now',
    buttonLink: '/pricing',
    gradient: 'from-yellow-100 to-orange-100',
    buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white'
  }
};

export function SidebarAd({ type = 'quiz', className = '' }: SidebarAdProps) {
  const config = adConfigs[type];
  const Icon = config.icon;

  return (
    <Card className={`border-0 shadow-lg ${className}`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">
            {type === 'newsletter' ? 'Sponsored' : 'Advertisement'}
          </div>
          <div className={`bg-gradient-to-br ${config.gradient} rounded-lg p-6 text-center`}>
            <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Icon className="w-6 h-6 text-gray-700" />
            </div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              {config.title}
            </div>
            <div className="text-xs text-gray-600 mb-4">
              {config.description}
            </div>
            <Link href={config.buttonLink}>
              <Button 
                size="sm" 
                className={config.buttonClass}
                variant={type === 'newsletter' ? 'outline' : 'default'}
              >
                {config.buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Rotating ad component that cycles through different ad types
export function RotatingAd({ className = '' }: { className?: string }) {
  const adTypes: Array<'quiz' | 'newsletter' | 'article' | 'premium'> = ['quiz', 'newsletter', 'article', 'premium'];
  const randomType = adTypes[Math.floor(Math.random() * adTypes.length)];
  
  return <SidebarAd type={randomType} className={className} />;
}
