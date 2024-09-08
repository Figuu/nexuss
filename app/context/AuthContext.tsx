import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthState {
  token: string | null;
  authenticated: boolean;
}

interface AuthProps {
  authState: AuthState;
  onRegister: (username: string, password: string, name: string, auth_method: string) => Promise<any>;
  onLogin: (username: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
}

const TOKEN_KEY = "token";
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
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({ token, authenticated: true });
      }
    };
    loadToken();
  }, []);

  const register = useCallback(
    async (
      username: string,
      password: string,
      name: string,
      auth_method: string,
      
    ) => {
      try {
        return await axios.post(`${API_URL}/auth/register-user`, {
          username,
          password,
          name,
          auth_method,
          status_id: 1,
          is_owner : false,
          is_seller: false,
          country_code: "591",
          phone: "12121212",
          roles: []
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
      if (result.data && result.data.token) {
        const token = result.data.token;

        setAuthState({
          token,
          authenticated: true,
        });

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await SecureStore.setItemAsync(TOKEN_KEY, token);

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
    axios.defaults.headers.common["Authorization"] = "";
    setAuthState({ token: null, authenticated: false });
  }, []);

  const value = {
    authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import * as SecureStore from "expo-secure-store";

// interface AuthProps {
//   authState?: { token: string | null; authenticated: boolean | null };
//   onRegister?: (email: string, password: string) => Promise<any>;
//   onLogin?: (username: string, password: string) => Promise<any>;
//   onLogout?: () => Promise<any>;
// }

// const TOKEN_KEY = "token";
// export const API_URL = "http://104.152.50.154:3002/api";
// const AuthContext = createContext<AuthProps>({});

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }: any) => {
//   const [authState, setAuthState] = useState<{
//     token: string | null;
//     authenticated: boolean | null;
//   }>({
//     token: null,
//     authenticated: null,
//   });

//   useEffect(() => {
//     const loadToken = async () => {
//       const token = await SecureStore.getItemAsync(TOKEN_KEY);

//       console.log("stored", token);

//       if (token) {
//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//         setAuthState({
//           token,
//           authenticated: true,
//         });
//       }
//     };
//     loadToken();
//   }, []);

//   const register = async (email: string, password: string) => {
//     try {
//       return await axios.post(`${API_URL}/register`, { email, password });
//     } catch (error) {
//       return { error: true, message: (error as any).response.data.message };
//     }
//   };

//   const login = async (username: string, password: string) => {
//     try {
//       const result = await axios.post(`${API_URL}/auth/login`, {
//         username,
//         password,
//       });

//       setAuthState({
//         token: result.data.token,
//         authenticated: true,
//       });

//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${result.data.token}`;

//       await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

//       return result;
//     } catch (error) {
//       return { error: true, message: (error as any).response.data.message };
//     }
//   };

//   const logout = async () => {
//     await SecureStore.deleteItemAsync(TOKEN_KEY);

//     axios.defaults.headers.common["Authorization"] = "";

//     setAuthState({
//       token: null,
//       authenticated: false,
//     });
//   };

//   const value = {
//     onRegister: register,
//     onLogin: login,
//     onLogout: logout,
//     authState,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
