import { ComponentChildren } from 'preact';

export type WarningProps = {
  children: ComponentChildren;
};

export function Warning({ children }: WarningProps) {
  return (
    <div style={{ background: 'black', padding: '2em' }}>
      <h2 style={{ fontSize: 'xx-large', color: 'yellow' }}>
        ⚠️ <a href="https://scrapbox.io/customize/icon-suggestion">icon-suggestion</a> による警告
      </h2>
      <section style={{ fontSize: 'large', color: 'white' }}>{children}</section>
    </div>
  );
}

export function RenamedOptionsWarning() {
  return (
    <Warning>
      <p>icon-suggestion のアップデートにより、いくつかのオプションの名前が変更されました。</p>
      <table>
        <thead>
          <th>古いオプション名</th>
          <th>新しいオプション名</th>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>isSuggestionOpenKeyDown</code>
            </td>
            <td>
              <code>isLaunchIconSuggestionKey</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>isSuggestionCloseKeyDown</code>
            </td>
            <td>
              <code>isExitIconSuggestionKey</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>isInsertQueryKeyDown</code>
            </td>
            <td>
              <code>isInsertQueryAsIconKey</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>defaultSuggestPresetIcons</code>
            </td>
            <td>
              <code>defaultIsShownPresetIcons</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        今後は古い名前のオプションはご利用頂けませんので、新しい名前のオプションを利用して下さい。
        この警告は当該オプションを置き換えるまで表示され続けます。
      </p>
      <p>
        アップデートの詳細については <a href="https://scrapbox.io/customize/icon-suggestion">icon-suggestion</a>{' '}
        を参照して下さい。
      </p>
    </Warning>
  );
}
