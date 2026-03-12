import { createContext } from 'preact';

export type ScrapboxContextValue = {
  scrapbox: Scrapbox;
};

/** icon-suggestion から参照する Scrapbox のインターフェイスを詰め込んだコンテキスト */
export const ScrapboxContext = createContext<ScrapboxContextValue>({
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  scrapbox: (window as any).scrapbox,
});
