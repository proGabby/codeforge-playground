import React from 'react';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { FeedbackLoopSection } from './FeedbackLoopSection';
import { CurriculumRoadmapSection } from './CurriculumRoadmapSection';
import { CalloutBanner } from './CalloutBanner';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onEnterPlayground: (lang?: 'go' | 'python') => void;
  onOpenEmailModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterPlayground,
  onOpenEmailModal,
}) => {
  const scrollToCurriculum = () => {
    const el = document.getElementById('curriculum');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0E14] text-[#F2F4F8] selection:bg-[#3B82F6]/30 selection:text-white font-sans overflow-x-hidden">
      <LandingNav
        onEnterPlayground={onEnterPlayground}
        onOpenEmailModal={onOpenEmailModal}
      />

      <main className="space-y-6 sm:space-y-10">
        <HeroSection
          onEnterPlayground={() => onEnterPlayground()}
          onScrollToCurriculum={scrollToCurriculum}
        />

        <FeedbackLoopSection />

        <CurriculumRoadmapSection onEnterPlayground={onEnterPlayground} />

        <CalloutBanner onOpenEmailModal={onOpenEmailModal} />
      </main>

      <LandingFooter onEnterPlayground={onEnterPlayground} />
    </div>
  );
};
