export interface ArticleDiscussion {
  provider: 'x';
  url: string;
}

export const ARTICLE_COMMENTS_COPY = {
  title: 'Comments on X',
  description:
    'Comments are hosted and moderated on X. They are not loaded until you choose to connect.',
  privacyNotice:
    'Loading comments lets X receive your IP address, browser details, and the page you are viewing.',
  loadLabel: 'Load comments from X',
  openLabel: 'Open the discussion on X',
  failure:
    'The embedded conversation could not be loaded. You can still open it directly on X.',
} as const;

export const X_WIDGET_SCRIPT_URL = 'https://platform.twitter.com/widgets.js';
export const X_WIDGET_SCRIPT_ID = 'x-widgets-script';
