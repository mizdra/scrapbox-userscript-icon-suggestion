import { useEffect } from 'preact/hooks';

export function useDocumentEventListener<K extends keyof DocumentEventMap>(
  type: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    document.addEventListener(type, listener, options);
    return () => document.removeEventListener(type, listener, options);
  }, [listener, options, type]);
}
