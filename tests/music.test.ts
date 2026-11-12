import { describe, expect, test } from 'bun:test';
import { isReservedArticleSlug } from '../apps/web/src/lib/articleRoutes';
import {
  MUSIC_PATH,
  MUSIC_SHELVES,
  getMusicTrackUrl,
  getMusicTrackThumbnail,
  getYouTubeWatchUrl,
  getYouTubeThumbnailUrl,
  MUSIC_TRACKS,
  YOUTUBE_VIDEO_ID_PATTERN,
} from '../apps/web/src/lib/music';
import { SITE_NAV_ITEMS } from '../apps/web/src/lib/navigation';
import { SHELF_PATH } from '../apps/web/src/lib/shelf';

describe('music resources', () => {
  test('reserves music and retired listen, and reaches music from Shelf', () => {
    expect(MUSIC_PATH).toBe('/music');
    expect(isReservedArticleSlug('music')).toBe(true);
    expect(isReservedArticleSlug('listen')).toBe(true);
    expect(SITE_NAV_ITEMS.some((item) => item.href === SHELF_PATH)).toBe(true);
    expect(SITE_NAV_ITEMS.some((item) => item.href === MUSIC_PATH)).toBe(false);
  });

  test('keeps optional video IDs valid', () => {
    expect(
      MUSIC_TRACKS.every(
        (track) =>
          track.youtubeId === undefined ||
          YOUTUBE_VIDEO_ID_PATTERN.test(track.youtubeId),
      ),
    ).toBe(true);
  });
  test('fills the demo playlists without requesting invented videos', () => {
    expect(MUSIC_SHELVES.every((shelf) => shelf.entries.length > 0)).toBe(true);
    for (const track of MUSIC_TRACKS) {
      expect(getMusicTrackUrl(track)).toBe('https://www.youtube.com/');
      expect(getMusicTrackThumbnail(track)).toStartWith('/images/');
    }
  });

  test('preserves real video links and rejects malformed video IDs', () => {
    const track = {
      id: 'test-track',
      title: 'Test track',
      youtubeId: 'abcdefghijk',
    };
    expect(getMusicTrackUrl(track)).toBe(getYouTubeWatchUrl(track.youtubeId));
    expect(getMusicTrackThumbnail(track)).toBe(
      getYouTubeThumbnailUrl(track.youtubeId),
    );
    expect(() => getMusicTrackUrl({ ...track, youtubeId: 'bad-id' })).toThrow();
  });
});
