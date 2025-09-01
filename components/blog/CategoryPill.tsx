import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CategoryPill({
  label,
  href,
  selected,
}: {
  label: string;
  href: string;
  selected?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium transition-colors',
        selected
          ? 'bg-primary text-primary-foreground border-primary shadow-brutal'
          : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
      )}
    >
      {label}
    </Link>
  );
}
