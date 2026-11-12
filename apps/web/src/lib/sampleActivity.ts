import { GITHUB_ACTIVITY_RECENT_WEEKS } from './config';

const SAMPLE_DAYS_PER_WEEK = 7;
const SAMPLE_LEVEL_PATTERN = [0, 1, 0, 2, 3, 0, 1, 4, 2, 0, 1, 3, 0, 2];
const levels = Array.from(
  { length: GITHUB_ACTIVITY_RECENT_WEEKS * SAMPLE_DAYS_PER_WEEK },
  (_, index) => SAMPLE_LEVEL_PATTERN[index % SAMPLE_LEVEL_PATTERN.length],
);

/** Deterministic, fictional values for the template preview. No user activity. */
export const SAMPLE_GITHUB_ACTIVITY = {
  activeDays: levels.filter((level) => level > 0).length,
  contributionCount: levels.reduce((total, level) => total + level, 0),
  levels,
  publicRepos: 8,
};
export const SAMPLE_ACTIVITY_DESCRIPTION =
  'Fictional Batcomputer activity. Even the cave has a commit history.';
