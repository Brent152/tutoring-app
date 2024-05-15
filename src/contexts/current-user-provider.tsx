'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import { UserModel } from '~/models/user-model';

// Define the shape of the context
interface CurrentUserContextData {
  currentUser: UserModel | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserModel | null>>;
}

// Create the context with initial value as undefined
const CurrentUserContext = createContext<CurrentUserContextData | undefined>(undefined)

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null)

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext)
  if (!context) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider')
  }
  return context
}