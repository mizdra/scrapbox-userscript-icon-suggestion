import { FunctionComponent, JSX } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { getCursor } from '../lib/scrapbox';

export type QueryInputProps = {
  defaultQuery: string;
  onInput: (newQuery: string) => void;
  onBlur: () => void;
};

function useStyles() {
  const cursor = getCursor();
  const queryInputStyle: JSXInternal.CSSProperties = {
    position: 'absolute',
    top: cursor.top,
    left: cursor.left,
  };
  return { queryInputStyle };
}

export const QueryInput: FunctionComponent<QueryInputProps> = ({ defaultQuery, onInput, onBlur }) => {
  const ref = useRef<HTMLInputElement>();
  const { queryInputStyle } = useStyles();

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
    <input
      ref={ref}
      className="form-control"
      style={queryInputStyle}
      value={defaultQuery}
      default
      onInput={handleInput}
      onBlur={onBlur}
    />
  );
};
