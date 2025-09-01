'use client';

import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QuizCard } from '@/components/ui/QuizCard';
import { Progress } from '@/components/ui/Progress';

export default function DesignSystemPage() {
  return (
    <Layout title="Design System" description="MyBeing's comprehensive design system and component library">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Primary, secondary, and functional colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Primary Purple</h4>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 300, 600, 900].map((shade) => (
                    <div
                      key={shade}
                      className={`h-12 w-full rounded bg-purple-${shade}`}
                      title={`purple-${shade}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sage Green</h4>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 300, 600, 900].map((shade) => (
                    <div
                      key={shade}
                      className={`h-12 w-full rounded bg-green-${shade}`}
                      title={`green-${shade}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Font styles and hierarchy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Display Large</h1>
                <p className="text-sm text-gray-600">32px/40px, Bold, -0.02em</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Headline Large</h2>
                <p className="text-sm text-gray-600">24px/32px, Semibold</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900">Title Large</h3>
                <p className="text-sm text-gray-600">18px/24px, Medium</p>
              </div>
              <div>
                <p className="text-base text-gray-900">Body Large - Primary reading text</p>
                <p className="text-sm text-gray-600">16px/24px, Regular</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Interactive button components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button>Primary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="secondary">Secondary Button</Button>
              </div>
              <div className="flex gap-3 items-center">
                <Button size="lg">Large Button</Button>
                <Button size="md">Medium Button</Button>
                <Button size="sm">Small Button</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress & Status</CardTitle>
            <CardDescription>Visual feedback components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Progress Bar</label>
                <Progress value={75} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Low Progress</label>
                <Progress value={25} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quiz Cards */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quiz Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuizCard
            title="Cognitive Dissonance Assessment"
            description="Explore contradictions between your values and actions"
            category="Psychology"
            duration="15 min"
            questions={20}
            progress={0}
          />
          
          <QuizCard
            title="Behavioral Patterns Analysis"
            description="Identify recurring patterns in your decision-making"
            category="Self-Awareness"
            duration="10 min"
            questions={15}
            progress={60}
          />
          
          <QuizCard
            title="Value-Action Alignment"
            description="Measure how well your actions align with your stated values"
            category="Personal Growth"
            duration="12 min"
            questions={18}
            progress={100}
          />
        </div>
      </div>

    </Layout>
  );
}
