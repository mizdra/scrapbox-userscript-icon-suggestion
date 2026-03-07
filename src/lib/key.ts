/** IME による変換中かどうか */
export function isComposing(e: KeyboardEvent): boolean {
  // oxlint-disable-next-line typescript/no-deprecated
  return e.isComposing || (e.key === 'Enter' && e.which === 229);
}
