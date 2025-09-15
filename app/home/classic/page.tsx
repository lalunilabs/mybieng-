import HeroSection from '@/components/landing/HeroSection';
import PressBar from '@/components/landing/PressBar';
import NewThisWeek from '@/components/landing/NewThisWeek';
import FeaturedBlogs from '@/components/landing/FeaturedBlogs';
import FeaturedQuizzes from '@/components/landing/FeaturedQuizzes';
import BrowseLatest from '@/components/landing/BrowseLatest';
import Newsletter from '@/components/Newsletter';
import BentoGrid from '@/components/landing/BentoGrid';

const SHOW_PRESS = process.env.NEXT_PUBLIC_SHOW_PRESS === 'true';

export default function ClassicHomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {SHOW_PRESS && <PressBar />}
      <NewThisWeek />
      <BentoGrid />
      <FeaturedQuizzes />
      <FeaturedBlogs />
      <BrowseLatest />
      <Newsletter />
    </div>
  );
}
