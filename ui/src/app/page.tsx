import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsSection } from '@/components/landing/StatsSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ScreenshotsSection } from '@/components/landing/ScreenshotsSection'
import { GlobeSection } from '@/components/landing/GlobeSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { CTASection } from '@/components/landing/CTASection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans antialiased text-[var(--color-text-primary)] relative">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ScreenshotsSection />
        <GlobeSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
