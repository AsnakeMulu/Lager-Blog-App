import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../constants/config";
import { useUser } from "../../utils/UserContext";

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const token = await AsyncStorage.getItem("access_token");

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/posts/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userPosts = response.data.filter(
          (post) => post.author.id === user?.id
        );

        setPosts(userPosts);
      } catch (error) {
        console.error("Failed to fetch user posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
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
          <TouchableOpacity style={styles.loginButton} onPress={logout}>
            <MaterialIcons name="logout" size={18} color="#fff" />
            <Text style={styles.addTopicsText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={posts}
          contentContainerStyle={styles.tagsContainer}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <>
              {/* Profile Header */}
              <View style={styles.profileHeader}>
                <Image
                  source={{ uri: "https://example.com/profile-pic.jpg" }}
                  style={styles.profileImage}
                />
                <Text style={styles.profileName}>{user?.username}</Text>
                <Text style={styles.profileHandle}>{user?.email}</Text>

                {/* Stats Row */}
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{posts.length}</Text>
                    <Text style={styles.statLabel}>P O S T S</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>100</Text>
                    <Text style={styles.statLabel}>S A V E D</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>200</Text>
                    <Text style={styles.statLabel}>S H A R E</Text>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Your Latest Blogs</Text>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/blog/[id]",
                  params: { id: item.id.toString() },
                })
              }
            >
              <View
                style={{
                  marginHorizontal: 16,
                  marginBottom: 14,
                  padding: 12,
                  backgroundColor: "#f2f2f2",
                  borderRadius: 8,
                }}
              >
                <Text style={styles.feedTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={{ paddingBottom: 6 }}>
                  {item.content}
                </Text>
                <Text style={styles.feedMeta}>
                  {new Date(item.created_at).toDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color="#ff7101"
                style={{ marginTop: 20 }}
              />
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No posts yet.
              </Text>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tagsContainer: {
    backgroundColor: "#fff",
    paddingBottom: 4,
  },
  profileHeader: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileHandle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingTop: 12,
    paddingLeft: 10,
    alignSelf: "flex-start", // Ensures it aligns to the start of its container
    textAlign: "left",
    textTransform: "uppercase",
  },
  addTopicsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  feedTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  feedMeta: {
    fontSize: 12,
    color: "#666",
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
    fontSize: 18,
    color: "#fff",
    paddingLeft: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  leftMenu: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: "#408dc5",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
