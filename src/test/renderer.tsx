import { render as nativeRender } from '@testing-library/preact';
import type { ComponentChild } from 'preact';
import type { Icon } from '../lib/icon';

export function render(
  ui: ComponentChild,
  options?: {
    type?: 'page' | 'list';
    cursorLineIndex?: number;
    embeddedIcons?: Icon[];
  },
) {
  function Wrapper({ children }: { children: ComponentChild }) {
    return (
      <ScrapboxLayout
        type={options?.type ?? 'page'}
        cursorLineIndex={options?.cursorLineIndex}
        embeddedIcons={options?.embeddedIcons}>
        {children}
      </ScrapboxLayout>
    );
  }
  return nativeRender(ui, { wrapper: Wrapper });
}

/**
 * テスト用の Scrapbox のレイアウトコンポーネント。
 * 本物のものを部分的に再現してるだけで、完全に同じではないので注意。
 */
function ScrapboxLayout({
  children,
  type,
  cursorLineIndex,
  embeddedIcons,
}: {
  children: ComponentChild;
  type: 'page' | 'list';
  cursorLineIndex?: number;
  embeddedIcons?: Icon[];
}) {
  return (
    <div id="app-container">
      <div className="app">
        <div className="container">
          {type === 'page' ? (
            <PageLayout cursorLineIndex={cursorLineIndex} embeddedIcons={embeddedIcons} />
          ) : (
            <ListLayout />
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

function PageLayout({ cursorLineIndex, embeddedIcons }: { cursorLineIndex?: number; embeddedIcons?: Icon[] }) {
  return (
    <main className="page">
      <div className="editor">
        <div className="cursor" />
        <textarea id="text-input" className="text-input" />
        <div className="pointer-event">
          <div className="lines">
            {/* 空行 */}
            <div className={`line${cursorLineIndex !== undefined ? ' cursor-line' : ''}`}>
              <span className="char-index" data-char-index="0" />
            </div>
            {/* アイコンが埋め込まれた行 */}
            {embeddedIcons && (
              <div className="line">
                {embeddedIcons.map((icon, i) => (
                  <a key={i} className="link icon" href={icon.fullPagePath}>
                    <img className="icon" alt={icon.imgAlt} title={icon.imgTitle} src={icon.imgSrc} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ListLayout() {
  return <div className="page-list" />;
}
