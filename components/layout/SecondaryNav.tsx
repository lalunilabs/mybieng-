'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const secondaryNavItems = [
  { href: '/blog', label: 'Articles', parent: '/blog' },
  { href: '/quizzes', label: 'Assessments', parent: '/quizzes' },
  { href: '/research', label: 'Research', parent: '/research' },
];

export function SecondaryNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <div className="bg-white/95 supports-[backdrop-filter]:backdrop-blur-xl border-b border-slate-100 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-12 gap-8">
          {secondaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative inline-flex items-center text-sm font-medium tracking-tight transition-all duration-200 group ${
                isActive(item.href)
                  ? 'text-purple-600'
                  : 'text-slate-600 hover:text-purple-600 focus-visible:text-purple-600'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.div
                  layoutId="secondary-nav-indicator"
                  className="absolute -bottom-3 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-purple-500 via-purple-500 to-pink-500"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="pointer-events-none absolute -bottom-3 left-0 right-0 h-0.5 rounded-full bg-purple-200 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
