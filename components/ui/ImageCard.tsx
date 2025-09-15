'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useGeneratedImage } from '@/components/hooks/useGeneratedImage';

interface ImageCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  author?: string;
  date?: string;
  readTime?: string;
  href: string;
  category?: string;
  isPremium?: boolean;
  className?: string;
}

export default function ImageCard({
  title,
  description,
  imageUrl,
  author = 'Dr N',
  date,
  readTime,
  href,
  category,
  isPremium = false,
  className = ''
}: ImageCardProps) {
  const [imageError, setImageError] = useState(false);

  const defaultImage = `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center&auto=format&q=80`;
  const shouldGenerate = !imageUrl;
  const prompt = `Editorial, minimal, research-backed magazine cover for article titled "${title}" in category ${category || 'General'}. Soft pastel lighting, abstract shapes, no people, clean typography backdrop, high quality, professional.`;
  const { src: generated, enabled } = useGeneratedImage(prompt, '4:3');
  const resolvedSrc = (!imageError && (imageUrl || (enabled && shouldGenerate && generated))) || defaultImage;
  
  const categoryColors = {
    'Understanding Yourself': 'bg-purple-100 text-purple-700',
    'Understanding Surroundings': 'bg-yellow-100 text-yellow-700',
    'Research': 'bg-blue-100 text-blue-700',
    'Quiz': 'bg-green-100 text-green-700'
  };

  return (
    <Card className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border-purple-200 overflow-hidden ${className}`}>
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={resolvedSrc}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzI1MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPSIjZWVlZWZmIi8+PC9zdmc+"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700'}`}>
              {category}
            </span>
          </div>
        )}
        
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              Premium
            </span>
          </div>
        )}
        
        {/* Hover Action */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" className="bg-white/90 hover:bg-white text-purple-600 backdrop-blur-sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pb-3">
        <CardTitle className="text-black text-lg font-bold line-clamp-2 group-hover:text-purple-700 transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-black/70 line-clamp-3 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-black/60 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>{author}</span>
            </div>
            {date && (
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{date}</span>
              </div>
            )}
            {readTime && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{readTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link href={href} className="block">
          <Button 
            variant="outline" 
            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {category === 'Quiz' ? 'Take Quiz' : 'Read More'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
