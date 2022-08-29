import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';
import { UserProvider } from './context/User.context';
import { ThemeProvider } from './context/Theme.context';

axios.defaults.headers.common.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <UserProvider>
        <ThemeProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
