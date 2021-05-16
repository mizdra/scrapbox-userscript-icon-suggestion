beforeAll(async () => {
  await page.goto('https://whatismybrowser.com/');
});

test('should display correct browser', async () => {
  const browser = await page.$eval('.string-major', (el: HTMLElement) => el.innerHTML);
  expect(browser).toContain('Chrome');
});
