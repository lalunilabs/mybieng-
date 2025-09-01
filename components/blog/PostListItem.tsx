import Link from 'next/link';
import type { Blog } from '@/data/blogs';

export default function PostListItem({ post }: { post: Blog }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="flex items-start gap-4 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
        <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0 border border-border bg-white">
          {post.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15" />
          )}
          {post.isPremium && (
            <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">⭐</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>
          <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
            <span>{post.readTime}m</span>
            <span>•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
