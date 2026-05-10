import { BookOpen } from 'lucide-react';
import ComingSoonPage from '../components/ComingSoonPage';

export default function Notes() {
  return (
    <ComingSoonPage
      title="Trip Notes"
      subtitle="Save ideas, confirmations, reminders, and local tips for every trip."
      icon={BookOpen}
    />
  );
}
