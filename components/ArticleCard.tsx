import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type Props = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags?: string[];
};

export default function ArticleCard({ slug, title, excerpt, date, tags = [] }: Props) {
  return (
    <Card variant="elevated" hover className="group h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300 shadow-soft">
            📚
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            {new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
        
        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
          <Link href={`/blog/${slug}`} className="hover:no-underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
          {excerpt}
        </p>
        
        <div className="space-y-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <Link href={`/blog/${slug}`} className="block">
            <div className="flex items-center text-primary font-medium text-sm group-hover:text-primary/80 transition-colors duration-200">
              <span className="mr-2">Read Article</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
