import React from 'react';
import { render } from 'react-dom';
import { App } from './app';
import CssBaseline from '@material-ui/core/CssBaseline';

render(
  <>
    <CssBaseline />
    <App />
  </>,
  document.querySelector('#app'),
);
