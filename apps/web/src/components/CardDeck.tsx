import SiteNav from './SiteNav';
import type { NavItem } from '../lib/navigation';

interface CardDeckProps {
  siteNavItems?: NavItem[];
  children?: React.ReactNode;
}

export default function CardDeck({ siteNavItems, children }: CardDeckProps) {
  return (
    <div className="deck-scene">
      <SiteNav activePage="home" siteNavItems={siteNavItems} />

      <main className="deck-wrapper">
        <div className="deck-stack">
          <div className="deck-card">{children}</div>
        </div>
      </main>
    </div>
  );
}
