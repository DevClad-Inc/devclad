import React from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import useAuth from '@/services/useAuth.services';
import AppShell from '@/components/AppShell';
import getsetIndexedDB from '@/lib/getsetIndexedDB.lib';
import { initialUserState, User } from '@/lib/InterfacesStates.lib';

export default function FourOFour() : JSX.Element {
  const { authed } = useAuth();
  useDocumentTitle('Oops! 404');
  const navigate = useNavigate();
  let idbUser: User = { ...initialUserState };

  React.useEffect(() => {
    if (Object.values(idbUser).every((v) => v === undefined)) {
      getsetIndexedDB('loggedInUser', 'get').then((localUser) => {
        if (localUser) {
          idbUser = localUser;
        }
      });
    }
    if (!authed && idbUser.pk === undefined) {
      navigate('/login');
    }
  }, [authed, idbUser]);

  return (
    // todo: CHANGE THIS!!
    <div>
      <AppShell>
        <div className="mx-auto max-w-full  px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg">
            <h1 className="text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
              404
            </h1>
          </div>
        </div>
      </AppShell>
    </div>
  );
}
