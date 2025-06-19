import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const BlogDetailScreen = ({ route }) => {
  const { blog } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{blog.title}</Text>
      <View style={styles.meta}>
        <Image source={{ uri: blog.author_image }} style={styles.avatar} />
        <Text style={styles.author}>{blog.author_name}</Text>
        <Text style={styles.date}>
          {" "}
          <Ionicons name="time-outline" size={14} />{" "}
          {new Date(blog.date).toDateString()}
        </Text>
      </View>

      <Image source={{ uri: blog.image }} style={styles.image} />
      <Text style={styles.caption}>{blog.caption}</Text>

      <Text style={styles.body}>{blog.body}</Text>
    </View>
  );
};

export default BlogDetailScreen;

const styles = StyleSheet.create({
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
});
