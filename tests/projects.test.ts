import { describe, expect, test } from 'bun:test';
import { PROJECTS_PAGE_SIZE } from '../apps/web/src/lib/config';
import {
  getVisibleProjects,
  PROJECTS,
  getProjectStatusTone,
} from '../apps/web/src/lib/projects';

describe('project visibility', () => {
  test('hides draft projects from public listings', () => {
    const drafts = PROJECTS.filter((project) => project.draft);
    expect(drafts.length).toBeGreaterThan(0);
    expect(getVisibleProjects().every((project) => !project.draft)).toBe(true);
    expect(getVisibleProjects().length).toBe(PROJECTS.length - drafts.length);
  });

  test('keeps enough sample projects for pagination and shows each status', () => {
    expect(getVisibleProjects().length).toBeGreaterThan(PROJECTS_PAGE_SIZE);
    expect(new Set(PROJECTS.map((project) => project.status))).toEqual(
      new Set(['Live', 'In progress', 'Planning']),
    );
    expect(getProjectStatusTone('Live')).toBe('live');
    expect(getProjectStatusTone('In progress')).toBe('progress');
    expect(getProjectStatusTone('Planning')).toBe('planning');
  });
});
