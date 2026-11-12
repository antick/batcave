import {
  buildRatingShelves,
  hydrateRatingEntries,
  type RatingCollectionCopy,
  type RatingGenrePreset,
} from './ratings';

export const READING_PATH = '/reading';
export const READING_DEFAULT_ICON = 'fa-solid fa-book';

export const READING_PAGE_COPY: RatingCollectionCopy = {
  title: 'Reading',
  subtitle: 'The books between the case files',
  allDescription: 'Every book I have read or queued, across every genre.',
  subjectIndexLabel: 'Book genres',
  watchedTitle: 'Read',
  watchedEmpty: 'No books read here yet.',
  queuedTitle: 'Want to read',
  queuedEmpty: 'Titles I have not read yet.',
  searchDescription:
    'Bruce Wayne’s fictional reading list: Gotham history, detective stories, and gadget design.',
  itemSingular: 'book',
  itemPlural: 'books',
};

const READING_GENRES: RatingGenrePreset[] = [
  {
    label: 'Fiction',
    description: 'Stories I have read, and stories I still want to start.',
    icon: 'fa-solid fa-book-open',
  },
  {
    label: 'Nonfiction',
    description: 'Ideas and reporting I learn from.',
    icon: 'fa-solid fa-landmark',
  },
  {
    label: 'Fantasy',
    description: 'Invented worlds I return to, or still want to enter.',
    icon: 'fa-solid fa-wand-magic-sparkles',
  },
  {
    label: 'History',
    description: 'The past, told well.',
    icon: 'fa-solid fa-scroll',
  },
  {
    label: 'Design',
    description: 'The workshop shelf, with Lucius’s handwritten corrections.',
    icon: 'fa-solid fa-leaf',
  },
];

export const READING = hydrateRatingEntries([
  {
    title: 'The Gotham Clockmaker',
    genre: 'Fiction',
    rating: 4,
    review:
      'An imaginary mystery with excellent clues. I solved it early, but Alfred refuses to confirm that.',
  },
  {
    title: 'A Practical Guide to Secret Basements',
    genre: 'Nonfiction',
    rating: 5,
    review:
      'Fictional advice on ventilation, cable management, and why a waterfall is rarely a sensible front door.',
  },
  {
    title: 'The Knight and the Paper Moon',
    genre: 'Fantasy',
    status: 'queued',
  },
  {
    title: 'Gotham Before the Skyline',
    genre: 'History',
    rating: 4,
    review:
      'A made-up city history that reminds me every neighborhood has a story worth protecting.',
  },
  {
    title: 'Gadgets That Fit in a Pocket',
    genre: 'Design',
    rating: 5,
    review:
      'Lucius’s imaginary handbook. The chapter about not adding another button feels personally directed at me.',
  },
]);

const collection = buildRatingShelves({
  entries: READING,
  copy: READING_PAGE_COPY,
  icon: READING_DEFAULT_ICON,
  path: READING_PATH,
  presetGenres: READING_GENRES,
});

export const READING_NAV_SHELVES = collection.navShelves;
export const ACTIVE_READING_CATEGORIES = collection.categories;
export const getReadingCategoryPath = collection.getPath;
export const getReadingShelf = collection.getShelf;
