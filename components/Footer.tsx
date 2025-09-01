import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-gradient-to-r from-slate-50/50 to-white/50 backdrop-blur-sm py-12 mt-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                🧠
              </div>
              <span className="text-xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                mybeing
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Discover patterns in your thoughts, behaviors, and personal growth through research-backed assessments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/quizzes" className="hover:text-primary transition-colors duration-200">All Quizzes</a></li>
              <li><a href="/dashboard" className="hover:text-primary transition-colors duration-200">Dashboard</a></li>
              <li><a href="/progress" className="hover:text-primary transition-colors duration-200">Progress</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/privacy" className="hover:text-primary transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-primary transition-colors duration-200">Terms of Service</a></li>
              <li><a href="/research" className="hover:text-primary transition-colors duration-200">Research Ethics</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} mybeing. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center">
              <span className="mr-2">🔒</span>
              Privacy First
            </span>
            <span className="flex items-center">
              <span className="mr-2">🔬</span>
              Research Backed
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
