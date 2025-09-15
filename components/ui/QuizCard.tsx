import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';

interface QuizCardProps {
  title: string;
  description: string;
  category: string;
  duration: string;
  questions: number;
  progress?: number;
  onStart?: () => void;
  onContinue?: () => void;
}

export function QuizCard({
  title,
  description,
  category,
  duration,
  questions,
  progress = 0,
  onStart = () => {},
  onContinue,
}: QuizCardProps) {
  const isCompleted = progress === 100;
  const isInProgress = progress > 0 && progress < 100;

  return (
    <Card hover className="overflow-hidden border border-lilac-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="bg-gradient-to-r from-lilac-400 to-lilac-300 h-2 rounded-t-2xl" />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-lilac-700 bg-lilac-100 px-2.5 py-1 rounded-full">
            {category}
          </span>
          <span className="text-xs text-gray-500">
            {duration} • {questions} Qs
          </span>
        </div>
        
        <CardTitle className="text-lg font-bold text-gray-900 mb-2">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isInProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} variant="premium" size="sm" />
          </div>
        )}

        <div className="flex gap-2">
          {isInProgress ? (
            <Button onClick={onContinue} variant="premium" size="md" className="flex-1 text-sm font-medium rounded-xl">
              Continue
            </Button>
          ) : isCompleted ? (
            <Button onClick={onStart} variant="outline" size="md" className="flex-1 text-sm font-medium rounded-xl border-2">
              Retake
            </Button>
          ) : (
            <Button onClick={onStart} variant="premium" size="md" className="flex-1 text-sm font-medium rounded-xl">
              Start
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
