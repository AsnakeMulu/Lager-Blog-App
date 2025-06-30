import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../constants/config";

interface Blog {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchQuery, blogs]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/posts/`)
      .then((response) => {
        setBlogs(response.data);
        setFilteredBlogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs", error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/blog/[id]",
          params: { id: item.id.toString() },
        })
      }
    >
      <View style={styles.blogItem}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.dateRow}>
            <MaterialIcons name="calendar-month" size={14} color="#666" />
            <Text style={styles.dateText}>
              {" "}
              {new Date(item.created_at).toDateString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftMenu}>
            {/* <TouchableOpacity style={styles.menuButton}> */}
            <MaterialIcons name="auto-stories" size={32} color="#fff" />
            {/* </TouchableOpacity> */}
            <View>
              <Text style={styles.welcomeText}>Lager Blogs</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <MaterialIcons name="login" size={18} color="#fff" />
            <Text style={styles.addTopicsText}>login</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredBlogs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  Hey There, if you like to post new blog and to comment on
                  blogs.
                </Text>

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => router.push("/register")}
                >
                  <Text style={styles.addTopicsText}>Register now</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                />
              </View>
              <Text style={styles.sectionTitle}>Popular Blogs</Text>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    marginHorizontal: 8,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#0077b6",
  },
  welcomeText: {
    fontSize: 20,
    color: "#fff",
    paddingLeft: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  leftMenu: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyStateContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  registerButton: {
    backgroundColor: "#408dc5",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: "#408dc5",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  addTopicsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    paddingLeft: 4,
  },
  blogItem: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#999",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    color: "#666",
    fontSize: 13,
  },
});
