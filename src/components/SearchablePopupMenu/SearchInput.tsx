import { FunctionComponent, JSX } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import useResizeObserver from 'use-resize-observer';
import { useScrapbox } from '../../hooks/useScrapbox';
import { calcSearchInputStyle } from '../../lib/calc-style';
import { CursorPosition } from '../../types';

export type SearchInputProps = {
  defaultQuery?: string;
  cursorPosition: CursorPosition;
  onInput?: (newQuery: string) => void;
  onBlur?: () => void;
};

export const SearchInput: FunctionComponent<SearchInputProps> = ({ defaultQuery, cursorPosition, onInput, onBlur }) => {
  const { editor } = useScrapbox();
  const ref = useRef<HTMLInputElement>();
  const { width: editorWidth = 0 } = useResizeObserver({ ref: editor });
  const searchInputStyle = calcSearchInputStyle(editorWidth, cursorPosition);

  // mount されたら即 focus する
  useEffect(() => {
    if (!ref.current) return;
    const input = ref.current;
    // NOTE: 何故かフォーカスが合わないことがあるらしいので、間をおいてからフォーカスする
    requestAnimationFrame(() => input.focus());
  }, []);

  const handleInput = useCallback(
    (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
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
        value={defaultQuery}
        default
        onInput={handleInput}
        onBlur={onBlur}
        data-testid="search-input"
      />
    </form>
  );
};
