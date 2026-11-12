import { YOUTUBE_PROFILE_URL } from './constants';
import { DEFAULT_CONTENT_IMAGES } from './content';
import type { ContentCategory } from './types';

export const MUSIC_PATH = '/music';
export const MUSIC_DEFAULT_ICON = 'fa-solid fa-headphones';
export const MUSIC_ALL_CATEGORY_ID = 'all';
export const YOUTUBE_WATCH_ORIGIN = 'https://www.youtube.com';
export const YOUTUBE_THUMBNAIL_ORIGIN = 'https://i.ytimg.com';
export const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export const MUSIC_PAGE_COPY = {
  title: 'Music',
  subtitle: 'Soundtracks for the cave, the car, and a quiet manor',
  allDescription: 'Every track across every playlist.',
  empty: 'Alfred is still choosing the music for this shelf.',
  subjectIndexLabel: 'Music playlists',
  searchDescription:
    'Fictional playlists for Bruce Wayne’s double life. Demo tracks use local artwork and open the YouTube homepage.',
  openLabel: 'YouTube',
} as const;

export interface MusicTrack {
  id: string;
  title: string;
  youtubeId?: string;
  note?: string;
}

export interface MusicShelf {
  id: string;
  label: string;
  description: string;
  icon: string;
  entries: MusicTrack[];
}

interface MusicGroup {
  id: string;
  label: string;
  description: string;
  icon: string;
  tracks: MusicTrack[];
}

const MUSIC_GROUPS: MusicGroup[] = [
  {
    id: 'rooftop-hours',
    label: 'Rooftop Hours',
    description: 'Imaginary instrumentals for the Gotham skyline.',
    icon: 'fa-solid fa-city',
    tracks: [
      {
        id: 'gotham-midnight',
        title: 'Gotham at Midnight',
        note: 'An invented slow-building instrumental. Best enjoyed above street level.',
      },
      {
        id: 'rain-on-the-cape',
        title: 'Rain on the Cape',
        note: 'Fictional rain-soaked piano. The cape is still not waterproof enough.',
      },
    ],
  },
  {
    id: 'workshop-radio',
    label: 'Workshop Radio',
    description: 'What Lucius plays while the prototypes charge.',
    icon: 'fa-solid fa-screwdriver-wrench',
    tracks: [
      {
        id: 'another-prototype',
        title: 'One More Prototype',
        note: 'An imaginary electronic loop for the last hour at the workbench.',
      },
      {
        id: 'batmobile-idle',
        title: 'Batmobile in Idle',
        note: 'Fictional garage ambience. Alfred has requested a lower volume.',
      },
    ],
  },
  {
    id: 'wayne-manor',
    label: 'Wayne Manor',
    description: 'Alfred gets the final say on the evening playlist.',
    icon: 'fa-solid fa-mug-hot',
    tracks: [
      {
        id: 'tea-before-dawn',
        title: 'Tea Before Dawn',
        note: 'An invented chamber piece for coming home and putting the case file down.',
      },
      {
        id: 'manor-sunday',
        title: 'Sunday at the Manor',
        note: 'Fictional jazz for the rare morning without a calendar alarm.',
      },
    ],
  },
];

function assertMusicCatalog(groups: MusicGroup[]) {
  const groupIds = new Set<string>();
  const trackIds = new Set<string>();

  groups.forEach((group) => {
    if (group.id === MUSIC_ALL_CATEGORY_ID || group.id === 'page') {
      throw new Error(`Music playlist id is reserved: ${group.id}`);
    }
    if (groupIds.has(group.id)) {
      throw new Error(`Duplicate music playlist id: ${group.id}`);
    }
    groupIds.add(group.id);

    group.tracks.forEach((track) => {
      if (
        track.youtubeId !== undefined &&
        !YOUTUBE_VIDEO_ID_PATTERN.test(track.youtubeId)
      ) {
        throw new Error(
          `Invalid YouTube video id in ${group.id}: ${track.youtubeId}`,
        );
      }
      if (trackIds.has(track.id)) {
        throw new Error(`Duplicate music track id: ${track.id}`);
      }
      trackIds.add(track.id);
    });
  });
}

assertMusicCatalog(MUSIC_GROUPS);

export const MUSIC_SHELVES: MusicShelf[] = MUSIC_GROUPS.map((group) => ({
  id: group.id,
  label: group.label,
  description: group.description,
  icon: group.icon,
  entries: group.tracks,
}));

export const MUSIC_TRACKS: MusicTrack[] = MUSIC_SHELVES.flatMap(
  (shelf) => shelf.entries,
);

export const ACTIVE_MUSIC_SHELVES = MUSIC_SHELVES;

export const ACTIVE_MUSIC_CATEGORIES: ContentCategory[] = MUSIC_SHELVES.map(
  ({ id, label, description, icon }) => ({
    id,
    label,
    description,
    icon,
  }),
);

export const MUSIC_ALL_SHELF: MusicShelf = {
  id: MUSIC_ALL_CATEGORY_ID,
  label: 'All',
  description: MUSIC_PAGE_COPY.allDescription,
  icon: MUSIC_DEFAULT_ICON,
  entries: MUSIC_TRACKS,
};

export const MUSIC_NAV_SHELVES: MusicShelf[] = [
  MUSIC_ALL_SHELF,
  ...ACTIVE_MUSIC_SHELVES,
];

export function getMusicCategoryPath(
  category: Pick<ContentCategory, 'id'>,
): string {
  return category.id === MUSIC_ALL_CATEGORY_ID
    ? MUSIC_PATH
    : `${MUSIC_PATH}/${category.id}`;
}

export function getMusicShelf(categoryId: string): MusicShelf | undefined {
  return MUSIC_NAV_SHELVES.find((shelf) => shelf.id === categoryId);
}

export function getYouTubeWatchUrl(videoId: string): string {
  if (!YOUTUBE_VIDEO_ID_PATTERN.test(videoId)) {
    throw new Error(`Invalid YouTube video id: ${videoId}`);
  }

  return `${YOUTUBE_WATCH_ORIGIN}/watch?v=${videoId}`;
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  if (!YOUTUBE_VIDEO_ID_PATTERN.test(videoId)) {
    throw new Error(`Invalid YouTube video id: ${videoId}`);
  }

  return `${YOUTUBE_THUMBNAIL_ORIGIN}/vi/${videoId}/hqdefault.jpg`;
}

export function getMusicCountLabel(count: number): string {
  return count === 1 ? '1 track' : `${count} tracks`;
}

/** Demo entries open the platform homepage; real entries keep their video links. */
export function getMusicTrackUrl(track: MusicTrack): string {
  return track.youtubeId === undefined
    ? YOUTUBE_PROFILE_URL
    : getYouTubeWatchUrl(track.youtubeId);
}

export function getMusicTrackThumbnail(track: MusicTrack): string {
  return track.youtubeId === undefined
    ? DEFAULT_CONTENT_IMAGES.light
    : getYouTubeThumbnailUrl(track.youtubeId);
}
