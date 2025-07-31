import { createContext, useContext, useState, useEffect } from "react";
import {
  logout as authLogout,
  register as authRegister,
} from "../api/auth";
import API from "../api/index";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // You might want to verify the token here or fetch user data
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Authentication error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await API.post("/auth/login/", credentials);
      console.log('Login API response:', response.data);

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setUser({
          id: response.data.user_id,
          username: response.data.username,
          email: response.data.email,
        });
        setIsAuthenticated(true);

        // Return success with user data
        return {
        success: true,
        token: response.data.token,
        user: {
          id: response.data.user_id,
          username: response.data.username,
          email: response.data.email
        }
      };
      }

      throw new Error("Login failed - no token received");
    } catch (error) {
      console.error("Login error:", error);
      // Return error details for better debugging
      return {
        success: false,
      error:error.response?.data || { message: "Login failed" }
      }
    }
  };

  const register = async (userData) => {
    try {
      const data = await authRegister(userData);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
