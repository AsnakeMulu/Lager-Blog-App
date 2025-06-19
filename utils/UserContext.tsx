import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_BASE_URL } from "../constants/config";

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loadUser: async () => {},
  logout: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const loadUser = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      }
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      setUser(null);
      router.replace("/welcome");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
