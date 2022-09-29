import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/root.css';
import '@/fonts.css';
import '@/inter.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from '@/context/User.context';
import { ThemeProvider } from '@/context/Theme.context';
import { SpeedProvider } from '@/context/Speed.context';
import Root from '@/routes/_root';
import { ForgotPassword, PassReset } from '@/routes/PasswordReset';
import VerifyEmail from '@/routes/VerifyEmail';
import { Onboarding, StepOne, StepTwo } from '@/routes/Onboarding';
import Hackathons from '@/components/Hackathons';
import Projects from '@/components/Projects';
import { Settings, AccountProfile, SocialProfile, Password } from '@/routes/Settings';
import Home from '@/routes/Home';
import { socialProfileLoader } from '@/lib/queriesAndLoaders';
import Login from '@/routes/Login';
import Signup from '@/routes/Signup';
import FourOFour from '@/routes/404';
import LoadingCard from '@/components/LoadingCard';
// SOCIAL
import Social from '@/routes/social/Social';
import OneOne from '@/routes/social/OneOne';
import Circle from '@/routes/social/Circle';
import Profile from './routes/Profile';

axios.defaults.headers.common.withCredentials = true;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'online',
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // COMMON FOR ALL AUTHED USERS
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'auth/registration/account-confirm-email/:key',
        element: <VerifyEmail />,
      },
      {
        path: 'auth/password/reset/confirm/:uid/:token',
        element: <PassReset />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      // AUTHED AND UNAPPROVED
      {
        path: 'onboarding',
        element: <Onboarding />,
        children: [
          {
            index: true,
            element: <StepOne />,
          },
          {
            path: '/onboarding/step-two',
            element: <StepTwo />,
            loader: socialProfileLoader(queryClient),
          },
        ],
      },
      // AUTHED AND APPROVED
      {
        path: 'profile/:username',
        element: <Profile />,
      },
      {
        path: 'social',
        element: <Social />,
        children: [
          {
            index: true,
            element: <OneOne />,
          },
          {
            path: '/social/circle',
            element: <Circle />,
          },
        ],
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'hackathons',
        element: <Hackathons />,
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            index: true,
            element: <AccountProfile />,
          },
          {
            path: '/settings/social',
            element: <SocialProfile />,
            loader: socialProfileLoader(queryClient),
          },
          {
            path: '/settings/password',
            element: <Password />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <FourOFour />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SpeedProvider>
          <ThemeProvider>
            <RouterProvider router={router} fallbackElement={<LoadingCard />} />
          </ThemeProvider>
        </SpeedProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
