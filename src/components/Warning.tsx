import { ComponentChildren } from 'preact';

export type WarningProps = {
  children: ComponentChildren;
};

export function Warning({ children }: WarningProps) {
  return (
    <div style={{ background: 'black', padding: '2em' }}>
      <h2 style={{ fontSize: 'xx-large', color: 'yellow' }}>
        ⚠️ <a href="https://scrapbox.io/mizdra/icon-suggestion">icon-suggestion</a> による警告
      </h2>
      <section style={{ fontSize: 'large', color: 'white' }}>{children}</section>
    </div>
  );
}
