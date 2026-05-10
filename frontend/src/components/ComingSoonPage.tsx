import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function ComingSoonPage({ title, subtitle, icon: Icon }: ComingSoonPageProps) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="traveloop-button-secondary mb-8"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="space-y-8">
        <div>
          <h1 className="font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 sm:text-base">{subtitle}</p>
        </div>

        <div className="traveloop-card flex min-h-[320px] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-[#EF9F27] dark:bg-amber-400/10">
            <Icon size={30} />
          </div>
          <h2 className="font-sora text-xl font-semibold text-[#1C1917] dark:text-stone-100">
            Coming Soon
          </h2>
          <p className="mt-2 max-w-md text-sm text-stone-600 dark:text-stone-300">
            This Traveloop workspace is being prepared for your next journey.
          </p>
        </div>
      </div>
    </div>
  );
}
