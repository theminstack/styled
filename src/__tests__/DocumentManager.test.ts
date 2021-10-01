import { createDocumentManager } from '../services/Manager';

afterEach(() => {
  document.head.innerHTML = '';
});

test('manager', () => {
  const manager = createDocumentManager('test', document);
  const A = manager.createGlobalStyle();
  const B = manager.createGlobalStyle();
  const C = manager.createGlobalStyle();
  const a = manager.createComponentStyle();
  const b = manager.createComponentStyle();
  const c = manager.createComponentStyle();

  B.update('B0');
  A.update('A0');

  b.update('b0', 'b0');

  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss=""
  >
    B0
  </style>
  <style
    data-tss=""
  >
    A0
  </style>
  <style
    data-tss="b0"
  >
    b0
  </style>
</head>
`);

  B.update('B1');
  C.update('C0');

  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss=""
  >
    B1
  </style>
  <style
    data-tss=""
  >
    A0
  </style>
  <style
    data-tss=""
  >
    C0
  </style>
  <style
    data-tss="b0"
  >
    b0
  </style>
</head>
`);

  a.update('a0', 'a0');
  b.update('b1', 'b1');
  c.update('c0', 'c0');

  C.remove();

  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss=""
  >
    B1
  </style>
  <style
    data-tss=""
  >
    A0
  </style>
  <style
    data-tss="a0"
  >
    a0
  </style>
  <style
    data-tss="b0"
  >
    b0
  </style>
  <style
    data-tss="b1"
  >
    b1
  </style>
  <style
    data-tss="c0"
  >
    c0
  </style>
</head>
`);
});
