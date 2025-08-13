import * as React from "react";
import { Analytics } from "@vercel/analytics/next";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Navigation } from "@toolpad/core/AppProvider";
import { SessionProvider, signIn, signOut } from "next-auth/react";
import { auth } from "../auth";
import {
  AdminPanelSettings,
  Checklist,
  ContactPage,
  DirectionsBike,
  EditCalendar,
  FormatListNumbered,
  Home,
  ManageAccounts,
  Pin,
} from "@mui/icons-material";
import ContextProvider from "./contextprovider";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { customTheme } from "./theme";
import { getUser } from "./prisma-queries";
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { fetchUserSession, cachedLogin } from "./datalayer";

const BRANDING = {
  title: "Podium Cafe VDS 2",
  logo: <Image src={"/logo.png"} alt={"PDC VDS 2.0"} width={40} height={50} />,
};

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const authSession = await auth();
  const session = await fetchUserSession(authSession);

  const NAVIGATION: Navigation = [
    {
      title: "Home",
      icon: <Home color={"primary"} />,
    },
    {
      segment: "teams",
      title: "All Teams",
      icon: <FormatListNumbered color={"secondary"} />,
    },
    {
      segment: "riders",
      title: "Riders",
      icon: <DirectionsBike />,
      pattern: "riders{/:id}*",
    },
    {
      segment: "results",
      title: "Results",
      icon: <Pin />,
      pattern: "results{/:id}*",
    },
  ];
  if (session?.user) {
    NAVIGATION.push(
      {
        segment: "profile",
        title: "Profile ",
        icon: <ContactPage />,
      },
      {
        segment: "my-team",
        title: "My Team",
        pattern: "my-teams{/:id}*",
        icon: <FormatListNumbered color={"secondary"} />,
      }
    );
  }
  if (session?.admin) {
    NAVIGATION.push({
      title: "Admin",
      segment: "admin",
      children: [
        {
          segment: "calendar",
          title: "Calendar",
          children: [
            {
              segment: "admin-calendar",
              title: "Edit Calendar",
              icon: <EditCalendar />,
              pattern: "admin-calendar{/:id}*",
            },    
            {
              segment: "upload-calendar",
              title: "Upload Calendar",
              icon: <EditCalendar />,
            },
          ],
        },
        {
          segment: "riders",
          title: "Riders",
          children: [
            {
              segment: "admin-riders",
              title: "Edit Riders",
              icon: <ManageAccounts />,
            },
                {
              segment: "upload-riders",
              title: "Upload Riders",
              icon: <ManageAccounts />,
            },
          ],
        },

      ]
    },
      );
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
              <Analytics />
              </AppRouterCacheProvider>
          </SessionProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
