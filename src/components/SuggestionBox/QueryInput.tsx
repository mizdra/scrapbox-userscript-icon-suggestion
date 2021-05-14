import { FunctionComponent, JSX } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import useResizeObserver from 'use-resize-observer';
import { calcQueryInputStyle } from '../../lib/calc-style';
import { editor as defaultEditor } from '../../lib/scrapbox';
import { CursorPosition } from '../../types';

export type QueryInputProps = {
  defaultQuery?: string;
  cursorPosition: CursorPosition;
  onInput?: (newQuery: string) => void;
  onBlur?: () => void;
  editor?: HTMLElement;
};

export const QueryInput: FunctionComponent<QueryInputProps> = ({
  defaultQuery,
  cursorPosition,
  onInput,
  onBlur,
  editor = defaultEditor,
}) => {
  const ref = useRef<HTMLInputElement>();
  const { width: editorWidth = 0 } = useResizeObserver({ ref: editor });
  const queryInputStyle = calcQueryInputStyle(editorWidth, cursorPosition);

  // mount されたら即 focus する
  useEffect(() => {
    ref.current.focus();
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
        style={queryInputStyle}
        value={defaultQuery}
        default
        onInput={handleInput}
        onBlur={onBlur}
      />
    </form>
  );
};
