import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';
import { UserProvider } from './context/User.context';
import { ThemeProvider } from './context/Theme.context';

axios.defaults.headers.common.withCredentials = true;

function QueryLoader() {
  const isFetching = useIsFetching();
  if (isFetching) {
    return (
      <button type="button" className="bg-fuchsia-500 ..." disabled>
        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24" />
        Processing...
      </button>
    );
  }
  return null;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <UserProvider>
        <ThemeProvider>
          <HashRouter>
            <QueryLoader />
            <App />
          </HashRouter>
        </ThemeProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
