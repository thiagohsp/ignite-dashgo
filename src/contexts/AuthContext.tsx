import Router from "next/router";
import { ReactNode, createContext, useState, useEffect } from "react";
import { api } from "../services/apiClient";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signOut: () => void;
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

  useEffect(() => {
    const { 'dashgo.token': token } = parseCookies();
    
    if (token) {

      api.get('/me').then((response) => {
        const { email, name, permissions, roles } = response.data?.user;
        setUser({ email, name, permissions, roles });
      }).catch(() => {
        if (process.browser)
          signOut()
        else
          return Promise.reject(new AuthTokenError())

      }
      );

    }
  }, []);

  const [user, setUser] = useState<User>(null)

  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {

    try {
      const response = await api.post('sessions', {
        email, password
      });

      //const { name, permissions, roles, token, refreshToken } = response.data;
      const { user , token } = response.data;

      setCookie(undefined, 'dashgo.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
      });

      // setCookie(undefined, 'dashgo.refreshToken', refreshToken, {
      //   maxAge: 60 * 60 * 24 * 30, // 30 dias
      //   path: '/'
      // });

      setUser(user);

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')

    } catch (err) {

      //console.log(err)

    }

  }

  async function signOut() {
    destroyCookie(undefined, 'dashgo.token');
    destroyCookie(undefined, 'dashgo.refreshToken');
    setUser(null)
    Router.push('/')
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}