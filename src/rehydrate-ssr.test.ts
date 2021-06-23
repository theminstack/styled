import { styledElementAttribute } from './constants';
import { rehydrate } from './rehydrate';

jest.mock('./constants', () => ({ ...jest.requireActual('./constants'), isClient: false }));

test('do not move styles to the head during SSR', () => {
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
});
