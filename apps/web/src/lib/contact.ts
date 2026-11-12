import {
  DISCORD_PROFILE_URL,
  GITHUB_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
  TWITTER_PROFILE_URL,
  YOUTUBE_PROFILE_URL,
} from './constants';

export const CONTACT_PATH = '/contact';

export const CONTACT_PAGE_COPY = {
  title: 'Contact',
  subtitle: 'Wayne Foundation inquiries by day. Bat-Signal after dark.',
  intro:
    'Alfred screens the messages. Lucius handles gadget proposals. These demo links open platform homepages, not Bruce Wayne accounts.',
  preferredTitle: 'Start with Alfred',
  preferredDescription:
    'For foundation work, leave a clear message. For rooftop emergencies, Gotham already has a rather large lamp.',
};

export const CONTACT_CV_REQUEST = {
  title: 'Need the daylight resume?',
  description:
    'Wayne Enterprises has the public version. The evening responsibilities are a little harder to fit on one page.',
  url: LINKEDIN_PROFILE_URL,
};

export const ARTICLE_DISCUSSION_COPY = {
  title: 'Want to continue the conversation?',
  description:
    'Have a better grapnel design or a Gotham story worth sharing? Alfred has promised to pass along the good ones.',
};

export interface ContactProfile {
  title: string;
  handle: string;
  url: string;
  icon: string;
}

export interface ContactGroup {
  id: string;
  title: string;
  description: string;
  profiles: ContactProfile[];
}

const profile = (title: string, url: string, icon: string): ContactProfile => ({
  title,
  handle: 'Platform homepage',
  url,
  icon,
});
const X_PROFILE = profile('X', TWITTER_PROFILE_URL, 'fa-brands fa-x-twitter');
const DISCORD_PROFILE = profile(
  'Discord',
  DISCORD_PROFILE_URL,
  'fa-brands fa-discord',
);
export const CONTACT_PREFERRED_PROFILES = [X_PROFILE, DISCORD_PROFILE];
export const CONTACT_GROUPS: ContactGroup[] = [
  {
    id: 'primary',
    title: 'Primary profiles',
    description:
      'The public-facing desk. No secret identities in the usernames.',
    profiles: [
      X_PROFILE,
      DISCORD_PROFILE,
      profile('LinkedIn', LINKEDIN_PROFILE_URL, 'fa-brands fa-linkedin-in'),
    ],
  },
  {
    id: 'developer-communities',
    title: 'Developer communities',
    description:
      'Where Lucius would put the code if the cave had a public repository.',
    profiles: [profile('GitHub', GITHUB_PROFILE_URL, 'fa-brands fa-github')],
  },
  {
    id: 'social',
    title: 'Social',
    description: 'Gala photos and carefully cropped workshop updates.',
    profiles: [
      profile('Instagram', INSTAGRAM_PROFILE_URL, 'fa-brands fa-instagram'),
      profile('YouTube', YOUTUBE_PROFILE_URL, 'fa-brands fa-youtube'),
    ],
  },
];

export const CONTACT_PROFILES = CONTACT_GROUPS.flatMap(
  (group) => group.profiles,
);
export const CONTACT_PROFILE_COUNT = CONTACT_PROFILES.length;
export const CONTACT_SEARCH_TAGS = CONTACT_PROFILES.flatMap((profile) => [
  profile.title,
  profile.handle,
]);
