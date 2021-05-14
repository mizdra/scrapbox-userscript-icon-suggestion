import { FunctionComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import { SuggestionBox, Item } from './components/SuggestionBox';
import { useDocumentEventListener } from './hooks/useDocumentEventListener';
import { uniqBy } from './lib/collection';
import { calcCursorPosition, insertText, scanIconsFromEditor } from './lib/scrapbox';
import { CursorPosition, Icon } from './types';

const editor = document.querySelector<HTMLElement>('.editor')!;
const textInput = document.querySelector<HTMLTextAreaElement>('#text-input')!;
const cursor = document.querySelector<HTMLElement>('.cursor')!;

function generateItems(icons: Icon[]) {
  return uniqBy(icons, (icon) => icon.pagePath).map((icon) => ({
    element: (
      <span>
        <img
          alt={icon.imgAlt}
          title={icon.imgTitle}
          style="width: 1.3em; height: 1.3em; object-fit: contain;"
          src={icon.imgSrc}
        />
        {' ' + icon.pagePath}
      </span>
    ),
    searchableText: icon.pagePath,
    value: icon,
  }));
}

type AppProps = {
  isSuggestionOpenKeyDown: (e: KeyboardEvent) => boolean;
  presetIcons: Icon[];
};

export const App: FunctionComponent<AppProps> = ({ isSuggestionOpenKeyDown, presetIcons }) => {
  const [open, setOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ styleTop: 0, styleLeft: 0 });
  const [iconsInEditor, setIconsInEditor] = useState<Icon[]>([]);
  const [presetAppended, setPresetAppended] = useState(false);
  const items = useMemo(() => {
    if (presetAppended) return generateItems([...iconsInEditor, ...presetIcons]);
    else return generateItems(iconsInEditor);
  }, [iconsInEditor, presetAppended, presetIcons]);

  const handleSelect = useCallback((item: Item<Icon>) => {
    setOpen(false);
    insertText(textInput, item.value.notation);
  }, []);

  const handleSelectNonexistent = useCallback((query: string) => {
    setOpen(false);
    insertText(textInput, `[${query}.icon]`);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    textInput.focus();
  }, []);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (!isSuggestionOpenKeyDown(e)) return;
      e.preventDefault();
      e.stopPropagation();

      if (!open) {
        // ポップアップが閉じていたら開く
        setCursorPosition(calcCursorPosition(cursor));

        // NOTE: ある行にフォーカスがあると、行全体がテキスト化されてしまい、`scanIconsFromEditor` で
        // アイコンを取得することができなくなってしまう。そのため、予めフォーカスを外し、フォーカスのあった
        // 行のアイコン記法が画像化されるようにしておく。
        textInput.blur();
        // 画像化されたらエディタを走査してアイコンを収集
        const icons = scanIconsFromEditor(scrapbox.Project.name, editor);

        setIconsInEditor(icons);
        setOpen(true);
        setPresetAppended(false);
      } else {
        // ポップアップが開いていたら、preset icon の表示・非表示をトグルする
        setPresetAppended((presetAppended) => !presetAppended);
      }
    },
    [isSuggestionOpenKeyDown, open],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  return (
    <SuggestionBox
      open={open}
      emptyMessage="キーワードにマッチするアイコンがありません"
      items={items}
      cursorPosition={cursorPosition}
      onSelect={handleSelect}
      onSelectNonexistent={handleSelectNonexistent}
      onClose={handleClose}
    />
  );
};
