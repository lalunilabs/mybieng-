'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Users, TrendingUp, Award, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-black rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Research & Evidence
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Science-Based
            <span className="block text-gradient bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Self-Discovery
            </span>
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            Our assessments and insights are grounded in peer-reviewed research from psychology, neuroscience, and behavioral science.
          </p>
        </motion.div>

        {/* Research Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white border-purple-200 shadow-soft text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-black font-medium">Research Papers</div>
              <div className="text-sm text-black mt-1">Peer-reviewed studies</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-purple-200 shadow-soft text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">10k+</div>
              <div className="text-black font-medium">Participants</div>
              <div className="text-sm text-black mt-1">In validation studies</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-purple-200 shadow-soft text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-black font-medium">Accuracy Rate</div>
              <div className="text-sm text-black mt-1">In personality assessments</div>
            </CardContent>
          </Card>
        </div>

        {/* Research Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <span>🧠</span>
                Cognitive Psychology
              </CardTitle>
              <CardDescription className="text-black">
                Understanding how people process information and make decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-black">
                <li>• Cognitive bias identification and mitigation</li>
                <li>• Decision-making pattern analysis</li>
                <li>• Information processing styles</li>
                <li>• Memory and learning preferences</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <span>💭</span>
                Behavioral Science
              </CardTitle>
              <CardDescription className="text-black">
                Exploring patterns in human behavior and habit formation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-black">
                <li>• Habit formation and change mechanisms</li>
                <li>• Motivation and goal-setting patterns</li>
                <li>• Social influence and conformity</li>
                <li>• Stress response and coping strategies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <span>🎯</span>
                Personality Research
              </CardTitle>
              <CardDescription className="text-black">
                Evidence-based personality trait measurement and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-black">
                <li>• Big Five personality dimensions</li>
                <li>• Emotional intelligence assessment</li>
                <li>• Values and belief system mapping</li>
                <li>• Interpersonal style analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <span>📊</span>
                Data Science
              </CardTitle>
              <CardDescription className="text-black">
                Advanced analytics and machine learning for personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-black">
                <li>• Pattern recognition algorithms</li>
                <li>• Predictive modeling for growth</li>
                <li>• Personalization engines</li>
                <li>• Statistical validation methods</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-yellow-100 to-purple-100 border-purple-200 max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold text-black mb-4">
                Experience Research-Backed Self-Discovery
              </h3>
              <p className="text-black mb-6">
                Take our scientifically validated assessments and discover insights backed by decades of research.
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                asChild
              >
                <Link href="/quizzes">
                  Start Your Assessment
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
