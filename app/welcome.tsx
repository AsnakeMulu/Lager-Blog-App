// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "../constants/config";

import axios from "axios";

interface Blog {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: string;
}

const PopularTags = ({ tags }: { tags: string[] }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.tagsContainer}
    style={styles.tagsScrollView}
  >
    {tags.map((tag, index) => (
      <TouchableOpacity style={styles.tagItem} key={`tag-${index}`}>
        <Text style={styles.tagText}>{tag}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const BlogItem = ({ blog }: { blog: Blog }) => (
  <View style={styles.blogItem}>
    {blog.image && (
      <Image
        source={{ uri: blog.image }}
        style={styles.blogImage}
        resizeMode="cover"
      />
    )}
    <Text style={styles.blogTitle}>{blog.title}</Text>
    <Text style={styles.blogContent}>{blog.content}</Text>
    {blog.date && (
      <View style={styles.blogDateContainer}>
        <Text style={styles.blogIcon}>💷</Text>
        <Text style={styles.blogDate}>
          {new Date(blog.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
        <Text style={styles.blogIcon}>💷</Text>
      </View>
    )}
  </View>
);

export default function HomeScreen() {
  const router = useRouter();

  const popularTags: string[] = [
    "Politics",
    "Music",
    "Sports",
    "Technology",
    "Food",
    "Travel",
    "Fashion",
  ];

  const userImage = "https://example.com/profile.jpg";
  const [popularBlogs, setPopularBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  const [blogs, setBlogs] = useState([]);
  // const [filteredPosts, setFilteredPosts] = useState(allPosts);

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") {
      setFilteredBlogs(blogs); // Show all if empty
    } else {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query)
      );
      setFilteredBlogs(filtered);
    }
  };

  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/api/posts/`);

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const data: Blog[] = await response.json();
  //       setPopularBlogs(data);
  //       setFilteredBlogs(data);
  //     } catch (err) {
  //       const message =
  //         err instanceof Error ? err.message : "An unknown error occurred";
  //       setError(message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBlogs();
  // }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(popularBlogs);
    } else {
      const filtered = popularBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchQuery, popularBlogs]);

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

  // const handleSearch = () => {
  //   if (onSearch) {
  //     onSearch(searchQuery);
  //   }
  // };

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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
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
          onPress={() => router.push("/login")}
        >
          <Text style={styles.addTopicsText}>login</Text>
        </TouchableOpacity>
        {/* <Avatar.Image
          size={40}
          source={{ uri: "https://via.placeholder.com/40" }} // Replace with user image URI
        /> */}
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
                Hey There, if you like to post new blog and to comment on blogs.
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
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <MaterialIcons name="search" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Popular Tag</Text>
            <PopularTags tags={popularTags} />

            <Text style={styles.sectionTitle}>Popular Blog</Text>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: 8, // optional for consistent spacing
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    // margin: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: "#fff",
  },
  searchButton: {
    // marginLeft: 10,
    // backgroundColor: "#ff7101", // Use your primary color
    padding: 10,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  tagsContainer: {
    paddingBottom: 8,
  },
  tagsScrollView: {
    maxHeight: 50, // Adjusted height for tags container
    marginBottom: 16,
  },
  tagItem: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
  },
  //   blogItem: {
  //     paddingVertical: 12,
  //   },
  blogImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  blogContent: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  blogDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  blogDate: {
    fontSize: 12,
    color: "#666",
    marginHorizontal: 4,
  },
  blogIcon: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,

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
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
    paddingRight: 4,
  },
  menuButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 2,
    backgroundColor: "#0077b6",
    borderRadius: 30,
    padding: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#999",
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
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  loginButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addTopicsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  // list: {
  //   paddingBottom: 20,
  // },
  blogItem: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#999",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
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
