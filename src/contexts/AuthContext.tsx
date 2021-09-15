import Router from "next/router";
import { ReactNode, createContext, useState } from "react";
import { api } from "../services/api";
import { setCookie } from "nookies";

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  user: User;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
}

type User = {
  email: string;
  name: string;
  permissions: string[];
  roles: string[];
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<User>(null)

  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {

    try {
      const response = await api.post('sessions', {
        email, password
      });

      const { name, permissions, roles, token, refreshToken } = response.data;

      setCookie(undefined, 'dashgo.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
      });
      setCookie(undefined, 'dashgo.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
      });

      setUser({
        email,
        name,
        permissions,
        roles
      });

      Router.push('/dashboard')

    } catch (err) {

      console.log(err)

    }

  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}