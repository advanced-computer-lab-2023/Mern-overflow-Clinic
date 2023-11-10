import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './userContest';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
  <App />
</UserProvider>,
);