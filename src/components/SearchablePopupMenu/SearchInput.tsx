import type { FunctionComponent, TargetedEvent } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { useScrapbox } from '../../hooks/useScrapbox';
import { calcSearchInputStyle } from '../../lib/calc-style';
import type { CursorPosition } from '../../types';

export type SearchInputProps = {
  defaultQuery?: string;
  cursorPosition: CursorPosition;
  onInput?: (newQuery: string) => void;
  onBlur?: () => void;
};

export const SearchInput: FunctionComponent<SearchInputProps> = ({ defaultQuery, cursorPosition, onInput, onBlur }) => {
  const { editor } = useScrapbox();
  const ref = useRef<HTMLInputElement>(null);
  const editorRef = useRef(editor);
  const { width: editorWidth = 0 } = useResizeObserver(editorRef);
  const searchInputStyle = calcSearchInputStyle(editorWidth, cursorPosition);

  // mount されたら即 focus する
  useEffect(() => {
    if (!ref.current) return;
    const input = ref.current;
    // NOTE: 何故かフォーカスが合わないことがあるらしいので、間をおいてからフォーカスする
    requestAnimationFrame(() => input.focus());
  }, []);

  const handleInput = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      if (e.currentTarget) onInput?.(e.currentTarget.value);
    },
    [onInput],
  );

  return (
    <form className="form-inline">
      <input
        ref={ref}
        className="form-control"
        style={searchInputStyle}
        defaultValue={defaultQuery}
        onInput={handleInput}
        onBlur={onBlur}
        data-testid="search-input"
      />
    </form>
  );
};
