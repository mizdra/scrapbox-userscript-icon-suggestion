import { render } from 'preact';
import { App } from '../components/App';
import { evaluatePresetIconItemsToIcons } from '../lib/options';
import { getEditor } from '../lib/scrapbox';
import type { Options } from '../types';

export async function registerIconSuggestion(options?: Options) {
  // 直接 editor に mount すると scrapbox 側の react renderer と干渉して壊れるので、
  // editor 内に差し込んだ container に mount する
  const container = document.createElement('div');
  const editor = getEditor();
  editor.appendChild(container);

  const presetIcons = options?.presetIcons ? await evaluatePresetIconItemsToIcons(options.presetIcons) : undefined;

  render(
    <App
      isLaunchIconSuggestionKey={options?.isLaunchIconSuggestionKey}
      isExitIconSuggestionKey={options?.isExitIconSuggestionKey}
      isInsertQueryAsIconKey={options?.isInsertQueryAsIconKey}
      presetIcons={presetIcons}
      matcher={options?.matcher}
    />,
    container,
  );
}
