import { ArrowRight, Backpack, CalendarDays, Github, Map, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config/app.config';

const heroImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1C1917]">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-amber-50 text-[#EF9F27]">
              <Plane size={22} />
            </div>
            <span className="font-sora text-xl font-bold text-[#EF9F27]">Traveloop</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={config.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-[10px] p-2 text-stone-600 transition hover:bg-[#F5F4F0] hover:text-[#EF9F27] sm:inline-flex"
              title="View on GitHub"
            >
              <Github size={20} />
            </a>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="traveloop-button-secondary px-4 py-2 text-sm"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="traveloop-button-primary px-4 py-2 text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <section className="relative min-h-[82vh] overflow-hidden">
        <img src={heroImage} alt="Scenic road trip destination" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/80 via-[#1C1917]/45 to-transparent" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="font-sora text-5xl font-bold leading-tight sm:text-7xl">Traveloop</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">
              Your intelligent travel companion for planning trips, discovering destinations,
              organizing itineraries, and tracking budgets in one calm workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="traveloop-button-primary"
              >
                Start Planning
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-white/40 bg-white/10 px-5 py-2.5 font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          { icon: Map, title: 'Destination Discovery', text: 'Search cities and activities while keeping trip ideas organized.' },
          { icon: CalendarDays, title: 'Smart Itineraries', text: 'Turn dates, stops, and notes into a clear day-by-day plan.' },
          { icon: Backpack, title: 'Packing & Budgets', text: 'Track essentials, expenses, and invoices before you leave.' },
        ].map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="traveloop-card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-[#EF9F27]">
                <Icon size={22} />
              </div>
              <h2 className="font-sora text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{feature.text}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
