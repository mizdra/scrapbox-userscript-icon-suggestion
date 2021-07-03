#!/usr/bin/env ts-node

import { resolve, join } from 'path';
import { BrowserContext, chromium } from 'playwright';
import * as rollup from 'rollup';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import loadConfigFile = require('rollup/dist/loadConfigFile');

const userScriptPath = join(__dirname, '../dist/e2e.js');

async function reloadPage(context: BrowserContext) {
  const [firstPage, ...otherPages] = context.pages();
  await Promise.all(otherPages.map(async (page) => page.close()));
  const page = firstPage ? firstPage : await context.newPage();
  await page.goto('https://scrapbox.io/mizdra/mizdra', { waitUntil: 'networkidle' });
  await page.addScriptTag({ path: userScriptPath, type: 'module' });
}

(async () => {
  console.log('⌛️ Launching  debugging tool...');
  const { options, warning } = await loadConfigFile(resolve(__dirname, '../rollup.config.js'), {});
  if (warning) console.warn(warning);

  const browser = await chromium.launch({ headless: false, devtools: true });
  const context = await browser.newContext({
    bypassCSP: true, // CSP を無効化しないと Page#addScriptTag が CSP 違反になってしまう
  });
  await context.newPage();

  const watcher = rollup.watch(options);

  watcher.on('event', (event) => {
    if (event.code === 'START') {
      console.log();
      console.log('⛏ Bundling...');
    }
    if (event.code === 'END') {
      console.log('🔄 Reloading page...');
      reloadPage(context)
        .then(() => console.log('✅ Reloading complete!'))
        .catch(console.error);
    }
  });

  console.log('✅ Successfully launched debugging tool!');

  function gracefulShutdown() {
    watcher.close();
    browser.close().catch(console.error);
  }
  process.on('SIGTERM', gracefulShutdown); // for kill
  process.on('SIGINT', gracefulShutdown); // for Ctrl+C
})().catch(console.error);
