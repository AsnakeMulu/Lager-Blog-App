import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../constants/config";
import { useUser } from "../../utils/UserContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { user } = useUser();
  const scrollRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  // const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchCategories(); // load categories from API
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        console.warn("No auth token found.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/categories/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error.response?.data || error.message
      );
    }
  };

  const pickImage = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant permission to access photos."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //ImagePicker.MediaType.Image,
      quality: 1,
    });

    if (!result.canceled) {
      const pickedImage = result.assets[0];
      setImage({
        uri: pickedImage.uri,
        name: pickedImage.uri.split("/").pop(),
        type: "image/jpeg", // or guess from extension
      });
    }
  };

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("caption", caption);
    formData.append("tags", tags);
    selectedCategories.forEach((id) =>
      formData.append("categories", id.toString())
    );
    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: image.name,
        type: image.type,
      });
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Blog added:", response.data);
      Alert.alert("Success", "The blog created successfully.");

      setTitle("");
      setContent("");
      setSelectedCategories([]);
      setImage(null);
      setCaption("");
      setTags("");
      router.push("/home");
    } catch (error: any) {
      Alert.alert(
        "Add blog Failed",
        error.response?.data?.detail || "Something went wrong. Try again later."
      );
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => setImage(null);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <MaterialIcons name="auto-stories" size={32} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeText}>Lager Blogs</Text>
        </View>
      </View>

      <View style={styles.container}>
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
          {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
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
              if (errors.content)
                setErrors((prev) => ({ ...prev, content: "" }));
            }}
            // value={content}
          />
          {errors.content ? (
            <Text style={styles.errorText}>{errors.content}</Text>
          ) : null}

          <Text style={styles.label}>Select Catagories</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderColor: selectedCategories.includes(cat.id)
                    ? "#0077b6"
                    : "#ccc",
                  borderWidth: 1,
                  borderRadius: 20,
                  marginRight: 4,
                  marginBottom: 8,
                }}
              >
                <Text>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Select Image</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <MaterialCommunityIcons
                name={image ? "image-edit" : "image-plus"}
                size={40}
                color="#0077b6"
              />
            </TouchableOpacity>

            {image && (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={removeImage}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={24}
                    color="#ff4444"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

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
          {/* <Text style={styles.label}>Slug(optional)</Text>
          <TextInput
            value={slug}
            placeholder="Slug"
            placeholderTextColor="#999"
            style={styles.input}
            onChangeText={(text) => {
              setSlug(text);
            }}
          /> */}

          <Text style={styles.label}>Tags</Text>
          <TextInput
            placeholder="Enter tags (comma-separated)"
            value={tags}
            onChangeText={setTags}
            style={styles.input}
          />

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerText}>Create Blog</Text>
            )}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 4,
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0077b6",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    marginLeft: 4,
    // textAlign: "center",
  },
  imageWrapper: {
    width: "50%",
    height: 100,
    marginVertical: 10,
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    // fontSize: 16,
    marginBottom: 10,
  },
  imageButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    justifyContent: "center", // Vertical center
    alignItems: "center", // Horizontal center
    marginVertical: 10,
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
