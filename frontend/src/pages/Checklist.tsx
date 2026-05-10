import { Backpack } from 'lucide-react';
import ComingSoonPage from '../components/ComingSoonPage';

export default function Checklist() {
  return (
    <ComingSoonPage
      title="Packing Checklist"
      subtitle="Keep essentials, documents, outfits, and gear organized before departure."
      icon={Backpack}
    />
  );
}
