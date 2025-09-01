'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from './Container';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from './ui/Button';

const links = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/blog', label: 'Blog', icon: '📖' },
  { href: '/quizzes', label: 'Quizzes', icon: '📊' },
  { href: '/dashboard', label: 'Dashboard', icon: '📈' },
  { href: '/admin', label: 'Admin', icon: '⚙️' },
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center space-x-2 font-bold text-xl text-primary hover:text-primary/80 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform duration-200">
              🧠
            </div>
            <span className="text-gradient">mybeing</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive 
                      ? 'text-primary bg-primary/10 shadow-soft' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }
                  `}
                >
                  <span className="flex items-center space-x-1">
                    <span className="text-xs">{link.icon}</span>
                    <span>{link.label}</span>
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="w-px h-6 bg-border" />
            
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : session?.user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground hidden lg:block">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button
                variant="gradient"
                size="sm"
                onClick={() => signIn()}
                className="shadow-glow hover:shadow-glow-lg"
              >
                <span className="mr-1">✨</span>
                Sign in
              </Button>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
