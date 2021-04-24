import { IconNode } from '../types';

export function scanIconsFromNotation(): IconNode[] {
  const projectName = scrapbox.Project.name;
  const editor = document.querySelector('.editor')!;
  const iconElements = Array.from(editor.querySelectorAll<HTMLAnchorElement>('a.link.icon'));
  return iconElements.map((iconElement) => {
    const imgElement = iconElement.querySelector<HTMLImageElement>('img.icon')!;
    return {
      // NOTE: 今の所 projectName はアルファベット・数字・ハイフンしか利用できないので、
      // パーセントエンコーディングは意識せずに href をパースしている。
      // TODO: もし scrapbox が projectName に日本語などを混ぜられるようになったら、パースの仕方を見直す
      pagePath: iconElement.pathname.startsWith(`/${projectName}/`)
        ? iconElement.pathname.slice(projectName.length + 2)
        : iconElement.pathname,
      imgAlt: imgElement.alt,
      imgTitle: imgElement.title,
      imgSrc: imgElement.src,
    };
  });
}

export function getCursor() {
  const cursorNode = document.querySelector<HTMLElement>('.cursor');
  if (!cursorNode) throw new Error('.cursor が存在しません');
  return { top: cursorNode.style.top, left: cursorNode.style.left };
}

export function getEditor() {
  const editor = document.querySelector('.editor');
  if (!editor) throw new Error('.editor が存在しません');
  return { clientWidth: editor.clientWidth };
}
