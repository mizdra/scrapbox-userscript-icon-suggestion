import { useContext, useEffect, useMemo, useState } from 'preact/hooks';
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
    // 画面遷移により layout や projectName は変わりうるので、変更を監視する
    const onLayoutChanged = () => setLayout(scrapbox.Layout);
    const onProjectChanged = () => setProjectName(scrapbox.Project.name);
    scrapbox.addListener('layout:changed', onLayoutChanged);
    scrapbox.addListener('project:changed', onProjectChanged);
    return () => {
      scrapbox.removeListener('layout:changed', onLayoutChanged);
      scrapbox.removeListener('project:changed', onProjectChanged);
    };
  }, [scrapbox]);

  const cursor = useMemo(() => {
    const el = editor.querySelector<HTMLDivElement>('.cursor');
    if (!el) throw new Error('.cursor が存在しません');
    return el;
  }, [editor]);
  const textInput = useMemo(() => {
    const el = editor.querySelector<HTMLTextAreaElement>('#text-input');
    if (!el) throw new Error('#text-input が存在しません');
    return el;
  }, [editor]);
  return { layout, projectName, editor, cursor, textInput };
}
