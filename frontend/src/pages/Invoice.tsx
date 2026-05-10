import { Receipt } from 'lucide-react';
import ComingSoonPage from '../components/ComingSoonPage';

export default function Invoice() {
  return (
    <ComingSoonPage
      title="Expense Invoice"
      subtitle="Track bookings, split costs, and export travel expense summaries."
      icon={Receipt}
    />
  );
}
