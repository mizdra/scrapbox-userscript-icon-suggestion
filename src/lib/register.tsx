import { render } from 'preact';
import { App } from '../components/App';
import { Warning } from '../components/Warning';
import { evaluatePresetIconItemsToIcons } from '../lib/options';
import { getEditor } from '../lib/scrapbox';
import { Matcher, PresetIconsItem } from '../types';
import { Icon } from './icon';

function IsSuggestionReloadKeyDownWarning() {
  return (
    <Warning>
      <p>
        icon-suggestion
        のアップデートにより、ポップアップを開く度に、その時点でページに埋め込まれているアイコンがアイコンリストに表示されるようになりました。
        それに伴い、ユーザ様がお使いの <code>isSuggestionReloadKeyDown</code>{' '}
        オプションが廃止されました。今後当該オプションはご利用頂けませんので、 ご利用の UserScript
        から当該オプションを削除して下さい。この警告は当該オプションを削除するまで表示され続けます。
      </p>
      <p>
        アップデートの詳細については <a href="https://scrapbox.io/mizdra/icon-suggestion">icon-suggestion</a>{' '}
        を参照して下さい。
      </p>
    </Warning>
  );
}

function PresetIconsWarning() {
  return (
    <Warning>
      <p>
        icon-suggestion のアップデートにより、<code>presetIcons</code> オプションの要素に <code>{`'done'`}</code>{' '}
        形式の値が渡せなくなりました。 今後は <code>{`new Icon('your-project-name', 'done')`}</code>{' '}
        形式の値をご利用下さい。この警告は形式の値の利用がされなくなるまで表示され続けます。
      </p>
      <p>
        アップデートの詳細については <a href="https://scrapbox.io/mizdra/icon-suggestion">icon-suggestion</a>{' '}
        を参照して下さい。
      </p>
    </Warning>
  );
}

type Options = {
  /**
   * ポップアップを開くキーかどうかを判定するコールバック。キーが押下される度に呼び出される。
   * `true` ならポップアップを開くキーだと判定される。
   * */
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
  /**
   * ポップアップを閉じるキーかどうかを判定するコールバック。キーが押下される度に呼び出される。
   * `true` ならポップアップを閉じるキーだと判定される。
   * */
  isSuggestionCloseKeyDown?: (e: KeyboardEvent) => boolean;
  /** @deprecated */
  isSuggestionReloadKeyDown?: (e: KeyboardEvent) => boolean;
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
  matcher?: Matcher<Icon>;
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

  // 廃止されたオプションを使用している場合は警告する
  // TODO: 十分時間が経過したら警告をやめる
  if (options?.isSuggestionReloadKeyDown) {
    render(<IsSuggestionReloadKeyDownWarning />, warningMessageContainer);
    return;
  }

  const presetIcons = options?.presetIcons ? await evaluatePresetIconItemsToIcons(options.presetIcons) : undefined;

  render(
    <App
      isSuggestionOpenKeyDown={options?.isSuggestionOpenKeyDown}
      isSuggestionCloseKeyDown={options?.isSuggestionCloseKeyDown}
      isInsertQueryKeyDown={options?.isInsertQueryKeyDown}
      presetIcons={presetIcons}
      defaultSuggestPresetIcons={options?.defaultSuggestPresetIcons}
      matcher={options?.matcher}
    />,
    container,
  );
}
