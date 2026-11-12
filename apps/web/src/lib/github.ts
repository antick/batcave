import {
  GITHUB_ACTIVITY_RECENT_WEEKS,
  GITHUB_ACTIVITY_USERNAME,
} from './config';
import { SAMPLE_GITHUB_ACTIVITY } from './sampleActivity';

const GITHUB_USERNAME = GITHUB_ACTIVITY_USERNAME.trim();
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_CONTRIBUTIONS_API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;
export const GITHUB_ACTIVITY_CACHE_KEY = `batcave:github-activity:${GITHUB_USERNAME || 'demo'}`;

const DAYS_PER_WEEK = 7;

export interface GitHubActivity {
  activeDays: number;
  contributionCount: number;
  levels: number[];
  publicRepos: number;
}

interface GitHubProfileResponse {
  public_repos: number;
}

interface GitHubContribution {
  date: string;
  level: number;
}

interface GitHubContributionsResponse {
  contributions: GitHubContribution[];
  total: {
    lastYear: number;
  };
}

export async function fetchGitHubActivity(
  signal?: AbortSignal,
): Promise<GitHubActivity> {
  if (!GITHUB_USERNAME) return SAMPLE_GITHUB_ACTIVITY;
  const [profileResponse, contributionsResponse] = await Promise.all([
    fetch(GITHUB_API_URL, {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    }),
    fetch(GITHUB_CONTRIBUTIONS_API_URL, { signal }),
  ]);

  if (!profileResponse.ok || !contributionsResponse.ok) {
    throw new Error('Unable to fetch GitHub activity.');
  }

  const profile = (await profileResponse.json()) as GitHubProfileResponse;
  const contributionData =
    (await contributionsResponse.json()) as GitHubContributionsResponse;
  const contributionDays = contributionData.contributions
    .slice()
    .sort((first, second) => first.date.localeCompare(second.date));

  return {
    activeDays: contributionDays.filter((day) => day.level > 0).length,
    contributionCount: contributionData.total.lastYear,
    levels: contributionDays
      .slice(-GITHUB_ACTIVITY_RECENT_WEEKS * DAYS_PER_WEEK)
      .map((day) => day.level),
    publicRepos: profile.public_repos,
  };
}
