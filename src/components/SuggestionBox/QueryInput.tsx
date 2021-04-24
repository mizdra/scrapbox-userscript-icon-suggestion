import { FunctionComponent, JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks';
import useResizeObserver from 'use-resize-observer';
import { calcQueryInputPosition } from '../../lib/position';
import { CursorPosition } from '../../types';

const editor = document.querySelector<HTMLElement>('.editor')!;

export type QueryInputProps = {
  defaultQuery: string;
  cursorPosition: CursorPosition;
  onInput: (newQuery: string) => void;
  onBlur: () => void;
};

export const QueryInput: FunctionComponent<QueryInputProps> = ({ defaultQuery, cursorPosition, onInput, onBlur }) => {
  const ref = useRef<HTMLInputElement>();
  const { width: editorWidth = 0 } = useResizeObserver({ ref: editor });
  const queryInputStyle = calcQueryInputPosition(editorWidth, cursorPosition);

  // mount されたら即 focus する
  useEffect(() => {
    ref.current.focus();
  }, []);

  const handleInput = useCallback(
    (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
      if (e.currentTarget?.value) onInput(e.currentTarget.value);
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
