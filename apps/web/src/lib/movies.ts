import {
  buildRatingShelves,
  hydrateRatingEntries,
  type RatingCollectionCopy,
} from './ratings';

export const MOVIES_PATH = '/movies';
export const MOVIES_DEFAULT_ICON = 'fa-solid fa-clapperboard';

export const MOVIES_PAGE_COPY: RatingCollectionCopy = {
  title: 'Movies',
  subtitle: 'What I watch when Gotham gives me a night off',
  allDescription: 'Every movie I have rated or queued, across every genre.',
  subjectIndexLabel: 'Movie genres',
  watchedTitle: 'Watched',
  watchedEmpty: 'No movies watched here yet.',
  queuedTitle: 'Want to watch',
  queuedEmpty: 'Titles I have not seen yet.',
  searchDescription:
    'Bruce Wayne’s imaginary movie shelf, with reviews from a very tired detective.',
  itemSingular: 'movie',
  itemPlural: 'movies',
};

export const MOVIES = hydrateRatingEntries([
  {
    title: 'Gotham: The Long Commute',
    genre: 'Adventure',
    rating: 4,
    review:
      'A fictional chase film with wildly optimistic traffic. I would like their parking consultant’s number.',
  },
  {
    title: 'Dinner at Wayne Manor',
    genre: 'Drama',
    rating: 5,
    review:
      'Two hours of Alfred trying to serve dinner while the doorbell rings. Finally, a believable thriller.',
  },
  {
    title: 'The Case of the Missing Cape',
    genre: 'Mystery',
    status: 'queued',
  },
]);

const collection = buildRatingShelves({
  entries: MOVIES,
  copy: MOVIES_PAGE_COPY,
  icon: MOVIES_DEFAULT_ICON,
  path: MOVIES_PATH,
});

export const MOVIE_NAV_SHELVES = collection.navShelves;
export const ACTIVE_MOVIE_CATEGORIES = collection.categories;
export const getMovieCategoryPath = collection.getPath;
export const getMovieShelf = collection.getShelf;
