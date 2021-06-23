import { styledElementAttribute } from './constants';
import { rehydrate } from './rehydrate';

test('move styles to the head', () => {
  document.body.innerHTML = `
    <div>
      <div>
        <style ${styledElementAttribute}="first"></style>
      </div>
      <style ${styledElementAttribute}="second"></style>
    </div>
  `.replace(/\n[ ]+/g, '');
  expect(document.head).toMatchInlineSnapshot(`<head />`);
  expect(document.body).toMatchInlineSnapshot(`
<body>
  <div>
    <div>
      <style
        data-tss="first"
      />
    </div>
    <style
      data-tss="second"
    />
  </div>
</body>
`);

  rehydrate();
  expect(document.head).toMatchInlineSnapshot(`
  <head>
    <style
      data-tss="first"
    />
    <style
      data-tss="second"
    />
  </head>
  `);
  expect(document.body).toMatchInlineSnapshot(`
<body>
  <div>
    <div />
  </div>
</body>
`);
});
