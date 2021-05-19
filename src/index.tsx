import { render } from 'preact';
import { App } from './App';
import { pagePathToIcon } from './lib/icon';
import { getEditor } from './lib/scrapbox';

type Options = {
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
  /** @deprecated */
  isSuggestionReloadKeyDown?: (e: KeyboardEvent) => boolean;
  // `string` is `pagePath`
  presetIcons?: string[];
  scrapbox?: Scrapbox;
  editor?: HTMLElement;
};

function WarningMessage() {
  return (
    <div style={{ background: 'black', padding: '2em' }}>
      <h2 style={{ fontSize: 'xx-large', color: 'yellow' }}>
        ⚠️ <a href="https://scrapbox.io/mizdra/icon-suggestion">icon-suggestion</a> による警告
      </h2>
      <section style={{ fontSize: 'large', color: 'white' }}>
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
      </section>
    </div>
  );
}

export function registerIconSuggestion(options?: Options) {
  // 直接 editor に mount すると scrapbox 側の react renderer と干渉して壊れるので、
  // editor 内に差し込んだ container に mount する
  const container = document.createElement('div');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrapbox = options?.scrapbox ?? (window as any).scrapbox;
  const editor = options?.editor ?? getEditor();
  editor.appendChild(container);

  // 廃止されたオプションを使用している場合は警告する
  if (options?.isSuggestionReloadKeyDown) {
    const warningMessageContainer = document.createElement('div');
    document.querySelector('.app')?.prepend(warningMessageContainer);
    render(<WarningMessage />, warningMessageContainer);
  }

  const presetIcons = options?.presetIcons?.map((pagePath) => pagePathToIcon(scrapbox.Project.name, pagePath));

  render(<App isSuggestionOpenKeyDown={options?.isSuggestionOpenKeyDown} presetIcons={presetIcons} />, container);
}
