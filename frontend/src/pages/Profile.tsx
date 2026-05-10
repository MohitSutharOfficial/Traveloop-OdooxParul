import { Calendar, Compass, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  const fullName =
    user?.user_metadata?.full_name ||
    [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(' ') ||
    'Traveler';
  const email = user?.email || 'traveler@example.com';
  const initials = fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join('');
  const location = [user?.user_metadata?.city, user?.user_metadata?.country].filter(Boolean).join(', ') || 'Add your home base';

  const details = [
    { label: 'Email Address', value: email, icon: Mail },
    { label: 'Phone Number', value: user?.user_metadata?.phone || 'Add phone number', icon: Phone },
    { label: 'Home Base', value: location, icon: MapPin },
    { label: 'Travel Style', value: user?.user_metadata?.travel_style || 'Adventure', icon: Compass },
    {
      label: 'Member Since',
      value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
      icon: Calendar,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-2 py-4 sm:px-4">
      <div>
        <h1 className="font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100">Profile</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
          Keep your traveler details ready for faster trip planning.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <Card>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#EF9F27] text-3xl font-bold text-white">
              {initials || 'TL'}
            </div>
            <h2 className="font-sora text-xl font-semibold text-[#1C1917] dark:text-stone-100">{fullName}</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{location}</p>
            <Button variant="secondary" className="mt-5 w-full">
              Change Avatar
            </Button>
          </div>
        </Card>

        <Card>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-[#EF9F27] dark:bg-amber-400/10">
                <UserRound size={20} />
              </div>
              <div>
                <h3 className="font-sora text-lg font-semibold text-[#1C1917] dark:text-stone-100">
                  Traveler Information
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300">Personal details for your Traveloop account.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {details.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-[12px] border border-[#E8E6E0] bg-[#F5F4F0] p-4 dark:border-stone-700 dark:bg-stone-800/70">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 text-[#EF9F27]" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                          {item.label}
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-[#1C1917] dark:text-stone-100">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[#E8E6E0] pt-5 dark:border-stone-700">
              <Button variant="primary">Edit Profile</Button>
              <Button variant="secondary">Change Password</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
