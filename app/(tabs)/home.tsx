// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
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
import { API_BASE_URL } from "../../constants/config";
// import useLogout from "../logout";
import axios from "axios";
import { useUser } from "../../utils/UserContext";

interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
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

// const BlogItem = ({ blog }: { blog: Blog }) => (
//   <View style={styles.blogItem}>
//     {/* {blog.image && ( */}
//     <Image
//       source={{ uri: blog.image }}
//       style={styles.blogImage}
//       resizeMode="cover"
//     />
//     {/* )} */}
//     <Text style={styles.blogTitle}>{blog.title}</Text>
//     <Text style={styles.blogContent}>{blog.content}</Text>
//     {blog.created_at && (
//       <Text style={styles.blogDate}>
//         {new Date(blog.created_at).toLocaleDateString("en-GB", {
//           day: "numeric",
//           month: "short",
//           year: "numeric",
//         })}
//       </Text>
//     )}
//   </View>
// );

export default function Index() {
  const router = useRouter();
  const { user } = useUser();
  const isFocused = useIsFocused();
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
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (isFocused) {
      fetchBlogs(); // Your function to load posts from backend
    }
  }, [isFocused]);

  // const handleSearch = () => {
  //   const query = searchQuery.trim().toLowerCase();
  //   if (query === "") {
  //     setFilteredBlogs(blogs); // Show all if empty
  //   } else {
  //     const filtered = blogs.filter(
  //       (blog) =>
  //         blog.title.toLowerCase().includes(query) ||
  //         blog.content.toLowerCase().includes(query)
  //     );
  //     setFilteredBlogs(filtered);
  //   }
  // };

  // useEffect(() => {
  //   axios
  //     .get(`${API_BASE_URL}/api/posts/`)
  //     .then((response) => {
  //       setBlogs(response.data);
  //       setFilteredBlogs(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching blogs", error);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get<Blog[]>(`${API_BASE_URL}/api/posts/`);

      setBlogs(response.data);
      setFilteredBlogs(response.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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

  // const renderBlogItem = ({ item }: ListRenderItemInfo<Blog>) => (
  //   <BlogItem blog={item} />
  // );

  const renderBlogItem = ({ item }) => (
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
    <>
      <View style={styles.header}>
        <View style={styles.leftMenu}>
          {/* <TouchableOpacity style={styles.menuButton}> */}
          <MaterialIcons name="auto-stories" size={32} color="#fff" />
          {/* </TouchableOpacity> */}
          <View>
            <Text style={styles.welcomeText}>Lager Blogs</Text>
          </View>
        </View>
        <View style={styles.leftMenu}>
          <Text style={styles.userName}>{user?.username || "Asnake"}</Text>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Image source={{ uri: userImage }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
        {/* <Avatar.Image
          size={40}
          source={{ uri: "https://via.placeholder.com/40" }} // Replace with user image URI
        /> */}
      </View>

      <View style={styles.container}>
        <FlatList
          data={filteredBlogs}
          renderItem={renderBlogItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>
              No blogs found matching your search
            </Text>
          }
          ListHeaderComponent={
            <>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {/* <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearch}
                >
                  <MaterialIcons name="search" size={24} color="#999" />
                </TouchableOpacity> */}
              </View>

              <Text style={styles.sectionTitle}>Popular Tags</Text>
              <PopularTags tags={popularTags} />

              <Text style={styles.sectionTitle}>Popular Blogs</Text>
            </>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 4 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    paddingHorizontal: 12,
    paddingTop: 8,
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
    borderRadius: 8,
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
  list: {
    paddingBottom: 10,
    // paddingHorizontal: 8, // optional for consistent spacing
  },
  // searchInput: {
  //   height: 40,
  //   borderColor: "#e0e0e0",
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   paddingHorizontal: 12,
  //   marginBottom: 16,
  // },
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
    marginVertical: 8,
  },
  tagsContainer: {
    paddingBottom: 4,
  },
  tagsScrollView: {
    maxHeight: 50, // Adjusted height for tags container
    marginBottom: 4,
  },
  tagItem: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
  },
  // blogItem: {
  //   paddingVertical: 12,
  // },
  blogImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#999",
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
    // backgroundColor: "#e0e0e0",
    marginVertical: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#0077b6",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 20,
    color: "#fff",
    paddingLeft: 6,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
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
  leftMenu: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#999",
  },
  blogItem: {
    flexDirection: "row",
    marginBottom: 10,
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
