import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Navigation } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { auth } from '../auth';
import { AdminPanelSettings, CalendarViewMonth, ContactPage, DirectionsBike, EditCalendar, EditNote, FormatListNumbered, Home, ManageAccounts, People, PersonAdd, PersonAddDisabled, Pin } from '@mui/icons-material';
import ContextProvider from './contextprovider';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { customTheme } from './theme';
import { getUser } from './prisma-queries';

const BRANDING = {
  title: 'Podium Cafe VDS 2',
  logo: <img src="/logo.png" alt="PDC VDS 2.0" />,
};

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user) {
    const dbuser = await getUser(session?.user?.email);
    console.log('profile user:', dbuser);
    session.id = dbuser.id;
    session.name = dbuser.name;
    session.admin = dbuser.admin;
  }

  const NAVIGATION: Navigation = [
    {
      title: 'Home',
      icon: <Home color={'primary'} />,
    },
    {
      segment: 'teams',
      title: 'Teams',
      icon: <FormatListNumbered color={'secondary'} />,
    },
    {
      segment: 'riders',
      title: 'Riders',
      icon: <DirectionsBike />,
    },
    {
      segment: 'results',
      title: 'Results',
      icon: <Pin />,
      pattern: 'results{/:id}*',

    }
  ];
  if (session?.user) {
    NAVIGATION.push(    
    {
      segment: 'profile',
      title: 'Profile ',
      icon: <ContactPage />,
    }
  )}
  if(session?.admin) {
    NAVIGATION.push(
    {
      segment: 'admin',
      title: 'Admin',
      icon: <AdminPanelSettings />,
      children: [
        {
          segment: 'admin-calendar',
          title: 'Edit Calendar',
          icon: <EditCalendar />,
          pattern: 'admin-calendar{/:id}*',
        },
        {
          segment: 'admin-riders',
          title: 'Edit Riders',
          icon: <ManageAccounts />,
        },
      ]
    }
  )
}

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ContextProvider>
        <SessionProvider session={session}>
        <InitColorSchemeScript attribute="class" />

          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <NextAppProvider
              navigation={NAVIGATION}
              branding={BRANDING}
              session={session}
              authentication={AUTHENTICATION}
              theme={customTheme}
            >
              {props.children}
            </NextAppProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
