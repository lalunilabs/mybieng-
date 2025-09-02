'use client';

import { useEngagementTracker } from '@/hooks/useEngagementTracker';
import NewsletterModal from '@/components/NewsletterModal';

export default function EngagementProvider({ children }: { children: React.ReactNode }) {
  const { showNewsletterModal, closeNewsletterModal } = useEngagementTracker();

  return (
    <>
      {children}
      <NewsletterModal 
        isOpen={showNewsletterModal} 
        onClose={closeNewsletterModal} 
      />
    </>
  );
}
