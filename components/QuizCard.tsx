import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type Props = {
  slug: string;
  title: string;
  description: string;
};

export default function QuizCard({ slug, title, description }: Props) {
  return (
    <Card variant="elevated" hover className="group h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300 shadow-soft">
            🧠
          </div>
          <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
            Assessment
          </div>
        </div>
        
        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
          {description}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="mr-2">⏱️</span>
              <span>5-15 min</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🔄</span>
              <span>Retakeable</span>
            </div>
          </div>
          
          <Link href={`/quizzes/${slug}`} className="block">
            <Button 
              variant="gradient" 
              size="lg" 
              className="w-full group-hover:shadow-glow-lg transition-all duration-300"
            >
              <span className="mr-2">Start Quiz</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
