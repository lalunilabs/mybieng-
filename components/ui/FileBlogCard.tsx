import Link from 'next/link';

interface FileBlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  categoryCount: number;
  isPremium?: boolean;
}

export default function FileBlogCard({
  title,
  slug,
  excerpt,
  category,
  categoryCount,
  isPremium,
}: FileBlogCardProps) {
  return (
    <article
      className="flex w-full max-w-xs bg-white border border-border rounded-xl transition-all duration-200 hover:shadow-[10px_10px_30px_rgba(0,0,0,0.08)]"
      aria-label={title}
    >
      {/* Vertical category rail */}
      <div className="flex flex-col items-center py-2 px-2" aria-hidden="true">
        <div
          className="text-xs font-bold uppercase tracking-wide text-gray-900"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {category}
        </div>
        <div className="w-px flex-1 bg-gray-200 my-2" />
        <div
          className="text-[10px] font-semibold text-gray-500"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {categoryCount} total
        </div>
      </div>

      {/* Separator */}
      <div className="w-px bg-gray-200" role="presentation" aria-hidden="true" />

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-[18.72px] font-bold uppercase text-gray-900 line-clamp-2">{title}</h3>
          <p className="mt-2 text-sm leading-5 text-gray-600 line-clamp-5">{excerpt}</p>
        </div>
        <div className="mt-4">
          <Link
            href={`/blog/${slug}`}
            className="block text-center text-xs font-bold uppercase text-gray-900 bg-yellow-300 hover:bg-yellow-400 rounded-md py-3 px-5 transition-colors"
            aria-label={`Read article: ${title}`}
            prefetch
          >
            Read Article
          </Link>
        </div>
      </div>
    </article>
  );
}
