import React, { useState, useCallback } from 'react';

export type AppProps = {};

export function App(_props: AppProps) {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return <button onClick={handleClick}>{count}</button>;
}
