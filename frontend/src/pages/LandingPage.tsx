import { ArrowRight, Backpack, CalendarDays, Github, Map, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config/app.config';

const heroImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      {/* Odoo style sleek header */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-[#714B67] text-white">
              <Plane size={20} />
            </div>
            <span className="font-sora text-xl font-bold tracking-tight text-[#111827]">Traveloop</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={config.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-stone-500 transition hover:text-[#714B67] sm:block"
              title="View on GitHub"
            >
              <Github size={20} />
            </a>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-[#111827] hover:text-[#714B67] transition-colors"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="rounded bg-[#714B67] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#5D3E55]"
            >
              Start now. It's free
            </button>
          </div>
        </div>
      </header>

      {/* Odoo style hero section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center lg:px-12 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2000')] bg-cover bg-center opacity-5 saturate-0"></div>
        <div className="max-w-4xl">
          <h1 className="font-sora text-6xl font-extrabold tracking-tight text-[#111827] sm:text-7xl lg:text-8xl">
            Unleash your <br/>
            <span className="text-[#714B67]">travel potential.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-stone-600">
            Your intelligent travel companion for planning trips, discovering destinations, organizing itineraries, and tracking budgets in one unified workspace.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center rounded bg-[#714B67] px-8 py-3.5 text-base font-semibold text-white transition hover:bg-[#5D3E55] shadow-lg shadow-[#714B67]/20"
            >
              Start Planning
              <ArrowRight size={18} className="ml-2" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center rounded border border-stone-200 bg-white px-8 py-3.5 text-base font-semibold text-[#111827] transition hover:bg-stone-50 hover:border-stone-300 shadow-sm"
            >
              Open Dashboard
            </button>
          </div>
          <p className="mt-6 text-sm text-stone-500">Free forever for personal use. No credit card required.</p>
        </div>
      </section>

      {/* Odoo style features grid */}
      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-16 text-center">
             <h2 className="font-sora text-4xl font-bold tracking-tight text-[#111827]">Everything you need to travel smart.</h2>
             <p className="mt-4 text-lg text-stone-600">A fully integrated suite of travel tools.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Map, title: 'Destination Discovery', text: 'Search cities and activities while keeping trip ideas meticulously organized in a clean interface.' },
              { icon: CalendarDays, title: 'Smart Itineraries', text: 'Turn dates, stops, and notes into a clear, beautiful day-by-day plan that you can access anywhere.' },
              { icon: Backpack, title: 'Packing & Budgets', text: 'Track essentials, record expenses, and attach invoices before you even leave your house.' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-md border border-stone-200 bg-white p-8 transition hover:shadow-xl hover:shadow-stone-200/50">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-[#714B67]/10 text-[#714B67]">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 font-sora text-xl font-bold text-[#111827]">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
