import { Icon } from '../../src/lib/icon';
import { CursorPosition } from '../../src/types';

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

export function iconToIconLinkElement(icon: Icon): HTMLAnchorElement {
  const a = document.createElement('a');
  a.setAttribute('class', 'link icon');
  a.setAttribute('rel', 'route');
  a.setAttribute('href', `/${icon.projectName}/${encodeURIComponent(icon.imgAlt)}`);
  const img = document.createElement('img');
  img.setAttribute('class', 'icon');
  img.setAttribute('alt', icon.imgAlt);
  img.setAttribute('title', icon.imgTitle);
  img.setAttribute('src', icon.imgSrc);
  a.appendChild(img);
  return a;
}

// scrapbox の .editor 要素を再現したものを返す関数
type CreateEditorOptions = {
  embeddedIcons?: Icon[];
  cursorPosition?: CursorPosition;
};

export function createEditor(options?: CreateEditorOptions): HTMLDivElement {
  const editor = document.createElement('div');
  editor.setAttribute('class', 'editor');
  editor.setAttribute('id', 'editor');
  editor.style.width = '1000px';

  editor.appendChild(createCursor(options?.cursorPosition ?? { styleTop: 0, styleLeft: 0 }));
  editor.appendChild(createTextInput());
  if (options?.embeddedIcons) embedIcons(editor, options.embeddedIcons);

  return editor;
}

function embedIcons(editor: HTMLElement, icons: Icon[]) {
  icons.forEach((icon) => {
    const iconLinkElement = iconToIconLinkElement(icon);
    editor.appendChild(iconLinkElement);
  });
}

// scrapbox の .cursor 要素を再現したものを返す関数
export function createCursor(style: { styleTop: number; styleLeft: number }): HTMLDivElement {
  const editor = document.createElement('div');
  editor.setAttribute('class', 'cursor');
  // top や height の値は実際の scrapbox からコピペしてきた適当なものを設定
  editor.setAttribute('style', `top: ${style.styleTop}px; left: ${style.styleLeft}px; height: 28px;`);
  return editor;
}

// scrapbox の #text-input 要素を再現したものを返す関数
function createTextInput(): HTMLTextAreaElement {
  const textInput = document.createElement('textarea');
  textInput.setAttribute('class', 'text-input');
  textInput.setAttribute('id', 'text-input');
  return textInput;
}

// scrapbox が window に露出させている API を再現したものを返す関数
export function createScrapboxAPI(): Scrapbox {
  const scrapbox = {
    Layout: 'page',
    Project: {
      name: 'project',
    },
    addListener: () => scrapbox,
    removeListener: () => scrapbox,
  };
  return scrapbox;
}
