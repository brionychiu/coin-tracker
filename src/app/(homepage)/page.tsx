import Navbar from '@/components/layout/Navbar';
import { HomeHero } from '@/components/section/HomeHero';
import { HomeIntro } from '@/components/section/HomeIntro';

export default function HomePage() {
  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)]">
      <header>
        <Navbar />
      </header>
      <main className="flex flex-grow flex-col">
        <HomeHero />
        <HomeIntro />
      </main>
    </div>
  );
}
