import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../constants/config";
import { useUser } from "../../utils/UserContext";

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const router = useRouter();
  const navigation = useNavigation();
  const scrollRef = useRef(null);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  // const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [isSaved, setIsSaved] = useState(false);

  // useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
  //     setKeyboardHeight(e.endCoordinates.height);
  //   });

  //   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
  //     setKeyboardHeight(0);
  //   });

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/posts/${id}/`);
        setPost(res.data);
        // console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/comments/?post=${id}`);

        setComments(res.data);
      } catch (err) {
        console.error(
          "Failed to fetch comments",
          err.response?.status,
          err.response?.data
        );
      }
    };

    fetchComments();
  }, []);

  useEffect(() => {
    if (!post) return;

    const fetchSavedStatus = async () => {
      const token = await AsyncStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/posts/${post.id}/is-saved/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsSaved(response.data.is_saved);
      } catch (error) {
        console.log("Check saved status failed:", error);
      }
    };

    fetchSavedStatus();
  }, [post]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      const res = await axios.post(
        `${API_BASE_URL}/api/comments/`,
        {
          text: newComment,
          post: id,
          author: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
      Keyboard.dismiss();
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (err) {
      console.error("Failed to add comment", err.response?.data);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("access_token");

              await axios.delete(`${API_BASE_URL}/api/comments/${commentId}/`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setComments((prev) =>
                prev.filter((comment) => comment.id !== commentId)
              );
            } catch (err) {
              console.error("Failed to delete comment", err.response?.data);
              Alert.alert("Error", "Unable to delete comment.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeletePost = (postId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("access_token");

              await axios.delete(`${API_BASE_URL}/api/posts/${postId}/`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              router.push("/home");
            } catch (err) {
              console.error("Failed to delete post", err.response?.data);
              Alert.alert("Error", "Unable to delete the post.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleSave = async () => {
    const token = await AsyncStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/${post.id}/toggle-save/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newState = !isSaved;
      setIsSaved(newState);
      Alert.alert(newState ? "Saved" : "Removed", response.data.message);
    } catch (error) {
      console.log("Save/Unsave failed:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  if (!post) return <Text>No Posts...</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {post && post.author && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Blog details</Text>

          {post.author.id === user?.id ? (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePost(post.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#e63946" />
              <Text style={styles.deleteText}> Delete</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleToggleSave}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color="#0077b6"
              />
              <Text style={styles.saveText}>{isSaved ? "Saved" : "Save"}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          ref={scrollRef}
          enableOnAndroid
          enableResetScrollToCoords={false}
          extraScrollHeight={Platform.OS === "ios" ? 50 : 150}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            padding: 16,
            paddingBottom: 50,
            backgroundColor: "#fff",
          }}
        >
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.meta}>
            <Image source={{ uri: post.author_image }} style={styles.avatar} />
            <Text style={styles.author}>{post.author.username}</Text>
            <Text style={styles.date}>
              <Ionicons name="time-outline" size={14} />{" "}
              {new Date(post.created_at).toDateString()}
            </Text>
          </View>

          <Image source={{ uri: post.image }} style={styles.image} />
          <Text style={styles.caption}>{post.caption}</Text>
          <Markdown>{post.content}</Markdown>
          <Text style={[styles.title, { marginTop: 24 }]}>Comments</Text>

          {comments.length === 0 ? (
            <Text style={{ color: "#777", marginVertical: 10 }}>
              No comments yet.
            </Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentBox}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentContent}>{comment.text}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.commentDate}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </Text>
                  {comment.author === user?.username && (
                    <TouchableOpacity
                      onPress={() => handleDeleteComment(comment.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#e63946"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}

          {user ? (
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.sendButton}
              >
                {commentLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ marginTop: 10, color: "#777" }}>
              Please log in to post a comment.
            </Text>
          )}
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    // flex: 1,
    paddingBottom: 50,
  },
  title: {
    fontSize: 18,
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
    borderBlockColor: "#999",
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },

  saveText: {
    color: "#0077b6",
    fontSize: 14,
    marginLeft: 5,
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
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#408dc5",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
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
    padding: 12,

    backgroundColor: "#0077b6",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 18,
    color: "#fff",
    paddingLeft: 4,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  commentBox: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#333",
  },
  commentContent: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  commentDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: "#ff7101",
    padding: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
});
