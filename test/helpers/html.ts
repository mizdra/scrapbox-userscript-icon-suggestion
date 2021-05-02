// scrapbox のアイコンの a タグを再現したものを返す関数
export function createIconLinkElement(projectName: string, pageName: string): HTMLAnchorElement {
  const anchor = document.createElement('a');
  anchor.setAttribute('class', 'link icon');
  anchor.setAttribute('rel', 'route');
  anchor.setAttribute('href', `/${projectName}/${encodeURIComponent(pageName)}`);
  const img = document.createElement('img');
  img.setAttribute('class', 'icon');
  img.setAttribute('alt', pageName);
  img.setAttribute('title', pageName);
  img.setAttribute('src', `/api/pages/${projectName}/${encodeURIComponent(pageName)}/icon`);
  anchor.appendChild(img);
  return anchor;
}

// scrapbox の .editor 要素を再現したものを返す関数
export function createEditor(): HTMLDivElement {
  const editor = document.createElement('div');
  editor.setAttribute('class', 'editor');
  editor.setAttribute('id', 'editor');
  return editor;
}

// scrapbox の .cursor 要素を再現したものを返す関数
export function createCursor(style: { styleTop: number; styleLeft: number }): HTMLDivElement {
  const editor = document.createElement('div');
  editor.setAttribute('class', 'cursor');
  // top や height の値は実際の scrapbox からコピペしてきた適当なものを設定
  editor.setAttribute('style', `top: ${style.styleTop}px; left: ${style.styleLeft}px; height: 28px; display: none;`);
  return editor;
}
