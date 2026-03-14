import { render } from 'preact';
import { App } from '../components/App';
import type { Options } from '../lib/options';
import { resolveOptions } from '../lib/options';

export async function registerIconSuggestion(options?: Options) {
  const app = document.querySelector('#app-container .app');
  if (!app) throw new Error('.app が存在しません');

  const resolvedOptions = await resolveOptions(options);
  const container = document.createElement('div');
  app.appendChild(container);
  render(<App {...resolvedOptions} />, container);
}
