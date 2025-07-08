import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
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
      console.log(response.data.access);
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/welcome")}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Lager Blogs</Text>
        <Text style={styles.addTopicsText}></Text>
      </View>
      <KeyboardAwareScrollView
        // ref={scrollRef}
        enableOnAndroid
        enableResetScrollToCoords={false}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 70}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingBottom: 40,
          backgroundColor: "#f8f8f8",
        }}
      >
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingTop: 40,
    // justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0077b6",
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
    borderColor: "#0077b6",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    marginBottom: 16,
  },
  forgotBtn: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: "#408dc5",
    fontWeight: "500",
  },
  signinBtn: {
    backgroundColor: "#408dc5",
    paddingVertical: 12,
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
    color: "#0077b6",
    marginBottom: 20,
    fontWeight: "600",
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
    backgroundColor: "#0077b6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 12,
    padding: 12,
  },
  welcomeText: {
    fontSize: 20,
    color: "#fff",
    paddingLeft: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  addTopicsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    paddingHorizontal: 20,
  },
});
