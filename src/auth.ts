import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';
import apple from 'next-auth/providers/apple';
import type { Provider } from 'next-auth/providers';
import Keycloak from 'next-auth/providers/keycloak';
import { prisma } from './prisma';
import { getUser } from './app/prisma-queries';

const providers: Provider[] = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  Facebook({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  }),
  apple({
    clientId: process.env.APPLE_CLIENT_ID,
    clientSecret: process.env.APPLE_CLIENT_SECRET,
  }),
  Keycloak({}),

  Credentials({
    credentials: {
      email: { label: 'Email Address', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(c) {
      if (!c.email || c.password !== 'password') {
        return null;
      }
      console.log('Credentials', c);
      return {
        id: 'test',
        name: 'Test User',
        email: String(c.email),
      };
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});


export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
    providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
    callbacks: {
      async signIn({ user }) {
        try {
          console.log('User signed in:', user);
          // Save user to the database
          let dbuser = await getUser(user.email);
          if(!dbuser) {
            dbuser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
              },
            });
          }
          console.log('User saved to database');
        } catch (error) {
          console.error('Error saving user to database:', error);
        }
        return true;
      },
    },
  });