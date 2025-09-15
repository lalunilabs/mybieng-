'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Brain, Globe, Users } from 'lucide-react';

interface CategorySelectorProps {
  onCategorySelect: (categories: string[]) => void;
}

export default function CategorySelector({ onCategorySelect }: CategorySelectorProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    {
      id: 'understanding-yourself',
      title: 'Understanding Yourself',
      description: 'Explore your inner patterns, behaviors, and psychological makeup',
      icon: Brain,
      color: 'from-purple-100 to-purple-200'
    },
    {
      id: 'understanding-surroundings',
      title: 'Understanding Your Surroundings',
      description: 'Analyze your environment, relationships, and external influences',
      icon: Globe,
      color: 'from-yellow-100 to-yellow-200'
    },
    {
      id: 'both',
      title: 'Complete Self-Discovery',
      description: 'Full access to both categories for comprehensive insights',
      icon: Users,
      color: 'from-yellow-100 to-purple-200'
    }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    if (categoryId === 'both') {
      setSelectedCategories(['both']);
    } else {
      const newCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId && id !== 'both')
        : [...selectedCategories.filter(id => id !== 'both'), categoryId];
      setSelectedCategories(newCategories);
    }
  };

  const handleContinue = () => {
    onCategorySelect(selectedCategories);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-4">Choose Your Path of Discovery</h2>
        <p className="text-lg text-black">
          Select the areas you'd like to explore with Dr N's research-backed content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 border-2 ${
                isSelected 
                  ? 'border-purple-400 shadow-lg transform scale-105' 
                  : 'border-purple-200 hover:border-purple-300'
              } bg-gradient-to-br ${category.color}`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <Icon className={`w-12 h-12 ${isSelected ? 'text-purple-600' : 'text-purple-500'}`} />
                </div>
                <CardTitle className="text-black text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-black text-center">
                  {category.description}
                </CardDescription>
                {isSelected && (
                  <div className="mt-4 text-center">
                    <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                      Selected ✓
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="text-center">
          <Button
            onClick={handleContinue}
            variant="gradient"
            className="px-8 py-3 text-lg"
          >
            Continue to Content
          </Button>
        </div>
      )}
    </div>
  );
}
