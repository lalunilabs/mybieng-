import React from 'react';
import { Card } from '@/components/ui/Card';
import { MessageSquare } from 'lucide-react';

/**
 * Testimonial Placeholder Component
 * Ready for future testimonials integration
 * Currently displays a message about collecting authentic feedback
 */

export function TestimonialPlaceholder() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Real Stories, Real Growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're collecting authentic feedback from our community to share meaningful transformation stories.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 text-center border-dashed">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Authentic testimonials from our growing community will be shared here.
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Want to share your experience? We'll reach out to early users for feedback.
          </p>
        </div>
      </div>
    </section>
  );
}

// Testimonial data structure for future use
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  quizTaken: string;
  date: string;
  verified: boolean;
}

// Placeholder data structure
export const testimonialSchema = {
  name: "string",
  email: "string", // for verification
  content: "string",
  quiz_type: "string",
  rating: "number (1-5)",
  consent: "boolean",
  created_at: "timestamp"
};
