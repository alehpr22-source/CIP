import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeaturesSection } from '@/components/FeaturesSection';
import { HeroSection } from '@/components/HeroSection';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 pt-16 md:pt-20'>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
