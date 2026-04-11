import HeroSection from '@/components/HeroSection';
import MawaqitWidget from '@/components/MawaqitWidget';
import DailyReminder from '@/components/DailyReminder';
import NewsSection from '@/components/NewsSection';
import QuickLinks from '@/components/QuickLinks';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Mawaqit + Daily Reminder Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mawaqit Widget - 2/3 */}
          <div className="lg:col-span-2">
            <MawaqitWidget />
          </div>

          {/* Daily Reminder - 1/3 */}
          <DailyReminder />
        </div>
      </section>

      <QuickLinks />
      <NewsSection />
    </div>
  );
}
