import { describe, expect, test } from 'bun:test';
import {
  countLines,
  getHtmlAttribute,
  validateHtmlDocument,
} from './quality-shared';

describe('quality helpers', () => {
  test('counts source lines deterministically', () => {
    expect(countLines('one\ntwo\nthree')).toBe(3);
    expect(countLines('')).toBe(0);
  });

  test('reads quoted HTML attributes', () => {
    expect(
      getHtmlAttribute('<a href="/about" rel="noopener noreferrer">', 'href'),
    ).toBe('/about');
  });

  test('accepts an accessible page shell', () => {
    const html = `
      <html><head>
        <meta name="description" content="Useful page">
        <link rel="canonical" href="https://example.com/about">
      </head><body>
        <main><h1>About</h1>
          <img src="/portrait.webp" alt="">
          <button aria-label="Open menu"><span></span></button>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a>
        </main>
      </body></html>
    `;
    expect(validateHtmlDocument(html)).toEqual([]);
  });

  test('reports missing page semantics and accessible names', () => {
    const issues = validateHtmlDocument(
      '<html><body><button><i></i></button><img src="/x.png"></body></html>',
    );
    expect(issues).toContain('expected exactly one h1, found 0');
    expect(issues).toContain('expected exactly one main landmark, found 0');
    expect(issues).toContain('button has no accessible name');
    expect(issues).toContain('image is missing alt text');
  });
});
