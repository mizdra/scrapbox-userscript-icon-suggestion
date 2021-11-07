import { execSync } from 'child_process';
import { resolve, sep } from 'path';

// E2E テストにはそれなりに時間が掛かるので、タイムアウトを 1 分に延長する
jest.setTimeout(60 * 1000);
// 確率的に失敗するのでリトライするように
jest.retryTimes(2);

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
  // icon-suggestion は .editor に依存しているため、
  // .editor のマウントを待ってから UserScript を実行する
  await page.waitForSelector('.editor', { state: 'attached' });
  await page.addScriptTag({ path: resolve(__dirname, '../../dist/e2e.js'), type: 'module' });
}

test('エディタのあるページで Ctrl+L を押下すると、icon-suggestion が開く', async () => {
  await goto('https://scrapbox.io/icon-suggestion-example/テスト用ページ1');

  expect(await page.isVisible('.popup-menu')).toBeFalsy();

  // Ctrl + L 押下
  await page.keyboard.down('Control');
  await page.keyboard.press('l');
  await page.keyboard.up('Control');

  expect(await page.isVisible('.popup-menu')).toBeTruthy();
});

test('プロジェクトのホームからエディタのあるページに smooth transition した時であっても、icon-suggestion が開く', async () => {
  await goto('https://scrapbox.io/icon-suggestion-example');

  await page.click('.page-list a[href="/icon-suggestion-example/mizdra"]');
  await page.waitForSelector('.editor', { state: 'visible' });

  // Ctrl + L 押下
  await page.keyboard.down('Control');
  await page.keyboard.press('l');
  await page.keyboard.up('Control');

  expect(await page.isVisible('.popup-menu')).toBeTruthy();
});

test('別のプロジェクトに smooth transition した時であっても、icon-suggestion が開く', async () => {
  // `/icon-suggestion-example/テスト用ページ2` => `/mizdra/テスト用ページ2` に smooth transition して、
  // project 名が変わっても正しい icon が suggest されることをテストする

  await goto(
    'https://scrapbox.io/icon-suggestion-example/%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%E3%83%9A%E3%83%BC%E3%82%B82',
  );

  // Ctrl + L 押下
  await page.keyboard.down('Control');
  await page.keyboard.press('l');
  await page.keyboard.up('Control');

  expect(await page.getAttribute('.popup-menu img', 'src')).toEqual('/api/pages/icon-suggestion-example/mizdra/icon');

  // mizdra プロジェクトのページに smooth transition する
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const linkHandle = (await page.$(
    'a[href="/mizdra/%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%E3%83%9A%E3%83%BC%E3%82%B82"]',
  ))!;
  // NOTE: デフォルトでは target="_blank" が付いていて smooth transition にならないので、強引に外してしまう
  await linkHandle.evaluate((node) => node.removeAttribute('target'));
  await linkHandle.click();
  await page.waitForSelector('.editor', { state: 'visible' });

  // Ctrl + L 押下
  await page.keyboard.down('Control');
  await page.keyboard.press('l');
  await page.keyboard.up('Control');

  // `icon-suggestion-example/mizdra` ではなく `mizdra/mizdra` が suggest される
  expect(await page.getAttribute('.popup-menu img', 'src')).toEqual('/api/pages/mizdra/mizdra/icon');
});

test('プロジェクトのホームでは icon-suggestion は開かない', async () => {
  await goto('https://scrapbox.io/icon-suggestion-example');

  expect(await page.isVisible('.popup-menu')).toBeFalsy();

  // Ctrl + L 押下
  await page.keyboard.down('Control');
  await page.keyboard.press('l');
  await page.keyboard.up('Control');

  expect(await page.isVisible('.popup-menu')).toBeFalsy();
});
