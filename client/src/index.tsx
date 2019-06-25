import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { init, initAddToHome } from './services/pwa';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
init();
initAddToHome();
