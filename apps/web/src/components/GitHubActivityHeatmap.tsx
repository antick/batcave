import { useEffect, useState } from 'react';
import { HOME_ACTIVITY_WEEKDAYS, GITHUB_PROFILE_URL } from '../lib/constants';
import {
  GITHUB_ACTIVITY_CACHE_TTL_MS,
  GITHUB_ACTIVITY_USERNAME,
} from '../lib/config';
import { SAMPLE_GITHUB_ACTIVITY } from '../lib/sampleActivity';
import {
  fetchGitHubActivity,
  GITHUB_ACTIVITY_CACHE_KEY,
  type GitHubActivity,
} from '../lib/github';

const LEGEND_LEVELS = [0, 1, 2, 3, 4];

interface CachedGitHubActivity {
  activity: GitHubActivity;
  cachedAt: number;
}

function getCachedActivity(): GitHubActivity | null {
  try {
    const cached = localStorage.getItem(GITHUB_ACTIVITY_CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as CachedGitHubActivity;
    return Date.now() - parsed.cachedAt < GITHUB_ACTIVITY_CACHE_TTL_MS
      ? parsed.activity
      : null;
  } catch {
    return null;
  }
}

function cacheActivity(activity: GitHubActivity): void {
  try {
    localStorage.setItem(
      GITHUB_ACTIVITY_CACHE_KEY,
      JSON.stringify({ activity, cachedAt: Date.now() }),
    );
  } catch {}
}

export default function GitHubActivityHeatmap() {
  const [activity, setActivity] = useState<GitHubActivity | null>(
    GITHUB_ACTIVITY_USERNAME ? null : SAMPLE_GITHUB_ACTIVITY,
  );
  const [isLoading, setIsLoading] = useState(Boolean(GITHUB_ACTIVITY_USERNAME));

  useEffect(() => {
    if (!GITHUB_ACTIVITY_USERNAME) return;

    const cachedActivity = getCachedActivity();
    if (cachedActivity) {
      setActivity(cachedActivity);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();
    fetchGitHubActivity(controller.signal)
      .then((freshActivity) => {
        if (isCancelled) return;
        cacheActivity(freshActivity);
        setActivity(freshActivity);
      })
      .catch(() => {
        if (!isCancelled) setActivity(null);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className="github-activity skeleton"
        role="status"
        aria-label="Loading public GitHub activity..."
        aria-busy="true"
      >
        <div className="github-activity-summary">
          {[1, 2, 3].map((i) => (
            <div key={i} className="github-activity-stat">
              <strong
                className="skeleton-text"
                style={{
                  display: 'inline-block',
                  width: '2.5rem',
                  borderRadius: '3px',
                }}
              >
                &nbsp;
              </strong>
              <span
                className="skeleton-text"
                style={{
                  display: 'inline-block',
                  width: '3.5rem',
                  borderRadius: '3px',
                }}
              >
                &nbsp;
              </span>
            </div>
          ))}
        </div>

        <div className="github-activity-grid-wrap">
          <div className="github-activity-weekdays" aria-hidden="true">
            {HOME_ACTIVITY_WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <a
            className="github-activity-grid skeleton-grid"
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="View profile on GitHub"
            aria-label="View public GitHub activity"
          >
            {Array.from({ length: 182 }).map((_, index) => (
              <span
                key={index}
                className="github-activity-cell skeleton-cell"
              />
            ))}
          </a>
        </div>

        <div className="github-activity-legend" aria-hidden="true">
          <span>Less</span>
          {LEGEND_LEVELS.map((level) => (
            <span
              key={level}
              className="github-activity-cell"
              data-level={level}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <p className="github-activity-unavailable">
        Public GitHub activity is temporarily unavailable.{' '}
        <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
          View it on GitHub
        </a>
        .
      </p>
    );
  }

  const summary = [
    {
      label: 'Contributions',
      value: activity.contributionCount.toLocaleString(),
    },
    { label: 'Active days', value: activity.activeDays.toLocaleString() },
    { label: 'Public repos', value: activity.publicRepos.toLocaleString() },
  ];

  return (
    <div
      className="github-activity"
      role="group"
      aria-label={
        GITHUB_ACTIVITY_USERNAME
          ? `Public GitHub activity for ${GITHUB_ACTIVITY_USERNAME}`
          : 'Fictional sample GitHub activity'
      }
    >
      <div className="github-activity-summary">
        {summary.map((item) => (
          <div key={item.label} className="github-activity-stat">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="github-activity-grid-wrap">
        <div className="github-activity-weekdays" aria-hidden="true">
          {HOME_ACTIVITY_WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <a
          className="github-activity-grid"
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="View profile on GitHub"
        >
          {activity.levels.map((level, index) => (
            <span
              key={`${index}-${level}`}
              className="github-activity-cell"
              data-level={level}
              aria-hidden="true"
            />
          ))}
        </a>
      </div>

      <div className="github-activity-legend" aria-hidden="true">
        <span>Less</span>
        {LEGEND_LEVELS.map((level) => (
          <span
            key={level}
            className="github-activity-cell"
            data-level={level}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
