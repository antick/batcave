import { BLOG_INDEX_PATH } from './articleRoutes';
import { SHELF_NAV_ITEM } from './shelf';

export type ActivePage =
  | 'home'
  | 'about'
  | 'projects'
  | 'blog'
  | 'books'
  | 'shelf'
  | 'contact';

export interface NavItem {
  id: ActivePage;
  label: string;
  icon: string;
  href: string;
}

const CONTACT_NAV_ITEM: NavItem = {
  id: 'contact',
  label: 'Contact',
  icon: 'fa-solid fa-address-card',
  href: '/contact',
};

export const SITE_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'fa-solid fa-house-chimney', href: '/' },
  {
    id: 'blog',
    label: 'Blog',
    icon: 'fa-solid fa-pen-nib',
    href: BLOG_INDEX_PATH,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'fa-solid fa-folder-open',
    href: '/projects',
  },
  {
    id: 'books',
    label: 'Books',
    icon: 'fa-solid fa-book-open',
    href: '/books',
  },
  SHELF_NAV_ITEM,
  {
    id: 'about',
    label: 'About',
    icon: 'fa-solid fa-user-astronaut',
    href: '/about',
  },
];

const FOOTER_NAV_ITEM_IDS: ActivePage[] = ['home', 'about'];

export const FOOTER_LINKS = [
  ...SITE_NAV_ITEMS.filter((item) => FOOTER_NAV_ITEM_IDS.includes(item.id)),
  CONTACT_NAV_ITEM,
].map(({ href, label }) => ({ href, label }));
