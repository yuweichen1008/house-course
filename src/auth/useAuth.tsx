import {
  useEffect,
  useState,
  useContext,
  createContext,
  FunctionComponent,
} from "react";
import { useRouter } from "next/router";
import { User, signOut, onAuthStateChanged } from "firebase/auth";
import { removeTokenCookie, setTokenCookie } from "./tokenCookies";
import { auth } from "../../firebase";

// initializw firebase

interface IAuthContext {
  user: User | null;
  logout: () => void;
  authenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  logout: () => null,
  authenticated: false,
});

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter();

  const logout = () => {
    signOut(auth).then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setUser(user)
        // setLoading(false)
      } else {
        // User is signed out
        setUser(null)
        // setLoading(false)
        router.push('/login')
      }

      // setInitialLoading(false)
    })
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, logout, authenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
