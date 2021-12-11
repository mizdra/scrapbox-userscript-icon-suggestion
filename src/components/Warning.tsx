import { ComponentChildren, JSX } from 'preact';

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
  const tdStyle: JSX.CSSProperties = { padding: '8px 8px', border: '1px solid #fff' };
  return (
    <Warning>
      <p>icon-suggestion のアップデートにより、いくつかのオプションの名前が変更されました。</p>
      <table style={{ margin: '15px 0' }}>
        <thead>
          <th style={tdStyle}>古いオプション名</th>
          <th style={tdStyle}>新しいオプション名</th>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>
              <code>isSuggestionOpenKeyDown</code>
            </td>
            <td style={tdStyle}>
              <code>isLaunchIconSuggestionKey</code>
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>
              <code>isSuggestionCloseKeyDown</code>
            </td>
            <td style={tdStyle}>
              <code>isExitIconSuggestionKey</code>
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>
              <code>isInsertQueryKeyDown</code>
            </td>
            <td style={tdStyle}>
              <code>isInsertQueryAsIconKey</code>
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>
              <code>defaultSuggestPresetIcons</code>
            </td>
            <td style={tdStyle}>
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
