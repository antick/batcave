import { expect, test } from 'bun:test';
import config from '../apps/web/astro.config.mjs';

test('Markdown headings and ToC share unique emoji-free IDs across renders', async () => {
  const renderer = await config.markdown.processor.createRenderer({
    syntaxHighlight: false,
  });
  const markdown = [
    '## 🏋️ 1. **One-Arm Dumbbell Row**',
    '## 🧠 Routine',
    '## Routine',
    '## Routine-1',
    '## 👩🏽‍💻',
    '## 🇮🇳',
    '## Café & 日本語',
    '## 1️⃣ Start',
  ].join('\n\n');
  for (let render = 0; render < 2; render++) {
    const result = await renderer.render(markdown);
    expect(result.metadata.headings.map(({ slug }) => slug)).toEqual([
      '1-one-arm-dumbbell-row',
      'routine',
      'routine-1',
      'routine-1-1',
      'section',
      'section-1',
      'café-日本語',
      '1-start',
    ]);
    for (const heading of result.metadata.headings) {
      expect(result.code).toContain(`id="${heading.slug}"`);
    }
    expect(result.code).toContain('🏋️');
    expect(result.metadata.headings[0].text).toContain('One-Arm Dumbbell Row');
  }
});
