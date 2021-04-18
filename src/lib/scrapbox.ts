import { Block, IconNode, Line, Page, Node, parse } from '@progfay/scrapbox-parser';

function scanIconsFromNode(node: Node): IconNode[] {
  if (node.type === 'quote') return [];
  if (node.type === 'helpfeel') return [];
  if (node.type === 'strongImage') return [];
  if (node.type === 'strongIcon') return [];
  if (node.type === 'strong') return [];
  if (node.type === 'formula') return [];
  if (node.type === 'decoration') return [];
  if (node.type === 'code') return [];
  if (node.type === 'commandLine') return [];
  if (node.type === 'blank') return [];
  if (node.type === 'image') return [];
  if (node.type === 'link') return [];
  if (node.type === 'googleMap') return [];
  if (node.type === 'icon') return [node];
  if (node.type === 'hashTag') return [];
  if (node.type === 'plain') return [];
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  throw new Error(`unknown node type: ${(node as any).type}`);
}

function scanIconsFromLine(line: Line): IconNode[] {
  return line.nodes.map(scanIconsFromNode).flat();
}

function scanIconsFromBlock(block: Block): IconNode[] {
  if (block.type === 'title') return [];
  if (block.type === 'codeBlock') return [];
  if (block.type === 'table') return [];
  if (block.type === 'line') return scanIconsFromLine(block);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  throw new Error(`unknown node type: ${(block as any).type}`);
}

function scanIconsFromPage(page: Page): IconNode[] {
  return page.map(scanIconsFromBlock).flat();
}

export function scanIconsFromNotation(notation: string): IconNode[] {
  const page = parse(notation);
  const icons = scanIconsFromPage(page);
  return icons;
}

export function generateIconSrc(icon: IconNode, currentProjectName: string) {
  if (icon.pathType === 'relative') {
    return `/api/pages/${currentProjectName}/${icon.path}/icon`;
  } else {
    return `/api/pages/${icon.path}/icon`;
  }
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
