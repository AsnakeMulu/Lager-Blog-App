import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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

export default function RegisterScreen() {
  const scrollRef = useRef(null);
  // const emailRef = useRef(null);
  // const usernameRef = useRef(null);
  // const passwordRef = useRef(null);
  // const confirmRef = useRef(null);
  // const emailRef1 = useRef(null);
  // const usernameRef1 = useRef(null);
  // const passwordRef1 = useRef(null);
  // const confirmRef1 = useRef(null);
  // const emailRef2 = useRef(null);
  // const usernameRef2 = useRef(null);
  // const passwordRef2 = useRef(null);
  // const confirmRef2 = useRef(null);
  // const [lastFocusedInput, setLastFocusedInput] = useState(null);
  // const handleFocus = (scrollY: number) => {
  //   setTimeout(() => {
  //     scrollRef.current?.scrollToPosition(0, scrollY, true);
  //   }, 100);
  // };
  // useEffect(() => {
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     () => {
  //       if (lastFocusedInput?.current) {
  //         // Wait a moment before re-focusing to avoid flicker
  //         setTimeout(() => {
  //           lastFocusedInput.current.focus();
  //         }, 300);
  //       }
  //     }
  //   );

  //   return () => {
  //     keyboardDidHideListener.remove();
  //   };
  // }, [lastFocusedInput]);

  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    const newErrors = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    };
    let valid = true;

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (!username) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/register/`, {
        email,
        username,
        password,
      });

      Alert.alert("Success", "Account created. Please log in.");
      router.push("/login");
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.detail || "Something went wrong. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/welcome")}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>Lager Blogs</Text>
          </View>
          <Text style={styles.addTopicsText}></Text>
        </View>

        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <KeyboardAwareScrollView
          ref={scrollRef}
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
          {/* <Text style={styles.title}>Create Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            ref={emailRef}
            onFocus={() => setLastFocusedInput(emailRef)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            // ref={usernameRef}
            onFocus={() => setLastFocusedInput(usernameRef)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            // ref={passwordRef}
            onFocus={() => setLastFocusedInput(passwordRef)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            // ref={confirmRef}
            onFocus={() => setLastFocusedInput(confirmRef)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            onFocus={() => setLastFocusedInput(emailRef1)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onFocus={() => setLastFocusedInput(usernameRef1)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onFocus={() => setLastFocusedInput(passwordRef1)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            onFocus={() => setLastFocusedInput(confirmRef1)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onFocus={() => setLastFocusedInput(emailRef2)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onFocus={() => setLastFocusedInput(usernameRef2)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onFocus={() => setLastFocusedInput(passwordRef2)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            onFocus={() => setLastFocusedInput(confirmRef2)}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <Text style={styles.loginLink}>Already have an account?</Text> */}

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Let's get you started!</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            style={[styles.input, errors.email ? { borderColor: "red" } : null]}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          <TextInput
            placeholder="Username"
            placeholderTextColor="#999"
            style={[
              styles.input,
              errors.username ? { borderColor: "red" } : null,
            ]}
            autoCapitalize="none"
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username)
                setErrors((prev) => ({ ...prev, username: "" }));
            }}
          />
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username}</Text>
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

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry
            style={[
              styles.input,
              errors.confirmPassword ? { borderColor: "red" } : null,
            ]}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword)
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginLink}>Already have an account?</Text>
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
        </KeyboardAwareScrollView>
        {/* </TouchableWithoutFeedback> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0077b6",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0077b6",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0077b6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loginLink: {
    // marginTop: 10,
    textAlign: "center",
    color: "#0077b6",
    fontWeight: "600",
    marginBottom: 20,
  },

  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: -12,
    marginBottom: 12,
    paddingLeft: 4,
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
  registerBtn: {
    backgroundColor: "#408dc5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    marginBottom: 32,
    textAlign: "center",
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
