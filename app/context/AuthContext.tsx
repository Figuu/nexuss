import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

interface User {
  id: string;
  username: string;
  name: string;
  phone: string;
  country_code: string;
  auth_method: string;
  status_id: number;
  is_owner: boolean;
  is_seller: boolean;
  role: any[];
}

interface AuthState {
  token: string | null;
  authenticated: boolean;
  user: User | null;
}

interface AuthProps {
  authState: AuthState;
  onRegister: (
    username: string,
    password: string,
    name: string,
    auth_method: string
  ) => Promise<any>;
  onLogin: (username: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
}

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
export const API_URL = "http://104.152.50.154:3002/api";
const AuthContext = createContext<AuthProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: false,
    user: null,
  });

  const loadTokens = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const user = await SecureStore.getItemAsync("user");

      // console.log("Token:", token);

      // console.log("Token:", refreshToken);

      if (refreshToken) {
        await refreshTokens(refreshToken);
      } else if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // setAuthState({ token, authenticated: true });
        setAuthState((prev) => ({
          ...prev,
          token,
          authenticated: true,
          user: user ? JSON.parse(user) : null,
        }));
      } else {
        // setAuthState({ token: null, authenticated: false });
        setAuthState({ token: null, authenticated: false, user: null });
      }
    } catch (error) {
      console.error("Error al cargar los tokens:", error);
      await logout(); // Si hay un error, asegúrate de cerrar sesión
    }
  };

  const refreshTokens = async (refreshToken: string) => {
    try {
      // Configurar encabezado con el token de refresco
      const headers = {
        Authorization: `Bearer ${refreshToken}`,
      };

      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        { headers }
      );

      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

      console.log("new", newToken);

      // setAuthState({ token: newToken, authenticated: true });
      setAuthState((prev) => ({
        ...prev,
        token: newToken,
        authenticated: true,
      }));

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error) {
      console.error("Error al refrescar los tokens:", error);
      await logout();
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  // useEffect(() => {
  //   const loadToken = async () => {
  //     const token = await SecureStore.getItemAsync(TOKEN_KEY);
  //     if (token) {
  //       axios.defaults.headers.common["Authorization"] = Bearer ${token};
  //       setAuthState({ token, authenticated: true });
  //     }
  //   };
  //   loadToken();
  // }, []);

  const register = useCallback(
    async (
      username: string,
      password: string,
      name: string,
      auth_method: string
    ) => {
      try {
        return await axios.post(`${API_URL}/auth/register-user`, {
          username,
          password,
          name,
          auth_method,
          status_id: 1,
          is_owner: false,
          is_seller: false,
          country_code: "591",
          phone: "12121212",
          roles: [],
        });
      } catch (error) {
        return { error: true, message: (error as any).response.data.message };
      }
    },
    []
  );

  const login = useCallback(async (username: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      // Verificar si la respuesta tiene el token
      if (result.data && result.data.token && result.data.refreshToken) {
        const { token, refreshToken, user } = result.data;

        setAuthState({
          token,
          authenticated: true,
          user,
        });

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        await SecureStore.setItemAsync("user", JSON.stringify(user));

        return result;
      } else {
        throw new Error("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      // Devolver un objeto de error que será manejado por el componente que llama a esta función
      return {
        error: true,
        message: (error as any).response
          ? (error as any).response.data.message
          : (error as any).message,
      };
    }
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync("user");
    axios.defaults.headers.common["Authorization"] = "";
    setAuthState({ token: null, authenticated: false, user: null });
    router.replace("/");
  }, []);

  const value = {
    authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
