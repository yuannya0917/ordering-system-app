import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  userId: '',
  usertype: 'customer',
  setCurrentUser: () => {},
  clearCurrentUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
