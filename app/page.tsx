import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import FeaturedQuizzes from '@/components/landing/FeaturedQuizzes';
import FeaturedBlogs from '@/components/landing/FeaturedBlogs';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <FeaturedQuizzes />
      <FeaturedBlogs />
    </div>
  );
}
