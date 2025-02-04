'use client';

import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import React from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
  session?: Session | null;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children,   }) => {
  return <SessionProvider >{children}</SessionProvider>;
};
