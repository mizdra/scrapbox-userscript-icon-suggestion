import { execSync } from 'child_process';
import { resolve, sep } from 'path';

// E2E テストにはそれなりに時間が掛かるので、タイムアウトを 1 分に延長する
jest.setTimeout(60 * 1000);

const dist = resolve(__dirname, '../../e2e-dist');

// dist/e2e.js が無いとテストできないので、yarn run build する
process.stdout.write('Running `yarn run build`...');
execSync('yarn run build');

beforeEach(async () => {
  await jestPlaywright.resetContext({
    recordVideo: { dir: dist }, // recordVideo.dir を指定しないと録画できないので指定する
    bypassCSP: true, // CSP を無効化しないと Page#addScriptTag が CSP 違反になってしまう
  });
});

afterEach(async () => {
  const testName = expect.getState().currentTestName;
  await context.close(); // close して録画を終了
  // ファイル名を指定して録画を保存
  // NOTE: 何故か `recordVideo.dir` で dist を指定しているのに dist を付けないと期待する場所に保存されなかったので、付けている。
  await page.video()?.saveAs(resolve(dist, `${testName.replaceAll(sep, '')}.webm`));
});

async function goto(url: string) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addScriptTag({ path: resolve(__dirname, '../../dist/e2e.js'), type: 'module' });
}

test('エディタにフォーカスされている状態で Ctrl+L を押下すると、icon-suggestion が開く', async () => {
  await goto('https://scrapbox.io/mizdra/icon-suggestion');

  expect(await page.isVisible('.popup-menu')).toBeFalsy();

  // Tab キーでエディタに移動してエディタにカーソルが置かれた状況を再現する。
  // エディタ上をクリックだと何故かカーソルが表示されなかったので、こうしたハックを利用している…
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  // Ctrl + L 押下
  await page.keyboard.down('Control');
  await page.keyboard.press('l');
  await page.keyboard.up('Control');

  expect(await page.isVisible('.popup-menu')).toBeTruthy();
});

test('エディタにフォーカスされていなければ icon-suggestion は開かない', async () => {
  await goto('https://scrapbox.io/mizdra/icon-suggestion');

  expect(await page.isVisible('.popup-menu')).toBeFalsy();

  // Ctrl + L 押下
  await page.keyboard.down('Control');
  await page.keyboard.press('l');
  await page.keyboard.up('Control');

  expect(await page.isVisible('.popup-menu')).toBeFalsy();
});

test('プロジェクト一覧ページでは icon-suggestion は開かない', async () => {
  await goto('https://scrapbox.io/mizdra');

  expect(await page.isVisible('.popup-menu')).toBeFalsy();

  // Ctrl + L 押下
  await page.keyboard.down('Control');
  await page.keyboard.press('l');
  await page.keyboard.up('Control');

  expect(await page.isVisible('.popup-menu')).toBeFalsy();
});
