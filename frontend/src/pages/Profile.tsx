import { Calendar, Compass, Mail, MapPin, Phone, UserRound, Loader2, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { profileService, Profile as UserProfile } from '../services/profile.service';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await profileService.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        preferred_travel_style: formData.preferred_travel_style,
      });
      setProfile(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
      </div>
    );
  }

  const fullName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user?.user_metadata?.full_name ||
    'Traveler';

  const email = user?.email || profile?.email || 'traveler@example.com';
  const initials = fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join('');
    
  const location = [profile?.city, profile?.country].filter(Boolean).join(', ') || 'Add your home base';

  const details = [
    { label: 'Email Address', value: email, icon: Mail, key: 'email', readOnly: true },
    { label: 'First Name', value: profile?.first_name || '', icon: UserRound, key: 'first_name' },
    { label: 'Last Name', value: profile?.last_name || '', icon: UserRound, key: 'last_name' },
    { label: 'Phone Number', value: profile?.phone || '', icon: Phone, key: 'phone' },
    { label: 'City', value: profile?.city || '', icon: MapPin, key: 'city' },
    { label: 'Country', value: profile?.country || '', icon: MapPin, key: 'country' },
    { label: 'Travel Style', value: profile?.preferred_travel_style || '', icon: Compass, key: 'preferred_travel_style' },
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
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#714B67] text-3xl font-bold text-white shadow-md">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-50 text-[#714B67] dark:bg-fuchsia-400/10">
                  <UserRound size={20} />
                </div>
                <div>
                  <h3 className="font-sora text-lg font-semibold text-[#1C1917] dark:text-stone-100">
                    Traveler Information
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-300">Personal details for your Traveloop account.</p>
                </div>
              </div>
              {!isEditing && (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {details.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="rounded-[12px] border border-[#E8E6E0] bg-[#F5F4F0] p-4 dark:border-stone-700 dark:bg-stone-800/70">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 text-[#714B67]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                          {item.label}
                        </p>
                        {isEditing && !item.readOnly ? (
                          <input
                            type="text"
                            value={(formData[item.key as keyof UserProfile] as string) || ''}
                            onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                            className="traveloop-input mt-1 w-full text-sm p-1.5"
                            placeholder={item.label}
                          />
                        ) : (
                          <p className="mt-1 truncate text-sm font-semibold text-[#1C1917] dark:text-stone-100">
                            {item.value || <span className="text-stone-400 font-normal italic">Not set</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {isEditing && (
              <div className="flex flex-wrap gap-3 border-t border-[#E8E6E0] pt-5 dark:border-stone-700">
                <Button variant="primary" onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => {
                  setIsEditing(false);
                  setFormData(profile || {});
                }} disabled={saving} className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
