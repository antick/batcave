import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

const EMPTY_HEADING_ID = 'section';
const idsByDocument = new WeakMap<object, Set<string>>();

/** Assign IDs before Astro collects the headings used by the article ToC. */
export const headingIds: NonNullable<
  SatteriProcessorOptions['hastPlugins']
>[number] = {
  name: 'readable-heading-ids',
  element: {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    visit(node, context) {
      let used = idsByDocument.get(context.data);
      if (!used) {
        used = new Set<string>();
        idsByDocument.set(context.data, used);
      }
      if (typeof node.properties?.id === 'string') {
        used.add(node.properties.id);
        return;
      }
      const base =
        context
          .textContent(node)
          .toLowerCase()
          .replace(
            /\p{Extended_Pictographic}|\p{Emoji_Presentation}|\u200d|[\ufe0e\ufe0f\u20e3\u{e0020}-\u{e007f}]/gu,
            '',
          )
          .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
          .trim()
          .replace(/[\s-]+/g, '-')
          .replace(/^-+|-+$/g, '') || EMPTY_HEADING_ID;
      let id = base;
      let suffix = 0;
      while (used.has(id)) id = `${base}-${++suffix}`;
      used.add(id);
      context.setProperty(node, 'id', id);
    },
  },
};
