import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Blog } from '@/data/blogs';

export default function PostCard({ post }: { post: Blog }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card variant="elevated" className="h-full overflow-hidden shadow-soft hover:shadow-brutal transition-all">
        {/* Image / Fallback */}
        <div className="relative h-44 w-full overflow-hidden">
          {post.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15" />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/80 text-foreground border border-border">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl leading-snug group-hover:text-primary">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
            <span>{post.readTime} min</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
