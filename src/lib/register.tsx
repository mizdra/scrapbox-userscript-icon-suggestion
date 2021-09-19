import { render } from 'preact';
import { App } from '../components/App';
import { evaluatePresetIconItemsToIcons } from '../lib/options';
import { getEditor } from '../lib/scrapbox';
import { Matcher, PresetIconsItem } from '../types';

type Options = {
  /**
   * ポップアップを開くキーかどうかを判定するコールバック。キーが押下される度に呼び出される。
   * `true` ならポップアップを開くキーだと判定される。
   * */
  isLaunchIconSuggestionKey?: (e: KeyboardEvent) => boolean;
  /**
   * ポップアップを閉じるキーかどうかを判定するコールバック。キーが押下される度に呼び出される。
   * `true` ならポップアップを閉じるキーだと判定される。
   * */
  isSuggestionCloseKeyDown?: (e: KeyboardEvent) => boolean;
  /**
   * クエリを `[query.icon]` として挿入するかどうかを判定するコールバック。キーが押下される度に呼び出される。
   * */
  isInsertQueryKeyDown?: (e: KeyboardEvent) => boolean;
  /** suggest に含めたいプリセットアイコンのリスト */
  presetIcons?: PresetIconsItem[];
  /**
   * ポップアップを開いた直後にプリセットアイコンを候補として表示するか。
   * `true` なら表示、`false` なら非表示。
   * @default true
   * */
  defaultSuggestPresetIcons?: boolean;
  /**
   * suggest されたアイコンを絞り込むために利用される matcher。
   */
  matcher?: Matcher;
  scrapbox?: Scrapbox;
  editor?: HTMLElement;
};

export async function registerIconSuggestion(options?: Options) {
  // 直接 editor に mount すると scrapbox 側の react renderer と干渉して壊れるので、
  // editor 内に差し込んだ container に mount する
  const container = document.createElement('div');
  const editor = options?.editor ?? getEditor();
  editor.appendChild(container);

  const warningMessageContainer = document.createElement('div');
  document.querySelector('.app')?.prepend(warningMessageContainer);

  const presetIcons = options?.presetIcons ? await evaluatePresetIconItemsToIcons(options.presetIcons) : undefined;

  render(
    <App
      isLaunchIconSuggestionKey={options?.isLaunchIconSuggestionKey}
      isSuggestionCloseKeyDown={options?.isSuggestionCloseKeyDown}
      isInsertQueryKeyDown={options?.isInsertQueryKeyDown}
      presetIcons={presetIcons}
      defaultSuggestPresetIcons={options?.defaultSuggestPresetIcons}
      matcher={options?.matcher}
    />,
    container,
  );
}
