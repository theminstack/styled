/* eslint-disable import/no-extraneous-dependencies */
import { appendFile, mkdir, unlink } from 'node:fs/promises';
import { createElement } from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);

globalThis.window = dom.window;
Object.assign(globalThis, {
  document: window.document,
  HTMLElement: window.HTMLElement,
});

(async () => {
  await mkdir('out', { recursive: true });
  await unlink('out/benchmark.md').catch(() => undefined);
  await appendFile('out/benchmark.md', `| Library | Op/s |\n|-|-|\n`);

  const tests = [
    // ['no-op', async () => () => () => () => null],
    ['Styled Components', () => import('styled-components').then((exports) => exports.default.default)],
    [
      'Goober',
      () =>
        import('goober').then(async (exports) => {
          const { createElement } = await import('react');
          exports.setup(createElement);
          return exports.styled;
        }),
    ],
    ['Emotion', () => import('@emotion/styled').then((exports) => exports.default.default)],
    ['React Micro-Styled', () => import('./lib/cjs/index.js').then((exports) => exports.styled)],
  ];

  for (const [framework, load] of tests) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    window.document.head.textContent = '';
    const { renderToString } = await import('react-dom/server');
    const styled = await load();

    // Create the dynamic styled component
    const Foo = styled('div')`
      opacity: ${(props) => (props.counter > 0.5 ? 1 : 0)};

      @media (min-width: 1px) {
        rule: all;
      }

      &:hover {
        another: 1;
        display: space;
      }
    `;

    let startTime = 0;
    const iterations = 50_000;
    const leadIn = 1_000;

    for (let i = 0; i < iterations; i++) {
      renderToString(createElement(Foo, { counter: i }));
      if (i === leadIn) startTime = Date.now();
    }

    const elapsed = Date.now() - startTime;
    const result = ((iterations - leadIn) / elapsed) * 1000;

    console.log(`${framework}: ${result >> 0} ops/s (${elapsed}ms)`);
    await appendFile('out/benchmark.md', `| ${framework} | ${result >> 0} |\n`);
  }
})();
