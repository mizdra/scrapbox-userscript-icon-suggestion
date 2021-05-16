import { createContext } from 'preact';
import { getEditor } from '../lib/scrapbox';

export type ScrapboxContextValue = {
  scrapbox: Scrapbox;
  editor: HTMLElement;
};

/** icon-suggestion から参照する Scrapbox のインターフェイスを詰め込んだコンテキスト */
export const ScrapboxContext = createContext<ScrapboxContextValue>({
  scrapbox: window.scrapbox,
  editor: getEditor(),
});
