import { render } from 'preact';
import { App } from '../components/App';
import { RenamedOptionsWarning } from '../components/Warning';
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
  isExitIconSuggestionKey?: (e: KeyboardEvent) => boolean;
  /**
   * クエリを `[query.icon]` として挿入するかどうかを判定するコールバック。キーが押下される度に呼び出される。
   * */
  isInsertQueryAsIconKey?: (e: KeyboardEvent) => boolean;
  /** @deprecated use `isLaunchIconSuggestionKey` */
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
  /** @deprecated use `isExitIconSuggestionKey` */
  isSuggestionCloseKeyDown?: (e: KeyboardEvent) => boolean;
  /** @deprecated use `isInsertQueryAsIconKey` */
  isInsertQueryKeyDown?: (e: KeyboardEvent) => boolean;
  /** @deprecated use `defaultIsShownPresetIcons` */
  defaultSuggestPresetIcons?: boolean;
  /** suggest に含めたいプリセットアイコンのリスト */
  presetIcons?: PresetIconsItem[];
  /**
   * ポップアップを開いた直後にプリセットアイコンを候補として表示するか。
   * `true` なら表示、`false` なら非表示。
   * @default true
   * */
  defaultIsShownPresetIcons?: boolean;
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

  if (
    options?.isSuggestionOpenKeyDown !== undefined ||
    options?.isSuggestionCloseKeyDown !== undefined ||
    options?.isInsertQueryKeyDown !== undefined ||
    options?.defaultSuggestPresetIcons !== undefined
  ) {
    render(<RenamedOptionsWarning />, warningMessageContainer);
    return;
  }

  const presetIcons = options?.presetIcons ? await evaluatePresetIconItemsToIcons(options.presetIcons) : undefined;

  render(
    <App
      isLaunchIconSuggestionKey={options?.isLaunchIconSuggestionKey}
      isExitIconSuggestionKey={options?.isExitIconSuggestionKey}
      isInsertQueryAsIconKey={options?.isInsertQueryAsIconKey}
      presetIcons={presetIcons}
      defaultIsShownPresetIcons={options?.defaultIsShownPresetIcons}
      matcher={options?.matcher}
    />,
    container,
  );
}
