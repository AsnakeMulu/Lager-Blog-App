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
  const { user } = useUser();
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
    const token = await AsyncStorage.getItem("access_token");
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
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/`,
        {
          title,
          caption,
          slug,
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
      // console.log("Blog added:", response.data);
      Alert.alert("Success", "The blog created successfully.");

      setTitle("");
      setCaption("");
      setSlug("");
      setContent("");
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
        <MaterialIcons name="auto-stories" size={32} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeText}>Lager Blogs</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Create New Blog</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
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
          value={caption}
          placeholder="Caption"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={(text) => {
            setCaption(text);
          }}
        />

        <Text style={styles.label}>Slug(optional)</Text>
        <TextInput
          value={slug}
          placeholder="Slug"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={(text) => {
            setSlug(text);
          }}
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          value={content}
          placeholder="Write the content here"
          placeholderTextColor="#999"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          style={[
            styles.input,
            { height: 120 },
            errors.content ? { borderColor: "red" } : null,
          ]}
          onChangeText={(text) => {
            setContent(text);
            if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
          }}
          value={content}
        />
        {errors.content ? (
          <Text style={styles.errorText}>{errors.content}</Text>
        ) : null}

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerText}>Create Blog</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0077b6",
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
    borderColor: "#0077b6",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  registerBtn: {
    backgroundColor: "#408dc5",
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
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 12,
  },
  welcomeText: {
    fontSize: 20,
    color: "#fff",
    paddingLeft: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
