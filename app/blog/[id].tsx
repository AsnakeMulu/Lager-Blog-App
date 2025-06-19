import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "../../constants/config";

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/posts/${id}/`);
        setPost(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftMenu}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={32} color="#999" />
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}> Blog detail</Text>
          </View>
        </View>
        {/* <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.addTopicsText}>login</Text>
        </TouchableOpacity> */}
        {/* <Avatar.Image
          size={40}
          source={{ uri: "https://via.placeholder.com/40" }} // Replace with user image URI
        /> */}
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>By {post.author}</Text>
      <Text style={styles.content}>{post.content}</Text> */}

        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.meta}>
          <Image source={{ uri: post.author_image }} style={styles.avatar} />
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.date}>
            {" "}
            <Ionicons name="time-outline" size={14} />{" "}
            {new Date(post.created_at).toDateString()}
          </Text>
        </View>

        <Image source={{ uri: post.image }} style={styles.image} />
        <Text style={styles.caption}>{post.title}</Text>

        <Text style={styles.body}>{post.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   padding: 16,
  // },
  // title: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   marginBottom: 8,
  //   color: "#888",
  // },
  // author: {
  //   fontSize: 14,
  //   color: "#888",
  //   marginBottom: 16,
  // },
  // content: {
  //   fontSize: 16,
  //   lineHeight: 22,
  //   color: "#888",
  // },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderBlockColor: "#666",
  },
  author: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  date: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderBlockColor: "#666",
  },
  caption: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 15,
  },
  body: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
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
    fontSize: 21,
    color: "#666",
    paddingLeft: 4,
    // fontWeight: "bold",
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
});
