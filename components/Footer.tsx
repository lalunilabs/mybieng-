import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-purple-200/50 bg-gradient-to-r from-yellow-50 to-purple-50 backdrop-blur-sm py-12 mt-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-white text-sm">
                🧠
              </div>
              <span className="text-xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                MyBeing
              </span>
            </div>
            <p className="text-black leading-relaxed max-w-md">
              Discover patterns in your thoughts, behaviors, and personal growth through research-backed assessments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-black mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-black">
              <li><a href="/" className="hover:text-purple-600 transition-colors duration-200">Home</a></li>
              <li><a href="/blog" className="hover:text-purple-600 transition-colors duration-200">Articles</a></li>
              <li><a href="/quizzes" className="hover:text-purple-600 transition-colors duration-200">Quizzes</a></li>
              <li><a href="/research" className="hover:text-purple-600 transition-colors duration-200">Research</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-black mb-4">About</h3>
            <ul className="space-y-2 text-sm text-black">
              <li><a href="/about" className="hover:text-purple-600 transition-colors duration-200">About Dr N</a></li>
              <li><a href="/admin" className="hover:text-purple-600 transition-colors duration-200">Admin</a></li>
              <li><a href="/privacy" className="hover:text-purple-600 transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-purple-600 transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-purple-200/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-black">
            © {new Date().getFullYear()} MyBeing by Dr N. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-black">
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
