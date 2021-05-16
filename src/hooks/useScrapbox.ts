import { useContext } from 'preact/hooks';
import { ScrapboxContext } from '../contexts/ScrapboxContext';

export type UseScrapboxResult = {
  scrapbox: Scrapbox;
  editor: HTMLElement;
  cursor: HTMLDivElement;
  textInput: HTMLTextAreaElement;
};

/** Scrapbox のインターフェイスにアクセスするための hooks */
export function useScrapbox(): UseScrapboxResult {
  const { scrapbox, editor } = useContext(ScrapboxContext);
  const cursor = editor.querySelector<HTMLDivElement>('.cursor');
  const textInput = editor.querySelector<HTMLTextAreaElement>('#text-input');
  if (!cursor) throw new Error('.cursor が存在しません');
  if (!textInput) throw new Error('#text-input が存在しません');
  return { scrapbox, editor, cursor, textInput };
}
