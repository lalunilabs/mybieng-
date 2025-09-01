import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import type { Blog } from '@/data/blogs';

export default function FeaturedPost({ post }: { post: Blog }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card variant="elevated" className="overflow-hidden border-2 border-foreground/10 bg-paper shadow-brutal hover:shadow-brutal-lg transition-all">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 md:h-full">
            {post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-yellow-300/20 to-primary/20" />
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              {post.isPremium && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Premium</span>
              )}
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/80 text-foreground border border-border">{post.readTime} min</span>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 group-hover:text-primary">
              {post.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 line-clamp-4">{post.excerpt}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </span>
              <span>•</span>
              <span>By {post.author}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
