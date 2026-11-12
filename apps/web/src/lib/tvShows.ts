import {
  buildRatingShelves,
  hydrateRatingEntries,
  type RatingCollectionCopy,
} from './ratings';

export const TV_SHOWS_PATH = '/tv-shows';
export const TV_SHOWS_DEFAULT_ICON = 'fa-solid fa-tv';

export const TV_SHOWS_PAGE_COPY: RatingCollectionCopy = {
  title: 'TV Shows',
  subtitle: 'Shows Alfred keeps saving for a quiet evening',
  allDescription: 'Every show I have rated or queued, across every genre.',
  subjectIndexLabel: 'TV genres',
  watchedTitle: 'Watched',
  watchedEmpty: 'No shows watched here yet.',
  queuedTitle: 'Want to watch',
  queuedEmpty: 'Titles I have not seen yet.',
  searchDescription:
    'Fictional TV shows from Bruce Wayne’s off-duty watchlist.',
  itemSingular: 'show',
  itemPlural: 'shows',
};

export const TV_SHOWS = hydrateRatingEntries([
  {
    title: 'Gotham Rooftop Society',
    genre: 'Mystery',
    rating: 4,
    review:
      'An imaginary neighborhood mystery. Good rooftops, questionable ladder safety.',
  },
  {
    title: 'Keeping Up with the Waynes',
    genre: 'Comedy',
    rating: 3,
    review:
      'A fictional sitcom about a billionaire who is never home. The butler should have top billing.',
  },
  {
    title: 'Lucius Explains It Again',
    genre: 'Documentary',
    status: 'queued',
  },
]);

const collection = buildRatingShelves({
  entries: TV_SHOWS,
  copy: TV_SHOWS_PAGE_COPY,
  icon: TV_SHOWS_DEFAULT_ICON,
  path: TV_SHOWS_PATH,
});

export const TV_SHOW_NAV_SHELVES = collection.navShelves;
export const ACTIVE_TV_SHOW_CATEGORIES = collection.categories;
export const getTvShowCategoryPath = collection.getPath;
export const getTvShowShelf = collection.getShelf;
