import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      router.replace("/welcome"); // or '/login'
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return logout;
};
