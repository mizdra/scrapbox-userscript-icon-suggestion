import { render } from 'preact';
import { App } from '../components/App';
import { resolveOptions } from '../lib/options';
import { getEditor } from '../lib/scrapbox';
import type { Options } from '../types';

export async function registerIconSuggestion(options?: Options) {
  // 直接 editor に mount すると scrapbox 側の react renderer と干渉して壊れるので、
  // editor 内に差し込んだ container に mount する
  const container = document.createElement('div');
  const editor = getEditor();
  editor.appendChild(container);

  const resolvedOptions = await resolveOptions(options);
  render(<App {...resolvedOptions} />, container);
}
