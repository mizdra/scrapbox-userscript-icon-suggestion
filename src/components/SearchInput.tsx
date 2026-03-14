import type { FunctionComponent, TargetedEvent } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';

export type SearchInputProps = {
  defaultQuery?: string;
  onInput?: (newQuery: string) => void;
  onBlur?: () => void;
};

export const SearchInput: FunctionComponent<SearchInputProps> = ({ defaultQuery, onInput, onBlur }) => {
  const ref = useRef<HTMLInputElement>(null);

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
        defaultValue={defaultQuery}
        onInput={handleInput}
        onBlur={onBlur}
        data-testid="search-input"
      />
    </form>
  );
};
