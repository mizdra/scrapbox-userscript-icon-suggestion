import { resolve } from 'path';

beforeEach(async () => {
  page.on('console', (msg) => console.log(msg.text()));
  await jestPlaywright.resetContext({ bypassCSP: true }); // CSP を無効化しないと Page#addScriptTag が CSP 違反になってしまう
  await page.goto('https://scrapbox.io/mizdra/icon-suggestion', { waitUntil: 'networkidle' });
  await page.addScriptTag({ path: resolve(__dirname, '../../dist/index.js'), type: 'module' });
});

test('エディタにフォーカスを合わせた状態で Ctrl+L を押下すると、icon-suggestion が開く', async () => {
  const visible1 = await page.isVisible('.popup-menu');
  expect(visible1).toBeFalsy();

  // エディタにフォーカスするために Tab キー移動していく
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  // Ctrl + L 押下
  await page.keyboard.down('Control');
  await page.keyboard.press('l');
  await page.keyboard.up('Control');

  const visible2 = await page.isVisible('.popup-menu');
  expect(visible2).toBeTruthy();
});
