import React, { useState, useCallback } from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

export type AppProps = {};

export function App(_props: AppProps) {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <Container maxWidth="sm">
      <Button variant="contained" color="primary" onClick={handleClick}>
        {count}
      </Button>
    </Container>
  );
}
