import { useContext, useEffect, useState } from 'preact/hooks';
import { ScrapboxContext } from '../contexts/ScrapboxContext';

export type UseScrapboxResult = {
  layout: string;
  projectName: string;
  editor: HTMLElement;
  cursor: HTMLDivElement;
  textInput: HTMLTextAreaElement;
};

/** Scrapbox のインターフェイスにアクセスするための hooks */
export function useScrapbox(): UseScrapboxResult {
  const { scrapbox, editor } = useContext(ScrapboxContext);
  const [layout, setLayout] = useState(scrapbox.Layout);
  const [projectName, setProjectName] = useState(scrapbox.Project.name);

  useEffect(() => {
    // smooth transition で layout や projectName は変わりうるので、変更を監視する
    const onLayoutChanged = () => setLayout(scrapbox.Layout);
    const onProjectChanged = () => setProjectName(scrapbox.Project.name);
    scrapbox.addListener('layout:changed', onLayoutChanged);
    scrapbox.addListener('project:changed', onProjectChanged);
    return () => {
      scrapbox.removeListener('layout:changed', onLayoutChanged);
      scrapbox.removeListener('project:changed', onProjectChanged);
    };
  }, [scrapbox]);

  const cursor = editor.querySelector<HTMLDivElement>('.cursor');
  const textInput = editor.querySelector<HTMLTextAreaElement>('#text-input');
  if (!cursor) throw new Error('.cursor が存在しません');
  if (!textInput) throw new Error('#text-input が存在しません');
  return { layout, projectName, editor, cursor, textInput };
}
