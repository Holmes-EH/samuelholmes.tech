import { User } from "@/generated/graphql";
import { useQueryClient } from "@tanstack/solid-query";
import {
  createContext,
  createSignal,
  JSX,
  onMount,
  useContext,
} from "solid-js";

type AuthContextType = {
  isAuthenticated: () => boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  token: () => string | null;
  user: () => User | null;
};

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: { children: JSX.Element }) {
  const [authenticated, setAuthenticated] = createSignal(false);
  const [token, setToken] = createSignal<string | null>(null);
  const [user, setUser] = createSignal<User | null>(null);
  const queryClient = useQueryClient();

  onMount(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
          return;
        }
        setToken(storedToken);
        setAuthenticated(true);
      } catch {
        logout();
        return;
      }
    }
  });

  const login = (newToken: string, user: User) => {
    localStorage.setItem("jwt", newToken);
    setToken(newToken);
    setUser(user);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
    setAuthenticated(false);

    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authenticated,
        token,
        login,
        logout,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
