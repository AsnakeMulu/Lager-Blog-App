import { MaterialIcons } from "@expo/vector-icons";
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
import { API_BASE_URL } from "../../constants/config";
import { useUser } from "../../utils/UserContext";

export default function RegisterScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const handleRegister = async () => {
    const { user } = useUser();
    const token = await AsyncStorage.getItem("access_token"); // or 'token'

    const newErrors = {
      title: "",
      content: "",
    };

    let valid = true;

    if (!title) {
      newErrors.title = "Title is required";
      valid = false;
    }

    if (!content) {
      newErrors.content = "Content is required";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      setLoading(true);
      let author = caption;
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/`,
        {
          title,
          //  slug,
          content,
          author: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Blog added:", response.data);
      Alert.alert("Success", "The blog created successfully.");
      router.push("/home");
    } catch (error: any) {
      Alert.alert(
        "Add blog Failed",
        error.response?.data?.detail || "Something went wrong. Try again later."
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
        <Text style={styles.title}>Create New Blog</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#999"
          style={[styles.input, errors.title ? { borderColor: "red" } : null]}
          onChangeText={(text) => {
            setTitle(text);
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
          }}
        />
        {errors.title ? (
          <Text style={styles.errorText}>{errors.title}</Text>
        ) : null}

        <Text style={styles.label}>Caption(optional)</Text>
        <TextInput
          placeholder="Caption"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={(text) => {
            setCaption(text);
          }}
        />

        <Text style={styles.label}>Slug(optional)</Text>
        <TextInput
          placeholder="Slug"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={(text) => {
            setSlug(text);
          }}
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          placeholder="Content"
          placeholderTextColor="#999"
          style={[styles.input, errors.content ? { borderColor: "red" } : null]}
          onChangeText={(text) => {
            setContent(text);
            if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
          }}
        />
        {errors.content ? (
          <Text style={styles.errorText}>{errors.content}</Text>
        ) : null}

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7f0",
    padding: 24,
    // justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff7101",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
    marginLeft: 4,
    // textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff7101",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  registerBtn: {
    backgroundColor: "#ff7101",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
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
