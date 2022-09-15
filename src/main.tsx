import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import {
  createBrowserRouter, RouterProvider,
} from 'react-router-dom';
import {
  QueryClient, QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '@/root.css';
import '@/clash-display.css';
import { UserProvider } from '@/context/User.context';
import { ThemeProvider } from '@/context/Theme.context';
import { SpeedProvider } from '@/context/Speed.context';
import Root from '@/routes/root';

axios.defaults.headers.common.withCredentials = true;

const router = createBrowserRouter([
  {
    path: '*',
    element: <Root />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <UserProvider>
        <SpeedProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </SpeedProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
