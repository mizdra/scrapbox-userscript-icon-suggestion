import { useEffect, useRef } from 'preact/hooks';

export function useDocumentEventListener<K extends keyof DocumentEventMap>(
  type: K,
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
) {
  const listenerRef = useRef(listener);
  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    const handler = (ev: DocumentEventMap[K]) => listenerRef.current.call(document, ev);
    document.addEventListener(type, handler, { capture: true });
    return () => document.removeEventListener(type, handler, { capture: true });
  }, [type]);
}
