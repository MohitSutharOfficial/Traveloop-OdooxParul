import { CalendarDays } from 'lucide-react';
import ComingSoonPage from '../components/ComingSoonPage';

export default function Itinerary() {
  return (
    <ComingSoonPage
      title="Itinerary Builder"
      subtitle="Plan your daily activities, stays, transfers, and must-see stops."
      icon={CalendarDays}
    />
  );
}
