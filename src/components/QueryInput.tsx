import { FunctionComponent, JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks';
import { calcQueryInputPosition } from '../lib/position';
import { CursorPosition } from '../types';

export type QueryInputProps = {
  defaultQuery: string;
  cursorPosition: CursorPosition;
  onInput: (newQuery: string) => void;
  onBlur: () => void;
};

function useStyles(viewportWidth: number, cursorPosition: CursorPosition) {
  const queryInputStyle = calcQueryInputPosition(viewportWidth, cursorPosition);
  return { queryInputStyle };
}

export const QueryInput: FunctionComponent<QueryInputProps> = ({ defaultQuery, cursorPosition, onInput, onBlur }) => {
  const ref = useRef<HTMLInputElement>();
  const viewportWidth = useMemo(() => document.body.clientWidth, []);
  const { queryInputStyle } = useStyles(viewportWidth, cursorPosition);

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
        // onBlur={onBlur}
      />
    </form>
  );
};
