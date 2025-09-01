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
    <Card hover className="overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2" />
      
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            {category}
          </span>
          <span className="text-sm text-gray-500">
            {duration} • {questions} questions
          </span>
        </div>
        
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isInProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex gap-3">
          {isInProgress ? (
            <Button onClick={onContinue} className="flex-1">
              Continue Assessment
            </Button>
          ) : isCompleted ? (
            <Button onClick={onStart} variant="outline" className="flex-1">
              Retake Assessment
            </Button>
          ) : (
            <Button onClick={onStart} className="flex-1">
              Start Assessment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
