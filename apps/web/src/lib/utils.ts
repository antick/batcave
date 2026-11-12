export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function formatMonthShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short' });
}

export function formatDateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toCategoryId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

export function getUrlHostname(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}

const EXTERNAL_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

/** Anchor attributes for links that leave the site. */
export function getExternalLinkProps(
  external = true,
): Partial<typeof EXTERNAL_LINK_PROPS> {
  return external ? EXTERNAL_LINK_PROPS : {};
}
