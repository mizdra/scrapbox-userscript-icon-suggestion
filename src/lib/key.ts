/** IME による変換中かどうか */
export function isComposing(e: KeyboardEvent): boolean {
  return e.isComposing || (e.key === 'Enter' && e.which === 229);
}
