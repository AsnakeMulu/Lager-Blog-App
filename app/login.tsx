import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "../constants/config";
import { useUser } from "../utils/UserContext";

export default function LoginScreen() {
  const router = useRouter();
  const { loadUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const newErrors = {
      email: "",
      password: "",
    };

    let valid = true;

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        email,
        password,
      });

      // Store token
      await AsyncStorage.setItem("access_token", response.data.access);
      await AsyncStorage.setItem("refresh_token", response.data.refresh);

      await loadUser();
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.detail || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <View style={styles.header}>
        <View style={styles.leftMenu}>
          {/* <TouchableOpacity style={styles.menuButton}> */}
          <MaterialIcons name="auto-stories" size={32} color="#333" />
          {/* </TouchableOpacity> */}
          <View>
            <Text style={styles.welcomeText}>Lager Blogs</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/welcome")}
        >
          <Text style={styles.addTopicsText}>Home</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Login here</Text>
        <Text style={styles.subtitle}>Welcome back you've been missed!</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={[styles.input, errors.email ? { borderColor: "red" } : null]}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={[
            styles.input,
            errors.password ? { borderColor: "red" } : null,
          ]}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signinBtn} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signinText}>Sign in</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerText}>Create new account</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or continue with</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialBtn}>
            <AntDesign name="google" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome name="facebook" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <AntDesign name="apple1" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7f0",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff7101",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff7101",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  inputMuted: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
  },
  forgotBtn: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: "#ff7101",
    fontWeight: "500",
  },
  signinBtn: {
    backgroundColor: "#ff7101",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  signinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#999",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: -12,
    marginBottom: 12,
    paddingLeft: 4,
  },

  header: {
    backgroundColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 12,
    padding: 12,
    // paddingBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 24,
    color: "#666",
    paddingLeft: 8,
    fontWeight: "bold",
  },
  leftMenu: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addTopicsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
