export const BOOKS_PATH = '/books';
export const BOOKS_PAGE_COPY = {
  title: 'Books',
  subtitle: 'Two manuscripts from a very busy night owl',
  intro:
    'A field guide to Gotham and a notebook of workshop lessons. These fictional Bruce Wayne manuscripts are part of the template demo, not real publications.',
  searchDescription:
    'Bruce Wayne’s imaginary books on Gotham rooftops, gadgets, and life in the Batcave.',
  note: 'Fictional manuscripts. Publication dates depend on Gotham having a quiet weekend.',
};
export const BOOKS_HOME_COPY = {
  title: 'From the Batcave bookshelf',
  description: 'Gotham field notes and gadgets that almost worked.',
  action: 'Explore the books',
} as const;
export const BOOKS = [
  {
    id: 'gotham-after-dark',
    label: 'Gotham After Dark',
    coverLabel: 'Book 01',
    status: 'Between patrols',
    direction:
      'A fictional collection of rooftop observations, neighborhood stories, and reasons to carry a spare umbrella in Gotham.',
    themes: ['Gotham', 'Field notes', 'Community'],
    tone: 'signal',
  },
  {
    id: 'notes-from-the-workshop',
    label: 'Notes from the Workshop',
    coverLabel: 'Book 02',
    status: 'Alfred is proofreading',
    direction:
      'Lessons from building the Batcomputer, testing new gadgets, and explaining the repair bill to Lucius.',
    themes: ['Gadgets', 'Design', 'Batcave'],
    tone: 'stillness',
  },
] as const;
