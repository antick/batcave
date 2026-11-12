import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import SearchBox from './SearchBox';
import { BRAND_LOGOS } from '../lib/brand';
import { SITE_NAME } from '../lib/constants';
import {
  SITE_NAV_ITEMS,
  type ActivePage,
  type NavItem,
} from '../lib/navigation';

interface Props {
  activePage?: ActivePage;
  siteNavItems?: NavItem[];
}

export default function SiteNav({
  activePage,
  siteNavItems = SITE_NAV_ITEMS,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="deck-nav"
      aria-label="Site navigation"
      data-open={isOpen || undefined}
    >
      <a className="site-logo-link" href="/" aria-label={`${SITE_NAME} home`}>
        <img
          className="site-logo site-logo-dark"
          src={BRAND_LOGOS.dark}
          alt=""
          width="26"
          height="26"
        />
        <img
          className="site-logo site-logo-light"
          src={BRAND_LOGOS.light}
          alt=""
          width="26"
          height="26"
        />
      </a>

      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label="Open site menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <i className="fa-solid fa-bars" aria-hidden="true" />
        <span>Menu</span>
      </button>

      <div className="deck-nav-menu">
        {siteNavItems.map((item) => {
          const isActive = item.id === activePage;
          return (
            <div key={item.id} className="deck-nav-item">
              <a
                href={item.href}
                className={`deck-nav-btn deck-nav-link${isActive ? ' active' : ''}`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <i className={item.icon} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            </div>
          );
        })}
      </div>

      <div className="deck-nav-sep" aria-hidden="true" />
      <SearchBox />
      <ThemeSwitcher inline />
    </nav>
  );
}
