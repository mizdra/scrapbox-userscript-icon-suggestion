export function htmlToHTMLElement(html: string): HTMLElement | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const element = doc.body.firstElementChild;
  if (element instanceof HTMLElement) return element;
  return null;
}
